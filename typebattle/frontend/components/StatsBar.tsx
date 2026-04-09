"use client";
import type { ReactNode } from "react";
import { Crosshair, Gauge, TriangleAlert } from "lucide-react";

type StatsBarProps = {
  wpm?: number;
  accuracy?: number;
  mistakes?: number;
};

type StatTone = "warm" | "green" | "red";

const toneStyles: Record<
  StatTone,
  { icon: string; value: string; border: string; glow: string; hoverGlow: string }
> = {
  warm: {
    icon: "text-amber-300",
    value: "text-amber-200",
    border: "border-amber-400/25",
    glow: "shadow-[0_0_0_1px_rgba(251,191,36,0.18),0_10px_30px_-12px_rgba(251,191,36,0.35)]",
    hoverGlow:
      "group-hover:shadow-[0_0_0_1px_rgba(251,191,36,0.30),0_18px_42px_-14px_rgba(251,191,36,0.55)]",
  },
  green: {
    icon: "text-emerald-300",
    value: "text-emerald-200",
    border: "border-emerald-400/25",
    glow: "shadow-[0_0_0_1px_rgba(52,211,153,0.18),0_10px_30px_-12px_rgba(16,185,129,0.35)]",
    hoverGlow:
      "group-hover:shadow-[0_0_0_1px_rgba(52,211,153,0.30),0_18px_42px_-14px_rgba(16,185,129,0.55)]",
  },
  red: {
    icon: "text-rose-300",
    value: "text-rose-200",
    border: "border-rose-400/25",
    glow: "shadow-[0_0_0_1px_rgba(251,113,133,0.18),0_10px_30px_-12px_rgba(244,63,94,0.35)]",
    hoverGlow:
      "group-hover:shadow-[0_0_0_1px_rgba(251,113,133,0.30),0_18px_42px_-14px_rgba(244,63,94,0.55)]",
  },
};

function StatCard({
  label,
  value,
  icon,
  tone,
}: {
  label: string;
  value: string;
  icon: ReactNode;
  tone: StatTone;
}) {
  const styles = toneStyles[tone];
  return (
    <div
      className={[
        "group relative w-full overflow-hidden rounded-2xl",
        "border bg-white/4 backdrop-blur-xl",
        "transition-all duration-300",
        "hover:scale-[1.02]",
        "shadow-[0_12px_30px_-16px_rgba(0,0,0,0.9)]",
        styles.border,
        styles.glow,
        styles.hoverGlow,
      ].join(" ")}
    >
      <div
        className={[
          "pointer-events-none absolute inset-0",
          "bg-[radial-gradient(1200px_circle_at_20%_0%,rgba(255,255,255,0.10),transparent_45%)]",
        ].join(" ")}
        aria-hidden="true"
      />

      <div className="flex h-[92px] items-center gap-4 px-5 sm:px-6">
        <div
          className={[
            "grid h-11 w-11 place-items-center rounded-2xl",
            "border border-white/10 bg-white/5",
            "shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]",
            "transition-all duration-300",
            "group-hover:bg-white/10",
          ].join(" ")}
        >
          <div className={styles.icon}>{icon}</div>
        </div>

        <div className="min-w-0 leading-none">
          <p className="text-[12px] font-semibold uppercase tracking-[0.22em] text-[#a7b2c7]">
            {label}
          </p>
          <p
            className={[
              "mt-2 font-mono text-[30px] font-bold tracking-tight",
              "tabular-nums",
              "leading-none",
              styles.value,
            ].join(" ")}
          >
            <span className="inline-block min-w-[8ch] align-baseline">{value}</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function StatsBar({
  wpm = 0,
  accuracy = 100,
  mistakes = 0,
}: StatsBarProps) {
  const wpmText = `${Math.max(0, Math.round(wpm))}`;
  const accuracyText = `${Math.max(0, Math.min(100, Math.round(accuracy)))}%`;
  const mistakesText = `${Math.max(0, Math.round(mistakes))}`;

  return (
    <div className="grid w-full grid-cols-1 gap-5 md:grid-cols-3">
      <StatCard
        label="WPM"
        value={wpmText}
        icon={<Gauge className="h-6 w-6" aria-hidden="true" />}
        tone="warm"
      />
      <StatCard
        label="ACCURACY"
        value={accuracyText}
        icon={<Crosshair className="h-6 w-6" aria-hidden="true" />}
        tone="green"
      />
      <StatCard
        label="MISTAKES"
        value={mistakesText}
        icon={<TriangleAlert className="h-6 w-6" aria-hidden="true" />}
        tone="red"
      />
    </div>
  );
}