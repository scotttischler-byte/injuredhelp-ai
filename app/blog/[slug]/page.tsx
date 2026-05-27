import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { BlogSiteHeader } from "@/components/blog/BlogSiteHeader";
import { BlogLanguageBar } from "@/components/blog/BlogLanguageBar";
import { BLOG_UI, type BlogLocale } from "@/lib/blog-locale";
import fs from "fs";
import path from "path";
import { WreckMatchPhone } from "@/components/WreckMatchPhone";
import { AuthorByline } from "@/components/blog/AuthorByline";
import { BLOG_FOOTER_DISCLAIMER } from "@/lib/compliance";
import { BlogCoverImage } from "@/components/blog/BlogCoverImage";
import { BlogPresentationDeck } from "@/components/blog/BlogPresentationDeck";
import { presentationPathForSlug } from "@/lib/blog-presentations";
import { blogCoverForSlug } from "@/lib/blog-images";
import { getAllSlugs, getPostBySlug } from "@/lib/posts";
import { blogFaqsForSlug } from "@/lib/blog-faqs";
import { authorshipForSlug } from "@/lib/blog-authors";
import { asgLinksForBlog } from "@/lib/asg-links";
import { expandPostContent } from "@/lib/blog-content-expander";
import { AccidentSurvivalGuideCrossLink } from "@/components/seo/AccidentSurvivalGuideCrossLink";
import { ALL_STATES } from "@/lib/states";
import { PRIORITY_BLOG_SEO } from "@/lib/priority-page-seo";
import { personPath, personSameAs, personDisplayName } from "@/lib/entities";
import { buildPageMetadata, faqPageJsonLd } from "@/lib/seo";
import { serverSiteOrigin } from "@/lib/site";
import { WRECKMATCH_ORG } from "@/lib/entities";

export const revalidate = 86400;

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  const priority = PRIORITY_BLOG_SEO[slug];
  return buildPageMetadata({
    title: priority?.title ?? `${post.meta.title} | WreckMatch Blog`,
    description: priority?.description ?? post.meta.description,
    path: `/blog/${slug}`,
    keywords: priority?.keywords,
  });
}

