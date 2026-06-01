import fs from "fs";
import path from "path";
import { notFound } from "next/navigation";
import TableOfContents from "./toc";

// Read all MDX files at build time to generate static paths
export function generateStaticParams() {
  const contentDir = path.join(process.cwd(), "src/content/blog");
  if (!fs.existsSync(contentDir)) {
    return [];
  }
  const files = fs.readdirSync(contentDir).filter((f) => f.endsWith(".mdx"));
  return files.map((f) => ({ slug: f.replace(/\.mdx$/, "") }));
}

export const dynamicParams = false;

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");
}

// Parse h2 and h3 headings from raw MDX text
function parseHeadings(raw: string) {
  const headings: { text: string; id: string; level: number }[] = [];
  for (const line of raw.split("\n")) {
    const match = line.match(/^(#{2,3})\s+(.+)$/);
    if (match) {
      const level = match[1].length;
      const text = match[2].trim();
      headings.push({ text, id: slugify(text), level });
    }
  }
  return headings;
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

  const filePath = path.join(process.cwd(), "src/content/blog", `${slug}.mdx`);
  if (!fs.existsSync(filePath)) {
    notFound();
  }

  const raw = fs.readFileSync(filePath, "utf-8");
  const headings = parseHeadings(raw);

  const { default: MdxContent, frontmatter } = await import(
    `@/content/blog/${slug}.mdx`
  );

  const formattedDate = new Date(frontmatter.date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <main className="px-6 py-16 md:py-24 max-w-[950px] mx-auto">
      {/* Header */}
      <header className="text-center mb-10">
        <h1 className="font-serif font-semibold text-[30px] leading-[1.4] max-w-[570px] mx-auto text-balance">
          {frontmatter.title}
        </h1>
        <div className="mt-4 flex flex-col items-center gap-1 text-[15px] font-sans text-[#676767]">
          <span className="text-[#282828]">
            {frontmatter.author ?? "Ivan Leo"}
          </span>
          <span>{formattedDate}</span>
        </div>
      </header>

      {/* Cover image — spans wider than article text */}
      {frontmatter.cover && (
        <div className="max-w-[900px] mx-auto mb-10">
          <img
            src={frontmatter.cover}
            alt={frontmatter.title}
            className="w-full h-auto max-h-[420px] object-cover rounded-xl"
          />
        </div>
      )}

      {/* Body: article centered, TOC positioned to the left */}
      <div className="relative max-w-[660px] mx-auto">
        {/* Table of Contents — absolutely positioned left of article on wide screens */}
        {headings.length > 0 && <TableOfContents headings={headings} />}

        {/* Article */}
        <article className="prose prose-neutral max-w-none prose-headings:font-serif prose-p:font-serif prose-li:font-serif prose-a:text-[#676767] prose-a:decoration-[0.5px] prose-a:underline-offset-2 prose-img:rounded-xl prose-img:w-full">
          <MdxContent components={mdxComponents} />
        </article>
      </div>
    </main>
  );
}
