"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";

type CompletionSampleProps = {
  prompt: string;
  completion: string;
  source?: string;
  loop?: boolean;
};

type Phase = "static" | "pending" | "playing";

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function nextCharDelay(char: string) {
  if (/[.!?]/.test(char)) return 200;
  if (/[,;:]/.test(char)) return 120;
  if (char === " ") return 36;
  return 20 + Math.random() * 18;
}

export default function CompletionSample({
  prompt,
  completion,
  source,
  loop = true,
}: CompletionSampleProps) {
  const promptText = prompt.trim();
  const completionText = completion.trim();
  const rootRef = useRef<HTMLElement>(null);
  const indexRef = useRef(0);
  const [typed, setTyped] = useState(completionText);
  const [phase, setPhase] = useState<Phase>("static");

  useLayoutEffect(() => {
    if (prefersReducedMotion()) return;
    indexRef.current = 0;
    setTyped("");
    setPhase("pending");
  }, [completionText]);

  const motionEnabled = phase !== "static";

  useEffect(() => {
    if (!motionEnabled) return;
    const node = rootRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setPhase(entry.isIntersecting ? "playing" : "pending");
      },
      { threshold: 0.35 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [motionEnabled]);

  useEffect(() => {
    if (phase !== "playing") return;

    let timeout = 0;
    let cancelled = false;

    const tick = () => {
      if (cancelled) return;

      if (indexRef.current >= completionText.length) {
        setTyped(completionText);
        if (!loop) return;
        timeout = window.setTimeout(() => {
          if (cancelled) return;
          indexRef.current = 0;
          setTyped("");
          timeout = window.setTimeout(tick, 280);
        }, 1800);
        return;
      }

      const index = indexRef.current;
      const char = completionText[index];
      indexRef.current = index + 1;
      setTyped(completionText.slice(0, index + 1));
      timeout = window.setTimeout(tick, nextCharDelay(char));
    };

    timeout = window.setTimeout(tick, indexRef.current === 0 ? 280 : 0);

    return () => {
      cancelled = true;
      window.clearTimeout(timeout);
    };
  }, [phase, completionText, loop]);

  const showCaret = phase !== "static" && typed.length < completionText.length;

  return (
    <figure
      ref={rootRef}
      className="my-8 not-prose mx-auto w-[88%] max-w-[36rem]"
      aria-label={`${source ? `${source} sample. ` : ""}${promptText} ${completionText}`}
    >
      {source ? (
        <figcaption className="my-3 text-[13px] leading-snug text-[#676767]">
          {source}
        </figcaption>
      ) : null}
      <div className="relative text-[17px] leading-[1.7] text-pretty">
        <p className="invisible m-0" aria-hidden="true">
          {promptText} {completionText}
        </p>
        <p className="absolute inset-0 m-0" aria-hidden="true">
          <span className="text-[#676767]">{promptText}</span>
          {typed ? (
            <>
              {" "}
              <mark className="bg-[#f3e8c4] text-[#282828] px-[0.12em] py-[0.06em] rounded-[1px] [box-decoration-break:clone] [-webkit-box-decoration-break:clone]">
                {typed}
              </mark>
            </>
          ) : (
            " "
          )}
          {showCaret ? (
            <span className="completion-caret" aria-hidden="true" />
          ) : null}
        </p>
      </div>
    </figure>
  );
}
