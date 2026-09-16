"use client";

import { useEffect, useState } from "react";
import { useInViewPlayback } from "./use-in-view-playback";

type TrajectoryTurn = {
  thought: string;
  action: string;
};

type PatchSampleProps = {
  issue: string;
  issueTitle?: string;
  actions: TrajectoryTurn[];
  patch: string;
  failToPass: string[];
  passToPass: string[];
  file?: string;
  source?: string;
  loop?: boolean;
};

type DiffLineKind = "add" | "del" | "hunk" | "meta" | "ctx";

function classifyDiffLine(line: string): DiffLineKind {
  if (line.startsWith("@@")) return "hunk";
  if (
    line.startsWith("diff ") ||
    line.startsWith("index ") ||
    line.startsWith("---") ||
    line.startsWith("+++")
  ) {
    return "meta";
  }
  if (line.startsWith("+")) return "add";
  if (line.startsWith("-")) return "del";
  return "ctx";
}

const diffLineClass: Record<DiffLineKind, string> = {
  add: "text-[#1a7f37]",
  del: "text-[#cf222e]",
  hunk: "text-[#0969da]",
  meta: "text-[#676767]",
  ctx: "text-[#282828]",
};

function splitAction(action: string) {
  const [tool, ...rest] = action.trim().split(/\s+/);
  return { tool, target: rest.join(" ") };
}

function SectionLabel({ children }: { children: string }) {
  return (
    <p className="m-0 mb-2.5 text-[11px] font-medium tracking-[0.14em] uppercase text-[#676767]">
      {children}
    </p>
  );
}

export default function PatchSample({
  issue,
  issueTitle,
  actions,
  patch,
  failToPass,
  passToPass,
  file,
  source,
  loop = false,
}: PatchSampleProps) {
  const { rootRef, phase } = useInViewPlayback();
  const revealUnits = actions.length * 2;
  const total = revealUnits + 1 + failToPass.length + passToPass.length;
  const [step, setStep] = useState(total);

  useEffect(() => {
    if (phase === "static") {
      setStep(total);
      return;
    }

    if (phase !== "playing") return;

    let current = 0;
    let timeout = 0;
    let cancelled = false;

    const tick = () => {
      if (cancelled) return;

      if (current >= total) {
        if (!loop) return;
        timeout = window.setTimeout(() => {
          if (cancelled) return;
          current = 0;
          setStep(0);
          timeout = window.setTimeout(tick, 320);
        }, 2400);
        return;
      }

      current += 1;
      setStep(current);
      const inTrajectory = current <= revealUnits;
      const justFinishedThought = inTrajectory && current % 2 === 1;
      timeout = window.setTimeout(
        tick,
        justFinishedThought ? 520 : inTrajectory ? 380 : 260,
      );
    };

    current = 0;
    setStep(0);
    timeout = window.setTimeout(tick, 320);

    return () => {
      cancelled = true;
      window.clearTimeout(timeout);
    };
  }, [phase, total, revealUnits, loop]);

  const shownUnits = Math.min(step, revealUnits);
  const showPatch = step > revealUnits;
  const testStep = Math.max(0, step - revealUnits - 1);
  const shownFail = Math.min(testStep, failToPass.length);
  const shownPass = Math.max(0, testStep - failToPass.length);

  return (
    <figure
      ref={rootRef}
      className="my-8 not-prose mx-auto w-[88%] max-w-[36rem]"
      aria-label={`${source ? `${source}. ` : ""}${issueTitle ? `${issueTitle}. ` : ""}${issue} ${actions.map((turn) => `${turn.thought} ${turn.action}`).join(". ")} ${failToPass.join(". ")} ${passToPass.join(". ")}`}
    >
      {source ? (
        <figcaption className="my-3 text-[13px] leading-snug text-[#676767]">
          {source}
        </figcaption>
      ) : null}

      <section>
        <SectionLabel>Issue</SectionLabel>
        {issueTitle ? (
          <p className="m-0 mb-1.5 text-[14px] leading-[1.4] font-medium text-[#282828] text-pretty">
            {issueTitle}
          </p>
        ) : null}
        <p className="m-0 text-[13px] leading-[1.55] text-[#676767] text-pretty">
          {issue}
        </p>
      </section>

      <section className="mt-8">
        <SectionLabel>Actions</SectionLabel>
        <ol className="m-0 list-none space-y-3.5 p-0">
          {actions.map((turn, index) => {
            const thoughtVisible = shownUnits >= index * 2 + 1;
            const actionVisible = shownUnits >= index * 2 + 2;
            const { tool, target } = splitAction(turn.action);

            return (
              <li key={turn.action}>
                <p
                  className={`m-0 text-[13px] leading-[1.5] italic text-[#676767] transition-opacity duration-300 ${
                    thoughtVisible ? "opacity-100" : "opacity-0"
                  }`}
                >
                  {turn.thought}
                </p>
                <p
                  className={`m-0 mt-1 flex items-baseline gap-3 font-mono text-[12.5px] leading-[1.45] transition-opacity duration-300 ${
                    actionVisible ? "opacity-100" : "opacity-0"
                  }`}
                >
                  <span className="w-10 shrink-0 text-[#676767]">{tool}</span>
                  <span className="text-[#282828]">{target}</span>
                </p>
              </li>
            );
          })}
        </ol>
      </section>

      <section className="mt-8">
        <SectionLabel>Patch</SectionLabel>
        <div
          className={`transition-opacity duration-300 ${
            showPatch ? "opacity-100" : "opacity-0"
          }`}
        >
          {file ? (
            <p className="m-0 mb-1.5 font-mono text-[11px] leading-none text-[#676767]">
              {file}
            </p>
          ) : null}
          <div className="overflow-x-auto font-mono text-[12px] leading-[1.6]">
            {patch.split("\n").map((line, index) => (
              <div
                key={`${index}-${line}`}
                className={`whitespace-pre ${diffLineClass[classifyDiffLine(line)]}`}
              >
                {line || " "}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-8">
        <SectionLabel>pytest</SectionLabel>
        <div className="font-mono text-[12px] leading-[1.65]">
          <p className="m-0 text-[#676767]"># FAIL_TO_PASS</p>
          {failToPass.map((test, index) => {
            const done = index < shownFail;
            return (
              <p key={test} className="m-0">
                <span className={done ? "text-[#1a7f37]" : "text-[#cf222e]"}>
                  {done ? "PASSED" : "FAILED"}
                </span>
                <span className="text-[#676767]"> {test}</span>
              </p>
            );
          })}
          <p className="m-0 mt-2 text-[#676767]"># PASS_TO_PASS</p>
          {passToPass.map((test, index) => {
            const done = index < shownPass;
            return (
              <p
                key={test}
                className={`m-0 ${done ? "opacity-100" : "opacity-40"}`}
              >
                <span className="text-[#1a7f37]">PASSED</span>
                <span className="text-[#676767]"> {test}</span>
              </p>
            );
          })}
          <p className="m-0 mt-2 text-[#676767]">
            {shownFail === failToPass.length && shownPass === passToPass.length
              ? `==== ${failToPass.length + passToPass.length} passed in 0.31s ====`
              : `==== ${failToPass.length - shownFail} failed, ${shownFail + shownPass} passed in 0.31s ====`}
          </p>
        </div>
      </section>
    </figure>
  );
}
