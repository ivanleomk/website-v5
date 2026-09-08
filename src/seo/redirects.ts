/**
 * Centralized redirect map for SEO cleanup
 * 
 * This file contains all permanent redirects for dead URLs and legacy paths.
 * When Google Search Console or GA reports a 404, add the redirect here.
 * 
 * Structure:
 * - source: The incoming URL path that needs to redirect
 * - destination: The target URL path (must be a live page)
 * - permanent: Always true for SEO (301 redirects)
 * 
 * Adding a new redirect:
 * 1. Verify the destination page exists (curl https://ivanleo.com/destination)
 * 2. Add entry to the appropriate section below
 * 3. Run `npm run seo:check` to validate no conflicts
 * 4. Commit and deploy
 */

export interface Redirect {
  source: string;
  destination: string;
  permanent: boolean;
}

/**
 * Legacy .html redirects - already handled by wildcard rule in next.config.ts
 * but documented here for reference
 */
export const HTML_STRIP_REDIRECT = {
  source: "/blog/:slug.html",
  destination: "/blog/:slug",
  permanent: true,
} as const;

/**
 * Braintrust-related redirects (historical renames)
 */
export const BRAINTRUST_REDIRECTS: Redirect[] = [
  {
    source: "/blog/braintrust-from-scratch",
    destination: "/blog/building-reliable-llm-applications",
    permanent: true,
  },
  {
    source: "/blog/getting-started-with-evals---a-speedrun-through-braintrust",
    destination: "/blog/building-reliable-llm-applications",
    permanent: true,
  },
];

/**
 * Dead blog posts with valid successors
 * These were live posts that have been removed/unpublished
 */
export const DEAD_POST_REDIRECTS: Redirect[] = [
  {
    source: "/blog/are-your-eval-improvements-just-pure-chance",
    destination: "/blog/report-error-bars",
    permanent: true,
  },
  {
    source: "/blog/evaluating-agents",
    destination: "/blog/agentic-search",
    permanent: true,
  },
  {
    source: "/blog/building-an-agent",
    destination: "/blog/agentic-search",
    permanent: true,
  },
  {
    source: "/blog/gpt-react",
    destination: "/blog/migrating-to-react-ink",
    permanent: true,
  },
  {
    source: "/blog/implementing-bpe",
    destination: "/blog",
    permanent: true,
  },
  {
    source: "/blog/the-lay-of-the-land",
    destination: "/blog",
    permanent: true,
  },
  {
    source: "/blog/the-benchmark-is-the-bottleneck",
    destination: "/blog",
    permanent: true,
  },
  {
    source: "/blog/reinventing-gandalf",
    destination: "/blog",
    permanent: true,
  },
  {
    source: "/blog/evals-after-rag",
    destination: "/blog/building-reliable-llm-applications",
    permanent: true,
  },
  {
    source: "/blog/mcps-are-really-llm-microservices",
    destination: "/blog",
    permanent: true,
  },
  {
    source: "/blog/three-styles-of-mcp-loading",
    destination: "/blog",
    permanent: true,
  },
];

/**
 * Legacy archive and category pages
 * These were never implemented but show up in GA due to scrapers/old links
 */
export const ARCHIVE_REDIRECTS: Redirect[] = [
  {
    source: "/blog/archive/:year.html",
    destination: "/blog",
    permanent: true,
  },
  {
    source: "/blog/category/:name.html",
    destination: "/blog",
    permanent: true,
  },
];

/**
 * Series redirects (never implemented)
 */
export const SERIES_REDIRECTS: Redirect[] = [
  {
    source: "/series/openclawd-from-scratch",
    destination: "/blog",
    permanent: true,
  },
];

/**
 * Combined export of all redirects
 * Import this in next.config.ts
 */
export const ALL_REDIRECTS: Redirect[] = [
  ...BRAINTRUST_REDIRECTS,
  ...DEAD_POST_REDIRECTS,
  ...ARCHIVE_REDIRECTS,
  ...SERIES_REDIRECTS,
];

/**
 * Get all redirect source paths (for validation)
 */
export function getRedirectSources(): string[] {
  return ALL_REDIRECTS.map((r) => r.source);
}

/**
 * Get all redirect destination paths (for validation)
 */
export function getRedirectDestinations(): string[] {
  return ALL_REDIRECTS.map((r) => r.destination);
}
