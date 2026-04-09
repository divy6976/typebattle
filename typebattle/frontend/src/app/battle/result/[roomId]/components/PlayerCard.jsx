import { Crown } from "lucide-react";

export default function PlayerCard({
  side = "you",
  isWinner,
  label,
  name,
  subtitle,
  wpm,
  accuracy,
  correctChars,
}) {
  const isYou = side === "you";
  const winner = typeof isWinner === "boolean" ? isWinner : isYou;

  return (
    <article
      className={[
        "group relative overflow-hidden rounded-2xl border bg-white/5 p-4 backdrop-blur-xl transition-all duration-500 hover:scale-105",
        winner
          ? "border-emerald-400/45 shadow-[0_0_40px_rgba(34,197,94,0.4)] hover:shadow-[0_0_58px_rgba(34,197,94,0.55)]"
          : "border-rose-400/45 shadow-[0_0_40px_rgba(244,63,94,0.35)] hover:shadow-[0_0_58px_rgba(244,63,94,0.5)]",
      ].join(" ")}
    >
      <div
        className={[
          "pointer-events-none absolute inset-0",
          winner
            ? "bg-[radial-gradient(circle_at_20%_0%,rgba(52,211,153,0.2),transparent_52%)]"
            : "bg-[radial-gradient(circle_at_80%_0%,rgba(251,113,133,0.2),transparent_52%)]",
        ].join(" ")}
      />
      <div
        className={[
          "pointer-events-none absolute inset-x-0 top-0 h-24",
          winner
            ? "bg-linear-to-b from-emerald-300/12 to-transparent"
            : "bg-linear-to-b from-rose-300/12 to-transparent",
        ].join(" ")}
      />

      <div className="relative z-10">
        <div className="mb-3 flex flex-col items-center">
          {winner ? (
            <Crown
              className="mb-0.5 h-5 w-5 animate-[floatSoft_3s_ease-in-out_infinite] text-yellow-300 drop-shadow-[0_0_16px_rgba(250,204,21,0.9)]"
            />
          ) : null}
          <div className="relative">
            <div
              className={[
                "pointer-events-none absolute -inset-2 rounded-full border",
                winner ? "border-emerald-300/35" : "border-rose-300/35",
              ].join(" ")}
            />
            <div
              className={[
                "pointer-events-none absolute -inset-4 rounded-full opacity-80 blur-md",
                winner ? "bg-emerald-400/25" : "bg-rose-400/30",
              ].join(" ")}
            />
            <div
              className={[
                "relative grid h-14 w-14 place-items-center rounded-full border-2 text-base font-bold text-white",
                "animate-[statusDotPulse_2s_ease-in-out_infinite]",
                winner
                  ? "border-emerald-300/80 bg-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.6)]"
                  : "border-rose-300/80 bg-rose-500/20 shadow-[0_0_20px_rgba(251,113,133,0.65)]",
              ].join(" ")}
            >
              {isYou ? "Y" : "O"}
            </div>
          </div>
          <span
            className={[
              "mt-2 rounded-full px-2 py-0.5 text-[9px] font-semibold tracking-[0.16em]",
              winner
                ? "bg-emerald-400/20 text-emerald-200"
                : "bg-rose-400/20 text-rose-200",
            ].join(" ")}
          >
            {label}
          </span>
          <h3 className="mt-1 text-xl font-bold text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]">{name}</h3>
          <p className="text-[10px] font-semibold tracking-[0.16em] text-yellow-300/90">{subtitle}</p>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <div className="rounded-xl border border-white/10 bg-black/30 px-1.5 py-2 text-center shadow-[inset_0_0_18px_rgba(255,255,255,0.04)]">
            <p
              className={[
                "text-4xl font-black leading-none",
                winner
                  ? "bg-linear-to-b from-emerald-200 to-emerald-400 bg-clip-text text-transparent drop-shadow-[0_0_16px_rgba(34,197,94,0.55)]"
                  : "bg-linear-to-b from-rose-200 to-rose-400 bg-clip-text text-transparent drop-shadow-[0_0_16px_rgba(251,113,133,0.55)]",
              ].join(" ")}
            >
              {wpm}
            </p>
            <p className="mt-0.5 text-[10px] uppercase tracking-widest text-slate-300">WPM</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-black/30 px-1.5 py-2 text-center shadow-[inset_0_0_18px_rgba(255,255,255,0.04)]">
            <p className="text-4xl font-black leading-none text-slate-100 drop-shadow-[0_0_10px_rgba(255,255,255,0.25)]">
              {accuracy}%
            </p>
            <p className="mt-0.5 text-[10px] uppercase tracking-widest text-slate-300">Accuracy</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-black/30 px-1.5 py-2 text-center shadow-[inset_0_0_18px_rgba(255,255,255,0.04)]">
            <p className="text-4xl font-black leading-none text-slate-100 drop-shadow-[0_0_10px_rgba(255,255,255,0.25)]">
              {correctChars}
            </p>
            <p className="mt-0.5 text-[10px] uppercase tracking-widest text-slate-300">Correct Chars</p>
          </div>
        </div>
      </div>
    </article>
  );
}
