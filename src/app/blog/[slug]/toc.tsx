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
      {/* Wide screens (xl:): Original text-based TOC in right gutter */}
      <nav
        className="hidden xl:block fixed z-10"
        aria-label="Table of contents"
        style={{
          right: "max(2rem, calc((100vw - 800px) / 2 - 180px))",
          top: "6rem",
          width: "150px",
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
          
          <ul className="space-y-0 list-none p-0 m-0">
            {headings.map((h) => {
              const isActive = activeId === h.id;
              return (
                <li
                  key={h.id}
                  className={`
                    text-[13px] leading-snug
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
                      block py-0.5 no-underline transition-colors duration-150 cursor-pointer
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

      {/* Mid screens (md: to below xl:): Codex dash rail with hover previews */}
      <nav
        className="hidden md:block xl:hidden fixed right-6 top-1/2 -translate-y-1/2 z-10"
        aria-label="Table of contents"
      >
        <div className="group bg-white rounded-full border border-[#eee] shadow-sm px-2 py-3 transition-all duration-200 hover:px-3 hover:py-4">
          <div className="flex flex-col gap-2 relative group-hover:gap-3 transition-all duration-200">
            {headings.map((h, index) => {
              const isActive = activeId === h.id;
              const isHovered = hoveredId === h.id;
              return (
                <div key={h.id} className="relative">
                  <button
                    onClick={() => scrollToHeading(h.id)}
                    onMouseEnter={() => handleDashHover(h.id)}
                    onMouseLeave={() => setHoveredId(null)}
                    className="px-1 py-1 cursor-pointer flex items-center justify-end group-hover:px-2 transition-all duration-200"
                    aria-label={h.text}
                  >
                    <span
                      className={`
                        h-[2px] transition-all duration-200
                        ${isActive || isHovered 
                          ? "w-5 bg-[#282828] group-hover:w-6" 
                          : "w-3 bg-[#d4d4d4] hover:bg-[#676767] group-hover:w-4"
                        }
                      `}
                    />
                  </button>
                  
                  {/* Hover preview card */}
                  {isHovered && (
                    <div
                      className="absolute right-12 top-1/2 -translate-y-1/2 bg-white rounded-lg shadow-lg p-3 w-64 pointer-events-none"
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
        </div>
      </nav>
    </>
  );
}
