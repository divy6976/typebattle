import StepCard from "./StepCard";

function CreateJoinIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6 text-[#facc15]" fill="none" aria-hidden="true">
      <circle cx="10" cy="9" r="3" className="stroke-current" strokeWidth="1.9" />
      <path d="M4.5 18.2C5.4 15.8 7.6 14.5 10 14.5C12.4 14.5 14.6 15.8 15.5 18.2" className="stroke-current" strokeWidth="1.9" strokeLinecap="round" />
      <path d="M18.5 7V12M16 9.5H21" className="stroke-current" strokeWidth="1.9" strokeLinecap="round" />
    </svg>
  );
}

function WaitPlayerIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6 text-[#3b82f6]" fill="none" aria-hidden="true">
      <circle cx="9" cy="9" r="3.2" className="stroke-current" strokeWidth="1.9" />
      <path d="M3.8 18.2C4.8 15.7 7 14.4 9.4 14.4C11.8 14.4 14 15.7 15 18.2" className="stroke-current" strokeWidth="1.9" strokeLinecap="round" />
      <circle cx="16.8" cy="10.8" r="2.6" className="stroke-current" strokeWidth="1.9" />
      <path d="M14.7 17.2C15.4 15.8 16.8 15 18.3 15" className="stroke-current" strokeWidth="1.9" strokeLinecap="round" />
    </svg>
  );
}

function StartBattleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6 text-[#4ade80]" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="8.5" className="stroke-current" strokeWidth="1.9" />
      <path d="M10 8.8L15 12L10 15.2V8.8Z" className="stroke-current" strokeWidth="1.9" strokeLinejoin="round" />
    </svg>
  );
}

function ResultsIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6 text-[#f472b6]" fill="none" aria-hidden="true">
      <path d="M8 5.5H16V8.2C16 10.8 14.3 12.8 12 13.4C9.7 12.8 8 10.8 8 8.2V5.5Z" className="stroke-current" strokeWidth="1.9" strokeLinejoin="round" />
      <path d="M8 7H5.8C5.8 8.7 6.7 9.8 8 10.2M16 7H18.2C18.2 8.7 17.3 9.8 16 10.2" className="stroke-current" strokeWidth="1.9" strokeLinecap="round" />
      <path d="M12 13.4V16.4M9.2 18.5H14.8" className="stroke-current" strokeWidth="1.9" strokeLinecap="round" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 text-[#6f7789]" fill="none" aria-hidden="true">
      <path d="M5 12H19M14.8 7.6L19.2 12L14.8 16.4" className="stroke-current" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function HowItWorks() {
  return (
    <section className="w-full font-sans">
      <div className="rounded-3xl border border-white/12 bg-white/4 px-4 py-2.5 backdrop-blur-xl shadow-[0_18px_38px_rgba(0,0,0,0.36)]">
        <h2 className="font-mono text-center text-[15px] font-bold tracking-tight text-transparent bg-linear-to-r from-white to-[#cbd5e1] bg-clip-text">
          How it works
        </h2>

        <div className="mt-2.5 grid items-start gap-1.5 md:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr]">
          <StepCard step={1} title="Create / Join" description="Create a room or join with a room code" icon={<CreateJoinIcon />} />
          <div className="hidden self-start pt-3 md:block">
            <ArrowIcon />
          </div>
          <StepCard step={2} title="Wait for Player" description="Wait for another player to join the room" icon={<WaitPlayerIcon />} />
          <div className="hidden self-start pt-3 md:block">
            <ArrowIcon />
          </div>
          <StepCard step={3} title="Start Battle" description="Both players click ready. 3, 2, 1 and go!" icon={<StartBattleIcon />} />
          <div className="hidden self-start pt-3 md:block">
            <ArrowIcon />
          </div>
          <StepCard step={4} title="See Results" description="Race to finish and see who was faster!" icon={<ResultsIcon />} />
        </div>
      </div>
    </section>
  );
}
