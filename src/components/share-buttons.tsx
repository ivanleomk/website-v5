"use client";

import { useState } from "react";
import { generateShareURL, type SocialPlatform } from "@/lib/utm";

interface ShareButtonsProps {
  url: string;
  title?: string;
}

export default function ShareButtons({ url, title }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const platforms: { name: string; platform: SocialPlatform; icon: string }[] = [
    { name: "X", platform: "x", icon: "𝕏" },
    { name: "LinkedIn", platform: "linkedin", icon: "in" },
    { name: "Threads", platform: "threads", icon: "@" },
  ];

  const handleCopyLink = async (platform: SocialPlatform) => {
    const { trackedURL } = generateShareURL(url, platform);
    
    try {
      await navigator.clipboard.writeText(trackedURL);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleShare = (platform: SocialPlatform) => {
    const { shareLink } = generateShareURL(url, platform);
    window.open(shareLink, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="flex flex-col gap-3 mt-8 pt-6 border-t border-[#e5e5e5]">
      <p className="text-[13px] text-[#676767] font-sans">
        Share this post:
      </p>
      
      <div className="flex gap-2 flex-wrap">
        {platforms.map(({ name, platform, icon }) => (
          <button
            key={platform}
            onClick={() => handleShare(platform)}
            className="px-3 py-1.5 text-[13px] font-sans border border-[#e5e5e5] rounded hover:border-[#282828] hover:text-[#282828] text-[#676767] transition-colors"
            aria-label={`Share on ${name}`}
          >
            {icon} {name}
          </button>
        ))}
        
        <button
          onClick={() => handleCopyLink("x")}
          className="px-3 py-1.5 text-[13px] font-sans border border-[#e5e5e5] rounded hover:border-[#282828] hover:text-[#282828] text-[#676767] transition-colors"
          aria-label="Copy link with UTM tracking"
        >
          {copied ? "✓ Copied!" : "📋 Copy Link"}
        </button>
      </div>
      
      <p className="text-[11px] text-[#999] font-sans mt-1">
        Links include tracking params for analytics
      </p>
    </div>
  );
}
