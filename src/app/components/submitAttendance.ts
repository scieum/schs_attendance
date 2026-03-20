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
 * no-cors POST는 redirect 시 body 유실 문제가 있으므로
 * JSONP(GET) 방식으로 전송합니다.
 */
export function submitAttendance(payload: SubmitPayload): Promise<void> {
  return new Promise((resolve, reject) => {
    const callbackName = `__submitCb_${Date.now()}`;
    const timeoutMs = 15000;

    const timer = setTimeout(() => {
      cleanup();
      reject(new Error("전송 시간 초과"));
    }, timeoutMs);

    const cleanup = () => {
      clearTimeout(timer);
      delete (window as unknown as Record<string, unknown>)[callbackName];
      document.getElementById(callbackName)?.remove();
    };

    (window as unknown as Record<string, unknown>)[callbackName] = (
      result: { success?: boolean; error?: string }
    ) => {
      cleanup();
      if (result?.error) {
        reject(new Error(result.error));
      } else {
        resolve();
      }
    };

    const url =
      `${APPS_SCRIPT_URL}?action=submit` +
      `&payload=${encodeURIComponent(JSON.stringify(payload))}` +
      `&callback=${callbackName}`;

    const script = document.createElement("script");
    script.id = callbackName;
    script.src = url;
    script.onerror = () => {
      cleanup();
      reject(new Error("전송 실패. 네트워크를 확인해주세요."));
    };

    document.head.appendChild(script);
  });
}
