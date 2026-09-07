/**
 * Quick manual tests for UTM tracking utilities
 * Run with: node src/lib/__tests__/utm.test.mjs
 */

// Manual test cases - paste these into a browser console or TypeScript playground
const testCases = `
// Test 1: Basic usage
import { addUTMParams } from '@/lib/utm';

const url1 = addUTMParams('https://ivanleo.com/blog/my-post', 'x');
console.log(url1);
// Expected: https://ivanleo.com/blog/my-post?utm_source=x&utm_medium=social&utm_campaign=my-post

// Test 2: Preserves existing params
const url2 = addUTMParams('https://ivanleo.com/blog/my-post?ref=newsletter', 'linkedin');
console.log(url2);
// Expected: includes both ref=newsletter and utm_* params

// Test 3: Custom parameters
const url3 = addUTMParams('https://ivanleo.com/blog/my-post', {
  source: 'linkedin',
  campaign: 'launch-week',
  content: 'variant-a'
});
console.log(url3);

// Test 4: Platform normalization
const url4 = addUTMParams('https://ivanleo.com/blog/test', 'twitter');
console.log(url4);
// Expected: utm_source=x (normalized from twitter)

// Test 5: Generate share URLs
import { generateShareURL } from '@/lib/utm';

const { trackedURL, shareLink } = generateShareURL('https://ivanleo.com/blog/test', 'x');
console.log('Tracked URL:', trackedURL);
console.log('Share link:', shareLink);
`;

console.log('UTM Test Cases');
console.log('='.repeat(50));
console.log('\nManual test code for browser/TS playground:');
console.log(testCases);
console.log('\nTo test in the Next.js app:');
console.log('1. Navigate to any blog post (e.g., http://localhost:3000/blog/agentic-search)');
console.log('2. Check for share buttons below the article');
console.log('3. Click "Copy Link" and paste to verify UTM params are present');
console.log('4. Click a platform button to verify share dialog opens with tracked URL');
console.log('\nExpected UTM format: ?utm_source=x&utm_medium=social&utm_campaign=agentic-search');
