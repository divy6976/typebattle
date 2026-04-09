"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { io, type Socket } from "socket.io-client";
import BattleStartCountdown from "./BattleStartCountdown";
import EnergyBorderCard from "./EnergyBorderCard";
import PlayerCard from "./PlayCard";
import ReadyButton from "./ReadyButton";

const SOCKET_URL = "http://localhost:5000";

type ServerPlayer = { id: string; ready: boolean };
type Difficulty = "easy" | "medium" | "hard";

function HourglassIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <path d="M5 22h14" className="stroke-current" strokeWidth="1.65" strokeLinecap="round" />
      <path d="M5 2h14" className="stroke-current" strokeWidth="1.65" strokeLinecap="round" />
      <path
        d="M17 22v-4.17a2 2 0 0 0-.59-1.41L12 12 7.59 16.42A2 2 0 0 0 7 17.83V22M7 2v4.17a2 2 0 0 0 .59 1.41L12 12l4.41-4.42A2 2 0 0 0 17 6.17V2"
        className="stroke-current"
        strokeWidth="1.65"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ShieldIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <path
        d="M12 3 5 6v5c0 4.55 2.84 8.74 7 10 4.16-1.26 7-5.45 7-10V6l-7-3Z"
        className="stroke-current"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

type WaitingSectionProps = {
  compact?: boolean;
};

