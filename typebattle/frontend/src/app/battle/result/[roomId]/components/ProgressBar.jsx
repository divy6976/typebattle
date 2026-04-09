export default function ProgressBar({ youPercent, opponentPercent }) {
  const you = Math.max(0, Math.min(100, youPercent));
  const opponent = Math.max(0, Math.min(100, opponentPercent));

  return (
    <section className="w-full">
      <h4 className="mb-1.5 text-center text-xs font-semibold tracking-[0.22em] text-slate-300">
        BATTLE PROGRESS
      </h4>
      <div className="relative overflow-hidden rounded-full border border-white/15 bg-black/45 p-1 shadow-[0_8px_30px_rgba(0,0,0,0.75)]">
        <div className="relative flex h-4.5 w-full overflow-hidden rounded-full bg-black/50">
          <div className="pointer-events-none absolute inset-0 bg-linear-to-r from-transparent via-white/15 to-transparent animate-[codeShimmer_4s_linear_infinite]" />
          <div
            className="h-full bg-linear-to-r from-emerald-500 via-yellow-300 to-violet-500 shadow-[0_0_26px_rgba(74,222,128,0.6)] transition-all duration-700"
            style={{ width: `${you}%` }}
          />
          <div
            className="h-full bg-linear-to-l from-violet-500 via-purple-500 to-fuchsia-400 shadow-[0_0_26px_rgba(168,85,247,0.65)] transition-all duration-700"
            style={{ width: `${opponent}%` }}
          />
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center text-xs font-semibold tracking-[0.2em] text-white/95">
            VS
          </div>
        </div>
        <div className="pointer-events-none absolute -bottom-1.5 left-1/2 h-4 w-[90%] -translate-x-1/2 rounded-full bg-linear-to-r from-emerald-400/20 via-yellow-300/15 to-violet-400/20 blur-md" />
      </div>
      <div className="mt-1 flex items-center justify-between text-xs font-bold uppercase tracking-[0.15em]">
        <span className="text-emerald-300">You {you}%</span>
        <span className="text-violet-300">{opponent}% Opponent</span>
      </div>
    </section>
  );
}
