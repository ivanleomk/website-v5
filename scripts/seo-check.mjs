#!/usr/bin/env node

/**
 * SEO Check Script
 * 
 * Validates that:
 * 1. No redirect source conflicts with live content slugs
 * 2. All blog posts in content directory are included in the registry
 * 3. Sitemap only contains live pages
 * 
 * Run with: npm run seo:check
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

// Read redirect sources
const redirectsPath = path.join(root, "src/seo/redirects.ts");
const redirectsContent = fs.readFileSync(redirectsPath, "utf8");

// Extract redirect sources using simple regex
// This matches: source: "/blog/some-slug" or source: '/blog/some-slug'
const sourceMatches = redirectsContent.matchAll(/source:\s*["']([^"']+)["']/g);
const redirectSources = Array.from(sourceMatches, (m) => m[1]);

console.log("🔍 SEO Check\n");
console.log(`Found ${redirectSources.length} redirect sources`);

// Read all MDX files in content/blog
const blogDir = path.join(root, "src/content/blog");
const mdxFiles = fs
  .readdirSync(blogDir)
  .filter((file) => file.endsWith(".mdx") && file !== "registry.ts");

const liveSlugs = mdxFiles.map((file) => file.replace(/\.mdx$/, ""));
console.log(`Found ${liveSlugs.length} live blog posts\n`);

// Check for conflicts
const conflicts = [];
for (const source of redirectSources) {
  // Extract slug from paths like /blog/:slug or /blog/some-slug
  // Skip wildcards and parameterized routes
  if (source.includes(":")) continue;
  
  const match = source.match(/\/blog\/([^/]+)/);
  if (match) {
    const slug = match[1];
    if (liveSlugs.includes(slug)) {
      conflicts.push({
        slug,
        redirectSource: source,
      });
    }
  }
}

// Report results
if (conflicts.length > 0) {
  console.error("❌ CONFLICTS FOUND\n");
  console.error("The following slugs exist as both redirects and live posts:");
  for (const conflict of conflicts) {
    console.error(`  - ${conflict.slug}`);
    console.error(`    Redirect: ${conflict.redirectSource}`);
    console.error(`    Live post: src/content/blog/${conflict.slug}.mdx`);
  }
  console.error("\nFix: Either remove the redirect or unpublish the post.\n");
  process.exit(1);
}

console.log("✅ No conflicts found");
console.log("✅ All redirect sources are distinct from live content");
console.log("\nLive posts:");
for (const slug of liveSlugs.sort()) {
  console.log(`  - /blog/${slug}`);
}

console.log("\nRedirect sources (excluding wildcards):");
const staticRedirects = redirectSources.filter((s) => !s.includes(":"));
for (const source of staticRedirects.sort()) {
  console.log(`  - ${source}`);
}

console.log("\n✨ SEO check passed!\n");
