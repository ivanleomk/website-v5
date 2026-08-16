"use client";

import { useState, FormEvent } from "react";

interface NewsletterSignupProps {
  className?: string;
}

type SubmitState = "idle" | "loading" | "success" | "error";

export default function NewsletterSignup({ className = "" }: NewsletterSignupProps) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<SubmitState>("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (state === "loading") return;
    if (!email.trim()) return;

    setState("loading");
    setMessage("");

    try {
      const secret = process.env.NEXT_PUBLIC_NEWSLETTER_SECRET;
      
      const response = await fetch("https://workingnotes.net/sign-up", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
          source: "ivanleo.com",
          secret: secret,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setState("success");
        if (data.status === "pending") {
          setMessage(data.message || "Check your inbox to confirm your subscription.");
        } else if (data.status === "already_active") {
          setMessage(data.message || "You're already subscribed.");
        } else {
          setMessage(data.message || "Thanks for subscribing!");
        }
        setEmail("");
      } else {
        setState("error");
        setMessage(data.error || "Something went wrong. Please try again.");
      }
    } catch (error) {
      setState("error");
      setMessage("Network error. Please try again.");
    }
  };

  return (
    <div className={className}>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="flex gap-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            required
            disabled={state === "loading"}
            className="flex-1 px-3 py-2 text-[15px] border border-[#e5e5e5] rounded-none focus:outline-none focus:border-[#282828] disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <button
            type="submit"
            disabled={state === "loading" || !email.trim()}
            className="px-4 py-2 text-[15px] text-[#282828] border border-[#282828] hover:bg-[#282828] hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {state === "loading" ? "..." : "Subscribe"}
          </button>
        </div>
        {message && (
          <p
            className={`text-[14px] ${
              state === "error" ? "text-red-600" : "text-[#676767]"
            }`}
          >
            {message}
          </p>
        )}
      </form>
    </div>
  );
}
