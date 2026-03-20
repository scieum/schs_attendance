// ============================================================
// Google Apps Script - 출석 데이터 전송용
// ============================================================
//
// [배포 방법]
// 1. Google Sheets (https://docs.google.com/spreadsheets/d/1GZRZ31mAZ2jGK9FBum9s_1skQjY50RYyQ-PSy3MXfXg)
//    에서 "확장 프로그램" → "Apps Script" 클릭
// 2. 기존 코드를 모두 삭제하고, 아래 코드를 전체 복사하여 붙여넣기
// 3. "배포" → "새 배포" 클릭 (또는 기존 배포 재배포)
// 4. 유형: "웹 앱" 선택
//    - 실행 사용자: "나"
//    - 액세스 권한: "모든 사용자"
// 5. "배포" 버튼 클릭 → URL이 생성됩니다
// 6. 생성된 URL을 복사하여 src/app/config.ts 파일의
//    APPS_SCRIPT_URL 에 붙여넣기
//
// [시트 구조] (각 탭: "Weekly 1F", "Weekly 2F", "Weekly 3F")
//   1행: 날짜 그룹 헤더 (월), (화), (수), (금) - 각 4칸 병합
//   2행: 자리번호 | 학번 | 이름 | 1교시 | 2교시 | 3교시 | 4교시 | (반복×4요일)
//   3행~: 실제 데이터
//
// [열 매핑] (1-indexed)
//   A(1)=자리번호, B(2)=학번, C(3)=이름
//   D(4)=월1교시, E(5)=월2교시, F(6)=월3교시, G(7)=월4교시
//   H(8)=화1교시, I(9)=화2교시, J(10)=화3교시, K(11)=화4교시
//   L(12)=수1교시, M(13)=수2교시, N(14)=수3교시, O(15)=수4교시
//   P(16)=금1교시, Q(17)=금2교시, R(18)=금3교시, S(19)=금4교시
// ============================================================

var DAY_GROUP = { 1: 0, 2: 1, 3: 2, 5: 3 }; // 월=0, 화=1, 수=2, 금=3
var DAY_NAMES = ["일", "월", "화", "수", "목", "금", "토"];
var YAJA_DAYS = [1, 2, 3, 5]; // 월, 화, 수, 금
var DATA_START_ROW = 3; // 헤더 2행 이후 데이터 시작

/**
 * POST 요청: 출석 데이터를 현재 요일·교시에 맞는 열에 기록합니다.
 *
 * 요청 바디:
 *   floor  - "1F" | "2F" | "3F"
 *   period - 0~3 (교시 인덱스, 프론트에서 선택된 값)
 *   rows   - [{seatNumber, value}] (value: "O" | "X" | "")
 */
function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000); // 최대 10초 대기 후 락 획득
  } catch (lockErr) {
    return json({ error: "서버가 혼잡합니다. 잠시 후 다시 시도해주세요." });
  }

  try {
    var data = JSON.parse(e.postData.contents);
    var floor = data.floor;
    var period = data.period; // 0~3
    var rows = data.rows;

    var now = new Date();
    var dayOfWeek = now.getDay(); // 0=일, 1=월, ..., 6=토
    var group = DAY_GROUP[dayOfWeek];

    if (group === undefined) {
      return json({ error: "오늘은 야자 요일이 아닙니다: " + DAY_NAMES[dayOfWeek] + "요일" });
    }

    // 열 번호 계산: 1-indexed (A=1, D=4, ...)
    var col = 4 + group * 4 + period;
    var sheetName = "Weekly " + floor;

    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(sheetName);
    if (!sheet) return json({ error: "시트를 찾을 수 없습니다: " + sheetName });

    var lastRow = sheet.getLastRow();
    if (lastRow < DATA_START_ROW) return json({ error: "시트에 데이터가 없습니다." });

    var numRows = lastRow - DATA_START_ROW + 1;
    var seatColumn = sheet.getRange(DATA_START_ROW, 1, numRows, 1).getValues();

    // 좌석번호 → 출석값 맵
    var seatMap = {};
    for (var i = 0; i < rows.length; i++) {
      seatMap[rows[i].seatNumber] = rows[i].value;
    }

    // 해당 열에 값 쓰기 (gray 셀은 값이 비어있어 덮어쓰기 무해)
    var values = [];
    for (var j = 0; j < seatColumn.length; j++) {
      var seatNum = parseInt(seatColumn[j][0]);
      if (isNaN(seatNum) || !seatNum) {
        values.push([""]);
      } else {
        values.push([seatMap[seatNum] !== undefined ? seatMap[seatNum] : ""]);
      }
    }

    sheet.getRange(DATA_START_ROW, col, values.length, 1).setValues(values);

    return json({
      success: true,
      updated: values.length,
      sheet: sheetName,
      day: DAY_NAMES[dayOfWeek] + "요일",
      period: period + 1,
      column: col,
    });
  } catch (err) {
    return json({ error: err.toString() });
  } finally {
    lock.releaseLock();
  }
}

