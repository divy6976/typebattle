type StepCardProps = {
  step: number;
  title: string;
  description: string;
  icon: React.ReactNode;
};

export default function StepCard({ step, title, description, icon }: StepCardProps) {
  return (
    <div className="group flex w-full flex-col items-center rounded-2xl border border-white/10 bg-white/3 px-2 py-2 text-center font-sans transition-all duration-300 hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/5 hover:shadow-[0_12px_28px_-18px_rgba(0,0,0,0.7)]">
      <div className="grid h-[42px] w-[42px] place-items-center rounded-full border border-white/10 bg-[#0f1627]/95 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] transition-transform duration-300 group-hover:scale-105">
        {icon}
      </div>
      <h3 className="font-display mt-1.5 text-[13px] font-bold leading-tight text-[#f0f3f7]">
        {step}. {title}
      </h3>
      <p className="mt-0.5 text-[11px] font-medium leading-tight text-[#96a0b4]">{description}</p>
    </div>
  );
}

