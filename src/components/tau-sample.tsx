"use client";

import { useEffect, useState } from "react";
import { useInViewPlayback } from "./use-in-view-playback";

type ChatRole = "user" | "agent" | "tool";

type ChatTurn = {
  role: ChatRole;
  text: string;
  detail?: string;
};

type CompareRow = {
  label: string;
  value: string;
};

type TauSampleProps = {
  source?: string;
  loop?: boolean;
};

const TURNS: ChatTurn[] = [
  { role: "agent", text: "Hi, how can I help you today?" },
  {
    role: "user",
    text: "I want to fly from New York to Seattle on May 20. One way.",
  },
  { role: "agent", text: "What's your user id?" },
  { role: "user", text: "mia_li_3668" },
  {
    role: "tool",
    text: "get_user_details",
    detail: "gold · $250 cert · $100 cert · •7447",
  },
  { role: "agent", text: "Cabin, bags, and do you want insurance?" },
  { role: "user", text: "Economy. 3 bags. No insurance." },
  {
    role: "tool",
    text: "search_direct_flight",
    detail: "JFK → SEA · 2024-05-20",
  },
  {
    role: "tool",
    text: "search_onestop_flight",
    detail: "HAT136 + HAT039 · $255",
  },
  {
    role: "agent",
    text: "Cheapest after 11am is a one-stop. HAT136 JFK→ATL 7:00pm, then HAT039 ATL→SEA 10:00pm. $255 economy. Book it?",
  },
  { role: "user", text: "Use my two certificates." },
  {
    role: "agent",
    text: "I can only apply one certificate. I'll use the $250 one and the rest on your 7447 card. Confirm?",
  },
  { role: "user", text: "Yes." },
  {
    role: "tool",
    text: "book_reservation",
    detail: "HAT136 + HAT039 · cert $250 + •7447 $5",
  },
];

const COMPARE: CompareRow[] = [
  { label: "origin", value: "JFK" },
  { label: "destination", value: "SEA" },
  { label: "flights", value: "HAT136, HAT039" },
  { label: "cabin", value: "economy" },
  { label: "bags", value: "3" },
  { label: "insurance", value: "no" },
  { label: "payment", value: "certificate_7504069 $250 + •7447 $5" },
];

const IMESSAGE_FONT =
  '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", sans-serif';

const LAST_AGENT_INDEX = TURNS.findLastIndex((turn) => turn.role === "agent");

function isChat(role: ChatRole): role is "user" | "agent" {
  return role === "user" || role === "agent";
}

function bubbleRadius(role: "user" | "agent", first: boolean) {
  if (role === "user") {
    return `rounded-[18px] rounded-bl-[4px] ${first ? "" : "rounded-tl-[4px]"}`;
  }

  return `rounded-[18px] rounded-br-[4px] ${first ? "" : "rounded-tr-[4px]"}`;
}

