import Link from "next/link";
import fs from "fs";
import path from "path";

type PostMeta = {
  slug: string;
  title: string;
  date: string;
  description: string;
  author: string;
};

async function getPosts(): Promise<PostMeta[]> {
  const dir = path.join(process.cwd(), "src/content/blog");
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".mdx"));

  const posts: PostMeta[] = [];
  for (const file of files) {
    const slug = file.replace(/\.mdx$/, "");
    const mod = await import(`@/content/blog/${slug}.mdx`);
    const fm = mod.frontmatter ?? {};
    posts.push({
      slug,
      title: fm.title ?? slug,
      date: fm.date ?? "",
      description: fm.description ?? "",
      author: fm.author ?? "Ivan Leo",
    });
  }

  return posts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export default async function BlogIndex() {
  const posts = await getPosts();

  return (
    <main className="max-w-[660px] mx-auto px-6 py-12 md:py-16">
      <header className="mb-12">
        <h1 className="font-sans text-[18px] font-bold tracking-tight text-[#282828]">
          Writing
        </h1>
        <p className="mt-2 font-serif text-[15px] text-[#676767]">
          Technical deep-dives, systems architecture, and essays on production agent evaluations.
        </p>
      </header>

      <section className="pt-8 border-t border-gray-100">
        <ul className="list-none p-0 m-0 space-y-8">
          {posts.map((post) => {
            const year = new Date(post.date).getFullYear();
            return (
              <li key={post.slug} className="group">
                <Link
                  href={`/blog/${post.slug}`}
                  className="block no-underline text-inherit"
                >
                  <div className="grid grid-cols-[3.5rem_1fr] gap-4 items-baseline">
                    <time className="text-[13.5px] font-sans text-[#676767] tracking-tight">
                      {year}
                    </time>
                    <div>
                      <span className="font-serif text-[17px] font-medium group-hover:text-[#676767] transition-colors">
                        {post.title}
                      </span>
                      <p className="mt-1 text-[14px] font-serif text-[#676767] leading-relaxed">
                        {post.description}
                      </p>
                    </div>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      {/* Footer / Social links */}
      <footer className="mt-20 pt-8 border-t border-gray-100 flex justify-between items-center text-[13px] font-sans text-[#676767]">
        <p>© {new Date().getFullYear()} Ivan Leo. All rights reserved.</p>
        <div className="flex gap-6">
          <a
            href="https://twitter.com/ivanleomk"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-black transition-colors"
          >
            Twitter
          </a>
          <a
            href="https://github.com/ivanleomk"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-black transition-colors"
          >
            GitHub
          </a>
        </div>
      </footer>
    </main>
  );
}
