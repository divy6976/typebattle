"use client";

import { useCallback, useRef, useState } from "react";

type RoomHeaderProps = {
  roomCode?: string;
  /** Tighter padding and type scale for viewport-fit layouts */
  compact?: boolean;
};

function KeyboardOutline({
  className,
  strokeClass,
  fillClass,
}: {
  className?: string;
  strokeClass: string;
  fillClass: string;
}) {
  return (
    <svg viewBox="0 0 320 150" className={className} fill="none" aria-hidden="true">
      <g className={strokeClass} stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
        <rect x="16" y="34" width="288" height="92" rx="12" className={fillClass} />
        <rect x="24" y="42" width="272" height="76" rx="8" className={fillClass} opacity="0.55" />
        <rect x="34" y="50" width="18" height="9" rx="1.6" />
        <rect x="56" y="50" width="18" height="9" rx="1.6" />
        <rect x="78" y="50" width="18" height="9" rx="1.6" />
        <rect x="100" y="50" width="18" height="9" rx="1.6" />
        <rect x="127" y="50" width="18" height="9" rx="1.6" />
        <rect x="149" y="50" width="18" height="9" rx="1.6" />
        <rect x="171" y="50" width="18" height="9" rx="1.6" />
        <rect x="193" y="50" width="18" height="9" rx="1.6" />
        <rect x="220" y="50" width="18" height="9" rx="1.6" />
        <rect x="242" y="50" width="18" height="9" rx="1.6" />
        <rect x="264" y="50" width="22" height="9" rx="1.6" />
        <rect x="30" y="63" width="24" height="11" rx="1.8" />
        <rect x="58" y="63" width="20" height="11" rx="1.8" />
        <rect x="82" y="63" width="20" height="11" rx="1.8" />
        <rect x="106" y="63" width="20" height="11" rx="1.8" />
        <rect x="130" y="63" width="20" height="11" rx="1.8" />
        <rect x="154" y="63" width="20" height="11" rx="1.8" />
        <rect x="178" y="63" width="20" height="11" rx="1.8" />
        <rect x="202" y="63" width="20" height="11" rx="1.8" />
        <rect x="226" y="63" width="20" height="11" rx="1.8" />
        <rect x="250" y="63" width="20" height="11" rx="1.8" />
        <rect x="274" y="63" width="16" height="11" rx="1.8" />
        <rect x="36" y="78" width="28" height="11" rx="1.8" />
        <rect x="68" y="78" width="20" height="11" rx="1.8" />
        <rect x="92" y="78" width="20" height="11" rx="1.8" />
        <rect x="116" y="78" width="20" height="11" rx="1.8" />
        <rect x="140" y="78" width="20" height="11" rx="1.8" />
        <rect x="164" y="78" width="20" height="11" rx="1.8" />
        <rect x="188" y="78" width="20" height="11" rx="1.8" />
        <rect x="212" y="78" width="20" height="11" rx="1.8" />
        <rect x="236" y="78" width="20" height="11" rx="1.8" />
        <rect x="260" y="78" width="32" height="11" rx="1.8" />
      </g>
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

function LightningBolt({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 40" className={className} fill="currentColor" aria-hidden="true">
      <path d="M13 0 0 24h8l-3 16 16-24h-9l5-16Z" />
    </svg>
  );
}

/** Stable layout for SSR / hydration: fixed positions, varied motion via delay + duration */
const HEADER_PARTICLES = [
  { top: 8, left: 6, size: 3, delay: 0, duration: 5.4, hue: "y" as const },
  { top: 22, left: 14, size: 2, delay: 0.4, duration: 6.2, hue: "y" },
  { top: 18, left: 78, size: 2, delay: 1.1, duration: 7.1, hue: "p" },
  { top: 12, left: 92, size: 3, delay: 0.2, duration: 5.8, hue: "p" },
  { top: 38, left: 4, size: 2, delay: 0.9, duration: 6.6, hue: "y" },
  { top: 72, left: 10, size: 4, delay: 0.15, duration: 5.2, hue: "p" },
  { top: 58, left: 22, size: 2, delay: 1.4, duration: 7.8, hue: "y" },
  { top: 48, left: 88, size: 3, delay: 0.6, duration: 6.4, hue: "p" },
  { top: 65, left: 95, size: 2, delay: 2, duration: 5.6, hue: "y" },
  { top: 28, left: 42, size: 2, delay: 0.8, duration: 8, hue: "p" },
  { top: 82, left: 48, size: 3, delay: 0.3, duration: 6.9, hue: "y" },
  { top: 6, left: 52, size: 2, delay: 1.7, duration: 5.1, hue: "p" },
  { top: 45, left: 65, size: 2, delay: 0.5, duration: 7.3, hue: "y" },
  { top: 88, left: 72, size: 4, delay: 1.2, duration: 6.1, hue: "p" },
  { top: 55, left: 35, size: 2, delay: 2.4, duration: 5.9, hue: "y" },
];

export default function RoomHeader({ roomCode = "A7B3K", compact = false }: RoomHeaderProps) {
  const [copied, setCopied] = useState(false);
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);
  const [parallax, setParallax] = useState({ x: 0, y: 0 });
  const rafRef = useRef<number | null>(null);
  const pendingRef = useRef({ x: 0, y: 0 });
  const rippleIdRef = useRef(0);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    const nx = (e.clientX - r.left) / r.width - 0.5;
    const ny = (e.clientY - r.top) / r.height - 0.5;
    pendingRef.current = { x: nx * 2, y: ny * 2 };

    if (rafRef.current == null) {
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null;
        const { x, y } = pendingRef.current;
        setParallax({
          x: Math.max(-1, Math.min(1, x)) * 0.38,
          y: Math.max(-1, Math.min(1, y)) * 0.38,
        });
      });
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    setParallax({ x: 0, y: 0 });
  }, []);

  const handleCopy = async (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const id = ++rippleIdRef.current;
    setRipples((prev) => [...prev, { id, x: e.clientX - rect.left, y: e.clientY - rect.top }]);
    window.setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== id));
    }, 650);

    try {
      await navigator.clipboard.writeText(roomCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      /* ignore */
    }
  };

  const px = parallax.x * 22;
  const py = parallax.y * 16;
  const pxR = parallax.x * -18;
  const pyR = parallax.y * 12;
  const pxC = parallax.x * 8;
  const pyC = parallax.y * 6;

  return (
    <section
      role="region"
      aria-label="Room lobby header"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={
        compact
          ? "relative isolate w-full overflow-hidden rounded-2xl border border-white/10 bg-white/5 px-4 py-4 shadow-[0_8px_32px_-8px_rgba(0,0,0,0.65),inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-xl transition-shadow duration-500 hover:shadow-[0_16px_56px_-12px_rgba(250,204,21,0.18),0_12px_40px_-8px_rgba(168,85,247,0.12)] md:rounded-3xl md:px-6 md:py-5"
          : "relative isolate w-full overflow-hidden rounded-3xl border border-white/10 bg-white/5 px-5 py-10 shadow-[0_8px_32px_-8px_rgba(0,0,0,0.65),inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-xl transition-shadow duration-500 hover:shadow-[0_16px_56px_-12px_rgba(250,204,21,0.18),0_12px_40px_-8px_rgba(168,85,247,0.12)] md:px-8 md:py-12"
      }
    >
      {/* Base layers */}
      <div className="pointer-events-none absolute inset-0 z-0 bg-linear-to-br from-[#0b0f18]/98 via-[#070a12]/95 to-[#150a22]/92" />
      <div className="pointer-events-none absolute inset-0 z-0 opacity-90 [background:radial-gradient(ellipse_85%_70%_at_15%_45%,rgba(250,204,21,0.14),transparent_55%),radial-gradient(ellipse_80%_65%_at_88%_55%,rgba(168,85,247,0.16),transparent_52%)]" />

      {/* Large blurred glow orbs */}
      <div className="pointer-events-none absolute -left-[10%] top-1/2 z-0 h-[min(320px,45vw)] w-[min(320px,45vw)] -translate-y-1/2 rounded-full bg-[#facc15]/20 blur-[80px]" />
      <div className="pointer-events-none absolute -right-[8%] top-1/2 z-0 h-[min(300px,42vw)] w-[min(300px,42vw)] -translate-y-1/2 rounded-full bg-[#a855f7]/22 blur-[88px]" />
      <div className="pointer-events-none absolute left-1/2 top-0 z-0 h-40 w-[70%] -translate-x-1/2 rounded-full bg-linear-to-b from-[#facc15]/8 to-transparent blur-2xl" />

      {/* Noise */}
      <div
        className="pointer-events-none absolute inset-0 z-1 opacity-[0.04] mix-blend-overlay [background-image:url('data:image/svg+xml,%3Csvg viewBox=%220 0 256 256%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22n%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%224%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23n)%22/%3E%3C/svg%3E')]"
        aria-hidden
      />

      {/* Particle field */}
      <div className="pointer-events-none absolute inset-0 z-2" aria-hidden>
        {HEADER_PARTICLES.map((p, i) => (
          <span
            key={i}
            className={
              p.hue === "y"
                ? "absolute rounded-full bg-[#facc15] blur-[2px] shadow-[0_0_10px_rgba(250,204,21,0.7)]"
                : "absolute rounded-full bg-[#a855f7] blur-[2px] shadow-[0_0_10px_rgba(168,85,247,0.65)]"
            }
            style={{
              top: `${p.top}%`,
              left: `${p.left}%`,
              width: p.size,
              height: p.size,
              animationName: i % 2 === 0 ? "headerParticleDrift" : "headerParticleDriftSlow",
              animationDuration: `${p.duration}s`,
              animationDelay: `${p.delay}s`,
              animationTimingFunction: "ease-in-out",
              animationIterationCount: "infinite",
            }}
          />
        ))}
      </div>

      {/* Left keyboard + lightning (depth: back) */}
      <div
        className="pointer-events-none absolute left-[6%] top-[38%] z-3 hidden md:block"
        style={{ transform: `translate3d(${px}px, ${py}px, 0)` }}
      >
        <div className="animate-[keyboardFloat_6.5s_ease-in-out_infinite] transform-3d will-change-transform">
          <div className="relative scale-[0.92]">
            <div className="absolute -inset-8 rounded-3xl bg-[#facc15]/25 blur-3xl" />
            <div className="absolute -inset-3 rounded-2xl bg-[#facc15]/12 blur-2xl" />
            <KeyboardOutline
              className="relative w-[128px] -rotate-12 drop-shadow-[0_0_20px_rgba(250,204,21,0.5)]"
              strokeClass="text-[#facc15]"
              fillClass="fill-[#0d0f14]"
            />
            <div className="absolute -right-4 top-0 text-[#facc15] animate-[lightningFlicker_2.4s_ease-in-out_infinite] [animation-delay:0.3s]">
              <LightningBolt className="h-8 w-5 opacity-90 mix-blend-screen drop-shadow-[0_0_8px_rgba(250,204,21,0.9)]" />
            </div>
            <div className="absolute -bottom-1 -left-2 text-[#fde047] animate-[lightningFlickerAlt_3.1s_ease-in-out_infinite] [animation-delay:1.1s]">
              <LightningBolt className="h-6 w-4 opacity-80 mix-blend-screen blur-[0.3px]" />
            </div>
          </div>
        </div>
      </div>

      {/* Right keyboard + lightning */}
      <div
        className="pointer-events-none absolute right-[6%] top-[38%] z-3 hidden md:block"
        style={{ transform: `translate3d(${pxR}px, ${pyR}px, 0)` }}
      >
        <div className="animate-[keyboardFloatReverse_7s_ease-in-out_infinite] will-change-transform">
          <div className="relative scale-95">
            <div className="absolute -inset-8 rounded-3xl bg-[#a855f7]/28 blur-3xl" />
            <div className="absolute -inset-3 rounded-2xl bg-[#a855f7]/15 blur-2xl" />
            <KeyboardOutline
              className="relative w-[128px] rotate-12 drop-shadow-[0_0_20px_rgba(168,85,247,0.55)]"
              strokeClass="text-[#a855f7]"
              fillClass="fill-[#0d0f14]"
            />
            <div className="absolute -left-3 top-2 text-[#c4b5fd] animate-[lightningFlickerAlt_2.8s_ease-in-out_infinite] [animation-delay:0.7s]">
              <LightningBolt className="h-7 w-4 opacity-90 mix-blend-screen drop-shadow-[0_0_8px_rgba(168,85,247,0.85)]" />
            </div>
            <div className="absolute bottom-0 -right-1 text-[#a855f7] animate-[lightningFlicker_3.2s_ease-in-out_infinite] [animation-delay:1.8s]">
              <LightningBolt className="h-5 w-3.5 opacity-75 mix-blend-screen" />
            </div>
          </div>
        </div>
      </div>

      {/* Center energy (parallax light) */}
      <div
        className="pointer-events-none absolute left-1/2 top-[38%] z-4 hidden md:block"
        style={{ transform: `translate3d(calc(-50% + ${pxC}px), ${pyC}px, 0)` }}
      >
        <div className="flex flex-col items-center text-[#facc15] drop-shadow-[0_0_16px_rgba(250,204,21,0.55)]">
          <div className="text-2xl leading-none animate-pulse">⚡</div>
          <div className="mt-2 h-0.5 w-20 bg-linear-to-r from-transparent via-[#facc15] to-transparent opacity-90" />
        </div>
      </div>

      {/* Foreground content */}
      <div
        className={
          compact
            ? "relative z-20 mx-auto max-w-[700px] transition-transform duration-300 ease-out"
            : "relative z-20 mx-auto max-w-[700px] transition-transform duration-300 ease-out md:scale-[1.02]"
        }
      >
        <div
          className="flex flex-col items-center text-center"
          style={{
            transform: `translate3d(${parallax.x * 6}px, ${parallax.y * 4}px, 0)`,
          }}
        >
          <p className="font-mono text-[11px] font-bold uppercase tracking-[0.28em] text-slate-400 md:text-xs">
            Room code
          </p>

          <div className={compact ? "mt-3 flex flex-wrap items-center justify-center gap-2 md:gap-4" : "mt-5 flex flex-wrap items-center justify-center gap-3 md:gap-5"}>
            <h1
              className={
                compact
                  ? "room-code-lobby mx-1 font-mono text-[clamp(1.85rem,7vw,2.75rem)] font-black leading-none tracking-[0.08em] text-transparent bg-linear-to-r from-[#fef08a] via-[#facc15] to-[#fb923c] bg-clip-text [text-shadow:0_0_40px_rgba(250,204,21,0.35)]"
                  : "room-code-lobby mx-1 font-mono text-[clamp(2.75rem,9vw,4rem)] font-black leading-none tracking-[0.08em] text-transparent bg-linear-to-r from-[#fef08a] via-[#facc15] to-[#fb923c] bg-clip-text [text-shadow:0_0_40px_rgba(250,204,21,0.35)]"
              }
            >
              {roomCode}
            </h1>

            <button
              type="button"
              onClick={handleCopy}
              className={
                compact
                  ? "group relative isolate flex h-10 shrink-0 cursor-pointer items-center gap-2 overflow-hidden rounded-xl border border-white/12 bg-white/6 px-3 text-[13px] font-semibold text-slate-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] transition-all duration-300 hover:scale-105 hover:border-[#facc15]/50 hover:bg-white/10 hover:text-white hover:shadow-[0_0_28px_rgba(250,204,21,0.35)] active:scale-[0.98]"
                  : "group relative isolate flex h-12 shrink-0 cursor-pointer items-center gap-2 overflow-hidden rounded-xl border border-white/12 bg-white/6 px-4 text-[15px] font-semibold text-slate-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] transition-all duration-300 hover:scale-105 hover:border-[#facc15]/50 hover:bg-white/10 hover:text-white hover:shadow-[0_0_28px_rgba(250,204,21,0.35)] active:scale-[0.98]"
              }
            >
              {ripples.map((r) => (
                <span
                  key={r.id}
                  className="pointer-events-none absolute rounded-full bg-[#facc15]/35"
                  style={{
                    left: r.x,
                    top: r.y,
                    width: 14,
                    height: 14,
                    animation: "copyRipple 0.65s ease-out forwards",
                  }}
                />
              ))}
              <CopyIcon className="relative z-10 h-5 w-5 text-[#facc15] transition-transform duration-300 group-hover:scale-110" />
              <span className="relative z-10">{copied ? "Copied" : "Copy"}</span>
            </button>
          </div>

          <p className={compact ? "mt-3 max-w-md text-[13px] font-medium leading-snug text-slate-400 md:text-sm" : "mt-5 max-w-md text-[15px] font-medium leading-relaxed text-slate-400 md:text-base"}>
            Share this code with your friend to invite them!
          </p>
        </div>
      </div>
    </section>
  );
}
