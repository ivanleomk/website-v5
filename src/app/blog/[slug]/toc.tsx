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
      className="hidden xl:block fixed top-1/2 -translate-y-1/2 z-10"
      aria-label="Table of contents"
      style={{
        left: "max(2rem, calc((100vw - 800px) / 2 - 220px))",
        maxHeight: "calc(100vh - 12rem)",
      }}
    >
      <div className="relative flex items-start gap-3 group">
        <div className="relative flex flex-col items-center py-2">
          <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-[#e5e5e5]" />
          
          {headings.map((h) => {
            const isActive = activeId === h.id;
            return (
              <button
                key={h.id}
                onClick={(e) => {
                  e.preventDefault();
                  document
                    .getElementById(h.id)
                    ?.scrollIntoView({ behavior: "smooth" });
                  setActiveId(h.id);
                }}
                className={`
                  relative z-10 w-2 h-2 rounded-full transition-all duration-200
                  ${isActive 
                    ? "bg-[#282828] scale-125" 
                    : "bg-[#d4d4d4] hover:bg-[#676767] hover:scale-110"
                  }
                  ${h.level === 3 ? "my-1.5" : "my-2"}
                `}
                aria-label={h.text}
                title={h.text}
              />
            );
          })}
        </div>

        <div className="flex flex-col overflow-y-auto" style={{ maxHeight: "calc(100vh - 12rem)" }}>
          {headings.map((h) => {
            const isActive = activeId === h.id;
            return (
              <a
                key={h.id}
                href={`#${h.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  document
                    .getElementById(h.id)
                    ?.scrollIntoView({ behavior: "smooth" });
                  setActiveId(h.id);
                }}
                className={`
                  py-2 text-[13px] leading-tight no-underline transition-all duration-150
                  whitespace-nowrap
                  opacity-0 group-hover:opacity-100
                  ${h.level === 3 ? "pl-3" : "pl-0"}
                  ${isActive 
                    ? "text-[#282828] font-medium" 
                    : "text-[#676767] hover:text-[#282828]"
                  }
                `}
                style={{ fontFamily: "var(--font-serif)" }}
              >
                {h.text}
              </a>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
