/**
 * UTM tracking utilities for social media sharing
 * 
 * Convention:
 * - utm_source: platform name (x, linkedin, threads, bluesky, mastodon, etc.)
 * - utm_medium: social
 * - utm_campaign: blog post slug or custom campaign name
 * - utm_content: optional variant/post identifier for A/B testing
 * 
 * Usage in social posts:
 * When sharing ivanleo.com links on social media, use addUTMParams() to generate
 * tracked URLs. This helps attribute traffic in Google Analytics.
 * 
 * Example:
 *   addUTMParams("https://ivanleo.com/blog/my-post", "x")
 *   → https://ivanleo.com/blog/my-post?utm_source=x&utm_medium=social&utm_campaign=my-post
 */

export type SocialPlatform = 
  | "x" 
  | "linkedin" 
  | "threads" 
  | "bluesky" 
  | "mastodon" 
  | "facebook" 
  | "reddit"
  | "other";

export interface UTMParams {
  source: SocialPlatform;
  medium?: string;
  campaign?: string;
  content?: string;
}

/**
 * Normalize platform names to standard utm_source values
 */
function normalizePlatform(platform: SocialPlatform | string): string {
  const normalized = platform.toLowerCase().trim();
  
  // Map common variations to canonical names
  const platformMap: Record<string, string> = {
    "twitter": "x",
    "x.com": "x",
    "linkedin.com": "linkedin",
    "threads.net": "threads",
    "bsky.app": "bluesky",
  };
  
  return platformMap[normalized] || normalized;
}

/**
 * Extract blog slug from URL for campaign name
 */
function extractCampaign(url: string): string {
  try {
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split('/').filter(Boolean);
    
    // For /blog/slug URLs, use the slug
    if (pathParts[0] === 'blog' && pathParts[1]) {
      return pathParts[1];
    }
    
    // For other URLs, use the first path segment or 'home'
    return pathParts[0] || 'home';
  } catch {
    return 'unknown';
  }
}

/**
 * Add UTM parameters to a URL for social media tracking
 * 
 * @param url - The full URL to add UTM params to
 * @param params - UTM parameters (source is required, others optional)
 * @returns URL with UTM parameters appended
 * 
 * @example
 * addUTMParams("https://ivanleo.com/blog/my-post", { source: "x" })
 * // → https://ivanleo.com/blog/my-post?utm_source=x&utm_medium=social&utm_campaign=my-post
 * 
 * @example
 * addUTMParams("https://ivanleo.com/blog/my-post?ref=newsletter", { 
 *   source: "linkedin",
 *   content: "variant-a"
 * })
 * // → https://ivanleo.com/blog/my-post?ref=newsletter&utm_source=linkedin&utm_medium=social&utm_campaign=my-post&utm_content=variant-a
 */
export function addUTMParams(url: string, params: UTMParams | SocialPlatform): string {
  try {
    const urlObj = new URL(url);
    const searchParams = urlObj.searchParams;
    
    // Don't double-append UTMs if they already exist
    if (searchParams.has('utm_source')) {
      return url;
    }
    
    // Handle shorthand: just pass platform string
    const utmParams: UTMParams = typeof params === 'string' 
      ? { source: params }
      : params;
    
    // Add UTM parameters
    searchParams.set('utm_source', normalizePlatform(utmParams.source));
    searchParams.set('utm_medium', utmParams.medium || 'social');
    searchParams.set('utm_campaign', utmParams.campaign || extractCampaign(url));
    
    if (utmParams.content) {
      searchParams.set('utm_content', utmParams.content);
    }
    
    return urlObj.toString();
  } catch (error) {
    // If URL parsing fails, return original
    console.error('Failed to add UTM params:', error);
    return url;
  }
}

/**
 * Generate social share URLs with UTM tracking
 * 
 * @param url - The URL to share
 * @param platform - The social platform
 * @returns Object with tracked URL and platform-specific share link
 */
export function generateShareURL(url: string, platform: SocialPlatform) {
  const trackedURL = addUTMParams(url, platform);
  const encodedURL = encodeURIComponent(trackedURL);
  
  const shareLinks: Record<SocialPlatform, string> = {
    x: `https://twitter.com/intent/tweet?url=${encodedURL}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedURL}`,
    threads: `https://threads.net/intent/post?text=${encodedURL}`,
    bluesky: `https://bsky.app/intent/compose?text=${encodedURL}`,
    mastodon: trackedURL, // Mastodon doesn't have a universal share intent
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedURL}`,
    reddit: `https://reddit.com/submit?url=${encodedURL}`,
    other: trackedURL,
  };
  
  return {
    trackedURL,
    shareLink: shareLinks[platform],
  };
}
