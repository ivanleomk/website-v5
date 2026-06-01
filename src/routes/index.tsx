import { createFileRoute, Link } from '@tanstack/react-router'
import IndexContent from '../content/index.md'

// Load all MDX files eagerly at build time to read their frontmatter
const postsGlob = import.meta.glob('../content/blog/*.mdx', { eager: true })

interface PostFrontmatter {
  title: string
  date: string
  description: string
  author?: string
}

interface PostModule {
  frontmatter: PostFrontmatter
}

const posts = Object.entries(postsGlob).map(([filePath, module]) => {
  const slug = filePath.split('/').pop()?.replace('.mdx', '') || ''
  const frontmatter = (module as PostModule).frontmatter
  return {
    slug,
    ...frontmatter
  }
}).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

export const Route = createFileRoute('/')({
  component: HomeComponent,
})

function HomeComponent() {
  return (
    <div id="main" className="index content max-w-2xl mx-auto px-6 py-16 md:py-24 animate-fade-in bg-white dark:bg-black transition-colors duration-300">

      {/* 1. Simple Name Header */}
      <header className="mb-2 pb-2">
        <h1 className="font-sans text-lg font-bold text-[#282828] dark:text-zinc-100 tracking-tight">
          Ivan Leo
        </h1>
      </header>

      {/* 2. Biography Block */}
      <article className="content text-[#282828] dark:text-zinc-200 mb-20 font-serif text-[17px] leading-[1.65]">
        <IndexContent />
      </article>

      {/* 3. Dynamic Article Listing */}
      <section className="post-group pt-10 border-t border-slate-100 dark:border-slate-900">
        <ul className="divide-y divide-slate-100 dark:divide-slate-900/40">
          {posts.map((post) => (
            <li key={post.slug} className="relative">
              <Link to="/blog/$postSlug" params={{ postSlug: post.slug }} className="post-item-link">
                {/* Desktop Date (Left) */}
                <time className="desktop-time">
                  {new Date(post.date).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </time>

                {/* Title & Author Info (Right) */}
                <div className="post-info">
                  <span className="post-title">{post.title}</span>
                  <span className="author">{post.author || 'Ivan Leo'}</span>
                  {/* Mobile Date (Underneath) */}
                  <time className="mobile-time">
                    {new Date(post.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </time>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>

    </div>
  )
}
