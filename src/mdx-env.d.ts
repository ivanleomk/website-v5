declare module '*.mdx' {
  import type { ComponentType } from 'react'
  const MDXComponent: ComponentType<any>
  export default MDXComponent
  export const frontmatter: Record<string, any>
}

declare module '*.md' {
  import type { ComponentType } from 'react'
  const MDXComponent: ComponentType<any>
  export default MDXComponent
  export const frontmatter: Record<string, any>
}
