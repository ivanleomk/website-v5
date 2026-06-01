import { createFileRoute } from '@tanstack/react-router'
import { lazy, Suspense } from 'react'
import { InteractiveCounter, ColorPaletteVisualizer } from '../../components/mdx-components'
import { MDXProvider } from '@mdx-js/react'

// Define the custom components that will be made available inside all MDX files
const mdxComponents = {
  InteractiveCounter,
  ColorPaletteVisualizer,
}

// A dictionary of all MDX files in content/blog
const postsGlob = import.meta.glob('../../content/blog/*.mdx')

export const Route = createFileRoute('/blog/$postSlug')({
  loader: async ({ params }) => {
    const slug = params.postSlug
    const path = `../../content/blog/${slug}.mdx`
    
    if (!(path in postsGlob)) {
      throw new Error(`Post "${slug}" not found`)
    }
    
    // Import the MDX module to read its frontmatter at build time / load time
    const module = await postsGlob[path]() as any
    return {
      frontmatter: module.frontmatter || {
        title: slug,
        date: new Date().toISOString().split('T')[0],
        description: ''
      }
    }
  },
  component: PostReaderComponent,
})

function PostReaderComponent() {
  const { postSlug } = Route.useParams()
  const { frontmatter } = Route.useLoaderData()

  // Dynamically resolve the MDX component based on the slug parameter
  const MdxContent = lazy(() => {
    const loaderFn = postsGlob[`../../content/blog/${postSlug}.mdx`] as () => Promise<any>
    if (!loaderFn) {
      throw new Error(`Post not found: ${postSlug}`)
    }
    return loaderFn()
  })

  // Determine the cover image for the post if available
  const hasCover = postSlug === 'three-lessons-manus'
  const coverSrc = hasCover ? '/images/three-lessons-manus/manus-desk.jpg' : null

  return (
    <main id="main" className="post animate-fade-in px-6 py-16 md:py-24">
      {/* Classy Centered Article Header matching thinkingmachines.ai exactly */}
      <div className="post-heading">
        <h1 className="post-title">
          {frontmatter.title}
        </h1>
        
        <div className="publish-metadata">
          <span className="author">
            {frontmatter.author || 'Ivan Leo'}
          </span>
          <span>
            {new Date(frontmatter.date).toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric'
            })}
          </span>
        </div>
      </div>

      {/* Post Cover Image if present */}
      {coverSrc && (
        <div className="post-cover compact">
          <img 
            src={coverSrc} 
            alt={frontmatter.title} 
            className="cover-image rounded-xl max-w-sm mx-auto shadow-sm" 
          />
        </div>
      )}

      {/* Premium Serif Article Body matching thinkingmachines.ai layout */}
      <div className="post-content-shell">
        <article className="content">
          <MDXProvider components={mdxComponents}>
            <Suspense fallback={
              <div className="py-12 flex flex-col items-center justify-center gap-3">
                <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-sm text-slate-500">Loading dynamic post...</span>
              </div>
            }>
              <MdxContent />
            </Suspense>
          </MDXProvider>
        </article>
      </div>
    </main>
  )
}