export default function WaitingSection({ compact = false }: WaitingSectionProps) {
  const params = useParams();
  const searchParams = useSearchParams();
  const roomId = typeof params?.roomId === "string" ? params.roomId : "";
  const difficultyParam = searchParams.get("difficulty");
  const timeLimitParam = Number(searchParams.get("timeLimit"));
  const roomSettings = useMemo(() => {
    const difficulty: Difficulty | null =
      difficultyParam === "easy" || difficultyParam === "medium" || difficultyParam === "hard"
        ? difficultyParam
        : null;
    const timeLimitSec = [30, 45, 60].includes(timeLimitParam) ? timeLimitParam : null;
    return difficulty && timeLimitSec ? { difficulty, timeLimitSec } : null;
  }, [difficultyParam, timeLimitParam]);
  const [connected, setConnected] = useState(false);
  const [mySocketId, setMySocketId] = useState<string | null>(null);
  const [players, setPlayers] = useState<ServerPlayer[]>([]);
  const [battleStartActive, setBattleStartActive] = useState(false);
  const [gameStartAtMs, setGameStartAtMs] = useState<number | null>(null);
  const [gameEndAtMs, setGameEndAtMs] = useState<number | null>(null);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!roomId) return;

    const socket = io(SOCKET_URL, { transports: ["websocket", "polling"] });

    socket.on("connect", () => {
      setConnected(true);
      setMySocketId(socket.id ?? null);
      socket.emit("join_room", { roomId, settings: roomSettings });
    });

    socket.on("disconnect", () => {
      setConnected(false);
    });

    socket.on("room_update", (roomPlayers: ServerPlayer[]) => {
      setPlayers(Array.isArray(roomPlayers) ? roomPlayers : []);
      setMySocketId(socket.id ?? null);
    });

    socket.on("start_game", (payload: { startAtMs?: number; endAtMs?: number }) => {
      console.log("Game Starting");
      if (typeof payload?.startAtMs === "number" && Number.isFinite(payload.startAtMs)) {
        setGameStartAtMs(payload.startAtMs);
      } else {
        setGameStartAtMs(Date.now() + 6700);
      }
      if (typeof payload?.endAtMs === "number" && Number.isFinite(payload.endAtMs)) {
        setGameEndAtMs(payload.endAtMs);
      } else {
        setGameEndAtMs(null);
      }
      setBattleStartActive(true);
    });

    socketRef.current = socket;

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [roomId, roomSettings]);

  const { youReady, opponentReady, opponentJoined } = useMemo(() => {
    if (!mySocketId) {
      return { youReady: false, opponentReady: false, opponentJoined: false };
    }
    const me = players.find((p) => p.id === mySocketId);
    const opponent = players.find((p) => p.id !== mySocketId);
    return {
      youReady: me?.ready ?? false,
      opponentReady: opponent?.ready ?? false,
      opponentJoined: !!opponent,
    };
  }, [players, mySocketId]);

  const bothReady = players.length === 2 && players.every((p) => p.ready);

  const handleReadyClick = () => {
    if (!roomId) return;
    socketRef.current?.emit("toggle_ready", roomId);
  };

  return (
    <div className="animate-waiting-section-in mx-auto w-full max-w-[960px]">
      <BattleStartCountdown roomId={roomId} active={battleStartActive} startAtMs={gameStartAtMs} endAtMs={gameEndAtMs} />

      <EnergyBorderCard
        className="w-full"
        innerClassName={
          compact
            ? "px-4 py-5 transition-shadow duration-300 md:px-8 md:py-6"
            : "px-6 py-10 transition-shadow duration-300 md:px-12 md:py-12"
        }
        durationSec={3.2}
      >
        <div
          className="pointer-events-none absolute inset-0 z-0 rounded-[calc(1rem-3px)] bg-linear-to-b from-[#facc15]/4 via-transparent to-[#8b5cf6]/6"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -right-24 top-0 z-0 h-64 w-64 rounded-full bg-[#8b5cf6]/10 blur-[80px]"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -left-16 bottom-0 z-0 h-48 w-48 rounded-full bg-[#facc15]/8 blur-[70px]"
          aria-hidden
        />

        <div
          className={
            compact
              ? "relative z-10 flex flex-col items-center gap-4 md:gap-5"
              : "relative z-10 flex flex-col items-center gap-10 md:gap-12"
          }
        >
          <header className={compact ? "flex max-w-lg flex-col items-center gap-1.5 text-center" : "flex max-w-lg flex-col items-center gap-3 text-center"}>
            <div className={compact ? "flex items-center justify-center gap-2" : "flex items-center justify-center gap-3"}>
              <HourglassIcon
                className={
                  compact
                    ? "h-5 w-5 shrink-0 text-[#facc15] drop-shadow-[0_0_14px_rgba(250,204,21,0.5)]"
                    : "h-6 w-6 shrink-0 text-[#facc15] drop-shadow-[0_0_14px_rgba(250,204,21,0.5)]"
                }
              />
              <h2
                className={
                  compact
                    ? "text-base font-semibold tracking-tight text-white md:text-lg"
                    : "text-lg font-semibold tracking-tight text-white md:text-xl"
                }
              >
                {!connected ? "Connecting…" : opponentJoined ? "Players in room" : "Waiting for another player…"}
              </h2>
            </div>
            <p className={compact ? "text-xs leading-snug text-slate-400 md:text-sm" : "text-sm leading-relaxed text-slate-400 md:text-[15px]"}>
              {!connected
                ? "Establishing real-time connection."
                : "The battle begins when both players are ready!"}
            </p>
          </header>

          <div
            className={
              compact
                ? "flex w-full max-w-[880px] flex-col items-stretch justify-center gap-3 md:flex-row md:gap-4"
                : "flex w-full max-w-[880px] flex-col items-stretch justify-center gap-6 md:flex-row md:gap-8"
            }
          >
            <div className="animate-waiting-stagger-a min-w-0 flex-1">
              <PlayerCard compact={compact} isYou isJoined={connected} isReady={youReady} name="You" />
            </div>
            <div className="animate-waiting-stagger-b min-w-0 flex-1">
              <PlayerCard
                compact={compact}
                isYou={false}
                isJoined={opponentJoined}
                isReady={opponentReady}
                name="Opponent"
              />
            </div>
          </div>

          {bothReady ? (
            <p
              className={
                compact
                  ? "text-center text-sm font-semibold tracking-tight text-emerald-300 drop-shadow-[0_0_12px_rgba(52,211,153,0.35)] md:text-base"
                  : "text-center text-base font-semibold tracking-tight text-emerald-300 drop-shadow-[0_0_12px_rgba(52,211,153,0.35)] md:text-lg"
              }
            >
              Both players ready 🚀
            </p>
          ) : null}

          <div className={compact ? "flex w-full max-w-md flex-col items-center gap-2" : "flex w-full max-w-md flex-col items-center gap-4"}>
            <ReadyButton
              compact={compact}
              ready={youReady}
              onToggle={handleReadyClick}
              showHelperText={false}
              disabled={!connected}
            />
            <p className="flex items-center gap-2 text-center text-xs text-slate-500">
              <ShieldIcon className="h-3.5 w-3.5 shrink-0 text-slate-500" />
              You can change your ready status anytime
            </p>
          </div>
        </div>
      </EnergyBorderCard>
    </div>
  );
}
