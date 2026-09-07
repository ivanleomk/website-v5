/**
 * Tests for UTM tracking utilities
 * Run with: node --test src/lib/__tests__/utm.test.ts
 */

import { addUTMParams, generateShareURL } from '../utm';

// Simple test runner
function test(name: string, fn: () => void) {
  try {
    fn();
    console.log(`✓ ${name}`);
  } catch (error) {
    console.error(`✗ ${name}`);
    console.error(error);
    process.exit(1);
  }
}

function assertEquals(actual: unknown, expected: unknown) {
  if (actual !== expected) {
    throw new Error(`Expected ${expected}, got ${actual}`);
  }
}

function assertContains(str: string, substr: string) {
  if (!str.includes(substr)) {
    throw new Error(`Expected string to contain "${substr}", got: ${str}`);
  }
}

// Tests
test('addUTMParams: basic usage with platform string', () => {
  const url = addUTMParams('https://ivanleo.com/blog/my-post', 'x');
  assertEquals(
    url, 
    'https://ivanleo.com/blog/my-post?utm_source=x&utm_medium=social&utm_campaign=my-post'
  );
});

test('addUTMParams: with custom parameters', () => {
  const url = addUTMParams('https://ivanleo.com/blog/my-post', {
    source: 'linkedin',
    campaign: 'launch-week',
    content: 'variant-a'
  });
  assertContains(url, 'utm_source=linkedin');
  assertContains(url, 'utm_medium=social');
  assertContains(url, 'utm_campaign=launch-week');
  assertContains(url, 'utm_content=variant-a');
});

test('addUTMParams: preserves existing query params', () => {
  const url = addUTMParams('https://ivanleo.com/blog/my-post?ref=newsletter', 'x');
  assertContains(url, 'ref=newsletter');
  assertContains(url, 'utm_source=x');
});

test('addUTMParams: does not double-append UTMs', () => {
  const url = 'https://ivanleo.com/blog/my-post?utm_source=existing';
  const result = addUTMParams(url, 'x');
  assertEquals(result, url); // Should return original
});

test('addUTMParams: normalizes platform names', () => {
  const url1 = addUTMParams('https://ivanleo.com/blog/test', 'twitter');
  assertContains(url1, 'utm_source=x');
  
  const url2 = addUTMParams('https://ivanleo.com/blog/test', 'X.com');
  assertContains(url2, 'utm_source=x');
});

test('addUTMParams: extracts campaign from URL', () => {
  const url = addUTMParams('https://ivanleo.com/blog/building-agents', 'linkedin');
  assertContains(url, 'utm_campaign=building-agents');
});

test('addUTMParams: handles homepage', () => {
  const url = addUTMParams('https://ivanleo.com', 'x');
  assertContains(url, 'utm_campaign=home');
});

test('generateShareURL: creates X share link', () => {
  const { trackedURL, shareLink } = generateShareURL('https://ivanleo.com/blog/test', 'x');
  assertContains(trackedURL, 'utm_source=x');
  assertContains(shareLink, 'twitter.com/intent/tweet');
  assertContains(shareLink, encodeURIComponent(trackedURL));
});

test('generateShareURL: creates LinkedIn share link', () => {
  const { trackedURL, shareLink } = generateShareURL('https://ivanleo.com/blog/test', 'linkedin');
  assertContains(trackedURL, 'utm_source=linkedin');
  assertContains(shareLink, 'linkedin.com/sharing/share-offsite');
});

console.log('\n✅ All UTM tests passed!');
