"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const NAV_ITEMS = [
  { label: "Practice", href: "/practice", icon: "⌕" },
  { label: "Battle", href: "/battle", icon: "⚔" },
  { label: "Exam Mode", href: "/exammode", icon: "◫", comingSoon: true },
];

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function NavBar() {
  const pathname = usePathname();
  const [soonMessage, setSoonMessage] = useState("");

  return (
    <nav className="relative w-full overflow-hidden rounded-3xl border border-white/12 bg-[#070d19]/75 px-4 py-1.5 backdrop-blur-2xl shadow-[0_18px_50px_-32px_rgba(0,0,0,0.95)] sm:py-0.5">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-[#334155] to-transparent opacity-80" />
      <div className="relative flex min-h-[48px] flex-wrap items-center gap-2 sm:h-[48px] sm:flex-nowrap sm:justify-between">
        <Link href="/" className="font-display flex items-center gap-1.5 text-[24px] font-extrabold leading-none tracking-tight transition-transform duration-300 hover:scale-[1.01] sm:text-[29px]">
          <span className="text-[18px] leading-none text-[#facc15]">⚡</span>
          <span className="text-[#e8edf5]">type</span>
          <span className="text-[#facc15]">battle</span>
        </Link>

        <div className="order-3 -mx-1 flex h-full w-full items-center gap-1 overflow-x-auto px-1 pb-0.5 pt-1 font-mono sm:order-none sm:mx-0 sm:w-auto sm:overflow-visible sm:px-0 sm:pt-0">
          {NAV_ITEMS.map((item) => {
            const active = isActive(pathname, item.href);
            const itemClassName = [
              "relative flex h-full shrink-0 items-center gap-2 whitespace-nowrap rounded-xl px-3 py-2 text-[15px] font-semibold leading-none transition-all duration-200 sm:py-0 sm:text-[16px]",
              active
                ? "text-[#facc15] bg-[#facc15]/10"
                : "text-[#b9c2d3] hover:bg-white/5 hover:text-[#e5eaf2]",
            ].join(" ");

            if (item.comingSoon) {
              return (
                <button
                  key={item.href}
                  type="button"
                  className={itemClassName}
                  onClick={() => setSoonMessage("Exam Mode: Coming soon")}
                >
                  <span className="text-[13px] leading-none opacity-85">{item.icon}</span>
                  {item.label}
                </button>
              );
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                className={itemClassName}
                onClick={() => setSoonMessage("")}
              >
                <span className="text-[13px] leading-none opacity-85">{item.icon}</span>
                {item.label}
                {active ? (
                  <span className="absolute inset-x-3 bottom-0 h-[3px] rounded-full bg-[#facc15]" />
                ) : null}
              </Link>
            );
          })}
          {soonMessage ? (
            <span className="ml-2 hidden text-[12px] font-semibold text-[#facc15] sm:inline">{soonMessage}</span>
          ) : null}
        </div>

        <div className="ml-auto flex items-center gap-2 sm:ml-0">
          <button
            type="button"
            className="flex h-8 items-center gap-1.5 rounded-full border border-[#202a3d] bg-[#0f1625] px-2.5 text-[14px] font-semibold leading-none text-[#dbe2ef]"
          >
            <span className="grid h-4.5 w-4.5 place-items-center rounded-full bg-[#202b3c] text-[10px]">👤</span>
            <span>Guest</span>
            <span className="text-[11px] text-[#8f9db1]">▾</span>
          </button>
          <button
            type="button"
            className="grid h-8 w-8 place-items-center rounded-full border border-[#202a3d] bg-[#0f1625] text-[14px] text-[#c8d1e1]"
            aria-label="Settings"
          >
            ☼
          </button>
        </div>
      </div>
    </nav>
  );
}
