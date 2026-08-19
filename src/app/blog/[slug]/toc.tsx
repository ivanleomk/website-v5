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

  const scrollToHeading = (headingId: string) => {
    document.getElementById(headingId)?.scrollIntoView({ behavior: "smooth" });
    setActiveId(headingId);
  };

  return (
    <nav
      className="hidden xl:block fixed z-10"
      aria-label="Table of contents"
      style={{
        right: "max(2rem, calc((100vw - 800px) / 2 - 200px))",
        top: "6rem",
        width: "170px",
      }}
    >
      <div className="sticky top-24">
        {/* Back to blog control */}
        <a
          href="/blog"
          className="inline-flex items-center gap-1 text-[12px] text-[#676767] hover:text-[#282828] no-underline transition-colors duration-150 mb-3 cursor-pointer"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          <span>←</span>
          <span>Back</span>
        </a>
        
        <ul className="space-y-1 list-none p-0 m-0">
          {headings.map((h) => {
            const isActive = activeId === h.id;
            return (
              <li
                key={h.id}
                className={`
                  text-[14px] leading-snug
                  border-l-[1.5px] transition-colors duration-200
                  ${h.level === 3 ? "pl-5" : "pl-3"}
                  ${isActive ? "border-[#282828]" : "border-transparent"}
                `}
                style={{ fontFamily: "var(--font-serif)" }}
              >
                <a
                  href={`#${h.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToHeading(h.id);
                  }}
                  className={`
                    block py-1 no-underline transition-colors duration-150 cursor-pointer
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
      </div>
    </nav>
  );
}
