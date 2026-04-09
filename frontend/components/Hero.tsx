"use client";

function KeyboardOutline({
  className,
  strokeClass,
  fillClass,
}: {
  className?: string;
  strokeClass: string;
  fillClass: string;
}) {
  return (
    <svg
      viewBox="0 0 320 150"
      className={className}
      fill="none"
      aria-hidden="true"
    >
      <g
        className={strokeClass}
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="16" y="34" width="288" height="92" rx="12" className={fillClass} />
        <rect x="24" y="42" width="272" height="76" rx="8" className={fillClass} opacity="0.55" />

        {/* function row */}
        <rect x="34" y="50" width="18" height="9" rx="1.6" />
        <rect x="56" y="50" width="18" height="9" rx="1.6" />
        <rect x="78" y="50" width="18" height="9" rx="1.6" />
        <rect x="100" y="50" width="18" height="9" rx="1.6" />
        <rect x="127" y="50" width="18" height="9" rx="1.6" />
        <rect x="149" y="50" width="18" height="9" rx="1.6" />
        <rect x="171" y="50" width="18" height="9" rx="1.6" />
        <rect x="193" y="50" width="18" height="9" rx="1.6" />
        <rect x="220" y="50" width="18" height="9" rx="1.6" />
        <rect x="242" y="50" width="18" height="9" rx="1.6" />
        <rect x="264" y="50" width="22" height="9" rx="1.6" />
        <circle cx="43" cy="54.5" r="1.1" />
        <circle cx="65" cy="54.5" r="1.1" />
        <circle cx="87" cy="54.5" r="1.1" />
        <circle cx="109" cy="54.5" r="1.1" />
        <circle cx="136" cy="54.5" r="1.1" />
        <circle cx="158" cy="54.5" r="1.1" />
        <circle cx="180" cy="54.5" r="1.1" />
        <circle cx="202" cy="54.5" r="1.1" />
        <circle cx="229" cy="54.5" r="1.1" />
        <circle cx="251" cy="54.5" r="1.1" />

        {/* number row */}
        <rect x="30" y="63" width="24" height="11" rx="1.8" />
        <rect x="58" y="63" width="20" height="11" rx="1.8" />
        <rect x="82" y="63" width="20" height="11" rx="1.8" />
        <rect x="106" y="63" width="20" height="11" rx="1.8" />
        <rect x="130" y="63" width="20" height="11" rx="1.8" />
        <rect x="154" y="63" width="20" height="11" rx="1.8" />
        <rect x="178" y="63" width="20" height="11" rx="1.8" />
        <rect x="202" y="63" width="20" height="11" rx="1.8" />
        <rect x="226" y="63" width="20" height="11" rx="1.8" />
        <rect x="250" y="63" width="20" height="11" rx="1.8" />
        <rect x="274" y="63" width="16" height="11" rx="1.8" />

        {/* qwerty */}
        <rect x="36" y="78" width="28" height="11" rx="1.8" />
        <rect x="68" y="78" width="20" height="11" rx="1.8" />
        <rect x="92" y="78" width="20" height="11" rx="1.8" />
        <rect x="116" y="78" width="20" height="11" rx="1.8" />
        <rect x="140" y="78" width="20" height="11" rx="1.8" />
        <rect x="164" y="78" width="20" height="11" rx="1.8" />
        <rect x="188" y="78" width="20" height="11" rx="1.8" />
        <rect x="212" y="78" width="20" height="11" rx="1.8" />
        <rect x="236" y="78" width="20" height="11" rx="1.8" />
        <rect x="260" y="78" width="32" height="11" rx="1.8" />

        {/* asdf */}
        <rect x="42" y="93" width="32" height="11" rx="1.8" />
        <rect x="78" y="93" width="20" height="11" rx="1.8" />
        <rect x="102" y="93" width="20" height="11" rx="1.8" />
        <rect x="126" y="93" width="20" height="11" rx="1.8" />
        <rect x="150" y="93" width="20" height="11" rx="1.8" />
        <rect x="174" y="93" width="20" height="11" rx="1.8" />
        <rect x="198" y="93" width="20" height="11" rx="1.8" />
        <rect x="222" y="93" width="20" height="11" rx="1.8" />
        <rect x="246" y="93" width="40" height="11" rx="1.8" />

        {/* bottom row */}
        <rect x="50" y="108" width="40" height="11" rx="1.8" />
        <rect x="94" y="108" width="22" height="11" rx="1.8" />
        <rect x="120" y="108" width="22" height="11" rx="1.8" />
        <rect x="146" y="108" width="62" height="11" rx="1.8" />
        <rect x="212" y="108" width="22" height="11" rx="1.8" />
        <rect x="238" y="108" width="48" height="11" rx="1.8" />
      </g>
    </svg>
  );
}

function LightningIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M13 2 5.5 13h5L9 22l9.5-12H13V2Z" />
    </svg>
  );
}

export default function Hero() {
  return (
    <section className="relative w-full overflow-hidden rounded-3xl border border-white/12 bg-white/5 px-5 py-4 backdrop-blur-2xl shadow-[0_24px_80px_-44px_rgba(0,0,0,0.95)] md:h-[188px] md:px-7">
      <div className="pointer-events-none absolute inset-0 bg-linear-to-r from-[#0d1726]/90 via-[#080d19]/75 to-[#17132a]/90" />
      <div className="pointer-events-none absolute left-[54%] top-1/2 h-[170px] w-[170px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#facc15]/18 blur-[74px] animate-pulse" />
      <div className="pointer-events-none absolute right-[9%] top-1/2 h-[160px] w-[160px] -translate-y-1/2 rounded-full bg-[#8b5cf6]/26 blur-[74px] animate-pulse [animation-delay:500ms]" />

      <div className="relative flex h-full items-center justify-between gap-4">
        <div className="max-w-[560px] font-sans">
          <h1 className="font-mono text-[34px] font-extrabold leading-[1.03] tracking-tight text-transparent bg-linear-to-r from-white via-[#f3f4f7] to-[#facc15] bg-clip-text md:text-[50px]">
            Challenge a <span className="text-transparent bg-linear-to-r from-[#facc15] to-[#f59e0b] bg-clip-text">Friend</span>
          </h1>
          <p className="mt-2 text-[15px] font-medium text-[#aeb8ca] md:text-[16px]">
            Create or join a room and start typing battle!
          </p>
        </div>

        <div className="relative mr-2 hidden w-[500px] items-center justify-center font-sans md:flex">
          <div className="pointer-events-none absolute left-[6%] top-[34%] h-2 w-2 rounded-full bg-[#facc15]/45 blur-[1px] animate-[floatSoft_4.6s_ease-in-out_infinite]" />
          <div className="pointer-events-none absolute left-[11%] top-[56%] h-1.5 w-1.5 rounded-full bg-[#facc15]/40 blur-[1px] animate-[driftSoft_5.4s_ease-in-out_infinite] [animation-delay:220ms]" />
          <div className="pointer-events-none absolute left-[19%] top-[24%] h-1 w-1 rounded-full bg-[#fde047]/55 blur-[2px] animate-[floatSoft_5.2s_ease-in-out_infinite] [animation-delay:680ms]" />
          <div className="pointer-events-none absolute left-[28%] top-[63%] h-2 w-2 rounded-full bg-[#facc15]/35 blur-[2px] animate-[driftSoft_6s_ease-in-out_infinite] [animation-delay:320ms]" />
          <div className="pointer-events-none absolute left-[35%] top-[30%] h-1.5 w-1.5 rounded-full bg-[#facc15]/40 blur-[1px] animate-[floatSoft_4.9s_ease-in-out_infinite] [animation-delay:1.1s]" />

          <div className="pointer-events-none absolute right-[7%] top-[32%] h-2 w-2 rounded-full bg-[#8b5cf6]/45 blur-[1px] animate-[floatSoft_4.8s_ease-in-out_infinite]" />
          <div className="pointer-events-none absolute right-[13%] top-[56%] h-1.5 w-1.5 rounded-full bg-[#a78bfa]/42 blur-[1px] animate-[driftSoft_5.8s_ease-in-out_infinite] [animation-delay:260ms]" />
          <div className="pointer-events-none absolute right-[20%] top-[25%] h-1 w-1 rounded-full bg-[#a78bfa]/55 blur-[2px] animate-[floatSoft_5.4s_ease-in-out_infinite] [animation-delay:780ms]" />
          <div className="pointer-events-none absolute right-[30%] top-[61%] h-2 w-2 rounded-full bg-[#8b5cf6]/35 blur-[2px] animate-[driftSoft_6.2s_ease-in-out_infinite] [animation-delay:420ms]" />
          <div className="pointer-events-none absolute right-[37%] top-[31%] h-1.5 w-1.5 rounded-full bg-[#8b5cf6]/40 blur-[1px] animate-[floatSoft_4.7s_ease-in-out_infinite] [animation-delay:1s]" />

          <div className="pointer-events-none absolute left-1/2 top-1/2 h-[210px] w-[210px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#facc15]/20 opacity-70 animate-[ping_3.6s_ease-in-out_infinite]" />
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-[250px] w-[250px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#8b5cf6]/20 opacity-60 animate-[ping_4.2s_ease-in-out_infinite] [animation-delay:700ms]" />
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-[146px] w-[146px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-black/50 blur-[10px]" />
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-[170px] w-[170px] -translate-x-1/2 -translate-y-1/2 bg-radial-[ellipse_at_center] from-black/55 to-transparent" />
          <div className="pointer-events-none absolute left-[23%] top-[38%] h-[2px] w-[84px] -rotate-12 bg-linear-to-r from-transparent via-[#facc15]/90 to-transparent opacity-80 animate-[pulse_2.4s_ease-in-out_infinite]" />
          <div className="pointer-events-none absolute right-[22%] top-[58%] h-[2px] w-[84px] rotate-12 bg-linear-to-r from-transparent via-[#8b5cf6]/90 to-transparent opacity-75 animate-[pulse_2.8s_ease-in-out_infinite] [animation-delay:450ms]" />

          <div className="absolute -left-[10px] top-[44%] h-[2px] w-[40px] rotate-[-25deg] bg-[#facc15] animate-pulse" />
          <div className="absolute left-[42px] top-[36%] h-[2px] w-[30px] rotate-12 bg-[#facc15] animate-pulse [animation-delay:240ms]" />
          <div className="absolute left-[84px] top-[30%] h-[2px] w-[18px] rotate-24 bg-[#facc15] animate-pulse [animation-delay:420ms]" />
          <div className="absolute right-[8px] top-[47%] h-[2px] w-[40px] rotate-25 bg-[#8b5cf6] animate-pulse" />
          <div className="absolute right-[40px] top-[44%] h-[2px] w-[30px] rotate-[-14deg] bg-[#8b5cf6] animate-pulse [animation-delay:240ms]" />
          <div className="absolute right-[86px] top-[35%] h-[2px] w-[24px] rotate-[-26deg] bg-[#8b5cf6] animate-pulse [animation-delay:420ms]" />
          <div className="absolute right-[20px] top-[26%] h-[2px] w-[14px] rotate-[-18deg] bg-[#8b5cf6] animate-pulse [animation-delay:580ms]" />
          <div className="absolute left-[205px] top-[54%] h-[2px] w-[18px] bg-[#facc15]" />
          <div className="absolute right-[208px] top-[54%] h-[2px] w-[18px] bg-[#8b5cf6]" />

          <KeyboardOutline
            className="w-[188px] -rotate-12 transition-transform duration-500 ease-out hover:scale-105 drop-shadow-[0_0_16px_rgba(250,204,21,0.42)]"
            strokeClass="text-[#facc15]"
            fillClass="fill-[#111419]"
          />

          <div className="mx-3 text-center">
            <LightningIcon className="mx-auto -mb-1 h-9 w-9 text-[#facc15] rotate-12 drop-shadow-[0_0_12px_rgba(250,204,21,0.55)] animate-pulse" />
            <div className="font-mono text-[58px] font-extrabold leading-none tracking-tight text-[#facc15] drop-shadow-[0_0_14px_rgba(250,204,21,0.42)]">
              VS
            </div>
            <LightningIcon className="mx-auto mt-0.5 h-9 w-9 -rotate-12 text-[#facc15] drop-shadow-[0_0_12px_rgba(250,204,21,0.55)] animate-pulse [animation-delay:300ms]" />
          </div>

          <KeyboardOutline
            className="w-[188px] rotate-10 transition-transform duration-500 ease-out hover:scale-105 drop-shadow-[0_0_16px_rgba(139,92,246,0.42)]"
            strokeClass="text-[#8b5cf6]"
            fillClass="fill-[#111419]"
          />
        </div>
      </div>
    </section>
  );
}
