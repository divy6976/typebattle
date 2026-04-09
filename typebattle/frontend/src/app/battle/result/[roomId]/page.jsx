"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  Clock3,
  Crown,
  Crosshair,
  Keyboard,
  Timer,
  TriangleAlert,
} from "lucide-react";
import PlayerCard from "./components/PlayerCard";
import ProgressBar from "./components/ProgressBar";
import StatCard from "./components/StatCard";

const RESULT_DATA = {
  you: {
    label: "YOU",
    name: "Player 1",
    subtitle: "THE CHAMPION",
    wpm: 82,
    accuracy: 96,
    correctChars: 457,
    progress: 96,
    isWinner: true,
  },
  opponent: {
    label: "OPPONENT",
    name: "Player 2",
    subtitle: "GOOD TRY!",
    wpm: 68,
    accuracy: 89,
    correctChars: 362,
    progress: 78,
    isWinner: false,
  },
  stats: [
    { label: "Total Words", value: "93", icon: Keyboard, iconClassName: "text-slate-200" },
    { label: "Correct Words", value: "89", icon: Crosshair, iconClassName: "text-emerald-300" },
    { label: "Mistakes", value: "4", icon: TriangleAlert, iconClassName: "text-rose-300" },
    { label: "Avg. WPM", value: "75", icon: Timer, iconClassName: "text-violet-300" },
    { label: "Time Played", value: "60s", icon: Clock3, iconClassName: "text-amber-300" },
  ],
};

const PARTICLES = Array.from({ length: 22 }, (_, i) => ({
  id: i + 1,
  left: `${Math.random() * 100}%`,
  top: `${Math.random() * 100}%`,
  size: `${3 + Math.random() * 3}px`,
  delay: `${Math.random() * 4}s`,
  duration: `${4 + Math.random() * 4}s`,
}));

