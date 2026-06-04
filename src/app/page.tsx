import Link from "next/link";

export default function Home() {
  const selectedEssays = [
    {
      slug: "grep-beats-sqlite-fts",
      title: "How Simple Grep Beats Naive SQL",
      date: "Jun 2026",
      description: "I benchmarked grep vs SQLite FTS across 300k tokens. grep won: 29.6% cheaper, better accuracy",
    },
    {
      slug: "three-lessons-manus",
      title: "Three Lessons I've Learned at Manus",
      date: "Dec 2025",
      description: "Lessons learnt from going from zero to $100M ARR in 8 months.",
    },
    {
      slug: "write-stupid-evals",
      title: "Write Stupid Evals",
      date: "Nov 2024",
      description: "Keep it simple and worry about the rest later.",
    },
    {
      slug: "migrating-to-react-ink",
      title: "Building a Coding CLI with React Ink",
      date: "Jul 2025",
      description: "Migrating our basic command-line agent to a rich, streaming terminal interface built with React Ink.",
    },
  ];

  return (
    <main className="max-w-[660px] mx-auto px-6 py-12 md:py-16">
      {/* Introduction */}
      <div className="mb-16 font-serif text-[17px] leading-[1.65] text-[#282828]">
        <p className="mt-6">
          I work on Developer Experience at{" "}
          <strong>Google DeepMind</strong>, where I focus on making it easy to
          build on Gemini and spend a lot of time thinking about evaluating
          autonomous agents. Previously, I built general-purpose action engines
          for knowledge work at <strong>Manus</strong> (acquired by Meta) and
          worked on open-source libraries like{" "}
          <a
            href="https://github.com/jxnl/instructor"
            className="text-[#676767] underline underline-offset-2 decoration-[0.5px]"
          >
            Instructor
          </a>{" "}
          which made it easy to get reliable structured outputs for language
          models using Pydantic.
        </p>
        <p className="mt-6">
          I like large wide spaces and once spent a month traveling across Russia
          and Mongolia on the Trans Siberian Railway. I started working on
          Language Models after becoming fluent in French (B2) and decided I
          should do something more productive for my career. I like spicy food a
          lot - especially a good 干锅。
        </p>
        <p className="mt-6">
          I also angel invest and advise companies.{" "}
          <a
            href="mailto:hello@ivanleo.com"
            className="text-[#676767] underline underline-offset-2 decoration-[0.5px]"
          >
            Reach out
          </a>{" "}
          if interested.
        </p>
      </div>

      {/* Selected Essays */}
      <section className="pt-10 border-t border-gray-100">
        <h2 className="font-sans text-[13px] font-bold uppercase tracking-widest text-[#676767] mb-6">
          Selected Essays
        </h2>
        <ul className="list-none p-0 m-0 space-y-8">
          {selectedEssays.map((essay) => (
            <li key={essay.slug} className="group">
              <Link
                href={`/blog/${essay.slug}`}
                className="block no-underline text-inherit"
              >
                <div className="flex justify-between items-baseline gap-4">
                  <span className="font-serif text-[17px] font-medium group-hover:text-[#676767] transition-colors">
                    {essay.title}
                  </span>
                  <span className="text-[13px] font-sans text-[#676767] whitespace-nowrap">
                    {essay.date}
                  </span>
                </div>
                <p className="mt-1.5 text-[14px] font-serif text-[#676767] leading-relaxed">
                  {essay.description}
                </p>
              </Link>
            </li>
          ))}
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
