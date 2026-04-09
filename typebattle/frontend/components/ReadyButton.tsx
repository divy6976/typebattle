"use client";

import { useState } from "react";

type ReadyButtonProps = {
  ready?: boolean;
  onToggle?: (nextReady: boolean) => void;
  className?: string;
  /** When false, only the button is rendered (helper line is omitted). */
  showHelperText?: boolean;
  compact?: boolean;
  disabled?: boolean;
};

export default function ReadyButton({
  ready,
  onToggle,
  className = "",
  showHelperText = true,
  compact = false,
  disabled = false,
}: ReadyButtonProps) {
  const [internalReady, setInternalReady] = useState(false);
  const isControlled = typeof ready === "boolean";
  const isReady = isControlled ? ready : internalReady;

  const handleToggle = () => {
    if (disabled) return;
    const nextReady = !isReady;
    if (!isControlled) {
      setInternalReady(nextReady);
    }
    onToggle?.(nextReady);
  };

  return (
    <div className={`flex w-full flex-col items-center ${className}`}>
      <button
        type="button"
        disabled={disabled}
        onClick={handleToggle}
        className={[
          compact
            ? "w-full max-w-sm rounded-lg px-6 py-2.5 text-sm font-semibold transition-all duration-300"
            : "w-full max-w-md rounded-lg px-8 py-3.5 font-semibold transition-all duration-300",
          "transform-gpu hover:scale-105 active:scale-[0.98] active:brightness-95",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#030712]",
          disabled ? "cursor-not-allowed opacity-50 hover:scale-100" : "",
          isReady
            ? "bg-linear-to-r from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/35 hover:shadow-xl hover:shadow-emerald-500/50 focus-visible:ring-emerald-400"
            : "bg-linear-to-r from-yellow-400 to-yellow-500 text-black shadow-lg shadow-yellow-500/30 hover:shadow-xl hover:shadow-yellow-500/50 focus-visible:ring-yellow-300",
        ].join(" ")}
      >
        {isReady ? "Ready" : "I'm Ready! ⚡"}
      </button>

      {showHelperText ? (
        <p className="mt-2 text-center text-xs text-slate-400">You can change your ready status anytime</p>
      ) : null}
    </div>
  );
}
