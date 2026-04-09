"use client";

import { useEffect, useState, type ReactNode } from "react";
import {
  Activity,
  CheckCircle2,
  Clock3,
  Keyboard,
  RefreshCw,
  UserPlus,
  XCircle,
  Zap,
  Crosshair,
} from "lucide-react";

export type ResultScreenStats = {
  wpm: number;
  accuracy: number; // 0-100
  timeSeconds: number;
  consistency: number; // 0-100
  totalTyped: number;
  correct: number;
  mistakes: number;
};

type ResultScreenProps = {
  stats: ResultScreenStats;
  onRestart?: () => void;
  onBackHome?: () => void;
};

function GlowCard({
  title,
  value,
  subtitle,
  icon,
  accent,
  valueMinWidthCh,
}: {
  title: string;
  value: ReactNode;
  subtitle: string;
  icon: ReactNode;
  accent: "amber" | "green" | "blue" | "violet";
  valueMinWidthCh?: number;
}) {
  const accentMap: Record<
    typeof accent,
    {
      text: string;
      ring: string;
      glow: string;
      iconBg: string;
      iconRing: string;
    }
  > = {
    amber: {
      text: "text-[#facc15]",
      ring: "border-[#2a2f3a]",
      glow: "shadow-[0_20px_60px_-30px_rgba(250,204,21,0.55)]",
      iconBg: "bg-[#2a2313]",
      iconRing: "ring-[#3a311a]",
    },
    green: {
      text: "text-[#22c55e]",
      ring: "border-[#2a2f3a]",
      glow: "shadow-[0_20px_60px_-30px_rgba(34,197,94,0.55)]",
      iconBg: "bg-[#132a1c]",
      iconRing: "ring-[#1a3a25]",
    },
    blue: {
      text: "text-[#3b82f6]",
      ring: "border-[#2a2f3a]",
      glow: "shadow-[0_20px_60px_-30px_rgba(59,130,246,0.55)]",
      iconBg: "bg-[#121f33]",
      iconRing: "ring-[#1a2c46]",
    },
    violet: {
      text: "text-[#a855f7]",
      ring: "border-[#2a2f3a]",
      glow: "shadow-[0_20px_60px_-30px_rgba(168,85,247,0.55)]",
      iconBg: "bg-[#221438]",
      iconRing: "ring-[#2d1a49]",
    },
  };

  const a = accentMap[accent];

  return (
    <div
      className={[
        "group relative h-full min-h-[110px] w-full overflow-hidden rounded-2xl border bg-[#0f1520]/60 px-5 py-5",
        "backdrop-blur-xl transition-all duration-300",
        "hover:scale-[1.02]",
        a.ring,
        a.glow,
        "shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]",
      ].join(" ")}
    >
      <div
        className={[
          "pointer-events-none absolute inset-0",
          accent === "amber"
            ? "bg-[radial-gradient(600px_circle_at_20%_0%,rgba(250,204,21,0.18),transparent_50%)]"
            : accent === "green"
              ? "bg-[radial-gradient(600px_circle_at_20%_0%,rgba(34,197,94,0.18),transparent_50%)]"
              : accent === "blue"
                ? "bg-[radial-gradient(600px_circle_at_20%_0%,rgba(59,130,246,0.18),transparent_50%)]"
                : "bg-[radial-gradient(600px_circle_at_20%_0%,rgba(168,85,247,0.18),transparent_50%)]",
        ].join(" ")}
      />

      <div className="relative flex h-full flex-col items-center justify-center text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full ring-1 shadow-[0_0_0_1px_rgba(255,255,255,0.04)]">
          <div
            className={[
              "flex h-11 w-11 items-center justify-center rounded-full",
              a.iconBg,
              a.iconRing,
              a.text,
            ].join(" ")}
          >
            <div className="h-6 w-6">{icon}</div>
          </div>
        </div>

        <div className="mt-2 text-[12px] font-semibold tracking-[0.2em] text-[#a7b2c7] opacity-90">
          {title}
        </div>

        <div
          className={["mt-1 font-mono font-extrabold leading-none", a.text].join(" ")}
          style={{ fontSize: "clamp(26px,3.8vw,42px)" }}
        >
          <span
            className="inline-block tabular-nums"
            style={{
              minWidth: valueMinWidthCh ? `${valueMinWidthCh}ch` : undefined,
            }}
          >
            {value}
          </span>
        </div>

        <div className="mt-1 text-[13px] text-[#93a0b4]">{subtitle}</div>
      </div>

      <div
        className={[
          "pointer-events-none absolute inset-x-0 bottom-0 h-[3px]",
          accent === "amber"
            ? "bg-linear-to-r from-transparent via-[#facc15]/70 to-transparent"
            : accent === "green"
              ? "bg-linear-to-r from-transparent via-[#22c55e]/70 to-transparent"
              : accent === "blue"
                ? "bg-linear-to-r from-transparent via-[#3b82f6]/70 to-transparent"
                : "bg-linear-to-r from-transparent via-[#a855f7]/70 to-transparent",
        ].join(" ")}
      />
    </div>
  );
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    if (!mql) return;
    const update = () => setReduced(Boolean(mql.matches));
    update();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const add = (mql as any).addEventListener ? "addEventListener" : "addListener";
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const remove = (mql as any).removeEventListener ? "removeEventListener" : "removeListener";
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (mql as any)[add]("change", update);
    return () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (mql as any)[remove]("change", update);
    };
  }, []);

  return reduced;
}

