# Source Tracking

Blog posts include a simple source parameter for tracking shares: `?source=blog`

## Convention

When sharing blog post URLs from the site, append `?source=blog` (or `&source=blog` if the URL already has query parameters).

**Example:**
```
https://ivanleo.com/blog/my-post
  ↓
https://ivanleo.com/blog/my-post?source=blog
```

## Usage

### On-Site Copy Link

Blog posts include a "Copy link to share" button that automatically appends `?source=blog` to the URL.

### Manual Sharing

When manually sharing links (e.g., from a social media scheduler or automation):

```typescript
import { addSourceParam } from '@/lib/utm';

const url = addSourceParam('https://ivanleo.com/blog/my-post');
// → https://ivanleo.com/blog/my-post?source=blog
```

Or simply append manually:
```
https://ivanleo.com/blog/my-post?source=blog
```

## Implementation

- **Helper**: `src/lib/utm.ts` - `addSourceParam()` function
- **Component**: `src/components/share-buttons.tsx` - Minimal copy link button
- **Integration**: `src/app/blog/[slug]/page.tsx` - Renders below articles

The helper preserves existing query parameters and won't double-append if `source` already exists.
