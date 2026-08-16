import { MetadataRoute } from "next";
import { blogPosts } from "@/content/blog/registry";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://ivanleo.com";

  const blogUrls = blogPosts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: post.frontmatter.date
      ? new Date(post.frontmatter.date)
      : new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    ...blogUrls,
  ];
}
