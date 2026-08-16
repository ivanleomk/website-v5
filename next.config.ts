import createMDX from "@next/mdx";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
  async redirects() {
    return [
      {
        source: "/blog/:slug.html",
        destination: "/blog/:slug",
        permanent: true,
      },
      {
        source: "/blog/braintrust-from-scratch",
        destination: "/blog/building-reliable-llm-applications",
        permanent: true,
      },
      {
        source: "/blog/getting-started-with-evals---a-speedrun-through-braintrust",
        destination: "/blog/building-reliable-llm-applications",
        permanent: true,
      },
    ];
  },
  turbopack: {
    root: process.cwd(),
  },
};

const withMDX = createMDX({
  options: {
    remarkPlugins: ["remark-gfm"],
    rehypePlugins: ["rehype-highlight"],
  },
});

export default withMDX(nextConfig);
