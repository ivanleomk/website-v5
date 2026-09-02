# SEO Automation Implementation

**Date:** 2026-09-02  
**Context:** Radar audit identified 404s and soft-404s with GSC impressions

## What Was Implemented

### 1. Central Redirect Map (`src/seo/redirects.ts`)

Created a centralized redirect configuration file that replaces inline redirects in `next.config.ts`. This makes adding new redirects much easier and more maintainable.

**Structure:**
- `BRAINTRUST_REDIRECTS` - Historical renames
- `DEAD_POST_REDIRECTS` - Unpublished posts with valid successors
- `ARCHIVE_REDIRECTS` - Legacy archive/category pages
- `SERIES_REDIRECTS` - Series pages that were never implemented

**Benefits:**
- All redirects in one place
- Easy to add new redirects (just add to appropriate array)
- Self-documenting with comments
- Type-safe with TypeScript

### 2. Automated SEO Check (`scripts/seo-check.mjs`)

Created a validation script that prevents conflicts between redirects and live content.

**What it checks:**
- No redirect source conflicts with live content slugs
- Lists all live posts from content directory
- Lists all redirect sources for review

**Usage:**
```bash
npm run seo:check
```

**Added to package.json** as `seo:check` script for CI/build validation.

### 3. Sitemap Hygiene

The sitemap already only emits live posts because it uses the generated registry from `scripts/generate-blog-registry.mjs`. This script:
1. Scans `src/content/blog/*.mdx` files
2. Generates `src/content/blog/registry.ts`
3. Sitemap imports from registry

**Result:** Dead posts automatically excluded from sitemap.

### 4. Homepage SEO Improvements

**Added to `src/app/page.tsx`:**
- H1 heading: "Developer Experience Engineer & AI/LLM Consultant"
- Canonical URL: `https://ivanleo.com`
- Enhanced meta description targeting key terms (DeepMind, Gemini, evals, agents)
- OpenGraph tags for social sharing

**Before:** Generic "Personal blog" with no H1  
**After:** Descriptive title, proper heading hierarchy, canonical URL

### 5. Instructor Post Meta Optimization

**Updated `src/content/blog/how-does-instructor-work.mdx` frontmatter:**

```typescript
// Before
title: "How does Instructor work?"
description: "How your request goes from chat completion to validated Pydantic model."

// After  
title: "How Instructor Works: from_openai, AsyncOpenAI, and response_model Explained"
description: "Complete guide to Instructor's from_openai wrapper, AsyncOpenAI support, and response_model parameter. Learn how chat completions become validated Pydantic models with OpenAI structured outputs."
```

**Targets high-intent keywords:**
- `from_openai`
- `AsyncOpenAI`
- `response_model`
- OpenAI structured outputs

These are the terms causing high impressions with low CTR (0.02%).

### 6. Documentation

Created two documentation files:

1. **`docs/seo-redirects.md`** - Complete guide for adding redirects
   - Step-by-step instructions
   - Common patterns and examples
   - Troubleshooting guide
   - Monitoring instructions

2. **`docs/seo-implementation.md`** (this file) - Implementation details and verification

## Redirects Added

### Dead Posts → Live Successors

| Source | Destination | Reason |
|--------|-------------|---------|
| `/blog/are-your-eval-improvements-just-pure-chance` | `/blog/report-error-bars` | Same topic (statistical significance in evals) |
| `/blog/evaluating-agents` | `/blog/agentic-search` | Agent evaluation covered in agentic search post |
| `/blog/building-an-agent` | `/blog/agentic-search` | Agent building covered in agentic search post |
| `/blog/gpt-react` | `/blog/migrating-to-react-ink` | Closest successor (CLI/React Ink) |
| `/blog/implementing-bpe` | `/blog` | No close successor |
| `/blog/the-lay-of-the-land` | `/blog` | Soft-404, no successor |
| `/blog/the-benchmark-is-the-bottleneck` | `/blog` | Draft not published |
| `/blog/reinventing-gandalf` | `/blog` | No close successor |

### Legacy Paths → Blog Index

| Source | Destination |
|--------|-------------|
| `/blog/archive/:year.html` | `/blog` |
| `/blog/category/:name.html` | `/blog` |
| `/series/openclawd-from-scratch` | `/blog` |

### Existing (Preserved)

| Source | Destination | Reason |
|--------|-------------|---------|
| `/blog/:slug.html` | `/blog/:slug` | Legacy .html URLs (wildcard) |
| `/blog/braintrust-from-scratch` | `/blog/building-reliable-llm-applications` | Historical rename |
| `/blog/getting-started-with-evals---a-speedrun-through-braintrust` | `/blog/building-reliable-llm-applications` | Historical rename |

## Verification

### Build Test

```bash
npm run build
```

**Result:** ✅ Build successful, all redirects compiled

**Output:**
```
Route (app)
├ ○ /
├ ○ /blog
├ ● /blog/[slug]
│ ├ /blog/agentic-search
│ ├ /blog/building-reliable-llm-applications
│ └ [+9 more paths]
├ ○ /robots.txt
└ ○ /sitemap.xml
```

### SEO Check

```bash
npm run seo:check
```

**Result:** ✅ No conflicts found

**Summary:**
- 14 redirect sources
- 11 live blog posts
- 0 conflicts

### Redirect Verification

Tested redirects in build output:

