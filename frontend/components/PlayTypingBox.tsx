"use client";

import type { ReactNode } from "react";

type PlayTypingBoxProps = {
  words: string[];
  currentWordIndex: number;
  typedWord: string;
  typedWords: string[];
  secondsLeft: number;
  transitionPhase: "in" | "out";
};

export default function PlayTypingBox({
  words,
  currentWordIndex,
  typedWord,
  typedWords,
  secondsLeft,
  transitionPhase,
}: PlayTypingBoxProps) {
  const expectedWord = words[currentWordIndex] ?? "";
  const expectedChars = Array.from(expectedWord);
  const typedChars = Array.from(typedWord);
  const maxLen = Math.max(expectedChars.length, typedChars.length);
  const caretVisible = secondsLeft > 0 && currentWordIndex < words.length;

  const normalize = (s: string) => s.toLowerCase();

  const renderExpectedWordTypedChars = () => {
    const nodes: ReactNode[] = [];

    for (let i = 0; i <= maxLen; i += 1) {
      if (i === typedChars.length && caretVisible) {
        nodes.push(
          <span
            key="caret"
            className="inline-block h-[1.1em] w-[2px] translate-y-[0.08em] bg-[#facc15] shadow-[0_0_18px_rgba(250,204,21,0.9)]"
          />
        );
      }

      if (i < expectedChars.length) {
        const expectedChar = expectedChars[i];
        const typedChar = i < typedChars.length ? typedChars[i] : null;
        const color =
          typedChar == null
            ? "text-white"
            : normalize(typedChar) === normalize(expectedChar)
              ? "text-[#34d399] drop-shadow-[0_0_14px_rgba(52,211,153,0.65)]"
              : "text-[#fb7185] drop-shadow-[0_0_14px_rgba(248,113,113,0.55)]";
        nodes.push(
          <span key={`c-${i}`} className={color}>
            {expectedChar}
          </span>
        );
        continue;
      }

      if (i < typedChars.length && i >= expectedChars.length) {
        nodes.push(
          <span key={`x-${i}`} className="text-[#fb7185] drop-shadow-[0_0_14px_rgba(248,113,113,0.55)]">
            {typedChars[i]}
          </span>
        );
      }
    }

    return nodes;
  };

  const renderCommittedWordChars = (word: string, committedTypedWord: string) => {
    const expected = Array.from(word);
    const typed = Array.from(committedTypedWord);
    const nodes: ReactNode[] = [];
    const max = Math.max(expected.length, typed.length);

    for (let i = 0; i < max; i += 1) {
      const expectedChar = expected[i];
      const typedChar = i < typed.length ? typed[i] : null;

      if (expectedChar == null) {
        if (typedChar == null) continue;
        nodes.push(
          <span key={`${word}-x-${i}`} className="text-[#fb7185] drop-shadow-[0_0_14px_rgba(248,113,113,0.55)]">
            {typedChar}
          </span>
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
        </span>
      );
    }

    return nodes;
  };

  return (
    <div className="relative mx-auto w-full max-w-3xl rounded-3xl border border-white/15 bg-white/10 px-6 pt-8 pb-16 font-mono text-lg text-slate-100 shadow-[0_24px_80px_rgba(0,0,0,0.95)] backdrop-blur-2xl h-[260px] overflow-hidden md:px-10 md:pt-12 md:pb-20 md:text-2xl">
      <div className="pointer-events-none absolute inset-0 rounded-3xl bg-[radial-gradient(circle_at_10%_0%,rgba(250,204,21,0.12),transparent_45%),radial-gradient(circle_at_90%_90%,rgba(168,85,247,0.18),transparent_55%)]" />
      <div className="pointer-events-none absolute inset-6 rounded-2xl border border-white/5" />
      <div
        className={[
          "relative z-10 flex min-w-0 flex-wrap whitespace-pre-wrap wrap-break-word text-left leading-relaxed tracking-wide transition-all duration-100 ease-out transform-gpu will-change-contents",
          transitionPhase === "out" ? "opacity-0" : "opacity-100",
        ].join(" ")}
      >
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
        <span className="hidden md:inline">No input box - just start typing.</span>
      </div>
    </div>
  );
}
