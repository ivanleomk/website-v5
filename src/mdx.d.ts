declare module "*.mdx" {
  import type { ComponentType } from "react";
  import type { MDXComponents } from "mdx/types";

  export const frontmatter: {
    title?: string;
    date?: string;
    description?: string;
    author?: string;
    cover?: string;
  };

  const MDXContent: ComponentType<{ components?: MDXComponents }>;
  export default MDXContent;
}
