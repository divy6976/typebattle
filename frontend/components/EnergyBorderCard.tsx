import type { ReactNode } from "react";

type EnergyBorderCardProps = {
  children: ReactNode;
  /** Outer wrapper (positioning, max-width, margin) */
  className?: string;
  /** Inner panel behind content (background, padding, blur) */
  innerClassName?: string;
  /** Loop duration in seconds (default 3.2) */
  durationSec?: number;
};

/**
 * Premium neon-style card: rotating conic-gradient border + dark inner panel.
 * CSS lives in globals.css (`.energy-border-gradient`, `@keyframes energyBorderSpin`).
 */
export default function EnergyBorderCard({
  children,
  className = "",
  innerClassName = "",
  durationSec = 3.2,
}: EnergyBorderCardProps) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl shadow-[0_0_36px_-6px_rgba(250,204,21,0.35),0_0_56px_-12px_rgba(168,85,247,0.22)] ${className}`}
    >
      {/* Soft outer glow (non-rotating) */}
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl bg-[radial-gradient(ellipse_at_50%_0%,rgba(250,204,21,0.12),transparent_55%)] opacity-80"
        aria-hidden
      />

      {/* Clip rotating energy to rounded frame */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl">
        <div
          className="energy-border-gradient"
          style={{ animationDuration: `${durationSec}s` }}
          aria-hidden
        />
      </div>

      {/* Inner dark glass — covers center so only the ring shows */}
      <div
        className={`relative z-10 m-[3px] rounded-[calc(1rem-3px)] border border-white/5 bg-[#05080f]/95 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-xl ${innerClassName}`}
      >
        {children}
      </div>
    </div>
  );
}
