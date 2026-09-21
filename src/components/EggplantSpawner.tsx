"use client";

import { useEffect, useRef, useState } from "react";
import { claimEggplantReward } from "@/app/actions/rewards";

function randomThreshold() {
  return 2 + Math.floor(Math.random() * 3); // 2~4번 클릭마다 (평균 3번)
}

export default function EggplantSpawner() {
  const [pos, setPos] = useState<{ top: string; left: string } | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const clickCountRef = useRef(0);
  const thresholdRef = useRef(randomThreshold());
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    function handlePageClick() {
      clickCountRef.current += 1;
      if (clickCountRef.current < thresholdRef.current) return;

      clickCountRef.current = 0;
      thresholdRef.current = randomThreshold();

      const top = 15 + Math.random() * 60;
      const left = 10 + Math.random() * 75;
      setPos({ top: `${top}vh`, left: `${left}vw` });

      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
      hideTimerRef.current = setTimeout(() => setPos(null), 6000);
    }

    document.addEventListener("click", handlePageClick);
    return () => {
      document.removeEventListener("click", handlePageClick);
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    };
  }, []);

  async function handleEggplantClick() {
    setPos(null);
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);

    const result = await claimEggplantReward();
    setToast(
      result.ok ? `+100원 적립! (총 ${result.points.toLocaleString("ko-KR")}원)` : result.message
    );
    setTimeout(() => setToast(null), 2500);
  }

  return (
    <>
      {pos && (
        <button
          onClick={handleEggplantClick}
          aria-label="가지 이벤트 - 클릭하면 100원 적립"
          className="fixed z-50 animate-bounce text-4xl drop-shadow-lg transition hover:scale-110"
          style={{ top: pos.top, left: pos.left }}
        >
          🍆
        </button>
      )}
      {toast && (
        <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 whitespace-nowrap rounded-full bg-zinc-900/90 px-4 py-2 text-sm font-medium text-white shadow-lg">
          {toast}
        </div>
      )}
    </>
  );
}
