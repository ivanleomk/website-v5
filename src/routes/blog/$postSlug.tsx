import { createFileRoute, Link } from '@tanstack/react-router'
import { useState, useEffect, useMemo } from 'react'
import { InteractiveCounter, ColorPaletteVisualizer } from '../../components/mdx-components'
import { MDXProvider } from '@mdx-js/react'
import MdxContent from '../../content/blog/three-lessons-manus.mdx'

// Define the custom components that will be made available inside all MDX files
const mdxComponents = {
  InteractiveCounter,
  ColorPaletteVisualizer,
}

// A dictionary of all MDX files in content/blog
const postsGlob = import.meta.glob('../../content/blog/*.mdx')
// Eagerly import raw MDX strings to parse headings dynamically
const rawPosts = import.meta.glob('../../content/blog/*.mdx', { query: '?raw', eager: true }) as Record<string, any>

function parseHeadings(markdown: any) {
  if (typeof markdown !== 'string') {
    return []
  }
  const lines = markdown.split('\n')
  const headings: { text: string; id: string; level: number }[] = []
  
  for (const line of lines) {
    const match = line.match(/^(#{1,2})\s+(.+)$/)
    if (match) {
      const level = match[1].length
      const text = match[2].trim()
      
      // Convert heading text to standard URL slug id
      const id = text
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
      
      headings.push({
        text: level === 1 ? 'Introduction' : text,
        id: level === 1 ? 'introduction' : id,
        level
      })
    }
  }
  return headings
}

export const Route = createFileRoute('/blog/$postSlug')({
  loader: async ({ params }) => {
    const slug = params.postSlug
    const path = `../../content/blog/${slug}.mdx`
    
    if (!(path in postsGlob)) {
      return {
        notFound: true,
        rawContent: '',
        frontmatter: {
          title: 'Post Deleted',
          date: new Date().toISOString().split('T')[0],
          description: 'This post has been deleted or moved.'
        }
      }
    }
    
    const module = await postsGlob[path]() as any
    const rawVal = rawPosts[path]
    const rawContent = typeof rawVal === 'string'
      ? rawVal
      : (rawVal && typeof rawVal === 'object' && 'default' in rawVal && typeof (rawVal as any).default === 'string')
        ? (rawVal as any).default
        : ''
    
    return {
      notFound: false,
      rawContent,
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
  const { frontmatter, notFound, rawContent } = Route.useLoaderData()
  const [activeId, setActiveId] = useState('introduction')

  // Parse H1 and H2 headings from raw MDX
  const headings = useMemo(() => {
    if (!rawContent) return []
    return parseHeadings(rawContent)
  }, [rawContent])

  // Track active heading on scroll
  useEffect(() => {
    if (notFound || headings.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        }
      },
      { rootMargin: '-10% 0px -70% 0px' }
    )

    // Observe all parsed headings inside the article body
    const headingElements = document.querySelectorAll(
      'article.content h1, article.content h2'
    )
    headingElements.forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [notFound, headings])

  if (notFound) {
    return (
      <main id="main" className="post animate-fade-in px-6 py-24 text-center space-y-6 min-h-[60vh] flex flex-col justify-center items-center">
        <div className="space-y-2">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-[#282828] dark:text-zinc-100">
            404
          </h1>
          <p className="font-sans text-[15px] font-semibold text-slate-500 dark:text-zinc-400">
            Post not found
          </p>
        </div>
        
        <p className="font-sans text-[14px] text-[#676767] dark:text-zinc-400 max-w-xs mx-auto leading-relaxed">
          The page at <code className="bg-slate-100 dark:bg-zinc-900 px-1.5 py-0.5 rounded text-[13px] text-[#282828] dark:text-zinc-200">/blog/{postSlug}</code> is not available.
        </p>
        
        <div className="pt-4">
          <Link 
            to="/"
            className="inline-flex items-center gap-1.5 font-sans text-[14px] font-semibold text-[#676767] hover:text-[#282828] dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors border-b border-transparent hover:border-current pb-0.5"
          >
            <span>Back to Homepage</span>
          </Link>
        </div>
      </main>
    )
  }

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
        {/* Dynamic Table of Contents (Left TOC) */}
        {headings.length > 0 && (
          <nav className="left-toc" aria-label="Table of contents">
            <ul className="toc-list">
              {headings.map((h) => {
                const isActive = activeId === h.id
                return (
                  <li key={h.id} className="toc-item flex items-baseline gap-2 py-0.5">
                    {isActive ? (
                      <span className="text-[12px] text-slate-800 dark:text-zinc-200 select-none">•</span>
                    ) : (
                      <span className="w-1.5 shrink-0"></span>
                    )}
                    <a 
                      href={`#${h.id}`}
                      className={`text-slate-500 hover:text-slate-800 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors font-medium ${isActive ? 'text-slate-900! dark:text-zinc-100! font-semibold' : ''}`}
                      onClick={(e) => {
                        e.preventDefault()
                        const targetId = h.id === 'introduction' ? 'main' : h.id
                        document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth' })
                        setActiveId(h.id)
                      }}
                    >
                      {h.text}
                    </a>
                  </li>
                )
              })}
            </ul>
          </nav>
        )}

        <article className="content">
          <MDXProvider components={mdxComponents}>
            <MdxContent />
          </MDXProvider>
        </article>
      </div>
    </main>
  )
}
