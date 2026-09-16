"use client";

import { useEffect, useState } from "react";
import { useInViewPlayback } from "./use-in-view-playback";

type Turn = {
  role: "counterpart" | "agent";
  text: string;
  price?: number;
  action?: "accept";
  cue?: string;
};

type TermsSampleProps = {
  source?: string;
  loop?: boolean;
};

const SELLER_R = 59.48;
const BUYER_R = 99.13;
const ACCEPT = 60.21;
const SURPLUS = 38.92;
const SCALE_MIN = 48;
const SCALE_MAX = 100;

const TURNS: Turn[] = [
  {
    role: "counterpart",
    price: 78.78,
    cue: "Concede",
    text: "Thanks for your interest—I’m happy to work with you. I can offer it for 78.78.",
  },
  {
    role: "agent",
    price: 50,
    text: "Thank you for the offer. I was hoping for a price closer to 50.",
  },
  {
    role: "counterpart",
    price: 69.57,
    cue: "Concede",
    text: "50 is a bit low for me, but I can come down. I can offer 69.57.",
  },
  {
    role: "agent",
    price: 55,
    text: "I can increase my offer to 55. Does that work?",
  },
  {
    role: "counterpart",
    price: 66.06,
    cue: "Concede",
    text: "I can come down to 66.06 if that works for you.",
  },
  {
    role: "agent",
    price: 58,
    text: "I can come up to 58. Would that be acceptable?",
  },
  {
    role: "counterpart",
    price: 66.06,
    cue: "Concede",
    text: "Thanks for raising your offer. I can come down to 66.06.",
  },
  {
    role: "agent",
    price: 61,
    text: "I can increase my bid to 61. I think we’re getting closer.",
  },
  {
    role: "counterpart",
    price: 60.21,
    cue: "Concede",
    text: "I can come down to 60.21 if you’re ready to finalize.",
  },
  {
    role: "agent",
    action: "accept",
    price: ACCEPT,
    text: "60.21 works for me. Let’s finalize the deal.",
  },
];

const IMESSAGE_FONT =
  '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", sans-serif';

const LAST_AGENT_INDEX = TURNS.findLastIndex((turn) => turn.role === "agent");

function pct(price: number) {
  return ((price - SCALE_MIN) / (SCALE_MAX - SCALE_MIN)) * 100;
}

function formatPrice(price: number) {
  return price.toFixed(2);
}

function bubbleRadius(incoming: boolean, first: boolean) {
  if (incoming) {
    return `rounded-[18px] rounded-bl-[4px] ${first ? "" : "rounded-tl-[4px]"}`;
  }

  return `rounded-[18px] rounded-br-[4px] ${first ? "" : "rounded-tr-[4px]"}`;
}

function latestQuotes(shown: number) {
  let bid: number | undefined;
  let ask: number | undefined;
  let accepted = false;

  for (let index = 0; index < shown; index += 1) {
    const turn = TURNS[index];
    if (turn.role === "counterpart" && turn.price != null) {
      ask = turn.price;
    }
    if (turn.role === "agent" && turn.action === "accept") {
      accepted = true;
      bid = turn.price;
      ask = turn.price;
    } else if (turn.role === "agent" && turn.price != null) {
      bid = turn.price;
    }
  }

  return { bid, ask, accepted };
}

