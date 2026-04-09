'use client';

import { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { io, type Socket } from "socket.io-client";
import { getApiBaseUrl } from "../../../../../lib/apiBase";

const SOCKET_URL = getApiBaseUrl();
const TOTAL_TARGET_CHARS = 1000;
const DEFAULT_GAME_DURATION_SEC = 60;

type GameStats = {
  totalTypedChars: number;
  totalCorrectChars: number;
  totalWordsTyped: number;
  startTime: number | null;
};

type PlayerFinalStats = {
  correctChars: number;
  mistakes: number;
  totalTypedChars: number;
  accuracy: number;
  wpm: number;
  progress: number;
};

type GameOverPayload = {
  player1: { id: string; stats: PlayerFinalStats } | null;
  player2: { id: string; stats: PlayerFinalStats } | null;
  winnerId: string | null;
};

type PlayerStatusCardProps = {
  label: "You" | "Opponent";
  accent: "yellow" | "purple";
  wpm: number;
};

function PlayerStatusCard({ label, accent, wpm }: PlayerStatusCardProps) {
  const isYou = label === "You";
  const ringColor =
    accent === "yellow"
      ? "ring-[#facc15]/80 shadow-[0_0_30px_rgba(250,204,21,0.6)]"
      : "ring-[#a855f7]/80 shadow-[0_0_30px_rgba(168,85,247,0.6)]";
  const avatarBg = accent === "yellow" ? "bg-[#0f172a]" : "bg-[#0b1020]";

  return (
    <div className="relative flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-3 py-2.5 backdrop-blur-xl shadow-[0_16px_40px_rgba(0,0,0,0.7)] md:px-4 md:py-3">
      <div
        className={[
          "relative grid h-11 w-11 place-items-center rounded-full md:h-12 md:w-12",
          avatarBg,
          "ring-2",
          ringColor,
          "transition-transform duration-500 will-change-transform animate-avatar-float",
        ].join(" ")}
      >
        <div className="grid h-7 w-7 place-items-center rounded-full bg-black/70 text-xs font-bold text-slate-100 md:h-8 md:w-8">
          {isYou ? "YOU" : "VS"}
        </div>
      </div>

      <div className="flex flex-col">
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
            {label}
          </span>
        </div>
        <p className="mt-0.5 text-sm font-semibold text-slate-100 md:text-base">
          <span className={accent === "yellow" ? "text-[#facc15]" : "text-[#a855f7]"}>
            {wpm}
          </span>{" "}
          <span className="text-xs font-medium text-slate-400">WPM</span>
        </p>
      </div>
    </div>
  );
}

type TimerProps = {
  secondsLeft: number;
};

function Timer({ secondsLeft }: TimerProps) {
  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const ss = String(secondsLeft % 60).padStart(2, "0");
  const display = `${mm}:${ss}`;

  return (
    <div className="relative flex flex-col items-center justify-center rounded-2xl border border-yellow-400/40 bg-linear-to-b from-white/10 via-white/5 to-transparent px-6 py-2.5 text-center shadow-[0_0_40px_rgba(250,204,21,0.3)] backdrop-blur-xl md:px-7 md:py-3">
      <span className="text-[10px] font-semibold uppercase tracking-[0.28em] text-slate-400">
        TIME LEFT
      </span>
      <div className="mt-1 flex items-baseline gap-1">
        <span className="battle-countdown-gradient battle-countdown-glow font-mono text-2xl font-black tracking-tight md:text-3xl">
          {display}
        </span>
      </div>
    </div>
  );
}

type ProgressBarProps = {
  youProgress: number;
  oppProgress: number;
};

function ProgressBar({ youProgress, oppProgress }: ProgressBarProps) {
  const clampedYou = Math.max(0, Math.min(100, youProgress));
  const clampedOpp = Math.max(0, Math.min(100, oppProgress));

  return (
    <div className="mt-4 flex w-full flex-col items-center gap-2 md:mt-5">
      <div className="flex w-full max-w-3xl items-center justify-between text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400 md:text-xs">
        <span className="text-[#facc15]">You {Math.round(clampedYou)}%</span>
        <span className="text-center text-[13px] font-mono text-slate-400 md:text-sm">Battle Progress</span>
        <span className="text-[#a855f7]">Opponent {Math.round(clampedOpp)}%</span>
      </div>

      <div className="relative w-full max-w-3xl overflow-hidden rounded-full border border-white/10 bg-black/60 shadow-[0_0_40px_rgba(0,0,0,0.9)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,rgba(250,204,21,0.12),transparent_50%),radial-gradient(circle_at_100%_0%,rgba(168,85,247,0.12),transparent_55%)]" />
        <div className="relative flex h-3.5 w-full overflow-hidden md:h-4">
          <div
              className="relative h-full origin-left bg-linear-to-r from-[#facc15] via-[#fbbf24] to-[#fb923c] shadow-[0_0_22px_rgba(250,204,21,0.7)] transition-[width] duration-400 ease-out"
            style={{ width: `${clampedYou}%` }}
          />
          <div
              className="relative h-full origin-right bg-linear-to-l from-[#a855f7] via-[#8b5cf6] to-[#6366f1] shadow-[0_0_22px_rgba(168,85,247,0.7)] transition-[width] duration-400 ease-out"
            style={{ width: `${clampedOpp}%` }}
          />
        </div>
      </div>

      <div className="mt-1 flex items-center gap-1 text-xs font-semibold tracking-[0.3em] text-slate-500">
        <span className="text-[#facc15]">⚔</span>
        <span>VS</span>
      </div>
    </div>
  );
}

type TypingTextProps = {
  words: string[];
  currentWordIndex: number;
  typedWord: string;
  typedWords: string[];
  secondsLeft: number;
  transitionPhase: "in" | "out";
};

function TypingText({
  words,
  currentWordIndex,
  typedWord,
  typedWords,
  secondsLeft,
  transitionPhase,
}: TypingTextProps) {
  const expectedWord = words[currentWordIndex] ?? "";
  const expectedChars = Array.from(expectedWord);
  const typedChars = Array.from(typedWord);

  const typedLen = typedChars.length;
  const expectedLen = expectedChars.length;
  const maxLen = Math.max(expectedLen, typedLen);

  const caretVisible = secondsLeft > 0 && currentWordIndex < words.length;

  const normalize = (s: string) => s.toLowerCase();

  const renderExpectedWordTypedChars = () => {
    const nodes: any[] = [];

    for (let i = 0; i <= maxLen; i++) {
      // Insert caret at the next typed position
      if (i === typedLen && caretVisible) {
        nodes.push(
          <span
            key="caret"
            className="inline-block h-[1.1em] w-[2px] translate-y-[0.08em] animate-battle-caret bg-[#facc15] shadow-[0_0_18px_rgba(250,204,21,0.9)]"
          />,
        );
      }

      // Render expected chars first (white/unrevealed + green/red typed)
      if (i < expectedLen) {
        const expectedChar = expectedChars[i];
        const typedChar = i < typedLen ? typedChars[i] : null;

        const color =
          typedChar == null
            ? "text-white"
            : normalize(typedChar) === normalize(expectedChar)
              ? "text-[#34d399] drop-shadow-[0_0_14px_rgba(52,211,153,0.65)]"
              : "text-[#fb7185] drop-shadow-[0_0_14px_rgba(248,113,113,0.55)]";

        nodes.push(
          <span key={`c${i}`} className={color}>
            {expectedChar}
          </span>,
        );
        continue;
      }

      // If user typed beyond expected length, show extra chars in red
      if (i < typedLen && i >= expectedLen) {
        nodes.push(
          <span key={`x${i}`} className="text-[#fb7185] drop-shadow-[0_0_14px_rgba(248,113,113,0.55)]">
            {typedChars[i]}
          </span>,
        );
      }
    }

    return nodes;
  };

  const renderCommittedWordChars = (word: string, committedTypedWord: string) => {
    const expectedChars = Array.from(word);
    const typedChars = Array.from(committedTypedWord);

    const nodes: any[] = [];
    const maxLen = Math.max(expectedChars.length, typedChars.length);
    for (let i = 0; i < maxLen; i++) {
      const expectedChar = expectedChars[i];
      const typedChar = i < typedChars.length ? typedChars[i] : null;

      // Extra typed chars beyond expected word length -> show as red.
      if (expectedChar == null) {
        if (typedChar == null) return nodes;
        nodes.push(
          <span
            key={`${word}-x-${i}`}
            className="text-[#fb7185] drop-shadow-[0_0_14px_rgba(248,113,113,0.55)]"
          >
            {typedChar}
          </span>,
        );
        continue;
      }

      const className =
        typedChar == null
          ? "text-white"
          : normalize(typedChar) === normalize(expectedChar)
            ? "text-[#34d399] drop-shadow-[0_0_14px_rgba(52,211,153,0.65)]"
            : "text-[#fb7185] drop-shadow-[0_0_14px_rgba(248,113,113,0.55)]";

      nodes.push(
        <span key={`${word}-${i}`} className={className}>
          {expectedChar}
        </span>,
      );
    }

    return nodes;
  };

  return (
    <div className="relative mx-auto mt-8 w-full max-w-3xl rounded-3xl border border-white/15 bg-white/10 px-6 pt-8 pb-16 font-mono text-lg text-slate-100 shadow-[0_24px_80px_rgba(0,0,0,0.95)] backdrop-blur-2xl h-[260px] overflow-hidden md:px-10 md:pt-12 md:pb-20 md:text-2xl">
      <div className="pointer-events-none absolute inset-0 rounded-3xl bg-[radial-gradient(circle_at_10%_0%,rgba(250,204,21,0.12),transparent_45%),radial-gradient(circle_at_90%_90%,rgba(168,85,247,0.18),transparent_55%)]" />
      <div className="pointer-events-none absolute inset-6 rounded-2xl border border-white/5" />

      <div
        className={[
          "relative z-10 flex min-w-0 flex-wrap whitespace-pre-wrap wrap-break-word text-left leading-relaxed tracking-wide transition-all duration-100 ease-out transform-gpu will-change-contents",
          transitionPhase === "out" ? "opacity-0" : "opacity-100",
        ].join(" ")}
      >
        {words.length === 0 ? (
          <p className="text-center text-sm text-slate-400 md:text-base">
            Waiting for shared paragraph from server...
          </p>
        ) : null}
        {words.map((word, idx) => {
          const isCompleted = idx < currentWordIndex;
          const isCurrent = idx === currentWordIndex;

          if (isCompleted) {
            return (
              <span key={idx} className="mr-2 text-white">
                {renderCommittedWordChars(word, typedWords[idx] ?? "")}
              </span>
            );
          }

          if (isCurrent) {
            return (
              <span key={idx} className="relative mr-2 text-white">
                <span className="relative z-10 underline decoration-white/20 decoration-2 underline-offset-4">
                  <span className="inline-block">{renderExpectedWordTypedChars()}</span>
                </span>
              </span>
            );
          }

          return (
            <span key={idx} className="mr-2 text-white">
              {word}
            </span>
          );
        })}
      </div>

      <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between text-[11px] text-slate-300/90 md:bottom-8 md:left-10 md:right-10 md:text-xs">
        <span>Type word by word. Space = next word.</span>
        <span className="hidden md:inline">No input box – just start typing.</span>
      </div>
    </div>
  );
}

function splitWords(text: string) {
  return text.trim().split(/\s+/g).filter(Boolean);
}

function getWordStats(expectedWord: string, typed: string) {
  const normalize = (s: string) => s.toLowerCase();
  const expectedChars = Array.from(expectedWord ?? "");
  const typedChars = Array.from(typed ?? "");
  const len = Math.min(expectedChars.length, typedChars.length);
  let correctChars = 0;
  for (let i = 0; i < len; i++) {
    if (normalize(typedChars[i]) === normalize(expectedChars[i])) correctChars++;
  }
  return {
    typedChars: typedChars.length,
    correctChars,
  };
}

export default function BattlePlayPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const roomIdRaw = typeof params?.roomId === "string" ? params.roomId : "";
  const startAtParam = searchParams.get("startAt");
  const endAtParam = searchParams.get("endAt");
  const difficultyParam = searchParams.get("difficulty");
  const timeLimitParam = searchParams.get("timeLimit");
  const parsedStartAt = startAtParam ? Number(startAtParam) : NaN;
  const parsedEndAt = endAtParam ? Number(endAtParam) : NaN;
  const parsedTimeLimit = timeLimitParam ? Number(timeLimitParam) : NaN;
  const roomDifficulty =
    difficultyParam === "easy" || difficultyParam === "medium" || difficultyParam === "hard"
      ? difficultyParam
      : null;
  const roomTimeLimitSec = [30, 45, 60, 120].includes(parsedTimeLimit) ? parsedTimeLimit : null;
  const serverStartAtMs =
    Number.isFinite(parsedStartAt) && parsedStartAt > 0 ? parsedStartAt : null;
  const serverEndAtMs =
    Number.isFinite(parsedEndAt) && parsedEndAt > 0 ? parsedEndAt : null;
  const initialDurationSec =
    serverStartAtMs != null && serverEndAtMs != null
      ? Math.max(1, Math.ceil((serverEndAtMs - serverStartAtMs) / 1000))
      : DEFAULT_GAME_DURATION_SEC;

  const [secondsLeft, setSecondsLeft] = useState(initialDurationSec);
  const [startTimeMs, setStartTimeMs] = useState<number | null>(null);
  const [gameStarted, setGameStarted] = useState(serverStartAtMs == null);

  const socketRef = useRef<Socket | null>(null);
  const didNavigateToResultRef = useRef(false);
  const didRequestFinalizeRef = useRef(false);
  const finalizeFallbackTimerRef = useRef<number | null>(null);
  const [opponentWpm, setOpponentWpm] = useState(0);
  const [opponentProgress, setOpponentProgress] = useState(0);

  const [paragraph, setParagraph] = useState<string>("");
  const [words, setWords] = useState<string[]>([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [typedWord, setTypedWord] = useState("");
  const [typedWords, setTypedWords] = useState<string[]>([]);
  const [transitionPhase, setTransitionPhase] = useState<"in" | "out">("in");
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [gameStats, setGameStats] = useState<GameStats>({
    totalTypedChars: 0,
    totalCorrectChars: 0,
    totalWordsTyped: 0,
    startTime: null,
  });

  const currentWordLiveStats = useMemo(() => {
    return getWordStats(words[currentWordIndex] ?? "", typedWord);
  }, [words, currentWordIndex, typedWord]);

  const liveTotalTypedChars = gameStats.totalTypedChars + typedWord.length;
  const liveTotalCorrectChars = gameStats.totalCorrectChars + currentWordLiveStats.correctChars;
  const liveMistakes = Math.max(0, liveTotalTypedChars - liveTotalCorrectChars);
  const liveAccuracy = liveTotalTypedChars > 0 ? Math.round((liveTotalCorrectChars / liveTotalTypedChars) * 100) : 0;

  const youProgress = useMemo(() => {
    return Math.max(0, Math.min(100, (liveTotalCorrectChars / TOTAL_TARGET_CHARS) * 100));
  }, [liveTotalCorrectChars]);

  const youWpm = useMemo(() => {
    if (secondsLeft <= 0) return 0;
    const gameStartTime = gameStats.startTime ?? startTimeMs;
    if (gameStartTime == null) return 0;

    const elapsedMs = Date.now() - gameStartTime;
    if (elapsedMs <= 0) return 0;
    const minutes = elapsedMs / 60000;
    const wpm = (liveTotalCorrectChars / 5) / minutes;
    if (!Number.isFinite(wpm) || wpm < 0) return 0;
    return Math.round(wpm);
  }, [liveTotalCorrectChars, secondsLeft, startTimeMs, gameStats.startTime]);

  const preStartSeconds = useMemo(() => {
    if (serverStartAtMs == null || gameStarted) return 0;
    const diff = Math.max(0, serverStartAtMs - Date.now());
    return Math.ceil(diff / 1000);
  }, [serverStartAtMs, gameStarted]);

  // Socket connection for real-time opponent stats
  useEffect(() => {
    if (!roomIdRaw) return;

    const socket = io(SOCKET_URL, { transports: ["websocket", "polling"] });
    socketRef.current = socket;

    socket.on("connect", () => {
      if (roomDifficulty && roomTimeLimitSec) {
        socket.emit("join_room", {
          roomId: roomIdRaw,
          settings: { difficulty: roomDifficulty, timeLimitSec: roomTimeLimitSec },
        });
      } else {
        socket.emit("join_room", { roomId: roomIdRaw });
      }
      socket.emit("get_room_state", roomIdRaw);
    });

    socket.on("disconnect", () => {
      // keep last opponent values; they'll resume when reconnected
    });

    socket.on("room_paragraph", (data: { paragraph?: string }) => {
      const next = typeof data?.paragraph === "string" ? data.paragraph : "";
      if (!next) return;
      setParagraph((prev) => {
        if (prev === next) return prev;
        return next;
      });
    });

    socket.on("new-paragraph", (data: { paragraph?: string }) => {
      const next = typeof data?.paragraph === "string" ? data.paragraph : "";
      if (!next) return;
      setParagraph((prev) => {
        if (prev === next) return prev;
        return next;
      });
    });

    socket.on("opponent-update", (data: { wpm?: number; progress?: number }) => {
      if (!data || typeof data !== "object") return;
      if (typeof data.wpm === "number" && Number.isFinite(data.wpm)) setOpponentWpm(Math.max(0, Math.round(data.wpm)));
      if (typeof data.progress === "number" && Number.isFinite(data.progress))
        setOpponentProgress(Math.max(0, Math.min(100, data.progress)));
    });

    socket.on("game_over", (payload: GameOverPayload) => {
      if (!payload || typeof payload !== "object") return;
      setIsGameOver(true);
      if (finalizeFallbackTimerRef.current != null) {
        window.clearTimeout(finalizeFallbackTimerRef.current);
        finalizeFallbackTimerRef.current = null;
      }

      const youWin = payload.winnerId === socket.id;
      if (typeof window !== "undefined") {
        window.sessionStorage.setItem(
          `battle_result_${roomIdRaw}`,
          JSON.stringify({
            ...payload,
            youWin,
            mySocketId: socket.id,
          }),
        );
      }

      if (!didNavigateToResultRef.current) {
        didNavigateToResultRef.current = true;
        router.push(`/battle/result/${roomIdRaw}`);
      }
    });

    return () => {
      if (finalizeFallbackTimerRef.current != null) {
        window.clearTimeout(finalizeFallbackTimerRef.current);
        finalizeFallbackTimerRef.current = null;
      }
      socket.disconnect();
      socketRef.current = null;
    };
  }, [roomIdRaw, router, roomDifficulty, roomTimeLimitSec]);

  // When timer hits zero, ask backend to finalize so winner is always server-authoritative.
  useEffect(() => {
    if (!gameStarted) return;
    if (secondsLeft > 0) return;
    if (didNavigateToResultRef.current || didRequestFinalizeRef.current) return;

    didRequestFinalizeRef.current = true;
    setIsGameOver(true);

    const socket = socketRef.current;
    const navigateWithFallbackResult = () => {
      if (didNavigateToResultRef.current) return;
      if (typeof window !== "undefined" && roomIdRaw) {
        const socketId = socket?.id ?? "local";
        const estimatedOpponentCorrectChars = Math.max(
          0,
          Math.round((opponentProgress / 100) * TOTAL_TARGET_CHARS),
        );
        const myScore =
          youProgress * 1000 + liveTotalCorrectChars * 10 + youWpm;
        const opponentScore =
          opponentProgress * 1000 + estimatedOpponentCorrectChars * 10 + opponentWpm;
        const estimatedWinnerId = myScore >= opponentScore ? socketId : "opponent";
        window.sessionStorage.setItem(
          `battle_result_${roomIdRaw}`,
          JSON.stringify({
            player1: {
              id: socketId,
              stats: {
                correctChars: liveTotalCorrectChars,
                mistakes: liveMistakes,
                totalTypedChars: liveTotalTypedChars,
                accuracy: liveAccuracy,
                wpm: youWpm,
                progress: youProgress,
              },
            },
            player2: {
              id: "opponent",
              stats: {
                correctChars: estimatedOpponentCorrectChars,
                mistakes: 0,
                totalTypedChars: estimatedOpponentCorrectChars,
                accuracy: 0,
                wpm: opponentWpm,
                progress: opponentProgress,
              },
            },
            winnerId: estimatedWinnerId,
            mySocketId: socketId,
          }),
        );
      }
      didNavigateToResultRef.current = true;
      router.push(`/battle/result/${roomIdRaw}`);
    };

    if (socket?.connected) {
      // Push one final progress snapshot before forcing finalize.
      socket.emit("progress-update", {
        roomId: roomIdRaw,
        stats: {
          correctChars: liveTotalCorrectChars,
          mistakes: liveMistakes,
          totalTypedChars: liveTotalTypedChars,
          accuracy: liveAccuracy,
          wpm: youWpm,
          progress: youProgress,
        },
      });
      socket.emit("finalize-game", { roomId: roomIdRaw });
      // If backend game_over is missed for any reason, do not leave user stuck on 00:00.
      finalizeFallbackTimerRef.current = window.setTimeout(() => {
        navigateWithFallbackResult();
      }, 2500);
      return;
    }

    // Last-resort offline fallback: navigate without forcing local winner.
    navigateWithFallbackResult();
  }, [
    gameStarted,
    secondsLeft,
    roomIdRaw,
    router,
    liveTotalCorrectChars,
    liveMistakes,
    liveTotalTypedChars,
    liveAccuracy,
    youWpm,
    youProgress,
    opponentWpm,
    opponentProgress,
  ]);

  // Apply server paragraph (single source of truth)
  useEffect(() => {
    if (!paragraph) return;
    const nextWords = splitWords(paragraph);
    setWords(nextWords);
    setCurrentWordIndex(0);
    setTypedWord("");
    setTypedWords([]);
    setTransitionPhase("in");
  }, [paragraph]);

  // Sync actual race start from server-provided start timestamp.
  useEffect(() => {
    if (serverStartAtMs == null) return;

    const tryStart = () => {
      if (Date.now() < serverStartAtMs) return false;
      setStartTimeMs(serverStartAtMs);
      setGameStats((prev) => (prev.startTime == null ? { ...prev, startTime: serverStartAtMs } : prev));
      setGameStarted(true);
      return true;
    };

    if (tryStart()) return;

    const id = window.setInterval(() => {
      if (tryStart()) window.clearInterval(id);
    }, 50);

    return () => window.clearInterval(id);
  }, [serverStartAtMs]);

  // Emit my live stats to opponent (throttled for smoother local typing)
  useEffect(() => {
    if (isGameOver) return;
    if (!roomIdRaw) return;
    const socket = socketRef.current;
    if (!socket?.connected) return;
    const timeoutId = window.setTimeout(() => {
      socket.emit("progress-update", {
        roomId: roomIdRaw,
        stats: {
          correctChars: liveTotalCorrectChars,
          mistakes: liveMistakes,
          totalTypedChars: liveTotalTypedChars,
          accuracy: liveAccuracy,
          wpm: youWpm,
          progress: youProgress,
        },
      });
    }, 70);

    return () => window.clearTimeout(timeoutId);
  }, [
    roomIdRaw,
    isGameOver,
    youProgress,
    youWpm,
    liveTotalCorrectChars,
    liveMistakes,
    liveTotalTypedChars,
    liveAccuracy,
    typedWord,
    currentWordIndex,
  ]);

  useEffect(() => {
    if (!gameStarted) return;
    if (startTimeMs == null) return;
    const id = window.setInterval(() => {
      const remaining = serverEndAtMs != null
        ? Math.max(0, Math.ceil((serverEndAtMs - Date.now()) / 1000))
        : Math.max(0, initialDurationSec - Math.floor((Date.now() - startTimeMs) / 1000));
      setSecondsLeft(remaining);
    }, 200);
    return () => window.clearInterval(id);
  }, [gameStarted, startTimeMs, serverEndAtMs, initialDurationSec]);

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (!gameStarted) return;
      if (isGameOver) return;
      if (isTransitioning) return;
      if (words.length === 0) return;

      const key = event.key;
      const commitCurrentWord = (committedWord: string) => {
        const expected = words[currentWordIndex] ?? "";
        if (!expected) return;
        if (committedWord.length < expected.length) return;

        const isLastWord = currentWordIndex >= words.length - 1;
        const nextWordIndex = currentWordIndex + 1;

        // Commit current word typed characters for character-level validation in renderer
        setTypedWords((prev) => {
          const next = [...prev];
          next[currentWordIndex] = committedWord;
          return next;
        });
        const committedStats = getWordStats(expected, committedWord);
        setGameStats((prev) => ({
          ...prev,
          totalTypedChars: prev.totalTypedChars + committedStats.typedChars,
          totalCorrectChars: prev.totalCorrectChars + committedStats.correctChars,
          totalWordsTyped: prev.totalWordsTyped + 1,
        }));

        // If last word completed and time remains: request shared next paragraph from server.
        if (isLastWord) {
          if (secondsLeft > 0) {
            setCurrentWordIndex(0);
            setTypedWord("");
            setTypedWords([]);
            setTransitionPhase("out");
            setIsTransitioning(true);
            const socket = socketRef.current;
            if (socket?.connected) {
              socket.emit("request-new-paragraph", { roomId: roomIdRaw });
            }
            window.setTimeout(() => {
              setTransitionPhase("in");
              setIsTransitioning(false);
            }, 90);
          }
          return;
        }

        // Not last word: move forward
        setCurrentWordIndex((_) => (nextWordIndex < words.length ? nextWordIndex : currentWordIndex));
        setTypedWord("");
      };

      // Backspace: edit current word, or navigate to previous word when empty
      if (key === "Backspace") {
        event.preventDefault();
        setTypedWord((prev) => {
          // If there is content in the current word, just delete last char
          if (prev.length > 0) {
            return prev.slice(0, -1);
          }

          // If we're at the first word already, nothing to navigate to
          if (currentWordIndex === 0) {
            return prev;
          }

          // Move back to previous word and load its typed content
          const previousIndex = currentWordIndex - 1;
          const previousTyped = typedWords[previousIndex] ?? "";
          const previousExpected = words[previousIndex] ?? "";
          const previousStats = getWordStats(previousExpected, previousTyped);

          setCurrentWordIndex(previousIndex);
          setTypedWords((prev) => {
            const next = [...prev];
            next[previousIndex] = "";
            return next;
          });
          setGameStats((prev) => ({
            ...prev,
            totalTypedChars: Math.max(0, prev.totalTypedChars - previousStats.typedChars),
            totalCorrectChars: Math.max(0, prev.totalCorrectChars - previousStats.correctChars),
            totalWordsTyped: Math.max(0, prev.totalWordsTyped - 1),
          }));

          // Cursor logically goes to end of that word because we set full value here
          return previousTyped;
        });
        return;
      }

      // Space commits the current word and moves to the next word
      if (key === " ") {
        if (!typedWord) return;
        event.preventDefault();
        commitCurrentWord(typedWord);
        return;
      }

      // Ignore other control keys
      if (key === "Enter" || key === "Shift" || key === "Control" || key === "Alt" || key === "Meta" || key === "Tab")
        return;

      // Accept normal single character typing (ASCII-friendly; we keep whatever the user types).
      if (key.length === 1) {
        event.preventDefault();
        if (startTimeMs == null) {
          const now = Date.now();
          setStartTimeMs(now);
          setGameStats((prev) => (prev.startTime == null ? { ...prev, startTime: now } : prev));
          setGameStarted(true);
        }
        const nextTyped = `${typedWord}${key.toLowerCase()}`;
        const expected = words[currentWordIndex] ?? "";
        const isLastWord = currentWordIndex >= words.length - 1;
        if (isLastWord && expected && nextTyped.length >= expected.length) {
          commitCurrentWord(nextTyped);
          return;
        }
        setTypedWord(nextTyped);
        return;
      }

    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [
    isGameOver,
    typedWord,
    words,
    currentWordIndex,
    startTimeMs,
    typedWords,
    gameStarted,
    isTransitioning,
    roomIdRaw,
    secondsLeft,
  ]);

  return (
    <main className="relative flex min-h-dvh flex-col items-center justify-start overflow-hidden bg-[radial-gradient(circle_at_20%_0%,rgba(250,204,21,0.12),transparent_55%),radial-gradient(circle_at_80%_0%,rgba(168,85,247,0.2),transparent_55%),#020617] px-4 py-4 font-sans text-slate-100 md:px-8 md:py-6">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_80%,rgba(250,204,21,0.12),transparent_60%),radial-gradient(circle_at_90%_85%,rgba(88,28,135,0.4),transparent_55%)] opacity-80" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_0%,rgba(250,250,250,0.12),transparent_55%),radial-gradient(circle_at_70%_100%,rgba(15,23,42,0.7),transparent_60%)] mix-blend-screen opacity-40" />
      <div className="pointer-events-none animate-battle-particles absolute inset-0" aria-hidden />

      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col gap-4 md:gap-6">
        <header className="flex flex-col items-stretch justify-between gap-3 rounded-3xl border border-white/10 bg-black/40 px-3 py-3 font-mono shadow-[0_18px_60px_rgba(0,0,0,0.9)] backdrop-blur-2xl md:flex-row md:items-center md:px-5 md:py-4">
          <div className="flex flex-1 justify-start">
            <PlayerStatusCard label="You" accent="yellow" wpm={youWpm} />
          </div>

          <div className="mt-1 flex flex-1 justify-center md:mt-0">
            <Timer secondsLeft={secondsLeft} />
          </div>

          <div className="mt-1 flex flex-1 justify-end md:mt-0">
            <PlayerStatusCard label="Opponent" accent="purple" wpm={opponentWpm} />
          </div>
        </header>

        <ProgressBar youProgress={youProgress || 0} oppProgress={opponentProgress || 0} />

        <section className="mt-2 flex flex-1 items-center justify-center pb-6 md:pb-8">
          <TypingText
            words={words}
            currentWordIndex={currentWordIndex}
            typedWord={typedWord}
            typedWords={typedWords}
            secondsLeft={secondsLeft}
            transitionPhase={transitionPhase}
          />
        </section>

        <footer className="mb-2 flex items-center justify-between text-[11px] text-slate-500 md:text-xs">
          <span>Room: {roomIdRaw.toUpperCase()}</span>
          <span className="hidden md:inline">
            {gameStarted
              ? "Designed for premium, real-time typing battles."
              : `Match starts in ${preStartSeconds}s`}
          </span>
        </footer>
      </div>
    </main>
  );
}