export default async function BlogPostPage({ params }: Props) {
  const locale: BlogLocale = "en";
  const { slug } = await params;
  const post = getPostBySlug(slug, locale);
  if (!post) notFound();

  const origin = serverSiteOrigin();
  const hasSpanish = fs.existsSync(path.join(process.cwd(), "content/blog/es", `${slug}.md`));
  const ui = BLOG_UI[locale];

  const { meta, content } = post;
  const cover = blogCoverForSlug(slug);

  // Strip the leading raw markdown image (we render our own hero cover above the article).
  const cleanContent = content.replace(/^\s*!\[[^\]]*\]\([^)]+\)\s*\n+/, "");

  const { author, reviewer } = authorshipForSlug(slug);
  const sourceWordCount = cleanContent
    .replace(/```[\s\S]*?```/g, "")
    .replace(/\[([^\]]*)\]\([^)]+\)/g, "$1")
    .replace(/[#*|_>`\-]/g, " ")
    .split(/\s+/)
    .filter(Boolean).length;
  const materialized =
    cleanContent.includes("<!-- wm-materialized-expansion -->") ||
    cleanContent.includes("<!-- wm-materialized-expansion-es -->") ||
    sourceWordCount >= 2000;
  const expanded = materialized
    ? { sections: [], faqs: [], introCallout: undefined }
    : expandPostContent(slug, meta);
  const postState = meta.state
    ? ALL_STATES.find((s) => s.state.toLowerCase() === meta.state?.toLowerCase())
    : undefined;
  const asgLinks = asgLinksForBlog(slug, postState);
  // Merge default FAQs from the existing system with expanded FAQs, dedup by question.
  const baseFaqs = blogFaqsForSlug(slug);
  const allFaqs = materialized
    ? baseFaqs.map((f) => ({ question: f.question, answer: f.answer }))
    : [...expanded.faqs];
  if (!materialized) {
    for (const f of baseFaqs) {
      if (!allFaqs.some((x) => x.question.toLowerCase() === f.question.toLowerCase())) {
        allFaqs.push({ question: f.question, answer: f.answer });
      }
    }
  }

  const authorPerson = {
    "@type": "Person" as const,
    "@id": `${origin}/#person-${author.id}`,
    name: personDisplayName(author),
    jobTitle: author.jobTitle,
    url: `${origin}${personPath(author)}`,
    image: author.image ? `${origin}${author.image}` : undefined,
    sameAs: personSameAs(author),
    worksFor: { "@type": "Organization" as const, name: WRECKMATCH_ORG.legalName, url: WRECKMATCH_ORG.url },
  };

  const reviewerPerson = reviewer
    ? {
        "@type": "Person" as const,
        "@id": `${origin}/#person-${reviewer.id}`,
        name: personDisplayName(reviewer),
        jobTitle: reviewer.jobTitle,
        url: `${origin}${personPath(reviewer)}`,
        image: reviewer.image ? `${origin}${reviewer.image}` : undefined,
        sameAs: personSameAs(reviewer),
      }
    : undefined;

  const coverAbsolute = cover.src.startsWith("http") ? cover.src : `${origin}${cover.src}`;

  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: meta.title,
    description: meta.description,
    datePublished: meta.date,
    dateModified: meta.date,
    image: [coverAbsolute],
    mainEntityOfPage: { "@type": "WebPage", "@id": `${origin}/blog/${slug}` },
    author: authorPerson,
    ...(reviewerPerson ? { reviewedBy: reviewerPerson } : {}),
    associatedMedia: {
      "@type": "MediaObject",
      contentUrl: `${origin}${meta.presentationUrl ?? presentationPathForSlug(slug)}`,
      encodingFormat: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      name: `${meta.title} — presentation summary`,
    },
    publisher: {
      "@type": "Organization",
      name: WRECKMATCH_ORG.legalName,
      url: WRECKMATCH_ORG.url,
      logo: { "@type": "ImageObject", url: WRECKMATCH_ORG.logo },
    },
  };
  const faqLd = faqPageJsonLd(allFaqs);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-gray-100 pb-24 md:pb-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <BlogSiteHeader blogLocale={locale} />
      <article className="mx-auto max-w-3xl px-4 py-8 sm:py-12">
        <nav className="mb-6 text-sm font-medium text-gray-600">
          <Link href="/blog" prefetch={false} className="hover:text-[#cc0000]">
            {ui.allGuides}
          </Link>
        </nav>
        <BlogLanguageBar slug={slug} locale={locale} hasEnglish hasSpanish={hasSpanish} />
        <p className="inline-flex rounded-full bg-red-50 px-3 py-1 text-xs font-bold uppercase tracking-wide text-[#cc0000]">
          {meta.category}
        </p>
        <h1 className="mt-4 text-3xl font-extrabold leading-tight tracking-tight text-gray-950 sm:text-4xl">
          {meta.title}
        </h1>
        <p className="mt-3 text-sm text-gray-500">
          {meta.date} · {meta.readTime}
        </p>

        <div className="relative mt-8 aspect-[1200/630] w-full overflow-hidden rounded-2xl border border-gray-200/80 bg-gray-900 shadow-lg ring-1 ring-black/5">
          <BlogCoverImage src={cover.src} alt={cover.alt} priority />
        </div>

        {/* Author / reviewer + per-post disclaimer */}
        <AuthorByline author={author} reviewer={reviewer} publishedAt={meta.date} />

        <BlogPresentationDeck slug={slug} title={meta.title} locale={locale} presentationUrl={meta.presentationUrl} />

        {expanded.introCallout ? (
          <div className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
            <strong className="font-bold">{ui.atAGlance}</strong> {expanded.introCallout}
          </div>
        ) : null}

        <div className="prose prose-lg prose-slate mt-6 max-w-none prose-headings:font-extrabold prose-headings:text-gray-950 prose-p:text-gray-900 prose-p:leading-relaxed prose-li:text-gray-900 prose-strong:text-gray-950 prose-a:font-semibold prose-a:text-[#b91c1c] prose-img:rounded-lg">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{cleanContent}</ReactMarkdown>
        </div>

        {/* Expanded sections — state legal context, first-48-hour timeline, topic pitfalls, value, decisions, local */}
        <div className="mt-12 space-y-12">
          {expanded.sections.map((section) => (
            <section key={section.heading}>
              <h2 className="text-2xl font-extrabold tracking-tight text-gray-950 sm:text-[1.65rem]">
                {section.heading}
              </h2>
              {section.paragraphs?.map((p, i) => (
                <p key={i} className="mt-4 text-[1.01rem] leading-7 text-gray-800">
                  {p}
                </p>
              ))}
              {section.list ? (
                <ol className="mt-5 list-decimal space-y-2 pl-5 text-[0.98rem] leading-7 text-gray-800">
                  {section.list.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ol>
              ) : null}
              {section.table ? (
                <div className="mt-5 overflow-x-auto rounded-lg border border-gray-200">
                  <table className="w-full border-collapse text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        {section.table[0].map((cell, i) => (
                          <th key={i} className="border-b border-gray-200 px-4 py-2 text-left font-bold text-gray-900">
                            {cell}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {section.table.slice(1).map((row, ri) => (
                        <tr key={ri} className="odd:bg-white even:bg-gray-50">
                          {row.map((cell, ci) => (
                            <td key={ci} className="border-b border-gray-100 px-4 py-2 align-top text-gray-700">
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : null}
            </section>
          ))}
        </div>

        {/* FAQ block */}
        <section className="mt-12">
          <h2 className="text-2xl font-extrabold tracking-tight text-gray-950 sm:text-[1.65rem]">
            {ui.faqHeading}
          </h2>
          <div className="mt-6 space-y-5">
            {allFaqs.map((f) => (
              <details
                key={f.question}
                className="group rounded-xl border border-gray-200 bg-white p-5 shadow-sm open:border-emerald-300"
              >
                <summary className="cursor-pointer list-none font-bold text-gray-900">
                  <span className="mr-2 text-emerald-600 group-open:rotate-90 inline-block transition-transform">▶</span>
                  {f.question}
                </summary>
                <p className="mt-3 text-[0.98rem] leading-7 text-gray-700">{f.answer}</p>
              </details>
            ))}
          </div>
        </section>

        <AccidentSurvivalGuideCrossLink links={asgLinks} variant="light" />

        {/* Inline conversion */}
        <div className="mt-10 rounded-xl border border-[#cc0000]/30 bg-red-50 p-6 text-center">
          <p className="font-semibold text-gray-900">Hurt in a crash? Get matched free in 60 seconds.</p>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
            <div className="rounded-xl border border-emerald-200 bg-white px-5 py-3">
              <WreckMatchPhone variant="light" asLink />
            </div>
            <Link
              href="/#form"
              className="rounded-xl border border-gray-300 bg-white px-5 py-3 font-semibold hover:bg-gray-50"
            >
              Submit the form
            </Link>
          </div>
        </div>

        {/* Author footer card */}
        <div className="mt-10 rounded-xl border border-gray-200 bg-white p-5 text-sm text-gray-700">
          <p className="text-xs font-bold uppercase tracking-wider text-gray-500">About the author</p>
          <p className="mt-2">
            <Link href={personPath(author)} className="font-bold text-gray-900 hover:underline">
              {personDisplayName(author)}
            </Link>{" "}
            — {author.jobTitle}. {author.description}
          </p>
          {reviewer ? (
            <p className="mt-3 border-t border-gray-100 pt-3">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                Reviewed for legal context by
              </span>
              <br />
              <Link href={personPath(reviewer)} className="font-bold text-gray-900 hover:underline">
                {personDisplayName(reviewer)}
              </Link>{" "}
              — {reviewer.jobTitle}. {reviewer.description}
            </p>
          ) : null}
        </div>

        <p className="mt-8 border-t border-gray-200 pt-6 text-xs leading-relaxed text-gray-500">
          {BLOG_FOOTER_DISCLAIMER}
        </p>
      </article>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-gray-200 bg-white/95 p-3 shadow-[0_-8px_30px_rgba(0,0,0,0.12)] backdrop-blur-md md:hidden">
        <div className="mx-auto flex max-w-lg gap-2">
          <Link
            href="/#form"
            className="flex min-h-[48px] flex-1 items-center justify-center rounded-xl bg-[#cc0000] px-4 text-center text-sm font-bold text-white"
          >
            Free match →
          </Link>
          <a
            href="tel:8558973256"
            className="flex min-h-[48px] shrink-0 items-center justify-center rounded-xl border border-gray-300 px-4 text-sm font-semibold text-gray-800"
          >
            Call
          </a>
        </div>
      </div>
    </div>
  );
}
