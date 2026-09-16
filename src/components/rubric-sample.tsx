"use client";

import { useEffect, useState } from "react";
import { useInViewPlayback } from "./use-in-view-playback";

type RubricItem = {
  label: string;
  pass?: boolean;
};

type RubricSampleProps = {
  problem: string;
  answer: string;
  rubric: RubricItem[];
  thoughts?: string[];
  source?: string;
  loop?: boolean;
};

function isAhaThought(thought: string) {
  return /aha moment|wait, wait/i.test(thought);
}

function nextCharDelay(char: string) {
  if (/[.!?]/.test(char)) return 160;
  if (/[,;:]/.test(char)) return 90;
  if (char === " ") return 24;
  return 12 + Math.random() * 12;
}

export default function RubricSample({
  problem,
  answer,
  rubric,
  thoughts = [],
  source,
  loop = false,
}: RubricSampleProps) {
  const { rootRef, phase } = useInViewPlayback();
  const [thoughtIndex, setThoughtIndex] = useState(thoughts.length);
  const [typedThought, setTypedThought] = useState(thoughts.at(-1) ?? "");
  const [typedAnswer, setTypedAnswer] = useState(answer);
  const [checked, setChecked] = useState(rubric.length);

  useEffect(() => {
    if (phase === "static") {
      setThoughtIndex(thoughts.length);
      setTypedThought(thoughts.at(-1) ?? "");
      setTypedAnswer(answer);
      setChecked(rubric.length);
      return;
    }

    if (phase !== "playing") return;

    let currentThought = 0;
    let thoughtChar = 0;
    let answerChar = 0;
    let checkIndex = 0;
    let timeout = 0;
    let cancelled = false;

    const tickThought = () => {
      if (cancelled) return;

      if (currentThought >= thoughts.length) {
        timeout = window.setTimeout(tickAnswer, 240);
        return;
      }

      const thought = thoughts[currentThought];
      if (thoughtChar >= thought.length) {
        currentThought += 1;
        thoughtChar = 0;
        setThoughtIndex(currentThought);
        setTypedThought("");
        timeout = window.setTimeout(tickThought, 200);
        return;
      }

      const char = thought[thoughtChar];
      thoughtChar += 1;
      setThoughtIndex(currentThought);
      setTypedThought(thought.slice(0, thoughtChar));
      timeout = window.setTimeout(tickThought, nextCharDelay(char));
    };

    const tickAnswer = () => {
      if (cancelled) return;

      if (answerChar >= answer.length) {
        setTypedAnswer(answer);
        timeout = window.setTimeout(tickRubric, 280);
        return;
      }

      const char = answer[answerChar];
      answerChar += 1;
      setTypedAnswer(answer.slice(0, answerChar));
      timeout = window.setTimeout(tickAnswer, nextCharDelay(char));
    };

    const tickRubric = () => {
      if (cancelled) return;

      if (checkIndex >= rubric.length) {
        if (!loop) return;
        timeout = window.setTimeout(start, 2400);
        return;
      }

      checkIndex += 1;
      setChecked(checkIndex);
      timeout = window.setTimeout(tickRubric, 220);
    };

    const start = () => {
      currentThought = 0;
      thoughtChar = 0;
      answerChar = 0;
      checkIndex = 0;
      setThoughtIndex(0);
      setTypedThought("");
      setTypedAnswer("");
      setChecked(0);
      timeout = window.setTimeout(
        thoughts.length > 0 ? tickThought : tickAnswer,
        320,
      );
    };

    start();

    return () => {
      cancelled = true;
      window.clearTimeout(timeout);
    };
  }, [phase, answer, rubric, thoughts, loop]);

  const thinking =
    phase !== "static" &&
    thoughts.length > 0 &&
    (thoughtIndex < thoughts.length || typedAnswer.length === 0);
  const typingAnswer =
    phase !== "static" &&
    typedAnswer.length > 0 &&
    typedAnswer.length < answer.length;

  return (
    <figure
      ref={rootRef}
      className="my-8 not-prose mx-auto w-[88%] max-w-[36rem]"
      aria-label={`${source ? `${source}. ` : ""}${problem} ${thoughts.join(" ")} Answer: ${answer}. ${rubric
        .map((item) => item.label)
        .join(". ")}`}
    >
      {source ? (
        <figcaption className="my-3 text-[13px] leading-snug text-[#676767]">
          {source}
        </figcaption>
      ) : null}

      <p className="m-0 text-[17px] leading-[1.7] text-[#676767] text-pretty">
        {problem}
      </p>

      {thoughts.length > 0 ? (
        <div className="mt-4">
          <p className="m-0 mb-2 text-[13px] leading-none text-[#676767]">
            {thinking ? <span className="thinking-dot" /> : null}
            Thinking
          </p>
          <div className="space-y-2">
            {thoughts.map((thought, index) => {
              const text =
                index < thoughtIndex || typedAnswer.length > 0
                  ? thought
                  : index === thoughtIndex
                    ? typedThought
                    : "";

              return (
                <p
                  key={thought}
                  className={`m-0 min-h-[1.65em] text-[15px] leading-[1.65] ${
                    isAhaThought(thought)
                      ? "not-italic font-medium text-[#9a3412]"
                      : "italic text-[#676767]"
                  }`}
                >
                  {text}
                  {thinking && index === thoughtIndex ? (
                    <span className="completion-caret" />
                  ) : null}
                </p>
              );
            })}
          </div>
        </div>
      ) : null}

      <p className="mt-4 mb-1.5 text-[13px] leading-none text-[#676767]">
        Answer
      </p>
      <p className="m-0 min-h-[1.7em] text-[17px] leading-[1.7] text-[#282828]">
        {typedAnswer ? (
          <mark className="bg-[#f3e8c4] text-inherit px-[0.12em] py-[0.06em] rounded-[1px] [box-decoration-break:clone] [-webkit-box-decoration-break:clone]">
            {typedAnswer}
          </mark>
        ) : null}
        {typingAnswer ? <span className="completion-caret" /> : null}
      </p>

      <p className="mt-5 mb-2 text-[13px] leading-none text-[#676767]">
        Rubric
      </p>
      <ul className="m-0 list-none space-y-1.5 p-0">
        {rubric.map((item, index) => {
          const done = index < checked;
          const passed = item.pass !== false;

          return (
            <li
              key={item.label}
              className={`flex items-baseline gap-2 text-[15px] leading-[1.55] transition-colors duration-300 ${
                done ? "text-[#282828]" : "text-[#676767]"
              }`}
            >
              <span className="w-4 shrink-0 text-[13px] tabular-nums">
                {done ? (passed ? "✓" : "×") : "·"}
              </span>
              <span>{item.label}</span>
            </li>
          );
        })}
      </ul>
    </figure>
  );
}
