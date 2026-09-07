# UTM Tracking Convention

This site uses UTM parameters to track social media referrals in Google Analytics.

## Standard Parameters

All social media links use these UTM parameters:

- **utm_source**: Platform name (`x`, `linkedin`, `threads`, `bluesky`, `mastodon`, etc.)
- **utm_medium**: Always `social` for social media shares
- **utm_campaign**: Blog post slug (auto-extracted from URL) or custom campaign name
- **utm_content**: _(optional)_ Variant identifier for A/B testing different post versions

## Usage

### On-Site Share Buttons

Blog posts include share buttons that automatically add UTM parameters. Users can:
- Click a platform button to open a pre-filled share dialog
- Click "Copy Link" to copy a tracked URL to clipboard

### Manual Link Sharing

When manually sharing links outside the site (e.g., in a social media scheduler or bot):

```javascript
import { addUTMParams } from '@/lib/utm';

// Simple usage
const url = addUTMParams('https://ivanleo.com/blog/my-post', 'x');
// → https://ivanleo.com/blog/my-post?utm_source=x&utm_medium=social&utm_campaign=my-post

// With custom campaign
const url = addUTMParams('https://ivanleo.com/blog/my-post', {
  source: 'linkedin',
  campaign: 'launch-week',
  content: 'variant-a'
});
```

### Quick Reference

For manual URL construction, append these query params:

```
?utm_source=x&utm_medium=social&utm_campaign=my-post
```

Replace `my-post` with the actual blog slug and `x` with the platform name.

## Supported Platforms

- `x` (Twitter)
- `linkedin`
- `threads`
- `bluesky`
- `mastodon`
- `facebook`
- `reddit`
- `other` (for unlisted platforms)

## Analytics

View UTM data in Google Analytics:
- Reports → Acquisition → Traffic acquisition
- Filter by `utm_source` to see social platform breakdown
- Filter by `utm_campaign` to see per-post performance

## Implementation

- **Helper**: `src/lib/utm.ts` - Core UTM generation logic
- **Component**: `src/components/share-buttons.tsx` - Share UI on blog posts
- **Integration**: `src/app/blog/[slug]/page.tsx` - Renders share buttons below articles

## Design Principles

1. **Non-breaking**: Preserves existing query params, doesn't double-append UTMs
2. **Fail-safe**: Returns original URL if parsing fails
3. **Convention over configuration**: Auto-extracts campaign from URL structure
4. **Minimal UI**: Share buttons match site's minimal design aesthetic
