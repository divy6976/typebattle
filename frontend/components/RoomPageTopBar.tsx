import Link from "next/link";

export default function RoomPageTopBar() {
  return (
    <header className="relative z-30 flex w-full shrink-0 items-center justify-between border-b border-white/10 bg-white/5 px-4 py-3 backdrop-blur-xl md:px-6">
      <Link
        href="/battle"
        className="group inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm font-medium text-slate-300 transition-all duration-200 hover:bg-white/10 hover:text-[#facc15]"
      >
        <span
          className="inline-block transition-transform duration-200 group-hover:-translate-x-0.5"
          aria-hidden
        >
          ←
        </span>
        Back to Battle
      </Link>

      <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-500/12 px-3.5 py-1.5 text-xs font-semibold tracking-wide text-emerald-100 shadow-[0_0_20px_rgba(52,211,153,0.18)]">
        <span
          className="h-2 w-2 shrink-0 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.85)]"
          aria-hidden
        />
        Room Active
      </div>
    </header>
  );
}
