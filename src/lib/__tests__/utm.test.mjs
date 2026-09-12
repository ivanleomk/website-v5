/**
 * Simple tests for source tracking
 * Run with: node src/lib/__tests__/utm.test.mjs
 */

// Manual test cases
const testCases = `
// Test 1: Basic usage
import { addSourceParam } from '@/lib/utm';

const url1 = addSourceParam('https://ivanleo.com/blog/my-post');
console.log(url1);
// Expected: https://ivanleo.com/blog/my-post?source=blog

// Test 2: Preserves existing params
const url2 = addSourceParam('https://ivanleo.com/blog/my-post?ref=newsletter');
console.log(url2);
// Expected: https://ivanleo.com/blog/my-post?ref=newsletter&source=blog

// Test 3: Doesn't double-append
const url3 = addSourceParam('https://ivanleo.com/blog/my-post?source=blog');
console.log(url3);
// Expected: https://ivanleo.com/blog/my-post?source=blog (unchanged)
`;

console.log('Source Tracking Test Cases');
console.log('='.repeat(50));
console.log('\nManual test code:');
console.log(testCases);
console.log('\nTo test in the Next.js app:');
console.log('1. Navigate to any blog post (e.g., http://localhost:3000/blog/agentic-search)');
console.log('2. Click "Copy link to share" button below the article');
console.log('3. Paste and verify URL includes ?source=blog');
console.log('\nExpected format: https://ivanleo.com/blog/agentic-search?source=blog');
