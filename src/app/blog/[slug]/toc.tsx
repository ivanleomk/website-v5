"use client";

import { useState, useEffect } from "react";

type Heading = { text: string; id: string; level: number };

export default function TableOfContents({ headings }: { headings: Heading[] }) {
  const [activeId, setActiveId] = useState(headings[0]?.id ?? "");

  useEffect(() => {
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { rootMargin: "-10% 0px -70% 0px" }
    );

    const elements = document.querySelectorAll("article h2, article h3");
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [headings]);

  return (
    <nav
      className="hidden xl:block absolute right-[calc(100%+2.5rem)] top-0 h-full w-[180px]"
      aria-label="Table of contents"
    >
      <ul className="sticky top-24 space-y-0.5 list-none p-0 m-0">
        {headings.map((h) => {
          const isActive = activeId === h.id;
          return (
            <li
              key={h.id}
              className={`
                font-sans text-[13.5px] leading-relaxed
                border-l-[1.5px] transition-colors duration-200
                ${h.level === 3 ? "pl-6" : "pl-3"}
                ${isActive ? "border-[#282828]" : "border-transparent"}
              `}
            >
              <a
                href={`#${h.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  document
                    .getElementById(h.id)
                    ?.scrollIntoView({ behavior: "smooth" });
                  setActiveId(h.id);
                }}
                className={`
                  block py-1 no-underline transition-colors duration-150
                  ${
                    isActive
                      ? "text-[#282828] font-semibold"
                      : "text-[#676767] hover:text-[#282828]"
                  }
                `}
              >
                {h.text}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