function CountUpNumber({
  target,
  minWidthCh,
  durationMs = 800,
}: {
  target: number;
  minWidthCh: number;
  durationMs?: number;
}) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (prefersReducedMotion) {
      const raf = requestAnimationFrame(() => setValue(target));
      return () => cancelAnimationFrame(raf);
    }

    let raf = 0;
    const start = performance.now();
    const from = 0;
    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / durationMs);
      const eased = easeOutCubic(t);
      const next = Math.round(from + (target - from) * eased);
      setValue(next);
      if (t < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [durationMs, prefersReducedMotion, target]);

  return (
    <span
      className="inline-block tabular-nums"
      style={{ minWidth: `${minWidthCh}ch` }}
      aria-label={`${target}`}
    >
      {value}
    </span>
  );
}

function Confetti() {
  const pieces = [
    { c: "bg-[#facc15]", x: "left-[18%]", y: "top-[18%]" },
    { c: "bg-[#22c55e]", x: "left-[30%]", y: "top-[10%]" },
    { c: "bg-[#3b82f6]", x: "left-[70%]", y: "top-[12%]" },
    { c: "bg-[#a855f7]", x: "left-[82%]", y: "top-[18%]" },
    { c: "bg-[#facc15]", x: "left-[12%]", y: "top-[32%]" },
    { c: "bg-[#3b82f6]", x: "left-[88%]", y: "top-[32%]" },
    { c: "bg-[#a855f7]", x: "left-[24%]", y: "top-[28%]" },
    { c: "bg-[#22c55e]", x: "left-[76%]", y: "top-[28%]" },
  ];

  return (
    <div className="pointer-events-none absolute inset-0">
      {pieces.map((p, i) => (
        <div
          key={i}
          className={[
            "absolute h-[10px] w-[3px] rotate-18 rounded-full opacity-90",
            p.c,
            p.x,
            p.y,
          ].join(" ")}
        />
      ))}
    </div>
  );
}

