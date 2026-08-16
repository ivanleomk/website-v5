"use client";

import { useState, useEffect } from "react";

type Heading = { text: string; id: string; level: number };

function getHeadingSnippet(headingId: string): string {
  const heading = document.getElementById(headingId);
  if (!heading) return "";
  
  let next = heading.nextElementSibling;
  while (next && next.tagName !== "P") {
    next = next.nextElementSibling;
  }
  
  if (next?.textContent) {
    const text = next.textContent.trim();
    return text.length > 80 ? text.slice(0, 80) + "..." : text;
  }
  
  return "";
}

export default function TableOfContents({ headings }: { headings: Heading[] }) {
  const [activeId, setActiveId] = useState(headings[0]?.id ?? "");
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [hoveredSnippet, setHoveredSnippet] = useState("");

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

  const handleDashHover = (headingId: string) => {
    setHoveredId(headingId);
    setHoveredSnippet(getHeadingSnippet(headingId));
  };

  const scrollToHeading = (headingId: string) => {
    document.getElementById(headingId)?.scrollIntoView({ behavior: "smooth" });
    setActiveId(headingId);
  };

  return (
    <>
      {/* Wide screens (xl:): Original text-based TOC in left gutter */}
      <nav
        className="hidden xl:block fixed z-10"
        aria-label="Table of contents"
        style={{
          left: "max(2rem, calc((100vw - 800px) / 2 - 220px))",
          top: "6rem",
          width: "180px",
        }}
      >
        <ul className="sticky top-24 space-y-0.5 list-none p-0 m-0">
          {headings.map((h) => {
            const isActive = activeId === h.id;
            return (
              <li
                key={h.id}
                className={`
                  text-[13.5px] leading-relaxed
                  border-l-[1.5px] transition-colors duration-200
                  ${h.level === 3 ? "pl-6" : "pl-3"}
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

      {/* Mid screens (md: to below xl:): Codex dash rail with hover previews */}
      <nav
        className="hidden md:block xl:hidden fixed left-6 top-1/2 -translate-y-1/2 z-10"
        aria-label="Table of contents"
      >
        <div className="flex flex-col gap-3 relative">
          {headings.map((h, index) => {
            const isActive = activeId === h.id;
            const isHovered = hoveredId === h.id;
            return (
              <div key={h.id} className="relative">
                <button
                  onClick={() => scrollToHeading(h.id)}
                  onMouseEnter={() => handleDashHover(h.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  className={`
                    h-[2px] transition-all duration-200
                    ${isActive || isHovered 
                      ? "w-6 bg-[#282828]" 
                      : "w-4 bg-[#d4d4d4] hover:bg-[#676767]"
                    }
                  `}
                  aria-label={h.text}
                />
                
                {/* Hover preview card */}
                {isHovered && (
                  <div
                    className="absolute left-10 top-1/2 -translate-y-1/2 bg-white rounded-lg shadow-lg p-3 w-64 pointer-events-none"
                    style={{ fontFamily: "var(--font-serif)" }}
                  >
                    <div className="font-semibold text-[14px] text-[#282828] mb-1">
                      {h.text}
                    </div>
                    {hoveredSnippet && (
                      <div className="text-[12px] text-[#676767] leading-snug">
                        {hoveredSnippet}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </nav>
    </>
  );
}
