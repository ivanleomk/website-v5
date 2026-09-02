import Link from "next/link";
import type { Metadata } from "next";
import { blogPosts } from "@/content/blog/registry";

export const metadata: Metadata = {
  title: "Page Not Found - Ivan Leo",
  description: "The page you're looking for doesn't exist.",
};

/**
 * Get a curated list of suggested essays for the 404 page.
 * Prefers agent/eval-focused posts based on site focus.
 */
function getSuggestedPosts() {
  // Priority slugs for 404 suggestions (evals/agents bias)
  const prioritySlugs = [
    "write-stupid-evals",
    "agentic-search",
    "building-reliable-llm-applications",
    "how-does-instructor-work",
  ];

  // Try to pull from registry to stay in sync with live posts
  const suggested = prioritySlugs
    .map((slug) => blogPosts.find((post) => post.slug === slug))
    .filter((post) => post !== undefined)
    .slice(0, 4)
    .map((post) => ({
      slug: post.slug,
      title: post.frontmatter.title ?? post.slug,
      description: post.frontmatter.description ?? "",
    }));

  return suggested;
}

export default function NotFound() {
  const suggestions = getSuggestedPosts();

  return (
    <main className="max-w-[800px] mx-auto px-6 py-12 md:py-16">
      <div className="mb-16">
        <h1 className="font-sans text-[32px] font-bold text-[#282828] mb-4">
          Page Not Found
        </h1>
        <p className="font-serif text-[17px] text-[#676767] leading-[1.65]">
          This page doesn't exist. Try one of these essays instead.
        </p>
      </div>

      <section className="border-t border-gray-100 pt-10">
        <h2 className="font-sans text-[13px] font-bold uppercase tracking-widest text-[#676767] mb-6">
          Suggested Reading
        </h2>
        <ul className="list-none p-0 m-0 space-y-6">
          {suggestions.map((post) => (
            <li key={post.slug} className="group">
              <Link
                href={`/blog/${post.slug}`}
                className="block no-underline text-inherit"
              >
                <span className="font-serif text-[17px] font-medium group-hover:text-[#676767] transition-colors">
                  {post.title}
                </span>
                <p className="mt-1 text-[14px] font-serif text-[#676767] leading-relaxed">
                  {post.description}
                </p>
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-8 pt-6 border-t border-gray-100">
          <Link
            href="/blog"
            className="inline-block font-sans text-[14px] text-[#676767] hover:text-[#282828] transition-colors underline underline-offset-2"
          >
            View all essays →
          </Link>
        </div>
      </section>

      <footer className="mt-20 pt-8 border-t border-gray-100 flex justify-between items-center text-[13px] font-sans text-[#676767]">
        <p>© {new Date().getFullYear()} Ivan Leo. All rights reserved.</p>
        <div className="flex gap-6">
          <a
            href="https://twitter.com/ivanleomk"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-black transition-colors"
          >
            Twitter
          </a>
          <a
            href="https://github.com/ivanleomk"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-black transition-colors"
          >
            GitHub
          </a>
        </div>
      </footer>
    </main>
  );
}