/**
 * GET 요청
 *   - ?action=availability&sheet=Weekly 1F[&callback=fn]
 *     → 음영(gray) 처리된 셀의 좌석번호·요일그룹·교시 정보를 반환
 *     → callback 파라미터가 있으면 JSONP 형식으로 반환
 *   - 그 외: 상태 확인용
 *
 * 응답 형식 (availability):
 *   { "좌석번호": { "요일그룹_교시인덱스": true, ... }, ... }
 *   예) { "1": { "0_1": true, "0_2": true }, "5": { "2_3": true } }
 */
function doGet(e) {
  var params = e ? e.parameter : {};
  var action = params.action || "";

  if (action === "availability") {
    return getAvailability(params.sheet, params.callback);
  }

  return json({ status: "ok", message: "출석 전송 API 정상 작동 중" });
}

/**
 * 시트에서 음영(gray) 처리되거나 "X"가 미리 입력된 셀의 좌석·요일그룹·교시 정보 반환.
 */
function getAvailability(sheetName, callbackName) {
  try {
    if (!sheetName) return json({ error: "sheet 파라미터가 필요합니다." });

    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(sheetName);
    if (!sheet) return json({ error: "시트를 찾을 수 없습니다: " + sheetName });

    var lastRow = sheet.getLastRow();
    if (lastRow < DATA_START_ROW) return jsonp({}, callbackName);

    var numDataRows = lastRow - DATA_START_ROW + 1;
    var totalCols = 3 + 4 * 4; // 19열 (A~S)

    var values = sheet.getRange(DATA_START_ROW, 1, numDataRows, totalCols).getValues();
    var bgs = sheet.getRange(DATA_START_ROW, 1, numDataRows, totalCols).getBackgrounds();

    var result = {};

    for (var row = 0; row < numDataRows; row++) {
      var seatNum = parseInt(values[row][0]);
      if (isNaN(seatNum) || !seatNum) continue;

      var unavailable = {};
      for (var dayGroup = 0; dayGroup < 4; dayGroup++) {
        for (var p = 0; p < 4; p++) {
          var colIdx = 3 + dayGroup * 4 + p;
          var bg = bgs[row][colIdx];
          var val = String(values[row][colIdx]).trim().toUpperCase();
          if (isGray(bg) || val === "X") {
            unavailable[dayGroup + "_" + p] = true;
          }
        }
      }

      if (Object.keys(unavailable).length > 0) {
        result[seatNum] = unavailable;
      }
    }

    return jsonp(result, callbackName);
  } catch (err) {
    return jsonp({ error: err.toString() }, callbackName);
  }
}

// ── 헬퍼 ──────────────────────────────────────────────────

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function jsonp(obj, callbackName) {
  if (callbackName) {
    var body = callbackName + "(" + JSON.stringify(obj) + ");";
    return ContentService.createTextOutput(body)
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  }
  return json(obj);
}

/**
 * 배경색이 회색(gray)인지 판별합니다.
 * Google Sheets의 일반적인 회색 계열: #cccccc, #d9d9d9, #b7b7b7 등
 */
function isGray(bg) {
  if (!bg || bg === "#ffffff" || bg === "white") return false;
  bg = bg.toLowerCase();
  if (!bg.startsWith("#") || bg.length !== 7) return false;
  var r = parseInt(bg.slice(1, 3), 16);
  var g = parseInt(bg.slice(3, 5), 16);
  var b = parseInt(bg.slice(5, 7), 16);
  var maxDiff = Math.max(Math.abs(r - g), Math.abs(g - b), Math.abs(r - b));
  // R≈G≈B (무채색) && 흰색이 아님(R<230)
  return maxDiff < 30 && r < 230;
}
