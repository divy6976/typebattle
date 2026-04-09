"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type CreateRoomProps = {
  initialCode?: string;
  onCreateRoom?: (roomId: string) => void;
};
const ROOM_CODE_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no O/0/I/1
const ROOM_CODE_LENGTH = 8;

function CreateRoomIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <path
        d="M15 19H8.5C5.5 19 4 17.5 4 14.5V8C4 5 5.5 3.5 8.5 3.5H15.5C18.5 3.5 20 5 20 8V14"
        className="stroke-current"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.5 8.5H14.5M9.5 12H13"
        className="stroke-current"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <circle cx="19" cy="19" r="3.5" className="stroke-current" strokeWidth="1.8" />
      <path d="M19 17.6V20.4M17.6 19H20.4" className="stroke-current" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function CopyIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <rect x="9" y="9" width="10" height="10" rx="2" className="stroke-current" strokeWidth="1.8" />
      <rect x="5" y="5" width="10" height="10" rx="2" className="stroke-current" strokeWidth="1.8" />
    </svg>
  );
}

function PlusCircleIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" className="stroke-current" strokeWidth="1.8" />
      <path d="M12 8.7V15.3M8.7 12H15.3" className="stroke-current" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function SmileyIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="8" className="stroke-current" strokeWidth="1.8" />
      <path d="M9.2 10.1H9.21M14.8 10.1H14.81" className="stroke-current" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M8.8 14.3C9.7 15.3 10.8 15.8 12 15.8C13.2 15.8 14.3 15.3 15.2 14.3" className="stroke-current" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function ClockIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="8" className="stroke-current" strokeWidth="1.8" />
      <path d="M12 7.8V12.2L14.8 13.8" className="stroke-current" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function CreateRoom({ initialCode = "A7B3K", onCreateRoom }: CreateRoomProps) {
  const router = useRouter();
  const [, setRoomCode] = useState(initialCode);
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("medium");
  const [timeLimit, setTimeLimit] = useState<30 | 45 | 60>(45);

  const generateRoomCode = () => {
    const newCode = Array.from(
      { length: ROOM_CODE_LENGTH },
      () => ROOM_CODE_CHARS[Math.floor(Math.random() * ROOM_CODE_CHARS.length)],
    ).join("");
    setRoomCode(newCode);
    onCreateRoom?.(newCode);
    router.push(`/battle/room/${newCode}?difficulty=${difficulty}&timeLimit=${timeLimit}`);
  };

  return (
    <section className="group w-full rounded-3xl border border-[#facc15]/45 bg-[#070b14]/85 px-3.5 py-3 backdrop-blur-xl shadow-[0_0_0_1px_rgba(250,204,21,0.16),0_22px_54px_rgba(0,0,0,0.58)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#facc15]/60 hover:shadow-[0_0_0_1px_rgba(250,204,21,0.24),0_26px_64px_rgba(0,0,0,0.62)]">
      <div className="mx-auto max-w-[560px] text-center font-sans">
        <div className="flex items-center justify-center gap-2">
          <CreateRoomIcon className="h-5 w-5 text-[#facc15]" />
          <h2 className="font-mono mt-0.5 text-[26px] font-extrabold leading-none tracking-tight text-white">Create Room</h2>
        </div>
        <p className="mt-1 text-[13px] font-medium text-[#9ea9bc]">Create a new room and share the code</p>

        <div className="mt-2 rounded-2xl border border-white/12 bg-[#0f1420]/85 px-3 py-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
          <p className="text-[12px] font-bold tracking-[0.18em] text-[#c1cbda]">DIFFICULTY</p>
          <div className="mt-1.5 grid grid-cols-3 gap-1.5">
            <button
              type="button"
              onClick={() => setDifficulty("easy")}
              className={[
                "flex h-10 items-center justify-center gap-1 rounded-xl border text-[15px] font-bold transition-all duration-200",
                difficulty === "easy"
                  ? "border-[#22c55e]/40 bg-[#16a34a]/20 text-[#22c55e] shadow-[0_0_20px_rgba(34,197,94,0.2)]"
                  : "border-white/10 bg-[#171b24] text-[#9ca7bc] hover:border-white/20 hover:text-white",
              ].join(" ")}
            >
              <SmileyIcon className="h-4.5 w-4.5" />
              <span>Easy</span>
            </button>
            <button
              type="button"
              onClick={() => setDifficulty("medium")}
              className={[
                "flex h-10 items-center justify-center gap-1 rounded-xl border text-[15px] font-bold transition-all duration-200",
                difficulty === "medium"
                  ? "border-[#facc15]/40 bg-[#facc15]/22 text-[#f6d75d] shadow-[0_0_20px_rgba(250,204,21,0.2)]"
                  : "border-white/10 bg-[#171b24] text-[#9ca7bc] hover:border-white/20 hover:text-white",
              ].join(" ")}
            >
              <SmileyIcon className="h-4.5 w-4.5" />
              <span>Medium</span>
            </button>
            <button
              type="button"
              onClick={() => setDifficulty("hard")}
              className={[
                "flex h-10 items-center justify-center gap-1 rounded-xl border text-[15px] font-bold transition-all duration-200",
                difficulty === "hard"
                  ? "border-[#ef4444]/40 bg-[#ef4444]/20 text-[#ef4444] shadow-[0_0_20px_rgba(239,68,68,0.18)]"
                  : "border-white/10 bg-[#171b24] text-[#9ca7bc] hover:border-white/20 hover:text-white",
              ].join(" ")}
            >
              <SmileyIcon className="h-4.5 w-4.5" />
              <span>Hard</span>
            </button>
          </div>
        </div>

        <div className="mt-1.5 rounded-2xl border border-white/12 bg-[#0f1420]/85 px-3 py-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
          <p className="text-[12px] font-bold tracking-[0.18em] text-[#c1cbda]">TIME LIMIT</p>
          <div className="mt-1.5 grid grid-cols-3 gap-1.5">
            {[30, 45, 60].map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setTimeLimit(value as 30 | 45 | 60)}
                className={[
                  "flex h-10 items-center justify-center gap-1 rounded-xl border text-[15px] font-bold transition-all duration-200",
                  timeLimit === value
                    ? "border-[#facc15]/45 bg-linear-to-r from-[#facc15] to-[#fbbf24] text-[#0f172a] shadow-[0_0_20px_rgba(250,204,21,0.2)]"
                    : "border-white/10 bg-[#171b24] text-[#d0d6e0] hover:border-white/20 hover:text-white",
                ].join(" ")}
              >
                <ClockIcon className="h-4.5 w-4.5" />
                <span>{value}s</span>
              </button>
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={generateRoomCode}
          className="mt-2 flex h-[46px] w-full items-center justify-center gap-2 rounded-2xl bg-linear-to-r from-[#facc15] via-[#fbbf24] to-[#facc15] text-[17px] font-extrabold text-[#0a0f1c] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_26px_rgba(250,204,21,0.35)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#facc15]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b1120] active:scale-[0.985]"
        >
          <span>Create Room</span>
          <PlusCircleIcon className="h-5 w-5" />
        </button>
      </div>
    </section>
  );
}

