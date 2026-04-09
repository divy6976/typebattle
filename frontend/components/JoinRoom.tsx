"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type JoinRoomProps = {
  onJoinRoom?: (roomCode: string) => void;
};

function JoinRoomIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <path
        d="M4.5 12H17.5M13.5 7.8L17.8 12L13.5 16.2"
        className="stroke-current"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9 4.5H16.5C18.4 4.5 19.5 5.6 19.5 7.5V16.5C19.5 18.4 18.4 19.5 16.5 19.5H9"
        className="stroke-current"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ArrowRightIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <path
        d="M4.5 12H19.5M14.8 7.3L19.5 12L14.8 16.7"
        className="stroke-current"
        strokeWidth="2.1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function JoinRoom({ onJoinRoom }: JoinRoomProps) {
  const router = useRouter();
  const [roomCode, setRoomCode] = useState("");

  const handleJoin = () => {
    const code = roomCode.trim().replace(/\s+/g, "").toUpperCase();
    if (!code) return;
    onJoinRoom?.(code);
    router.push(`/battle/room/${encodeURIComponent(code)}`);
  };

  return (
    <section className="group w-full rounded-3xl border border-white/12 bg-white/5 px-3.5 py-3 backdrop-blur-xl shadow-[0_0_0_1px_rgba(130,145,184,0.1),0_22px_54px_rgba(0,0,0,0.55)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#8b5cf6]/40 hover:shadow-[0_0_0_1px_rgba(139,92,246,0.2),0_26px_64px_rgba(0,0,0,0.62)]">
      <div className="mx-auto max-w-[560px] text-center font-sans">
        <JoinRoomIcon className="mx-auto h-5 w-5 text-[#7f53f4]" />
        <h2 className="font-mono mt-0.5 text-[26px] font-extrabold leading-none tracking-tight text-transparent bg-linear-to-r from-white via-[#eceafd] to-[#8b5cf6] bg-clip-text">
          Join Room
        </h2>
        <p className="mt-1 text-[13px] font-medium text-[#9ea9bc]">Enter a room code to join</p>

        <div className="mt-2">
          <input
            type="text"
            value={roomCode}
            onChange={(event) => setRoomCode(event.target.value.toUpperCase())}
            placeholder="Enter room code"
            className="h-[44px] w-full rounded-2xl border border-white/12 bg-[#101626]/95 px-4 text-[14px] font-semibold tracking-[0.03em] text-[#e7e9f0] placeholder:text-[14px] placeholder:font-medium placeholder:tracking-normal placeholder:text-[#6e7486] shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] transition-all duration-200 focus:border-[#8b5cf6]/70 focus:outline-none focus:ring-2 focus:ring-[#8b5cf6]/35"
            maxLength={10}
            aria-label="Enter room code"
          />
        </div>

        <button
          type="button"
          onClick={handleJoin}
          className="mt-2 flex h-[44px] w-full items-center justify-center gap-2 rounded-2xl bg-linear-to-r from-[#8b5cf6] via-[#7c3aed] to-[#6d28d9] text-[15px] font-extrabold text-white transition-all duration-300 hover:-translate-y-0.5 hover:scale-[1.01] hover:shadow-[0_0_24px_rgba(139,92,246,0.35)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8b5cf6]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b1120] active:scale-[0.985]"
        >
          <span>Join Room</span>
          <ArrowRightIcon className="h-5 w-5" />
        </button>
      </div>
    </section>
  );
}

