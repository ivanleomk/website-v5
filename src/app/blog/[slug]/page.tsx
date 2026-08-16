import { notFound } from "next/navigation";
import { blogPosts, getBlogPost } from "@/content/blog/registry";
import TableOfContents from "./toc";
import NewsletterSignup from "@/components/newsletter-signup";
import type { Metadata } from "next";

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) {
    return {
      title: "Post Not Found | Ivan Leo",
    };
  }

  const { frontmatter } = post;
  const title = `${frontmatter.title ?? slug} | Ivan Leo`;
  const description = frontmatter.description ?? "Personal blog";

  return {
    title,
    description,
    alternates: {
      canonical: `https://ivanleo.com/blog/${slug}`,
    },
  };
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");
}

// Custom heading components that add id attributes for TOC linking
const mdxComponents = {
  h2: (props: React.HTMLAttributes<HTMLHeadingElement>) => {
    const text =
      typeof props.children === "string"
        ? props.children
        : String(props.children ?? "");
    return <h2 id={slugify(text)} {...props} />;
  },
  h3: (props: React.HTMLAttributes<HTMLHeadingElement>) => {
    const text =
      typeof props.children === "string"
        ? props.children
        : String(props.children ?? "");
    return <h3 id={slugify(text)} {...props} />;
  },
};

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const post = getBlogPost(slug);
  if (!post) {
    notFound();
  }

  const { Content: MdxContent, frontmatter, headings } = post;

  const formattedDate = new Date(frontmatter.date ?? "").toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <main className="px-6 py-20 md:py-32 max-w-[800px] mx-auto">
      {/* Header */}
      <header className="mb-16">
        <h1 className="font-semibold text-[30px] leading-[1.4] mb-3">
          {frontmatter.title}
        </h1>
        <div className="text-[15px] text-[#676767]">
          <span className="text-[#282828]">
            {frontmatter.author ?? "Ivan Leo"}
          </span>
          {" · "}
          <span>{formattedDate}</span>
        </div>
      </header>

      {/* Body: article with optional TOC */}
      <div className="relative">
        {/* Table of Contents — only for longer posts */}
        {headings.length >= 4 && <TableOfContents headings={headings} />}

        {/* Article */}
        <article className="prose prose-neutral max-w-none prose-a:text-[#282828] prose-a:underline prose-a:decoration-[0.5px] prose-a:underline-offset-2">
          <MdxContent components={mdxComponents} />
        </article>

        {/* Newsletter signup */}
        <div className="mt-16 pt-8 border-t border-[#e5e5e5]">
          <p className="text-[15px] text-[#676767] mb-4">
            I send Working Notes every two weeks.
          </p>
          <NewsletterSignup />
        </div>
      </div>
    </main>
  );
}
