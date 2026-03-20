import svgPaths from "../../imports/svg-4wcy67qoze";
const img1RemovebgPreview1 = `${import.meta.env.BASE_URL}mascot-2f.png`;
import { useState, useEffect, useRef } from "react";
import { useGoogleSheet, getDayGroup, SeatData } from "./useGoogleSheet";
import { useResponsiveScale } from "./useResponsiveScale";
import { useAutoPeriod } from "./useAutoPeriod";

interface Floor2Props {
  onNavigateBack: () => void;
}

type SeatStatus = "none" | "present" | "absent";

const PERIODS = ["1교시", "2교시", "3교시", "4교시"] as const;

import { submitAttendance } from "./submitAttendance";

function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <div
      className="relative shrink-0 size-[59.2px] cursor-pointer active:scale-95 transition-transform"
      data-name="Back Button"
      onClick={onClick}
    >
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 59.2 59.2">
        <g data-figma-bg-blur-radius="37" id="Back Button">
          <rect fill="white" fillOpacity="0.7" height="59.2" rx="29.6" width="59.2" />
          <path d={svgPaths.p866af80} stroke="black" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.90286" />
        </g>
        <defs>
          <clipPath id="bgblur_0_25_374_clip_path" transform="translate(37 37)">
            <rect height="59.2" rx="29.6" width="59.2" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function RoundNumberContainer() {
  return (
    <div className="backdrop-blur-[18.5px] bg-[rgba(255,255,255,0.7)] h-full relative rounded-[7.4px] shrink-0" data-name="Round Number Container">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex font-['Pretendard:ExtraBold',sans-serif] gap-[7.4px] h-full items-center justify-center not-italic px-[18.5px] py-[9.25px] relative text-[18.5px] text-center whitespace-nowrap">
          <p className="leading-[normal] relative shrink-0 text-[#0e0c0a]">2</p>
          <div className="flex flex-col justify-end leading-[0] opacity-40 relative shrink-0 text-[#1c1c1c]">
            <p className="leading-[normal]">Floor</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function TimerContainer({ presentCount }: { presentCount: number }) {
  return (
    <div className="backdrop-blur-[18.5px] bg-[rgba(255,255,255,0.7)] content-stretch flex flex-col items-center justify-center p-[9.25px] relative rounded-[7.4px] shrink-0 size-[59.2px]" data-name="Timer Container">
      <p className="font-['NanumSquareOTF_ac:ExtraBold',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#d10e0e] text-[37px] text-center w-full">{presentCount}</p>
    </div>
  );
}

function RoundTimeInfo({ presentCount }: { presentCount: number }) {
  return (
    <div className="content-stretch flex gap-[7.4px] h-[59.2px] items-center relative shrink-0" data-name="Round&Time Info">
      <RoundNumberContainer />
      <TimerContainer presentCount={presentCount} />
    </div>
  );
}

function Header({ onBack, presentCount }: { onBack: () => void; presentCount: number }) {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full max-w-[1880px]" data-name="Header">
      <BackButton onClick={onBack} />
      <RoundTimeInfo presentCount={presentCount} />
    </div>
  );
}

function StateBar({
  selectedPeriod,
  onSelectPeriod,
}: {
  selectedPeriod: number;
  onSelectPeriod: (idx: number) => void;
}) {
  return (
    <div className="content-stretch flex gap-[22px] items-center relative shrink-0 self-start" data-name="State Bar">
      {PERIODS.map((label, idx) => {
        const isSelected = selectedPeriod === idx;
        return (
          <div
            key={label}
            className={`bg-white content-stretch flex h-[65px] items-center py-[8px] relative rounded-[12px] shrink-0 w-[102px] cursor-pointer active:scale-95 transition-all ${
              isSelected ? "pl-[16px] pr-[19px]" : "px-[12px]"
            }`}
            data-name="State_User1"
            onClick={() => onSelectPeriod(idx)}
          >
            {isSelected && (
              <div aria-hidden="true" className="absolute border-2 border-black border-solid inset-0 pointer-events-none rounded-[12px]" />
            )}
            <div className="content-stretch flex items-center justify-center relative shrink-0 w-full" data-name="Result">
              {isSelected ? (
                <div className="flex flex-col font-['Pretendard:SemiBold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[25px] text-black text-center">
                  <p className="leading-[1.4]">{label}</p>
                </div>
              ) : (
                <p className="font-['Pretendard:Regular',sans-serif] leading-[1.4] not-italic relative shrink-0 text-[25px] text-black text-center">{label}</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function isEmptySeat(data?: SeatData): boolean {
  return !data;
}

function Seat({
  seatNumber,
  studentData,
  status,
  onPresent,
  onAbsent,
  disabled,
  blocked,
}: {
  seatNumber: number;
  studentData?: SeatData;
  status: SeatStatus;
  onPresent: () => void;
  onAbsent: () => void;
  disabled?: boolean;
  blocked?: boolean;
}) {
  if (disabled) {
    return (
      <div
        className="backdrop-blur-[3.469px] bg-[rgba(0,0,0,0.15)] content-stretch flex flex-col gap-[8px] h-[91.379px] items-center overflow-clip pb-[7px] pt-[10.816px] px-[11.935px] relative rounded-[4.476px] shrink-0 w-[104.434px] opacity-40"
        data-name="Seat"
      >
        <div className="content-stretch flex flex-col font-['Pretendard:ExtraBold',sans-serif] gap-[12.681px] items-center leading-[normal] not-italic relative shrink-0 text-center text-white/60 w-full">
          <p className="relative shrink-0 text-[18px] w-full">{seatNumber}번</p>
          <p className="relative shrink-0 text-[11px] whitespace-nowrap">빈 좌석</p>
        </div>
        <div className="content-stretch flex gap-[2.984px] items-center relative shrink-0 w-full">
          <div className="flex-[1_0_0] h-[19.395px] min-h-px min-w-px relative rounded-[2.984px] bg-[#4e4d4d]/50">
            <div className="flex items-center justify-center size-full">
              <p className="font-['Pretendard:ExtraBold',sans-serif] text-[9px] text-white/40 whitespace-nowrap">출석</p>
            </div>
          </div>
          <div className="flex-[1_0_0] h-[19.395px] min-h-px min-w-px relative rounded-[2.984px] bg-white/50">
            <div className="flex items-center justify-center size-full">
              <p className="font-['Pretendard:ExtraBold',sans-serif] text-[9px] text-black/40 whitespace-nowrap">결석</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (blocked) {
    return (
      <div
        className="backdrop-blur-[3.469px] bg-[rgba(0,0,0,0.55)] content-stretch flex flex-col gap-[8px] h-[91.379px] items-center overflow-clip pb-[7px] pt-[10.816px] px-[11.935px] relative rounded-[4.476px] shrink-0 w-[104.434px] pointer-events-none select-none"
        data-name="Seat"
      >
        <div className="content-stretch flex flex-col font-['Pretendard:ExtraBold',sans-serif] gap-[12.681px] items-center leading-[normal] not-italic relative shrink-0 text-center text-white/50 w-full">
          <p className="relative shrink-0 text-[18px] w-full">{seatNumber}번</p>
          <p className="relative shrink-0 text-[11px] whitespace-nowrap">{studentData ? `${studentData.studentId} ${studentData.name}` : "학번 이름"}</p>
        </div>
        <div className="content-stretch flex gap-[2.984px] items-center relative shrink-0 w-full">
          <div className="flex-[1_0_0] h-[19.395px] min-h-px min-w-px relative rounded-[2.984px] bg-[#4e4d4d]/40">
            <div className="flex items-center justify-center size-full">
              <p className="font-['Pretendard:ExtraBold',sans-serif] text-[9px] text-white/50 whitespace-nowrap">출석</p>
            </div>
          </div>
          <div className="flex-[1_0_0] h-[19.395px] min-h-px min-w-px relative rounded-[2.984px] bg-white/20">
            <div className="flex items-center justify-center size-full">
              <p className="font-['Pretendard:ExtraBold',sans-serif] text-[9px] text-white/50 whitespace-nowrap">결석</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="backdrop-blur-[3.469px] bg-[rgba(0,0,0,0.42)] content-stretch flex flex-col gap-[8px] h-[91.379px] items-center overflow-clip pb-[7px] pt-[10.816px] px-[11.935px] relative rounded-[4.476px] shrink-0 w-[104.434px]"
      data-name="Seat"
    >
      {/* Alarm Info */}
      <div className="content-stretch flex flex-col font-['Pretendard:ExtraBold',sans-serif] gap-[12.681px] items-center leading-[normal] not-italic relative shrink-0 text-center text-white w-full" data-name="Alarm Info">
        <p className="relative shrink-0 text-[18px] w-full">{seatNumber}번</p>
        <p className="relative shrink-0 text-[11px] whitespace-nowrap">{studentData ? `${studentData.studentId} ${studentData.name}` : "학번 이름"}</p>
      </div>
      {/* Button Container */}
      <div className="content-stretch flex gap-[2.984px] items-center relative shrink-0 w-full" data-name="Button Container">
        <div
          className={`flex-[1_0_0] h-[19.395px] min-h-px min-w-px relative rounded-[2.984px] cursor-pointer active:scale-95 transition-all ${
            status === "present" ? "bg-[#2ecc71]" : "bg-[#4e4d4d]"
          }`}
          data-name="Next Button Container"
          onClick={onPresent}
        >
          <div className="flex flex-row items-center justify-center size-full">
            <div className="content-stretch flex items-center justify-center p-[3.73px] relative size-full">
              <p className="font-['Pretendard:ExtraBold',sans-serif] leading-[normal] not-italic relative shrink-0 text-[9px] text-white whitespace-nowrap">출석</p>
            </div>
          </div>
        </div>
        <div
          className={`flex-[1_0_0] h-[19.395px] min-h-px min-w-px relative rounded-[2.984px] cursor-pointer active:scale-95 transition-all ${
            status === "absent" ? "bg-[#e74c3c]" : "bg-white"
          }`}
          data-name="Home Button Container"
          onClick={onAbsent}
        >
          <div className="flex flex-row items-center justify-center size-full">
            <div className="content-stretch flex items-center justify-center p-[3.73px] relative size-full">
              <p className={`font-['Pretendard:ExtraBold',sans-serif] leading-[normal] not-italic relative shrink-0 text-[9px] whitespace-nowrap ${
                status === "absent" ? "text-white" : "text-black"
              }`}>결석</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SelectButtonContainer({ onClick, isSending }: { onClick: () => void; isSending: boolean }) {
  return (
    <div
      className={`bg-[#141414] content-stretch flex h-[50px] items-center justify-center max-w-[260px] overflow-clip p-[6px] relative rounded-[8px] shrink-0 w-[260px] cursor-pointer active:scale-95 transition-all ${
        isSending ? "opacity-60 pointer-events-none" : ""
      }`}
      data-name="Select Button Container"
      onClick={onClick}
    >
      <p className="font-['Pretendard:SemiBold',sans-serif] leading-[normal] not-italic relative shrink-0 text-[22px] text-white whitespace-nowrap">
        {isSending ? "전송 중..." : "전송하기"}
      </p>
    </div>
  );
}

function FooterTextContainer() {
  return (
    <div className="bg-white content-stretch flex gap-[8px] items-center justify-center p-[12px] relative rounded-[10px] shadow-[0px_0px_8px_0px_rgba(0,0,0,0.12)] shrink-0" data-name="Footer Text Container">
      <p className="font-['NanumSquare:ExtraBold',sans-serif] leading-[normal] not-italic relative shrink-0 text-[16px] text-black whitespace-nowrap">늘 학생들을 위해 애써 주셔서 진심으로 감사드립니다.</p>
      <div className="absolute bottom-[3px] h-[18px] left-[-7px] w-[14px]">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 17 23">
          <path d={svgPaths.p1e207780} fill="white" />
        </svg>
      </div>
    </div>
  );
}

function Footer() {
  return (
    <div className="content-stretch flex gap-[20px] items-center justify-center relative shrink-0" data-name="Footer">
      <div className="flex items-center justify-center relative shrink-0">
        <div className="-scale-y-100 flex-none rotate-180">
          <div className="h-[48px] relative w-[46px]" data-name="영랑이_얼빡1-removebg-preview 1">
            <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={img1RemovebgPreview1} />
          </div>
        </div>
      </div>
      <FooterTextContainer />
    </div>
  );
}

// 2F 좌석 배치: 상단 14개(64~77), 왼쪽 세로 4개(63~60), 하단 11개(59~49)
const SEAT_POSITIONS_2F: { num: number; col: number; row: number }[] = [
  // Top row (columns 1-14, row 1)
  { num: 64, col: 1,  row: 1 },
  { num: 65, col: 2,  row: 1 },
  { num: 66, col: 3,  row: 1 },
  { num: 67, col: 4,  row: 1 },
  { num: 68, col: 5,  row: 1 },
  { num: 69, col: 6,  row: 1 },
  { num: 70, col: 7,  row: 1 },
  { num: 71, col: 8,  row: 1 },
  { num: 72, col: 9,  row: 1 },
  { num: 73, col: 10, row: 1 },
  { num: 74, col: 11, row: 1 },
  { num: 75, col: 12, row: 1 },
  { num: 76, col: 13, row: 1 },
  { num: 77, col: 14, row: 1 },
  // Left column (column 1, rows 2-5)
  { num: 63, col: 1, row: 2 },
  { num: 62, col: 1, row: 3 },
  { num: 61, col: 1, row: 4 },
  { num: 60, col: 1, row: 5 },
  // Bottom row (columns 1-11, row 6)
  { num: 59, col: 1,  row: 6 },
  { num: 58, col: 2,  row: 6 },
  { num: 57, col: 3,  row: 6 },
  { num: 56, col: 4,  row: 6 },
  { num: 55, col: 5,  row: 6 },
  { num: 54, col: 6,  row: 6 },
  { num: 53, col: 7,  row: 6 },
  { num: 52, col: 8,  row: 6 },
  { num: 51, col: 9,  row: 6 },
  { num: 50, col: 10, row: 6 },
  { num: 49, col: 11, row: 6 },
];
const ALL_SEATS = SEAT_POSITIONS_2F.map((p) => p.num); // 총 29개

export default function Floor2({ onNavigateBack }: Floor2Props) {
  const { selectedPeriod, setSelectedPeriod } = useAutoPeriod();
  const [periodStatuses, setPeriodStatuses] = useState<Record<number, Record<number, SeatStatus>>>({
    0: {}, 1: {}, 2: {}, 3: {},
  });
  const [isSending, setIsSending] = useState(false);
  const { data: sheetData, unavailableMap, loading, error } = useGoogleSheet("Weekly 2F");
  const { scale } = useResponsiveScale({ baseWidth: 1920, baseHeight: 1080 });
  const initializedRef = useRef(false);

  useEffect(() => {
    if (!loading && !initializedRef.current) {
      initializedRef.current = true;
      const newStatuses: Record<number, Record<number, SeatStatus>> = { 0: {}, 1: {}, 2: {}, 3: {} };
      ALL_SEATS.forEach((seatNum) => {
        const seat = sheetData[seatNum];
        if (isEmptySeat(seat)) return;
        for (let p = 0; p < 4; p++) {
          const val = seat?.periods?.[p] || "";
          if (val === "X") {
            newStatuses[p][seatNum] = "absent";
          } else if (val === "O") {
            newStatuses[p][seatNum] = "present";
          } else if (p === selectedPeriod) {
            newStatuses[p][seatNum] = "present";
          }
        }
      });
      setPeriodStatuses(newStatuses);
      console.log(`[Floor2] 시트 기존 값 반영 완료. ${selectedPeriod + 1}교시 기준 초기화.`);
    }
  }, [loading, sheetData, selectedPeriod]);

  const currentStatuses = periodStatuses[selectedPeriod] || {};
  const presentCount = Object.values(currentStatuses).filter((s) => s === "present").length;

  const isBlocked = (seatNum: number): boolean => {
    const key = `${getDayGroup()}_${selectedPeriod}`;
    if (unavailableMap[seatNum]?.[key]) return true;
    const val = sheetData[seatNum]?.periods?.[selectedPeriod];
    return val === "X";
  };

  const handlePresent = (num: number) => {
    setPeriodStatuses((prev) => {
      const current = prev[selectedPeriod] || {};
      return {
        ...prev,
        [selectedPeriod]: {
          ...current,
          [num]: current[num] === "present" ? "none" : "present",
        },
      };
    });
  };

  const handleAbsent = (num: number) => {
    setPeriodStatuses((prev) => {
      const current = prev[selectedPeriod] || {};
      return {
        ...prev,
        [selectedPeriod]: {
          ...current,
          [num]: current[num] === "absent" ? "none" : "absent",
        },
      };
    });
  };

  const handleSubmit = async () => {
    setIsSending(true);
    try {
      const allSeats = [...ALL_SEATS].sort((a, b) => a - b);
      const rows = allSeats.map((seatNum) => {
        const status = currentStatuses[seatNum];
        return {
          seatNumber: seatNum,
          value: status === "present" ? "O" : status === "absent" ? "X" : "",
        };
      });

      await submitAttendance({ floor: "2F", period: selectedPeriod, rows });

      alert(`${selectedPeriod + 1}교시 출석 데이터가 전송되었습니다!`);
    } catch (err) {
      console.error("전송 실패:", err);
      alert("전송에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-gradient-to-t from-[#0ea5e9] to-[#e0f2fe] flex items-center justify-center" data-name="2F-Wrapper">
      <div
        className="bg-gradient-to-t content-stretch flex flex-col from-[#0ea5e9] gap-[16px] items-center pb-[14px] pt-[16px] px-[20px] relative w-[1920px] h-[1080px] to-[#e0f2fe] origin-center"
        style={{ transform: `scale(${scale})` }}
        data-name="2F"
      >
        <Header onBack={onNavigateBack} presentCount={presentCount} />

        {loading && (
          <div className="flex items-center justify-center flex-1">
            <p className="font-['NanumSquare:ExtraBold',sans-serif] text-[24px] text-[#0e0c0a] animate-pulse">데이터 불러오는 중...</p>
          </div>
        )}

        {error && (
          <div className="flex flex-col items-center justify-center flex-1 gap-[16px] px-[40px]">
            <p className="font-['NanumSquare:ExtraBold',sans-serif] text-[22px] text-[#d10e0e]">시트 연결 실패</p>
            <div className="bg-white/80 rounded-[12px] p-[20px] max-w-[600px] w-full">
              <p className="font-['NanumSquare:Bold',sans-serif] text-[16px] text-[#333] whitespace-pre-line">{error}</p>
            </div>
            <p className="font-['NanumSquare:Bold',sans-serif] text-[14px] text-[#888] text-center">
              브라우저 개발자 도구(F12) → Console 탭에서 상세 로그를 확인할 수 있습니다.
            </p>
          </div>
        )}

        {!loading && !error && (
          <>
            {/* Content Container */}
            <div
              className="bg-[rgba(255,255,255,0.7)] content-stretch flex flex-col flex-1 items-center max-w-[1880px] relative rounded-[14px] shrink-0 w-full overflow-hidden"
              data-name="Content Container"
            >
              {/* Word Container */}
              <div
                className="flex flex-col flex-1 gap-[28px] px-[20px] py-[20px] relative w-full"
                data-name="Word Container"
              >
                <StateBar selectedPeriod={selectedPeriod} onSelectPeriod={setSelectedPeriod} />
                
                {/* Seats Layout - 2F Grid */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(14, 1fr)',
                  gridTemplateRows: 'repeat(6, auto)',
                  gap: '8px',
                  width: '100%',
                }}>
                  {SEAT_POSITIONS_2F.map(({ num, col, row }) => (
                    <div key={num} style={{ gridColumn: col, gridRow: row, display: 'flex', justifyContent: 'center' }}>
                      <Seat
                        seatNumber={num}
                        studentData={sheetData[num]}
                        status={currentStatuses[num] || "none"}
                        onPresent={() => handlePresent(num)}
                        onAbsent={() => handleAbsent(num)}
                        disabled={isEmptySeat(sheetData[num])}
                        blocked={!isEmptySeat(sheetData[num]) && isBlocked(num)}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Select Button Container (전송하기) */}
              <div className="pb-[18px]">
                <SelectButtonContainer onClick={handleSubmit} isSending={isSending} />
              </div>
            </div>

            <Footer />
          </>
        )}
      </div>
    </div>
  );
}