export default function TauSample({
  source,
  loop = false,
}: TauSampleProps) {
  const { rootRef, phase } = useInViewPlayback();
  const total = TURNS.length + COMPARE.length + 1;
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
          timeout = window.setTimeout(tick, 280);
        }, 2400);
        return;
      }

      current += 1;
      setStep(current);
      const turn = TURNS[current - 1];
      const delay = !turn
        ? 200
        : turn.role === "tool"
          ? 280
          : turn.role === "user"
            ? 360
            : 480;
      timeout = window.setTimeout(tick, delay);
    };

    current = 0;
    setStep(0);
    timeout = window.setTimeout(tick, 320);

    return () => {
      cancelled = true;
      window.clearTimeout(timeout);
    };
  }, [phase, total, loop]);

  const shownTurns = Math.min(step, TURNS.length);
  const compareStep = Math.max(0, step - TURNS.length);
  const shownCompare = Math.min(compareStep, COMPARE.length);
  const showMatch = step >= total;

  const transcript = TURNS.map((turn) =>
    turn.role === "tool"
      ? `${turn.text} ${turn.detail ?? ""}`
      : `${turn.role}: ${turn.text}`,
  ).join(". ");

  return (
    <figure
      ref={rootRef}
      className="my-8 not-prose mx-auto w-[88%] max-w-[36rem]"
      aria-label={`${source ? `${source}. ` : ""}${transcript}. Database matches annotated goal.`}
    >
      {source ? (
        <figcaption className="my-3 text-[13px] leading-snug text-[#676767]">
          {source}
        </figcaption>
      ) : null}

      <div style={{ fontFamily: IMESSAGE_FONT }}>
        <header className="mb-4 text-center">
          <p className="m-0 text-[13px] font-semibold leading-none text-[#282828]">
            Mia Li
          </p>
          <p className="m-0 mt-1 text-[11px] leading-none text-[#8e8e93]">
            Text Message
          </p>
        </header>

        <ol className="m-0 list-none p-0">
          {TURNS.map((turn, index) => {
            const visible = index < shownTurns;
            const prev = TURNS[index - 1];
            const first = !prev || prev.role !== turn.role;
            const stacked = isChat(turn.role) && !first;

            if (turn.role === "tool") {
              return (
                <li
                  key={`${turn.text}-${index}`}
                  className={`flex justify-center py-2 transition-opacity duration-300 ${
                    visible ? "opacity-100" : "opacity-0"
                  }`}
                >
                  <p className="m-0 max-w-[90%] text-center text-[11px] leading-[1.45] text-[#8e8e93]">
                    <span className="font-medium">{turn.text}</span>
                    {turn.detail ? (
                      <>
                        <span className="text-[#c7c7cc]"> · </span>
                        <span>{turn.detail}</span>
                      </>
                    ) : null}
                  </p>
                </li>
              );
            }

            const incoming = turn.role === "user";

            return (
              <li
                key={`${turn.role}-${index}`}
                className={`${
                  incoming ? "flex justify-start" : "flex flex-col items-end"
                } ${stacked ? "mt-[3px]" : "mt-2"} transition-opacity duration-300 ${
                  visible ? "opacity-100" : "opacity-0"
                }`}
              >
                <p
                  className={`m-0 max-w-[78%] px-[14px] py-[8px] text-[15px] leading-[1.35] text-pretty ${bubbleRadius(
                    turn.role,
                    first,
                  )} ${
                    incoming
                      ? "bg-[#e9e9eb] text-[#111111]"
                      : "bg-[#007aff] text-white"
                  }`}
                >
                  {turn.text}
                </p>
                {index === LAST_AGENT_INDEX ? (
                  <p className="m-0 mt-1 pr-[2px] text-[11px] leading-none text-[#8e8e93]">
                    Read May 15, 2024 3:12 PM
                  </p>
                ) : null}
              </li>
            );
          })}
        </ol>
      </div>

      <section className="mt-8">
        <p className="m-0 mb-2 text-[13px] leading-none text-[#676767]">
          Database
        </p>
        <div className="font-mono text-[12px] leading-[1.65]">
          {COMPARE.map((row, index) => {
            const done = index < shownCompare;
            return (
              <p
                key={row.label}
                className={`m-0 flex gap-3 transition-opacity duration-300 ${
                  done ? "opacity-100" : "opacity-0"
                }`}
              >
                <span className="w-[7.5rem] shrink-0 text-[#676767]">
                  {row.label}
                </span>
                <span className="text-[#282828]">{row.value}</span>
              </p>
            );
          })}
          <p
            className={`m-0 mt-2 transition-opacity duration-300 ${
              showMatch ? "opacity-100" : "opacity-0"
            }`}
          >
            <span className="text-[#1a7f37]">✓</span>
            <span className="text-[#676767]"> matches annotated goal</span>
          </p>
        </div>
      </section>
    </figure>
  );
}