```bash
cat .next/routes-manifest.json | jq -r '.redirects[]'
```

**Verified redirects:**
- `/blog/:slug.html` → `/blog/:slug` ✅
- `/blog/the-lay-of-the-land` → `/blog` ✅
- `/blog/evaluating-agents` → `/blog/agentic-search` ✅
- `/blog/building-an-agent` → `/blog/agentic-search` ✅
- `/blog/are-your-eval-improvements-just-pure-chance` → `/blog/report-error-bars` ✅
- `/blog/gpt-react` → `/blog/migrating-to-react-ink` ✅
- All archive/category wildcards ✅

### Redirect Chain Test

**Test:** Does `.html` + dead slug redirect work?

```
/blog/are-your-eval-improvements-just-pure-chance.html
  → [strip .html] → /blog/are-your-eval-improvements-just-pure-chance
  → [dead slug] → /blog/report-error-bars
```

**Result:** ✅ Works (tested via curl, returned 308 Permanent Redirect)

Next.js handles the chain correctly:
1. First redirect strips `.html`
2. Second redirect resolves dead slug

### Live Page Verification

Confirmed these destination pages exist as live posts:
- ✅ `/blog/agentic-search`
- ✅ `/blog/report-error-bars`
- ✅ `/blog/migrating-to-react-ink`
- ✅ `/blog/building-reliable-llm-applications`
- ✅ `/blog` (blog index)

## Impact

### Before
- ❌ 72 clicks / 24k impressions (0.3% CTR overall)
- ❌ Instructor post: 0.02% CTR despite high impressions
- ❌ Many 404s with GA sessions
- ❌ Soft-404 `/blog/the-lay-of-the-land` still indexing
- ❌ No H1 on homepage
- ❌ Generic "Personal blog" meta

### After
- ✅ All dead URLs redirect to live pages
- ✅ Soft-404 redirects to `/blog` (will stop indexing)
- ✅ Instructor post title/meta optimized for keywords
- ✅ Homepage has H1 + canonical + descriptive meta
- ✅ Easy to add new redirects (one line in `redirects.ts`)
- ✅ Automated validation prevents conflicts
- ✅ Sitemap only contains live posts

### Expected Results
- Increased CTR on Instructor post (better title/description)
- Reduced bounce rate (404s → redirects)
- Better crawl efficiency (GSC sees clean structure)
- Link equity preserved (301s pass PageRank)

## Maintenance

### Adding a New Redirect

1. Edit `src/seo/redirects.ts`
2. Add entry to appropriate array
3. Run `npm run seo:check`
4. Commit and deploy

**Example:**
```typescript
{
  source: "/blog/old-post",
  destination: "/blog/new-post",
  permanent: true,
}
```

See `docs/seo-redirects.md` for complete guide.

### Monitoring

**Google Search Console:**
- Check "Coverage" → "Excluded" → "Not found (404)"
- Review URLs with impressions
- Add redirects for any with traffic

**Google Analytics:**
- Behavior → Site Content → All Pages
- Filter for 404 pages
- Check bounce rate and sessions

**Sitemap:**
After adding redirects, resubmit sitemap to GSC:
```
https://ivanleo.com/sitemap.xml
```

## Architecture

```
Content Files (src/content/blog/*.mdx)
  ↓
Registry Generation (scripts/generate-blog-registry.mjs)
  ↓
Registry File (src/content/blog/registry.ts)
  ↓
├→ Sitemap (src/app/sitemap.ts) - Uses registry for live posts
└→ Blog Pages (src/app/blog/[slug]/page.tsx)

Redirect Config (src/seo/redirects.ts)
  ↓
Next Config (next.config.ts)
  ↓
Build Output (.next/routes-manifest.json)
  ↓
Runtime (Next.js serves 301/308 redirects)

Validation (scripts/seo-check.mjs)
  ↓
├→ Checks: No conflicts between redirects and live content
└→ Reports: Live posts vs redirect sources
```

## Future Improvements

### Optional Enhancements (Not Required)

1. **CI Integration** - Add `npm run seo:check` to CI pipeline
   ```yaml
   - run: npm run seo:check
   ```

2. **Redirect Testing** - Add unit tests for redirect logic
   ```typescript
   test('dead post redirects to successor', () => {
     expect(getRedirect('/blog/dead-slug')).toBe('/blog/live-slug');
   });
   ```

3. **Analytics Dashboard** - Track redirect usage
   - Which redirects get most traffic?
   - Are there patterns in 404s?

4. **Auto-redirect Suggestions** - Script to analyze GA 404s
   ```bash
   npm run seo:suggest-redirects
   ```

5. **Redirect Consolidation** - Periodically review chains
   - `/a → /b → /c` becomes `/a → /c`

## Questions & Troubleshooting

See `docs/seo-redirects.md` for:
- How to add redirects
- Common patterns
- Troubleshooting guide
- Examples

## Summary

✅ **Automated:** Redirects are now a data file, not scattered in config  
✅ **Validated:** SEO check script prevents conflicts  
✅ **Documented:** Clear guide for adding redirects  
✅ **Clean:** Sitemap only contains live posts  
✅ **Optimized:** Homepage and Instructor post SEO improved  
✅ **Tested:** Build succeeds, redirects work, no conflicts  

All dead URLs from Radar audit now redirect to appropriate successors. The system is ready for ongoing SEO maintenance.
