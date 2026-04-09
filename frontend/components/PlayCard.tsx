"use client";

type PlayerCardProps = {
  isYou?: boolean;
  isJoined?: boolean;
  isReady?: boolean;
  name?: string;
  /** Shorter card for single-viewport room layout */
  compact?: boolean;
};

function UserIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <path
        d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 8a7 7 0 1 1 14 0"
        className="stroke-current"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function GroupIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <path
        d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"
        className="stroke-current"
        strokeWidth="1.65"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="9" cy="7" r="4" className="stroke-current" strokeWidth="1.65" />
      <path
        d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"
        className="stroke-current"
        strokeWidth="1.65"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function PlayerCard({
  isYou = false,
  isJoined = true,
  isReady = false,
  name,
  compact = false,
}: PlayerCardProps) {
  const displayName = name ?? (isJoined ? "You" : "Waiting for player...");
  const showWaitingTopLabel = !isYou && !isJoined;

  return (
    <article
      className={[
        "group relative mx-auto w-full max-w-[420px] overflow-hidden rounded-2xl border bg-white/5 text-center shadow-[0_4px_24px_-4px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-xl transition-all duration-300",
        compact ? "p-4 md:p-5" : "p-6 md:p-8",
        "hover:-translate-y-1 hover:scale-[1.02] hover:shadow-[0_20px_50px_-20px_rgba(0,0,0,0.85)]",
        isYou
          ? "border-white/10 shadow-[0_0_0_1px_rgba(250,204,21,0.12),0_12px_40px_-16px_rgba(250,204,21,0.15)] hover:border-[#facc15]/40 hover:shadow-[0_0_40px_-8px_rgba(250,204,21,0.35),0_20px_50px_-20px_rgba(0,0,0,0.85)]"
          : "border-white/10 hover:border-violet-400/25 hover:shadow-[0_0_36px_-10px_rgba(139,92,246,0.25),0_20px_50px_-20px_rgba(0,0,0,0.85)]",
      ].join(" ")}
    >
      {isYou ? (
        <div
          className="pointer-events-none absolute left-1/2 top-0 z-10 h-1 w-24 -translate-x-1/2 rounded-b-md bg-linear-to-r from-[#fde047] via-[#facc15] to-[#eab308] shadow-[0_4px_20px_rgba(250,204,21,0.6)]"
          aria-hidden
        />
      ) : null}

      <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-white/[0.07] via-transparent to-black/25" />
      <div className="pointer-events-none absolute inset-0 opacity-70 [background:radial-gradient(circle_at_20%_0%,rgba(250,204,21,0.08),transparent_45%),radial-gradient(circle_at_90%_80%,rgba(139,92,246,0.1),transparent_40%)]" />
      {isYou ? (
        <div className="pointer-events-none absolute left-1/2 top-20 h-32 w-32 -translate-x-1/2 rounded-full bg-[#facc15]/12 blur-3xl" />
      ) : (
        <div className="pointer-events-none absolute left-1/2 top-20 h-28 w-28 -translate-x-1/2 rounded-full bg-violet-500/10 blur-3xl" />
      )}

      {isYou ? (
        <span className="absolute left-1/2 top-5 z-20 -translate-x-1/2 rounded-full border border-[#facc15]/50 bg-black/90 px-3.5 py-1 text-[11px] font-extrabold tracking-[0.2em] text-[#facc15] shadow-[0_0_20px_rgba(250,204,21,0.35)]">
          YOU
        </span>
      ) : null}

      {showWaitingTopLabel ? (
        <span className="absolute left-1/2 top-5 z-20 -translate-x-1/2 rounded-full border border-white/15 bg-[#0d1117]/95 px-3.5 py-1 text-[11px] font-extrabold tracking-[0.16em] text-slate-400">
          WAITING
        </span>
      ) : null}

      <div
        className={
          compact
            ? "relative flex min-h-[200px] flex-col items-center justify-center gap-3 pt-6 pb-4 md:min-h-[220px] md:gap-4"
            : "relative flex min-h-[270px] flex-col items-center justify-center gap-6 pt-8 pb-6 md:min-h-[290px]"
        }
      >
        <div className={isJoined ? "animate-avatar-float" : ""}>
          <div
            className={[
              compact
                ? "relative grid h-24 w-24 place-items-center rounded-full md:h-28 md:w-28"
                : "relative grid h-30 w-30 place-items-center rounded-full md:h-32 md:w-32",
              isYou
                ? "bg-[#141820] ring-2 ring-[#facc15]/75 animate-ring-you"
                : isJoined
                  ? "bg-[#12161f] ring-2 ring-violet-400/35 animate-ring-opp"
                  : "bg-[#12161f] ring-2 ring-dashed ring-white/25",
            ].join(" ")}
          >
            <div
              className={[
                compact
                  ? "grid h-16 w-16 place-items-center rounded-full border shadow-[inset_0_2px_12px_rgba(0,0,0,0.45)] md:h-18 md:w-18"
                  : "grid h-21 w-21 place-items-center rounded-full border shadow-[inset_0_2px_12px_rgba(0,0,0,0.45)] md:h-24 md:w-24",
                isYou ? "border-white/12 bg-[#0c1018]" : "border-white/10 bg-[#080c12]",
              ].join(" ")}
            >
              {isJoined ? (
                <UserIcon
                  className={compact ? "h-7 w-7 text-slate-100 md:h-8 md:w-8" : "h-9 w-9 text-slate-100 md:h-10 md:w-10"}
                />
              ) : (
                <GroupIcon
                  className={compact ? "h-7 w-7 text-slate-500 md:h-8 md:w-8" : "h-9 w-9 text-slate-500 md:h-10 md:w-10"}
                />
              )}
            </div>
          </div>
        </div>

        <h3
          className={
            compact ? "text-base font-semibold tracking-tight text-white md:text-lg" : "text-lg font-semibold tracking-tight text-white md:text-xl"
          }
        >
          {displayName}
        </h3>

        {isJoined ? (
          <div
            className={[
              compact
                ? "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold transition-all duration-300 md:text-sm"
                : "inline-flex items-center gap-2.5 rounded-full border px-4 py-2 text-sm font-semibold transition-all duration-300",
              isReady
                ? "border-emerald-400/35 bg-emerald-500/15 text-emerald-100 shadow-[0_0_20px_rgba(52,211,153,0.25),inset_0_1px_0_rgba(255,255,255,0.08)]"
                : "border-amber-400/30 bg-black/60 text-[#fef08a] shadow-[0_0_18px_rgba(250,204,21,0.2),inset_0_1px_0_rgba(255,255,255,0.05)]",
            ].join(" ")}
          >
            <span
              className={[
                "h-2.5 w-2.5 shrink-0 rounded-full",
                isReady
                  ? "bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.9)]"
                  : "bg-amber-400 shadow-[0_0_12px_rgba(250,204,21,0.9)] animate-status-dot",
              ].join(" ")}
            />
            {isReady ? "Ready" : "Not Ready"}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-1.5">
            <p className="text-sm text-slate-400">Invite a friend to join</p>
          </div>
        )}
      </div>
    </article>
  );
}
