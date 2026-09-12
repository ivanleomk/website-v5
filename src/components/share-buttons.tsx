"use client";

import { useState } from "react";
import { addSourceParam } from "@/lib/utm";

interface ShareButtonsProps {
  url: string;
}

export default function ShareButtons({ url }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = async () => {
    const trackedURL = addSourceParam(url);
    
    try {
      await navigator.clipboard.writeText(trackedURL);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <button
      onClick={handleCopyLink}
      className="mt-4 text-[13px] text-[#676767] hover:text-[#282828] transition-colors"
      aria-label="Copy link for sharing"
    >
      {copied ? "✓ Link copied" : "Copy link for sharing"}
    </button>
  );
}
