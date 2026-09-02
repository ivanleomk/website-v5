# SEO Redirects Guide

This document explains how to add and manage redirects for ivanleo.com.

## Quick Start

When Google Search Console or Google Analytics reports a 404 error:

1. **Verify the URL is dead** - Check that the page truly doesn't exist
2. **Find the best successor** - Identify a live page with similar content
3. **Add the redirect** - Edit `src/seo/redirects.ts`
4. **Validate** - Run `npm run seo:check`
5. **Deploy** - Commit and push to deploy

## Adding a Redirect

### Step 1: Choose the Right Section

Open `src/seo/redirects.ts` and find the appropriate section:

- **BRAINTRUST_REDIRECTS** - Historical renames of posts about Braintrust
- **DEAD_POST_REDIRECTS** - Blog posts that have been unpublished
- **ARCHIVE_REDIRECTS** - Archive/category pages (if they exist)
- **SERIES_REDIRECTS** - Series pages (if they exist)

### Step 2: Add Your Redirect

Add a new entry to the appropriate array:

```typescript
{
  source: "/blog/your-dead-slug",
  destination: "/blog/your-target-slug",
  permanent: true,  // Always true for SEO (301 redirects)
}
```

**Important:** 
- `source` must match the dead URL exactly
- `destination` must point to a live page (verify with curl or browser)
- Always use `permanent: true` for SEO purposes (301 redirect)

### Step 3: Verify the Destination Exists

Before adding the redirect, verify the destination page is live:

```bash
curl -I https://ivanleo.com/blog/your-target-slug
# Should return: HTTP/2 200
```

### Step 4: Run the SEO Check

```bash
npm run seo:check
```

This validates:
- No redirect sources conflict with live content slugs
- No circular redirects
- All redirects are properly formatted

### Step 5: Test Locally

```bash
npm run dev
```

Navigate to the dead URL in your browser and verify it redirects to the correct destination.

### Step 6: Deploy

```bash
git add src/seo/redirects.ts
git commit -m "Add redirect for /blog/dead-slug"
git push
```

## Common Patterns

### Redirect to Homepage or Blog Index

When there's no good successor:

```typescript
{
  source: "/blog/old-post-with-no-successor",
  destination: "/blog",
  permanent: true,
}
```

### Redirect with .html Extension

The `.html` → no-extension redirect is automatic via wildcard rule:

```typescript
// Already handled automatically:
// /blog/my-post.html → /blog/my-post
```

Dead slugs will also redirect correctly after the .html strip:
```
/blog/dead-slug.html → /blog/dead-slug (stripped) → /blog (redirected)
```

### Redirect Category/Archive Pages

For scrapers hitting non-existent archive pages:

```typescript
{
  source: "/blog/category/:name.html",
  destination: "/blog",
  permanent: true,
}
```

## Troubleshooting

### Conflict Error

If `npm run seo:check` reports a conflict:

```
❌ CONFLICTS FOUND
The following slugs exist as both redirects and live posts:
  - example-slug
```

**Solution:** You're trying to redirect a URL that has a live post. Either:
1. Remove the redirect (if the post is intentionally live)
2. Unpublish the post (delete the .mdx file) if it should be dead

### Redirect Not Working

1. **Check the source path** - Must match exactly (case-sensitive)
2. **Verify destination exists** - Run `curl -I https://ivanleo.com/destination`
3. **Clear browser cache** - Hard refresh (Cmd+Shift+R / Ctrl+Shift+F5)
4. **Check build logs** - Verify redirect was compiled into Next.js build

### Redirect Chain

If you have:
```
/a → /b → /c
```

**Better approach:** Redirect directly:
```typescript
// Instead of /a → /b, then /b → /c
{ source: "/a", destination: "/c", permanent: true }
{ source: "/b", destination: "/c", permanent: true }
```

This reduces latency and improves SEO.

## Architecture

### How Redirects Work

1. **Source of Truth:** `src/seo/redirects.ts` contains all redirect definitions
2. **Build Time:** `next.config.ts` imports and compiles redirects
3. **Runtime:** Next.js serves 301 redirects automatically
4. **Validation:** `scripts/seo-check.mjs` prevents conflicts

### Why This Approach?

- **Centralized:** All redirects in one file, not scattered in next.config.ts
- **Documented:** Each section explains what the redirects are for
- **Validated:** Automated checks prevent mistakes
- **Maintainable:** Easy to add new redirects without touching config

### Sitemap Integration

The sitemap (`src/app/sitemap.ts`) only includes live posts from the registry. Dead posts automatically excluded, so:

1. ✅ Live posts appear in sitemap
2. ✅ Dead posts redirect but don't appear in sitemap
3. ✅ Google Search Console gets clean signal

## Monitoring

### Check for 404s

**Google Search Console:**
1. Go to [Coverage Report](https://search.google.com/search-console)
2. Check "Excluded" → "Not found (404)"
3. Add redirects for any URLs with traffic

**Google Analytics:**
1. Behavior → Site Content → All Pages
2. Filter for 404 or error pages
3. Review bounce rate and sessions
4. Add redirects for high-traffic 404s

### Resubmit Sitemap

After adding redirects, resubmit the sitemap to Google:
```
https://ivanleo.com/sitemap.xml
```

This tells Google to recrawl and recognize the new structure.

## Examples

### Example 1: Post Renamed

Old post was about "eval improvements" but title/slug changed:

```typescript
{
  source: "/blog/are-your-eval-improvements-just-pure-chance",
  destination: "/blog/report-error-bars",
  permanent: true,
}
```

### Example 2: Post Merged

Two posts about agents merged into one:

```typescript
{
  source: "/blog/evaluating-agents",
  destination: "/blog/agentic-search",
  permanent: true,
},
{
  source: "/blog/building-an-agent", 
  destination: "/blog/agentic-search",
  permanent: true,
}
```

### Example 3: No Good Successor

Old post about BPE has no successor:

```typescript
{
  source: "/blog/implementing-bpe",
  destination: "/blog",
  permanent: true,
}
```

## Questions?

If you're unsure about:
- Which destination to use → Choose the closest topical match, or fallback to `/blog`
- Whether to redirect → If it has GSC impressions or GA sessions, redirect it
- Redirect not working → Check build logs and verify with `curl -I`

For more help, see:
- [Next.js Redirects Docs](https://nextjs.org/docs/app/api-reference/next-config-js/redirects)
- [Google Search Console](https://search.google.com/search-console)
- [MDN: HTTP 301](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/301)
