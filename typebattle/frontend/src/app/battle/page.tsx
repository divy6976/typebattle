"use client";

import CreateRoom from "../../../components/CreateRoom";
import Hero from "../../../components/Hero";
import HowItWorks from "../../../components/HowItWorks";
import JoinRoom from "../../../components/JoinRoom";
import NavBar from "../../../components/NavBar";

export default function BattlePage() {
  return (
    <div className="relative min-h-dvh overflow-hidden bg-[#040913] px-4 py-2.5 font-sans md:px-6">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_10%,rgba(250,204,21,0.14),transparent_36%),radial-gradient(circle_at_88%_20%,rgba(139,92,246,0.18),transparent_42%),linear-gradient(to_bottom,rgba(6,10,18,0.55),rgba(4,9,19,0.96))]" />
      <div className="relative mx-auto flex h-full w-full max-w-[1220px] flex-col gap-2.5">
        <NavBar />
        <Hero />
        <section className="grid grid-cols-1 gap-2.5 xl:grid-cols-2">
          <CreateRoom />
          <JoinRoom />
        </section>
        <HowItWorks />
      </div>
    </div>
  );
}