export default function BattleResultPage() {
  const params = useParams();
  const roomId = typeof params?.roomId === "string" ? params.roomId : "";
  const [resultData, setResultData] = useState(null);

  useEffect(() => {
    if (!roomId || typeof window === "undefined") return;
    const raw = window.sessionStorage.getItem(`battle_result_${roomId}`);
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw);
      setResultData(parsed);
    } catch {
      // ignore malformed cache and keep fallback UI
    }
  }, [roomId]);

  const resolved = useMemo(() => {
    if (!resultData) return null;

    const player1 = resultData?.player1 ?? null;
    const player2 = resultData?.player2 ?? null;
    const mySocketId = resultData?.mySocketId ?? "";

    const me =
      player1?.id === mySocketId ? player1 : player2?.id === mySocketId ? player2 : player1;
    const opp =
      player1?.id === mySocketId ? player2 : player2?.id === mySocketId ? player1 : player2;

    const safe = (stats) => ({
      correctChars: Number.isFinite(stats?.correctChars) ? stats.correctChars : 0,
      mistakes: Number.isFinite(stats?.mistakes) ? stats.mistakes : 0,
      totalTypedChars: Number.isFinite(stats?.totalTypedChars) ? stats.totalTypedChars : 0,
      accuracy: Number.isFinite(stats?.accuracy) ? stats.accuracy : 0,
      wpm: Number.isFinite(stats?.wpm) ? stats.wpm : 0,
      progress: Number.isFinite(stats?.progress) ? stats.progress : 0,
    });

    const youStats = safe(me?.stats);
    const oppStats = safe(opp?.stats);
    const youWin = resultData?.winnerId === mySocketId;

    return {
      youWin,
      you: {
        label: "YOU",
        name: "Player 1",
        subtitle: youWin ? "THE CHAMPION" : "GOOD TRY!",
        wpm: youStats.wpm,
        accuracy: youStats.accuracy,
        correctChars: youStats.correctChars,
        progress: youStats.progress,
        isWinner: youWin,
      },
      opponent: {
        label: "OPPONENT",
        name: "Player 2",
        subtitle: youWin ? "GOOD TRY!" : "THE CHAMPION",
        wpm: oppStats.wpm,
        accuracy: oppStats.accuracy,
        correctChars: oppStats.correctChars,
        progress: oppStats.progress,
        isWinner: !youWin,
      },
      stats: [
        { label: "Total Words", value: String(Math.round(youStats.totalTypedChars / 5)), icon: Keyboard, iconClassName: "text-slate-200" },
        { label: "Correct Words", value: String(Math.round(youStats.correctChars / 5)), icon: Crosshair, iconClassName: "text-emerald-300" },
        { label: "Mistakes", value: String(youStats.mistakes), icon: TriangleAlert, iconClassName: "text-rose-300" },
        { label: "Avg. WPM", value: String(youStats.wpm), icon: Timer, iconClassName: "text-violet-300" },
        { label: "Time Played", value: "60s", icon: Clock3, iconClassName: "text-amber-300" },
      ],
    };
  }, [resultData]);

  const uiData = resolved ?? RESULT_DATA;

  return (
    <main className="relative flex h-dvh items-center justify-center overflow-hidden bg-black px-3 py-2 font-mono text-white sm:px-4 sm:py-3 lg:px-6">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_18%,rgba(255,180,60,0.16),transparent_40%),radial-gradient(circle_at_50%_100%,rgba(139,92,246,0.12),transparent_45%)]" />
        <div className="absolute -left-28 top-20 h-64 w-64 rounded-full bg-orange-500/25 blur-3xl" />
        <div className="absolute right-0 top-0 h-72 w-72 rounded-full bg-violet-600/25 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-56 w-56 rounded-full bg-emerald-500/15 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.7)_0.6px,transparent_0.6px)] bg-size-[3px_3px] opacity-[0.08]" />
        {PARTICLES.map((particle) => (
          <span
            key={particle.id}
            className="absolute rounded-full bg-white/30"
            style={{
              left: particle.left,
              top: particle.top,
              width: particle.size,
              height: particle.size,
              animationName: "floatParticle",
              animationTimingFunction: "ease-in-out",
              animationIterationCount: "infinite",
              animationDelay: particle.delay,
              animationDuration: particle.duration,
            }}
          />
        ))}
      </div>

      <section className="relative mx-auto flex h-full max-h-[calc(100dvh-0.5rem)] w-full max-w-6xl flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-3 shadow-[0_24px_70px_rgba(0,0,0,0.7)] backdrop-blur-xl animate-[roomFadeIn_0.7s_ease-out] sm:p-4">
        <div className="pointer-events-none absolute inset-0 rounded-2xl bg-[linear-gradient(145deg,rgba(255,255,255,0.06),transparent_45%)]" />
        <header className="relative text-center">
          <h1 className="bg-linear-to-r from-yellow-400 via-orange-500 to-yellow-300 bg-clip-text text-3xl font-black tracking-wide text-transparent drop-shadow-[0_0_20px_rgba(251,146,60,0.55)] animate-[roomCodePulse_4s_ease-in-out_infinite] sm:text-4xl">
            BATTLE OVER!
          </h1>
          <p className="mt-0.5 text-xs text-slate-300 sm:text-sm">Time&apos;s up! Here are your results.</p>
          <h2
            className={[
              "mt-1 bg-clip-text text-2xl font-black text-transparent animate-[roomCodePulse_3.5s_ease-in-out_infinite] sm:text-3xl",
              uiData.youWin === false
                ? "bg-linear-to-r from-rose-300 via-red-400 to-rose-200 drop-shadow-[0_0_30px_rgba(251,113,133,0.85)]"
                : "bg-linear-to-r from-emerald-300 via-green-400 to-emerald-200 drop-shadow-[0_0_30px_rgba(52,211,153,0.85)]",
            ].join(" ")}
          >
            {uiData.youWin === false ? "YOU LOSE!" : "YOU WIN!"}
          </h2>
          <div className="relative mx-auto mt-2 grid h-16 w-16 place-items-center rounded-full border border-yellow-300/40 bg-yellow-400/15 shadow-[0_0_40px_rgba(250,204,21,0.55)] animate-[avatarFloat_3.2s_ease-in-out_infinite]">
            <div className="pointer-events-none absolute -inset-3 rounded-full bg-[radial-gradient(circle,rgba(253,224,71,0.28)_0%,rgba(251,146,60,0.14)_38%,transparent_72%)] blur-lg" />
            <Crown className="relative h-8 w-8 text-yellow-200 drop-shadow-[0_0_18px_rgba(250,204,21,0.95)]" />
          </div>
        </header>

        <div className="mt-2 grid gap-2 lg:grid-cols-[1fr_145px_1fr] lg:items-center">
          <PlayerCard side="you" {...uiData.you} />

          <div className="mx-auto w-full max-w-[145px] rounded-2xl border border-white/10 bg-white/5 px-2.5 py-2.5 text-center backdrop-blur-xl shadow-[0_0_22px_rgba(248,113,113,0.4)] animate-[ringGlowYou_3s_ease-in-out_infinite]">
            <p className="text-[11px] font-semibold tracking-[0.22em] text-slate-300">TIME&apos;S UP</p>
            <p className="mt-0.5 font-mono text-2xl font-black text-rose-300 drop-shadow-[0_0_12px_rgba(251,113,133,0.65)]">00:00</p>
          </div>

          <PlayerCard side="opponent" {...uiData.opponent} />
        </div>

        <div className="mx-auto mt-2 w-full max-w-4xl">
          <ProgressBar
              youPercent={uiData.you.progress}
              opponentPercent={uiData.opponent.progress}
          />
        </div>

        <section className="mx-auto mt-2 w-full max-w-5xl">
          <h3 className="mb-1.5 text-center text-[11px] font-semibold tracking-[0.2em] text-slate-200">
            PERFORMANCE BREAKDOWN
          </h3>
          <div className="grid grid-cols-5 gap-1.5">
            {uiData.stats.map((item) => (
              <StatCard
                key={item.label}
                icon={item.icon}
                label={item.label}
                value={item.value}
                iconClassName={item.iconClassName}
              />
            ))}
          </div>
        </section>

        <div className="mt-4 flex flex-col items-center justify-center gap-1.5 sm:flex-row">
          <Link
            href={`/battle/room/${roomId}`}
            className="inline-flex min-w-36 items-center justify-center rounded-xl border border-violet-300/40 bg-black/20 px-4 py-2.5 text-xs font-semibold text-slate-100 shadow-[0_0_18px_rgba(168,85,247,0.35)] transition-all duration-300 hover:scale-105 hover:border-violet-200/80 hover:bg-violet-500/20 hover:shadow-[0_0_30px_rgba(168,85,247,0.6)]"
          >
            Play Again
          </Link>
          <Link
            href="/battle"
            className="inline-flex min-w-36 items-center justify-center rounded-xl bg-linear-to-r from-yellow-300 via-amber-400 to-orange-500 px-4 py-2.5 text-xs font-bold text-zinc-900 shadow-[0_0_30px_rgba(250,204,21,0.75)] transition-all duration-300 hover:-translate-y-0.5 hover:scale-105 hover:brightness-110"
          >
            Back to Lobby
          </Link>
        </div>

      </section>

    </main>
  );
}