export default function TermsSample({
  source,
  loop = false,
}: TermsSampleProps) {
  const { rootRef, phase } = useInViewPlayback();
  const total = TURNS.length + 1;
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
      const reading = turn
        ? Math.min(2400, 1100 + turn.text.length * 22)
        : 1000;
      const hold =
        !turn ? 1000 : turn.action === "accept" ? 1600 : turn.role === "agent" ? 500 : 200;
      timeout = window.setTimeout(tick, reading + hold);
    };

    current = 0;
    setStep(0);
    timeout = window.setTimeout(tick, 700);

    return () => {
      cancelled = true;
      window.clearTimeout(timeout);
    };
  }, [phase, total, loop]);

  const shownTurns = Math.min(step, TURNS.length);
  const showSurplus = step >= total;
  const { bid, ask, accepted } = latestQuotes(shownTurns);
  const bandLeft = bid ?? SCALE_MIN;
  const bandRight = ask ?? BUYER_R;
  const hasBand = bid != null && ask != null;

  const transcript = TURNS.map((turn) =>
    `${turn.role} ${turn.price ?? turn.action}: ${turn.text}`,
  ).join(". ");

  return (
    <figure
      ref={rootRef}
      className="my-8 not-prose mx-auto w-[88%] max-w-[36rem]"
      aria-label={`${source ? `${source}. ` : ""}${transcript} Surplus ${SURPLUS}.`}
    >
      {source ? (
        <figcaption className="my-3 text-[13px] leading-snug text-[#676767]">
          {source}
        </figcaption>
      ) : null}

      <div style={{ fontFamily: IMESSAGE_FONT }}>
        <header className="mb-4 text-center">
          <p className="m-0 text-[13px] font-semibold leading-none text-[#282828]">
            Supplier
          </p>
          <p className="m-0 mt-1 text-[11px] leading-none text-[#8e8e93]">
            Overlap · Expressive
          </p>
        </header>

        <div className="mb-4">
          <div className="relative h-9">
            <div className="absolute top-[18px] right-0 left-0 h-px bg-[#e5e5e5]" />
            <div
              className="absolute top-[14px] h-[10px] rounded-full bg-[#f3e8c4]"
              style={{
                left: `${pct(SELLER_R)}%`,
                width: `${pct(BUYER_R) - pct(SELLER_R)}%`,
              }}
            />
            {hasBand ? (
              <div
                className="absolute top-[16px] h-[6px] rounded-full bg-[#007aff]/35 transition-[left,width] duration-700 ease-out"
                style={{
                  left: `${pct(Math.min(bandLeft, bandRight))}%`,
                  width: `${Math.max(
                    pct(Math.max(bandLeft, bandRight)) -
                      pct(Math.min(bandLeft, bandRight)),
                    1.2,
                  )}%`,
                }}
              />
            ) : null}
            {bid != null ? (
              <span
                className="absolute top-[13px] h-[12px] w-[12px] -translate-x-1/2 rounded-full bg-[#007aff] ring-2 ring-white transition-[left] duration-700 ease-out"
                style={{ left: `${pct(bid)}%` }}
              />
            ) : null}
            {ask != null && !accepted ? (
              <span
                className="absolute top-[13px] h-[12px] w-[12px] -translate-x-1/2 rounded-full bg-[#8e8e93] ring-2 ring-white transition-[left] duration-700 ease-out"
                style={{ left: `${pct(ask)}%` }}
              />
            ) : null}
          </div>
          <div className="flex items-baseline justify-between text-[11px] leading-none">
            <span className="text-[#8e8e93]">{formatPrice(SELLER_R)}</span>
            <span>
              {accepted ? (
                <span className="text-[#282828]">{formatPrice(ACCEPT)} deal</span>
              ) : hasBand ? (
                <>
                  <span className="text-[#007aff]">bid {formatPrice(bid)}</span>
                  <span className="text-[#c7c7cc]"> · </span>
                  <span className="text-[#8e8e93]">ask {formatPrice(ask)}</span>
                </>
              ) : ask != null ? (
                <span className="text-[#8e8e93]">ask {formatPrice(ask)}</span>
              ) : (
                <span className="text-[#8e8e93]">ZOPA</span>
              )}
            </span>
            <span className="text-[#8e8e93]">{formatPrice(BUYER_R)}</span>
          </div>
        </div>

        <ol className="m-0 list-none p-0">
          {TURNS.map((turn, index) => {
            const visible = index < shownTurns;
            const prev = TURNS[index - 1];
            const first = !prev || prev.role !== turn.role;
            const stacked = !first;
            const incoming = turn.role === "counterpart";

            return (
              <li
                key={`${turn.role}-${index}`}
                className={`${stacked ? "mt-[3px]" : "mt-2"} transition-opacity duration-300 ${
                  visible ? "opacity-100" : "opacity-0"
                }`}
              >
                {incoming && turn.cue ? (
                  <p className="m-0 mb-1.5 text-center text-[11px] leading-none text-[#8e8e93]">
                    {turn.cue}
                    {turn.price != null ? ` · ${formatPrice(turn.price)}` : ""}
                  </p>
                ) : null}
                <div
                  className={
                    incoming ? "flex justify-start" : "flex flex-col items-end"
                  }
                >
                  <p
                    className={`m-0 max-w-[78%] px-[14px] py-[8px] text-[15px] leading-[1.35] text-pretty ${bubbleRadius(
                      incoming,
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
                      Read Jun 4, 2026 2:18 PM
                    </p>
                  ) : null}
                </div>
              </li>
            );
          })}
        </ol>
      </div>

      <p
        className={`m-0 mt-6 text-[17px] leading-[1.7] transition-opacity duration-300 ${
          showSurplus ? "opacity-100" : "opacity-0"
        }`}
      >
        <mark className="bg-[#f3e8c4] text-inherit px-[0.12em] py-[0.06em] rounded-[1px] [box-decoration-break:clone] [-webkit-box-decoration-break:clone]">
          u = {SURPLUS} · p = {ACCEPT}
        </mark>
      </p>
      <p
        className={`m-0 mt-1 text-[13px] leading-snug text-[#676767] transition-opacity duration-300 ${
          showSurplus ? "opacity-100" : "opacity-0"
        }`}
      >
        Accepts near the seller reservation. Almost the entire ZOPA.
      </p>
    </figure>
  );
}
