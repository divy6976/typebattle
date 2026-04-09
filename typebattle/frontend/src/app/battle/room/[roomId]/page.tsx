import RoomHeader from "../../../../../components/RoomHeader";
import RoomPageTopBar from "../../../../../components/RoomPageTopBar";
import WaitingSection from "../../../../../components/WaitingSection";

type RoomPageProps = {
  params: Promise<{ roomId: string }>;
};

export default async function RoomPage({ params }: RoomPageProps) {
  const { roomId } = await params;

  return (
    <main className="flex h-screen min-h-screen flex-col overflow-hidden bg-[#030712] font-mono antialiased">
      {/* Background (fixed to viewport behind content) */}
      <div className="pointer-events-none fixed inset-0 -z-10" aria-hidden>
        <div className="absolute -left-[20%] top-0 h-[min(70vh,560px)] w-[min(90vw,640px)] rounded-full bg-[radial-gradient(circle,rgba(250,204,21,0.14)_0%,transparent_65%)] blur-3xl" />
        <div className="absolute -right-[15%] top-[15%] h-[min(60vh,480px)] w-[min(85vw,520px)] rounded-full bg-[radial-gradient(circle,rgba(139,92,246,0.18)_0%,transparent_62%)] blur-3xl" />
        <div className="absolute bottom-0 left-1/2 h-[40vh] w-[120%] -translate-x-1/2 bg-[radial-gradient(ellipse_at_center,rgba(99,102,241,0.08)_0%,transparent_55%)] blur-2xl" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-size-[48px_48px] opacity-40 mask-[radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />
        <div className="absolute inset-0 opacity-[0.035] mix-blend-overlay [background-image:url('data:image/svg+xml,%3Csvg viewBox=%220 0 256 256%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22n%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%224%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23n)%22/%3E%3C/svg%3E')]" />
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(12)].map((_, i) => (
            <span
              key={i}
              className="absolute h-1 w-1 rounded-full bg-white/40"
              style={{
                left: `${8 + ((i * 7.5) % 84)}%`,
                top: `${12 + ((i * 13) % 76)}%`,
                animation: `floatParticle ${5 + (i % 4)}s ease-in-out infinite`,
                animationDelay: `${i * 0.35}s`,
              }}
            />
          ))}
        </div>
      </div>

      <RoomPageTopBar />

      <div
        className="flex min-h-0 flex-1 flex-col items-center justify-center overflow-y-auto px-3 py-2 md:overflow-y-hidden md:px-6"
        style={{ animation: "roomFadeIn 0.65s ease-out both" }}
      >
        <div className="flex w-full max-w-[1180px] flex-col items-center justify-center gap-3 md:gap-4">
          <RoomHeader compact roomCode={roomId.toUpperCase()} />
          <WaitingSection compact />
        </div>
      </div>
    </main>
  );
}
