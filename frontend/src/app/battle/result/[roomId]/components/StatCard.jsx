export default function StatCard({ icon: Icon, label, value, iconClassName = "text-slate-200" }) {
  return (
    <div className="group rounded-xl border border-white/10 bg-white/5 p-2.5 text-center backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.45)] transition-all duration-300 hover:-translate-y-0.5 hover:scale-[1.02] hover:border-white/20 hover:bg-white/10 hover:shadow-[0_0_24px_rgba(148,163,184,0.3)]">
      <div className="mx-auto mb-1.5 grid h-8 w-8 place-items-center rounded-md border border-white/10 bg-black/35 shadow-[inset_0_0_16px_rgba(255,255,255,0.08)]">
        <Icon className={`h-4 w-4 drop-shadow-[0_0_10px_rgba(255,255,255,0.35)] ${iconClassName}`} />
      </div>
      <p className="text-[9px] uppercase tracking-[0.12em] text-slate-400">{label}</p>
      <p className="mt-0.5 text-xl font-black text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.25)]">{value}</p>
    </div>
  );
}
