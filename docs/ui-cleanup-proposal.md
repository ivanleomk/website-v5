# UI Cleanup Proposal: Article Pages

## What Makes Articles Feel Messy

The article pages (`src/app/blog/[slug]/page.tsx`) currently mix multiple competing patterns:

1. **Dual measure problem**: The layout has `max-w-[950px]` on the `<main>`, then `max-w-[660px]` for the article, creating nested constraints that feel indecisive.

2. **Typeface mixing**: Inter for UI chrome, Iowan Old Style BT for prose. Two voices fighting. The `prose-headings:font-serif prose-p:font-serif prose-li:font-serif` classes force everything into serif, but the navigation and TOC remain sans.

3. **TOC overreach**: `TableOfContents` appears on every post with headings, positioned absolutely 180px to the left, visible only at `xl:` breakpoint. It adds chrome to short posts that don't need it.

4. **Centered header**: The article header centers the title, stacks author and date vertically, and uses both `text-[#282828]` and `text-[#676767]` for metadata. This creates a "landing page" feel rather than a clean reading experience.

5. **Code block decoration**: GitHub dark theme (`#0d1117` background, `1px solid #21262d` border, `border-radius: 0.5rem`) and explicit `!important` overrides in `globals.css` lines 29-64. Lots of visual weight.

6. **Cover image treatment**: `rounded-xl`, `max-h-[420px]`, `object-cover` — adds another nested max-width container at `900px`. More constraints, more chrome.

## What to Steal (and What to Skip)

### From Lee Robinson

- **One measure throughout**: Lee's posts use a single content width. No nested containers, no sidebar offset math.
- **Quiet nav**: His top nav is barely there — small, muted, out of the way. Current layout has `font-semibold` and `font-medium` nav that competes with content.
- **Left-aligned everything**: Title, date, content. No centered header that breaks the reading flow.
- **Type hierarchy through size and weight only**: No mixing fonts to signal hierarchy. One typeface doing all the work.

### From are.na

- **Air**: Generous margins, breathing room between elements. Current `mb-10` gaps feel tight.
- **Utilitarian restraint**: No rounded corners on everything, no gradients, no decorative borders. Let the content breathe.
- **Blocks, not chrome**: Are.na's channels are just content in space. No sidebar ornaments.

### What NOT to steal

- Are.na's grid-of-blocks homepage is not this site.
- Are.na's image-first channel view doesn't map to technical writing.
- Lee's entire brand and color palette — this is Ivan's site.

## Punch List (Do First → Later)

### Do First

1. **Kill TOC on short posts**: Only show `TableOfContents` if `headings.length >= 4`. Most blog posts don't need it. Change line 83 in `page.tsx` to: `{headings.length >= 4 && <TableOfContents headings={headings} />}`.

2. **One typeface**: Remove the serif. Use Inter everywhere. Delete `prose-headings:font-serif prose-p:font-serif prose-li:font-serif` from line 86 in `page.tsx`. Rely on prose defaults and size differentiation.

3. **Unify the measure**: Remove the outer `max-w-[950px]` from `<main>` on line 55. Use a single `max-w-[680px]` for both article and layout. No nested width logic.

4. **Left-align header**: Move title and metadata to left alignment. Remove `text-center`, `max-w-[570px] mx-auto`, `flex-col items-center` classes from lines 57-66. Make the date inline next to author, separated by a middot: `"Ivan Leo · Nov 26, 2024"`.

5. **De-chrome the code blocks**: Remove `border`, `!important` rules from `globals.css` lines 29-45. Keep the dark background but lose the decoration. Let the code sit flush in the flow.

### Do Later

6. **Widen breathing room**: Increase article `py-16 md:py-24` to `py-20 md:py-32`. Add more `mb-` space between header and body (currently `mb-10`, try `mb-16`).

7. **Simplify cover images**: Remove `rounded-xl`, make them full-bleed within the measure. Remove `max-h-[420px] object-cover` cropping — let images be their natural aspect ratio.

8. **Quiet the nav**: In `layout.tsx` line 28, reduce `font-semibold` to `font-medium`, reduce `text-[15px]` to `text-[14px]`. Make the `/blog` link even quieter: `text-[13px]`.

9. **Inline code consistency**: The `!important` cascade in `globals.css` lines 56-64 is heavy-handed. Remove `!important`, rely on specificity.

10. **Prose color refinement**: The `prose-a:text-[#676767]` on line 86 makes links blend into body text. Try `prose-a:text-[#282828]` with `prose-a:underline` for clarity.

## What to Leave Alone

- No new brand identity, no logo refresh.
- No dark mode (not requested, adds complexity).
- Keep `/blog` index as-is — grid layout is fine.
- Keep `/evals` nav structure unchanged (not in scope).
- Leave Inter as the core typeface (no switching to system fonts or custom serif stacks).
- Keep the existing color palette (`#282828`, `#676767`, `#ffffff`).
- Don't touch homepage or any non-article pages.

---

**Target outcome**: Articles that feel like reading in a quiet room, not browsing a tutorial marketplace. Measure once, breathe deep, get out of the way.
