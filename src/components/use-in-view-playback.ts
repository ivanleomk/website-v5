"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";

export type PlaybackPhase = "static" | "pending" | "playing";

export function useInViewPlayback() {
  const rootRef = useRef<HTMLElement>(null);
  const [phase, setPhase] = useState<PlaybackPhase>("static");

  useLayoutEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setPhase("pending");
  }, []);

  const motionEnabled = phase !== "static";

  useEffect(() => {
    if (!motionEnabled) return;
    const node = rootRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setPhase(entry.isIntersecting ? "playing" : "pending");
      },
      { threshold: 0.3 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [motionEnabled]);

  return { rootRef, phase };
}
