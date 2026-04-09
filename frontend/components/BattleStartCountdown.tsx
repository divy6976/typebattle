"use client";

import { useEffect, useMemo, useState, type CSSProperties } from "react";
import { useRouter } from "next/navigation";

type Step = "intro" | "3" | "2" | "1" | "go";

const SEQUENCE: Step[] = ["intro", "3", "2", "1", "go"];

function stepDuration(step: Step): number {
  if (step === "intro") return 1500;
  if (step === "go") return 1200;
  return 1000;
}

function LightningFlash() {
  return (
    <div
      className="pointer-events-none absolute inset-0 z-10 animate-battle-lightning-flash"
      aria-hidden
      style={{
        background:
          "linear-gradient(125deg, transparent 35%, rgba(250,204,21,0.15) 45%, rgba(255,255,255,0.25) 50%, rgba(168,85,247,0.12) 55%, transparent 65%)",
      }}
    />
  );
}

function ParticleBurst() {
  const particles = useMemo(
    () =>
      Array.from({ length: 28 }, (_, i) => ({
        id: i,
        angle: (i / 28) * 360 + Math.random() * 12,
        dist: 120 + Math.random() * 180,
        delay: Math.random() * 0.08,
      })),
    []
  );

  return (
    <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center overflow-visible" aria-hidden>
      {particles.map((p) => (
        <span
          key={p.id}
          className="absolute h-2 w-2 rounded-full bg-linear-to-br from-[#fef08a] to-[#fb923c] shadow-[0_0_12px_rgba(250,204,21,0.9)] animate-battle-particle-burst"
          style={
            {
              "--burst-angle": `${p.angle}deg`,
              "--burst-dist": `${p.dist}px`,
              animationDelay: `${p.delay}s`,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}

type BattleStartCountdownProps = {
  roomId: string;
  active: boolean;
  startAtMs?: number | null;
  endAtMs?: number | null;
  difficulty?: "easy" | "medium" | "hard" | null;
  timeLimitSec?: 30 | 45 | 60 | 120 | null;
  onFinished?: () => void;
};

export default function BattleStartCountdown({
  roomId,
  active,
  startAtMs,
  endAtMs,
  difficulty,
  timeLimitSec,
  onFinished,
}: BattleStartCountdownProps) {
  const router = useRouter();
  const [step, setStep] = useState<Step | null>(null);

  useEffect(() => {
    if (!active) {
      setStep(null);
      return;
    }
    setStep("intro");
  }, [active]);

  useEffect(() => {
    if (!active || !step) return;

    const t = window.setTimeout(() => {
      if (step === "go") {
        const base = `/battle/play/${encodeURIComponent(roomId)}`;
        const query = new URLSearchParams();
        if (typeof startAtMs === "number" && Number.isFinite(startAtMs)) query.set("startAt", String(startAtMs));
        if (typeof endAtMs === "number" && Number.isFinite(endAtMs)) query.set("endAt", String(endAtMs));
        if (difficulty === "easy" || difficulty === "medium" || difficulty === "hard") {
          query.set("difficulty", difficulty);
        }
        if (typeof timeLimitSec === "number" && [30, 45, 60, 120].includes(timeLimitSec)) {
          query.set("timeLimit", String(timeLimitSec));
        }
        const href = query.toString() ? `${base}?${query.toString()}` : base;
        router.push(href);
        onFinished?.();
        setStep(null);
        return;
      }
      const i = SEQUENCE.indexOf(step);
      const next = SEQUENCE[i + 1];
      if (next) setStep(next);
    }, stepDuration(step));

    return () => window.clearTimeout(t);
  }, [active, step, roomId, router, onFinished, startAtMs, endAtMs, difficulty, timeLimitSec]);

  if (!active || !step) return null;

  const isGo = step === "go";
  const isNumber = step === "3" || step === "2" || step === "1";

  return (
    <div
      className="fixed inset-0 z-200 flex items-center justify-center bg-black/80 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-live="assertive"
    >
      {isGo ? <LightningFlash /> : null}

      <div
        className={[
          "relative flex h-full w-full items-center justify-center",
          isGo ? "animate-battle-screen-shake" : "",
        ].join(" ")}
      >
        {isGo ? <ParticleBurst /> : null}

        {/* Pulse glow behind main text */}
        <div
          className={[
            "pointer-events-none absolute left-1/2 top-1/2 h-[min(90vmin,640px)] w-[min(90vmin,640px)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(250,204,21,0.35)_0%,rgba(168,85,247,0.12)_45%,transparent_70%)] blur-3xl animate-battle-pulse-glow",
            isGo ? "opacity-100" : "opacity-80",
          ].join(" ")}
          aria-hidden
        />

        <div className="relative z-30 flex flex-col items-center justify-center px-4">
          {step === "intro" ? (
            <div
              key="intro"
              className="animate-battle-intro flex flex-col items-center gap-3 text-center md:gap-4"
            >
              <p className="font-mono text-xs font-bold uppercase tracking-[0.35em] text-[#94a3b8] md:text-sm">Match</p>
              <div className="flex flex-wrap items-center justify-center gap-3 md:gap-6">
                <span className="battle-countdown-gradient battle-countdown-glow font-mono text-3xl font-black uppercase tracking-tight md:text-5xl">
                  You
                </span>
                <span className="font-mono text-2xl font-black uppercase text-white/90 drop-shadow-[0_0_20px_rgba(255,255,255,0.35)] md:text-4xl">
                  vs
                </span>
                <span className="battle-countdown-gradient-alt font-mono text-3xl font-black uppercase tracking-tight md:text-5xl">
                  Opponent
                </span>
              </div>
              <div className="mt-1 h-px w-48 max-w-[80vw] bg-linear-to-r from-transparent via-[#facc15]/60 to-transparent md:w-64" />
            </div>
          ) : null}

          {isNumber ? (
            <div
              key={step}
              className="battle-countdown-tick flex items-center justify-center"
            >
              <span className="battle-countdown-gradient battle-countdown-glow font-mono text-[clamp(4.5rem,22vmin,12rem)] font-black uppercase leading-none tracking-tighter">
                {step}
              </span>
            </div>
          ) : null}

          {isGo ? (
            <div key="go" className="battle-countdown-go flex flex-col items-center justify-center gap-2 animate-battle-go-zoom">
              <span className="battle-countdown-gradient-go battle-countdown-glow-strong font-mono text-[clamp(3.5rem,16vmin,9rem)] font-black uppercase leading-none tracking-tight">
                GO
              </span>
              <span className="text-4xl drop-shadow-[0_0_24px_rgba(250,204,21,0.8)] md:text-6xl" aria-hidden>
                🚀
              </span>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
