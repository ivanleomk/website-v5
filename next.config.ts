import createMDX from "@next/mdx";
import type { NextConfig } from "next";
import { ALL_REDIRECTS, HTML_STRIP_REDIRECT } from "./src/seo/redirects";

const nextConfig: NextConfig = {
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
  async redirects() {
    return [
      HTML_STRIP_REDIRECT,
      ...ALL_REDIRECTS,
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