export default function ResultScreen({ stats, onRestart, onBackHome }: ResultScreenProps) {
  const mistakePercent =
    stats.totalTyped > 0 ? Math.round((stats.mistakes / stats.totalTyped) * 100) : 0;

  const title = "Time's Up!";
  const subtitle = "Great job! Here are your results.";

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const raf = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className="relative flex h-full min-h-0 w-full items-center justify-center overflow-hidden">
      <div
        className={[
          "relative flex h-full w-full max-w-[980px] flex-col overflow-hidden rounded-3xl border border-[#1a2332] p-4 sm:p-5",
          "bg-[#020617]/70 shadow-[0_30px_80px_-35px_rgba(0,0,0,0.9)] backdrop-blur-2xl",
          "transition-opacity duration-700 ease-out",
          mounted ? "opacity-100" : "opacity-0",
        ].join(" ")}
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_50%_at_50%_-10%,rgba(59,130,246,0.20),transparent)]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(50%_45%_at_50%_100%,rgba(99,102,241,0.15),transparent)]" />

        <div className="relative grid h-full grid-rows-[auto_1fr_auto] gap-2 sm:gap-3">
          <header className="flex flex-col items-center justify-center text-center">
            <div className="relative mb-2 mt-1 text-[#facc15]">
              <Clock3 className="h-9 w-9" aria-hidden="true" />
              <Confetti />
            </div>
            <h2
              className={[
                "text-[clamp(32px,4.3vw,50px)] font-extrabold tracking-tight text-white",
                "transition-all duration-700 ease-out",
                mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1",
              ].join(" ")}
            >
              {title}
            </h2>
            <p className="mt-1 text-[clamp(13px,1.5vw,15px)] text-[#9aa6bb]">{subtitle}</p>
          </header>

          <section className="min-h-0 overflow-hidden">
            <div className="grid h-full grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-4">
              <GlowCard
                title="WPM"
                value={
                  <CountUpNumber
                    target={stats.wpm}
                    minWidthCh={Math.max(2, String(Math.round(stats.wpm)).length + 1)}
                  />
                }
                valueMinWidthCh={Math.max(2, String(Math.round(stats.wpm)).length + 1)}
                subtitle="Words per minute"
                icon={<Zap className="h-7 w-7" aria-hidden="true" />}
                accent="amber"
              />

              <GlowCard
                title="ACCURACY"
                value={
                  <span className="inline-flex items-baseline gap-0.5">
                    <CountUpNumber
                      target={stats.accuracy}
                      minWidthCh={Math.max(2, String(Math.round(stats.accuracy)).length + 1)}
                    />
                    <span className="text-[0.6em] font-bold leading-none opacity-95">%</span>
                  </span>
                }
                valueMinWidthCh={Math.max(2, String(Math.round(stats.accuracy)).length + 1)}
                subtitle="Correct characters"
                icon={<Crosshair className="h-7 w-7" aria-hidden="true" />}
                accent="green"
              />

              <GlowCard
                title="TIME"
                value={
                  <span className="inline-flex items-baseline gap-0.5">
                    <CountUpNumber
                      target={stats.timeSeconds}
                      minWidthCh={Math.max(2, String(Math.round(stats.timeSeconds)).length + 1)}
                    />
                    <span className="text-[0.6em] font-bold leading-none opacity-95">s</span>
                  </span>
                }
                valueMinWidthCh={Math.max(2, String(Math.round(stats.timeSeconds)).length + 1)}
                subtitle="Total time"
                icon={<Clock3 className="h-7 w-7" aria-hidden="true" />}
                accent="blue"
              />

              <GlowCard
                title="CONSISTENCY"
                value={
                  <span className="inline-flex items-baseline gap-0.5">
                    <CountUpNumber
                      target={stats.consistency}
                      minWidthCh={Math.max(2, String(Math.round(stats.consistency)).length + 1)}
                    />
                    <span className="text-[0.6em] font-bold leading-none opacity-95">%</span>
                  </span>
                }
                valueMinWidthCh={Math.max(2, String(Math.round(stats.consistency)).length + 1)}
                subtitle="WPM stability"
                icon={<Activity className="h-7 w-7" aria-hidden="true" />}
                accent="violet"
              />
            </div>
          </section>

          <footer className="flex flex-col items-center justify-center gap-2 sm:gap-3">
            <div className="relative w-full overflow-hidden rounded-2xl border border-[#1c2330] bg-[#020617]/80 backdrop-blur-xl">
              <div className="grid grid-cols-1 md:grid-cols-3">
                <div className="flex items-center gap-4 px-4 py-3 transition-all duration-300 hover:bg-white/5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#020617] ring-1 ring-[#232c3b] text-[#9aa6bb]">
                    <Keyboard className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[12px] font-semibold tracking-[0.18em] text-[#9aa6bb]/90">
                      TOTAL TYPED
                    </div>
                    <div className="mt-1 font-mono text-[clamp(24px,3vw,32px)] font-bold text-white tabular-nums">
                      <CountUpNumber
                        target={stats.totalTyped}
                        minWidthCh={Math.max(2, String(stats.totalTyped).length + 1)}
                        durationMs={650}
                      />
                    </div>
                    <div className="mt-1 text-[14px] text-[#93a0b4]">Characters</div>
                  </div>
                </div>

                <div className="border-t border-[#1c2330] md:border-t-0 md:border-l">
                  <div className="flex items-center gap-4 px-4 py-3 transition-all duration-300 hover:bg-white/5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#022c22] ring-1 ring-[#1a3a25] text-[#22c55e]">
                      <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-[12px] font-semibold tracking-[0.18em] text-[#9aa6bb]/90">
                        CORRECT
                      </div>
                      <div className="mt-1 font-mono text-[clamp(24px,3vw,32px)] font-bold text-white tabular-nums">
                        <CountUpNumber
                          target={stats.correct}
                          minWidthCh={Math.max(2, String(stats.correct).length + 1)}
                          durationMs={650}
                        />
                      </div>
                      <div className="mt-1 text-[14px] text-[#93a0b4] tabular-nums">
                        {Math.round(stats.accuracy)}%
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t border-[#1c2330] md:border-t-0 md:border-l">
                  <div className="flex items-center gap-4 px-4 py-3 transition-all duration-300 hover:bg-white/5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#2a0613] ring-1 ring-[#3b1c1c] text-[#ef4444]">
                      <XCircle className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-[12px] font-semibold tracking-[0.18em] text-[#9aa6bb]/90">
                        MISTAKES
                      </div>
                      <div className="mt-1 font-mono text-[clamp(24px,3vw,32px)] font-bold text-white tabular-nums">
                        <CountUpNumber
                          target={stats.mistakes}
                          minWidthCh={Math.max(2, String(stats.mistakes).length + 1)}
                          durationMs={650}
                        />
                      </div>
                      <div className="mt-1 text-[14px] text-[#93a0b4] tabular-nums">
                        {mistakePercent}%
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex w-full flex-col items-center justify-center gap-3 sm:flex-row">
              <button
                type="button"
                onClick={onRestart}
                className="inline-flex w-full items-center justify-center gap-3 rounded-xl bg-linear-to-b from-[#fdd835] to-[#facc15] px-5 py-3 text-[15px] font-semibold text-[#111827] shadow-[0_18px_40px_-25px_rgba(250,204,21,0.9)] transition-all duration-300 hover:-translate-y-px hover:from-[#fde047] hover:to-[#fbbf24] focus:outline-none focus:ring-2 focus:ring-[#facc15]/60 sm:w-auto"
              >
                <RefreshCw className="h-5 w-5" aria-hidden="true" />
                Restart
              </button>

              <button
                type="button"
                onClick={onBackHome}
                className="inline-flex w-full items-center justify-center gap-3 rounded-xl border border-[#263247] bg-[#020617]/90 px-5 py-3 text-[15px] font-semibold text-[#e5e7eb] shadow-[0_10px_24px_-18px_rgba(59,130,246,0.7)] transition-all duration-300 hover:-translate-y-px hover:border-[#32435f] hover:bg-[#020617] focus:outline-none focus:ring-2 focus:ring-[#94a3b8]/30 sm:w-auto"
              >
                <UserPlus className="h-5 w-5" aria-hidden="true" />
                Challenge a Friend
              </button>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}
