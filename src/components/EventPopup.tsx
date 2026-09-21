"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "ggm_event_popup_dismissed_date";

export default function EventPopup({ isLoggedIn }: { isLoggedIn: boolean }) {
  const [open, setOpen] = useState(false);

  // 로그인 여부와 무관하게 브라우저에만 저장된 "오늘 안 보기" 상태를 마운트 후 한 번 확인함.
  useEffect(() => {
    try {
      const today = new Date().toDateString();
      if (localStorage.getItem(STORAGE_KEY) !== today) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setOpen(true);
      }
    } catch {
      setOpen(true);
    }
  }, []);

  function close(dismissToday: boolean) {
    setOpen(false);
    if (dismissToday) {
      try {
        localStorage.setItem(STORAGE_KEY, new Date().toDateString());
      } catch {
        // 저장 실패해도 무시 (프라이빗 모드 등)
      }
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-xs rounded-2xl bg-white p-5 text-center shadow-xl">
        <p className="text-4xl">🍆🎉</p>
        <h2 className="mt-2 text-lg font-bold text-zinc-900">가지가지마켓 오픈 기념 이벤트</h2>
        <p className="mt-2 text-sm text-zinc-600">
          사이트를 돌아다니다 보이는 가지(🍆)를 클릭하면
          <br />
          <span className="font-semibold text-orange-600">100원씩 적립</span>돼요!
        </p>
        {!isLoggedIn && (
          <p className="mt-2 text-xs text-zinc-400">로그인하면 적립을 시작할 수 있어요.</p>
        )}
        <div className="mt-4 flex flex-col gap-2">
          <button
            onClick={() => close(false)}
            className="rounded-lg bg-orange-500 py-2 text-sm font-medium text-white transition hover:bg-orange-600"
          >
            확인!
          </button>
          <button onClick={() => close(true)} className="text-xs text-zinc-400 underline">
            오늘 하루 안 보기
          </button>
        </div>
      </div>
    </div>
  );
}
