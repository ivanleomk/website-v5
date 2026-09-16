"use client";

import { useEffect, useState } from "react";
import { useInViewPlayback } from "./use-in-view-playback";

type ReasoningSampleProps = {
  problem: string;
  thoughts: string[];
  answer: string;
  source?: string;
  loop?: boolean;
};

function nextCharDelay(char: string) {
  if (/[.!?]/.test(char)) return 160;
  if (/[,;:]/.test(char)) return 90;
  if (char === " ") return 24;
  return 12 + Math.random() * 12;
}

export default function ReasoningSample({
  problem,
  thoughts,
  answer,
  source,
  loop = true,
}: ReasoningSampleProps) {
  const { rootRef, phase } = useInViewPlayback();
  const [thoughtIndex, setThoughtIndex] = useState(thoughts.length);
  const [typed, setTyped] = useState(thoughts.at(-1) ?? "");
  const [showAnswer, setShowAnswer] = useState(true);

  useEffect(() => {
    if (phase === "static") {
      setThoughtIndex(thoughts.length);
      setTyped(thoughts.at(-1) ?? "");
      setShowAnswer(true);
      return;
    }

    if (phase !== "playing") return;

    let currentThought = 0;
    let currentChar = 0;
    let timeout = 0;
    let cancelled = false;

    const setThought = (index: number, text: string) => {
      setThoughtIndex(index);
      setTyped(text);
    };

    const tick = () => {
      if (cancelled) return;

      if (currentThought >= thoughts.length) {
        setShowAnswer(true);
        if (!loop) return;
        timeout = window.setTimeout(() => {
          if (cancelled) return;
          currentThought = 0;
          currentChar = 0;
          setShowAnswer(false);
          setThought(0, "");
          timeout = window.setTimeout(tick, 280);
        }, 2200);
        return;
      }

      const thought = thoughts[currentThought];
      if (currentChar >= thought.length) {
        currentThought += 1;
        currentChar = 0;
        setThought(currentThought, "");
        timeout = window.setTimeout(tick, 220);
        return;
      }

      const char = thought[currentChar];
      currentChar += 1;
      setThought(currentThought, thought.slice(0, currentChar));
      timeout = window.setTimeout(tick, nextCharDelay(char));
    };

    currentThought = 0;
    currentChar = 0;
    setShowAnswer(false);
    setThought(0, "");
    timeout = window.setTimeout(tick, 320);

    return () => {
      cancelled = true;
      window.clearTimeout(timeout);
    };
  }, [phase, thoughts, loop]);

  const thinking = phase !== "static" && !showAnswer;

  return (
    <figure
      ref={rootRef}
      className="my-8 not-prose mx-auto w-[88%] max-w-[36rem]"
      aria-label={`${source ? `${source}. ` : ""}${problem} ${thoughts.join(" ")} ${answer}`}
    >
      {source ? (
        <figcaption className="my-3 text-[13px] leading-snug text-[#676767]">
          {source}
        </figcaption>
      ) : null}

      <p className="m-0 text-[17px] leading-[1.7] text-[#676767] text-pretty">
        {problem}
      </p>

      <div className="relative mt-4">
        <div className="invisible" aria-hidden="true">
          <p className="m-0 mb-2 text-[13px] leading-none">Thinking</p>
          <div className="space-y-2">
            {thoughts.map((thought) => (
              <p key={thought} className="m-0 text-[15px] leading-[1.65] italic">
                {thought}
              </p>
            ))}
          </div>
          <p className="m-0 mt-4 mb-1.5 text-[13px] leading-none">Answer</p>
          <p className="m-0 text-[17px] leading-[1.7]">{answer}</p>
        </div>

        <div className="absolute inset-0" aria-hidden="true">
          <p className="m-0 mb-2 text-[13px] leading-none text-[#676767]">
            {thinking ? <span className="thinking-dot" /> : null}
            Thinking
          </p>
          <div className="space-y-2">
            {thoughts.map((thought, index) => {
              const text =
                index < thoughtIndex || showAnswer
                  ? thought
                  : index === thoughtIndex
                    ? typed
                    : "";

              return (
                <p
                  key={thought}
                  className="m-0 min-h-[1.65em] text-[15px] leading-[1.65] italic text-[#676767]"
                >
                  {text}
                  {thinking && index === thoughtIndex ? (
                    <span className="completion-caret" />
                  ) : null}
                </p>
              );
            })}
          </div>
          <p className="m-0 mt-4 mb-1.5 text-[13px] leading-none text-[#676767]">
            Answer
          </p>
          <p className="m-0 text-[17px] leading-[1.7] text-[#282828]">
            {showAnswer ? (
              <mark className="bg-[#f3e8c4] text-inherit px-[0.12em] py-[0.06em] rounded-[1px] [box-decoration-break:clone] [-webkit-box-decoration-break:clone]">
                {answer}
              </mark>
            ) : null}
          </p>
        </div>
      </div>
    </figure>
  );
}
