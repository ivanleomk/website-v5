/**
 * Simple source tracking for blog shares
 * 
 * Appends `?source=blog` to URLs when sharing from the blog.
 * Preserves existing query parameters.
 * 
 * @example
 * addSourceParam("https://ivanleo.com/blog/my-post")
 * // → https://ivanleo.com/blog/my-post?source=blog
 * 
 * @example
 * addSourceParam("https://ivanleo.com/blog/my-post?ref=newsletter")
 * // → https://ivanleo.com/blog/my-post?ref=newsletter&source=blog
 */
export function addSourceParam(url: string): string {
  try {
    const urlObj = new URL(url);
    const searchParams = urlObj.searchParams;
    
    // Don't double-append if source param already exists
    if (searchParams.has('source')) {
      return url;
    }
    
    searchParams.set('source', 'blog');
    return urlObj.toString();
  } catch (error) {
    // If URL parsing fails, return original
    console.error('Failed to add source param:', error);
    return url;
  }
}
