import type { MDXComponents } from "mdx/types";

// Required by @next/mdx — defines global MDX component overrides
export function useMDXComponents(
  components: MDXComponents
): MDXComponents {
  return {
    ...components,
  };
}
