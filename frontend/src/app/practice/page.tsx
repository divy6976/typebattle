"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import NavBar from "../../../components/NavBar";
import ResultScreen, { type ResultScreenStats } from "../../../components/ResultScreen";
import StatsBar from "../../../components/StatsBar";
import TypingBox, {
  type TypingSessionResult,
  type TypingStats,
} from "../../../components/TypingBox";

export default function Page() {
  const router = useRouter();
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("easy");
  const [timeLimitSeconds, setTimeLimitSeconds] = useState(30);
  const [stats, setStats] = useState<TypingStats>({
    wpm: 0,
    accuracy: 100,
    mistakes: 0,
  });
  const [sessionKey, setSessionKey] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [resultStats, setResultStats] = useState<ResultScreenStats>({
    wpm: 0,
    accuracy: 100,
    timeSeconds: timeLimitSeconds,
    consistency: 0,
    totalTyped: 0,
    correct: 0,
    mistakes: 0,
  });

  const handleComplete = (result: TypingSessionResult) => {
    setStats({
      wpm: result.wpm,
      accuracy: result.accuracy,
      mistakes: result.mistakes,
    });
    setResultStats(result);
    setShowResult(true);
  };

  const handleRestart = () => {
    setShowResult(false);
    setStats({ wpm: 0, accuracy: 100, mistakes: 0 });
    setResultStats({
      wpm: 0,
      accuracy: 100,
      timeSeconds: timeLimitSeconds,
      consistency: 0,
      totalTyped: 0,
      correct: 0,
      mistakes: 0,
    });
    setSessionKey((k) => k + 1);
  };

  return (
    <div
      className={[
        "min-h-screen bg-[#0a0a0a] p-4",
        "font-mono",
        showResult ? "overflow-hidden" : "",
      ].join(" ")}
    >
      <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-5">
        <NavBar />

        <div className="flex flex-1 items-center justify-center">
          {showResult ? (
            <ResultScreen
              stats={resultStats}
              onRestart={handleRestart}
              onBackHome={() => router.push("/battle")}
            />
          ) : (
            <div className="w-full max-w-[980px]">
              <div className="mb-4 flex flex-wrap items-center gap-3">
                <label className="flex items-center gap-2 text-[13px] text-[#a7b2c7]">
                  <span className="font-semibold uppercase tracking-[0.14em]">Difficulty</span>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value as "easy" | "medium" | "hard")}
                    className="rounded-md border border-[#283246] bg-[#101621] px-2.5 py-1.5 text-[14px] text-[#e5e7eb] outline-none"
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </label>

                <label className="flex items-center gap-2 text-[13px] text-[#a7b2c7]">
                  <span className="font-semibold uppercase tracking-[0.14em]">Time</span>
                  <select
                    value={timeLimitSeconds}
                    onChange={(e) => setTimeLimitSeconds(Number(e.target.value))}
                    className="rounded-md border border-[#283246] bg-[#101621] px-2.5 py-1.5 text-[14px] text-[#e5e7eb] outline-none"
                  >
                    <option value={30}>30s</option>
                    <option value={60}>60s</option>
                    <option value={120}>120s</option>
                  </select>
                </label>
              </div>
              <TypingBox
                key={`${sessionKey}-${difficulty}-${timeLimitSeconds}`}
                difficulty={difficulty}
                timeLimitSeconds={timeLimitSeconds}
                onStatsChange={setStats}
                onComplete={handleComplete}
              />
              <div className="mt-6">
                <StatsBar
                  wpm={stats.wpm}
                  accuracy={stats.accuracy}
                  mistakes={stats.mistakes}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}