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
    ];
  },
  turbopack: {
    root: process.cwd(),
  },
};

const withMDX = createMDX({
  options: {
    rehypePlugins: ["rehype-highlight"],
  },
});

export default withMDX(nextConfig);
