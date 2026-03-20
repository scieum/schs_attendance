import svgPaths from "../../imports/svg-d7huhobbv7";
const img1RemovebgPreview1 = `${import.meta.env.BASE_URL}mascot-1f3f.png`;
import { useState, useEffect, useRef, useLayoutEffect } from "react";
import { useGoogleSheet, getDayGroup, SeatData } from "./useGoogleSheet";
import { useResponsiveScale } from "./useResponsiveScale";
import { useAutoPeriod } from "./useAutoPeriod";

interface Floor3Props {
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
          <clipPath id="bgblur_0_26_299_clip_path" transform="translate(37 37)">
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
          <p className="leading-[normal] relative shrink-0 text-[#0e0c0a]">3</p>
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
  return !data || !data.name?.trim();
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

// 3F 좌석 배치도 기준 (총 27석) - 5열 9행 그리드
const SEAT_POSITIONS: { num: number; col: number; row: number }[] = [
  // Left wall (col 1, rows 1-7)
  { num: 84, col: 1, row: 1 },
  { num: 83, col: 1, row: 2 },
  { num: 82, col: 1, row: 3 },
  { num: 81, col: 1, row: 4 },
  { num: 80, col: 1, row: 5 },
  { num: 79, col: 1, row: 6 },
  { num: 78, col: 1, row: 7 },
  // Center-left (col 2)
  { num: 85, col: 2, row: 1 },
  { num: 86, col: 2, row: 3 },
  { num: 87, col: 2, row: 4 },
  { num: 88, col: 2, row: 5 },
  // Center-right (col 3)
  { num: 95, col: 3, row: 1 },
  { num: 94, col: 3, row: 3 },
  { num: 93, col: 3, row: 4 },
  { num: 92, col: 3, row: 5 },
  // Right wall (col 5, rows 1-9)
  { num: 96, col: 5, row: 1 },
  { num: 97, col: 5, row: 2 },
  { num: 98, col: 5, row: 3 },
  { num: 99, col: 5, row: 4 },
  { num: 100, col: 5, row: 5 },
  { num: 101, col: 5, row: 6 },
  { num: 102, col: 5, row: 7 },
  { num: 103, col: 5, row: 8 },
  { num: 104, col: 5, row: 9 },
  // Bottom center (row 9)
  { num: 89, col: 2, row: 9 },
  { num: 90, col: 3, row: 9 },
  { num: 91, col: 4, row: 9 },
];
const ALL_SEATS = SEAT_POSITIONS.map((p) => p.num);

const GRID_NATURAL_WIDTH = 5 * 104.434 + 4 * 6;
const GRID_NATURAL_HEIGHT = 9 * 91.379 + 8 * 6;

export default function Floor3({ onNavigateBack }: Floor3Props) {
  const { selectedPeriod, setSelectedPeriod } = useAutoPeriod();
  const [periodStatuses, setPeriodStatuses] = useState<Record<number, Record<number, SeatStatus>>>({
    0: {}, 1: {}, 2: {}, 3: {},
  });
  const [isSending, setIsSending] = useState(false);
  const { data: sheetData, unavailableMap, loading, error } = useGoogleSheet("Weekly(3F)");
  const { scale } = useResponsiveScale({ baseWidth: 1920, baseHeight: 1080 });
  const initializedRef = useRef(false);
  const gridWrapperRef = useRef<HTMLDivElement>(null);
  const [gridScale, setGridScale] = useState(1);

  useLayoutEffect(() => {
    const wrapper = gridWrapperRef.current;
    if (!wrapper || loading) return;
    const availH = wrapper.clientHeight;
    const availW = wrapper.clientWidth;
    const s = Math.min(availH / GRID_NATURAL_HEIGHT, availW / GRID_NATURAL_WIDTH, 1);
    setGridScale(s);
  }, [loading]);

  useEffect(() => {
    if (!loading && !initializedRef.current) {
      initializedRef.current = true;
      const newStatuses: Record<number, Record<number, SeatStatus>> = { 0: {}, 1: {}, 2: {}, 3: {} };
      ALL_SEATS.forEach((seatNum) => {
        const seat = sheetData[seatNum];
        if (isEmptySeat(seat)) return;
        for (let p = 0; p < 4; p++) {
          const val = seat?.periods?.[p] || "";
          const periodKey = `${getDayGroup()}_${p}`;
          if (unavailableMap[seatNum]?.[periodKey]) continue; // 음영(해당 교시 없음) 제외
          if (val === "X") {
            newStatuses[p][seatNum] = "absent";
          } else if (val === "O") {
            newStatuses[p][seatNum] = "present";
          } else {
            newStatuses[p][seatNum] = "present";
          }
        }
      });
      setPeriodStatuses(newStatuses);
      console.log(`[Floor3] 시트 기존 값 반영 완료. ${selectedPeriod + 1}교시 기준 초기화.`);
    }
  }, [loading, sheetData, selectedPeriod, unavailableMap]);

  const currentStatuses = periodStatuses[selectedPeriod] || {};

  const isBlocked = (seatNum: number): boolean => {
    const key = `${getDayGroup()}_${selectedPeriod}`;
    if (unavailableMap[seatNum]?.[key]) return true;
    const val = sheetData[seatNum]?.periods?.[selectedPeriod];
    return val === "X";
  };

  const presentCount = Object.entries(currentStatuses)
    .filter(([seatNum, s]) => s === "present" && !isBlocked(parseInt(seatNum)))
    .length;

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

      await submitAttendance({ floor: "3F", period: selectedPeriod, rows });

      alert(`${selectedPeriod + 1}교시 출석 데이터가 전송되었습니다!`);
    } catch (err) {
      console.error("전송 실패:", err);
      alert("전송에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-gradient-to-t from-[#a855f7] to-[#f3e8ff] flex items-center justify-center" data-name="3F-Wrapper">
      <div
        className="bg-gradient-to-t content-stretch flex flex-col from-[#a855f7] gap-[16px] items-center pb-[14px] pt-[16px] px-[20px] relative w-[1920px] h-[1080px] to-[#f3e8ff] origin-center"
        style={{ transform: `scale(${scale})` }}
        data-name="3F"
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
                className="flex flex-col flex-1 min-h-0 gap-[28px] px-[20px] py-[20px] relative w-full"
                data-name="Word Container"
              >
                <StateBar selectedPeriod={selectedPeriod} onSelectPeriod={setSelectedPeriod} />

                {/* Grid Area - auto-scale to fit */}
                <div ref={gridWrapperRef} className="flex-1 min-h-0 flex items-center justify-center overflow-hidden">
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(5, auto)',
                    gridTemplateRows: 'repeat(9, auto)',
                    gap: '6px',
                    transform: `scale(${gridScale})`,
                    transformOrigin: 'center center',
                  }}>
                    {SEAT_POSITIONS.map(({ num, col, row }) => (
                      <div key={num} style={{ gridColumn: col, gridRow: row }}>
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
                    <div
                      style={{ gridColumn: 1, gridRow: 9 }}
                      className="flex items-center justify-center rounded-[4px] border-2 border-black/20 bg-white/30 h-[91.379px] w-[104.434px]"
                    >
                      <p className="font-['Pretendard:SemiBold',sans-serif] text-[14px] text-black/40">출입문</p>
                    </div>
                  </div>
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
