import { APPS_SCRIPT_URL } from "../config";

interface SubmitRow {
  seatNumber: number;
  value: string;
}

interface SubmitPayload {
  floor: string;
  period: number;
  rows: SubmitRow[];
}

/**
 * 출석 데이터를 Apps Script로 전송합니다.
 * 서버 혼잡 시 최대 3회 재시도합니다.
 */
export async function submitAttendance(payload: SubmitPayload, maxRetries = 3): Promise<void> {
  const body = JSON.stringify(payload);

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      await fetch(APPS_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body,
      });
      return; // 성공
    } catch (err) {
      if (attempt === maxRetries) throw err;
      // 재시도 전 대기 (1초, 2초, ...)
      await new Promise((res) => setTimeout(res, attempt * 1000));
    }
  }
}
