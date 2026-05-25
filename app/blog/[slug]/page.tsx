import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { SiteHeader } from "@/components/SiteHeader";
import { WreckMatchPhone } from "@/components/WreckMatchPhone";
import { AuthorByline } from "@/components/blog/AuthorByline";
import { BLOG_FOOTER_DISCLAIMER } from "@/lib/compliance";
import { blogCoverForSlug } from "@/lib/blog-images";
import { getAllSlugs, getPostBySlug } from "@/lib/posts";
import { blogFaqsForSlug } from "@/lib/blog-faqs";
import { authorshipForSlug } from "@/lib/blog-authors";
import { expandPostContent } from "@/lib/blog-content-expander";
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
  return buildPageMetadata({
    title: `${post.meta.title} | WreckMatch Blog`,
    description: post.meta.description,
    path: `/blog/${slug}`,
  });
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const origin = serverSiteOrigin();

  const { meta, content } = post;
  // Topic-matched real photography wins over the legacy SVG covers in frontmatter.
  const frontmatterCover = meta.coverImage ?? "";
  const isLegacySvgCover = /^\/blog\/covers\/[a-z0-9-]+\.svg$/i.test(frontmatterCover);
  const cover = meta.coverImage && !isLegacySvgCover
    ? { src: meta.coverImage, alt: meta.coverAlt ?? meta.title }
    : blogCoverForSlug(slug, undefined);

  // Strip the leading raw markdown image (we render our own hero cover above the article).
  const cleanContent = content.replace(/^\s*!\[[^\]]*\]\([^)]+\)\s*\n+/, "");

  const { author, reviewer } = authorshipForSlug(slug);
  const expanded = expandPostContent(slug, meta);

  // Merge default FAQs from the existing system with expanded FAQs, dedup by question.
  const baseFaqs = blogFaqsForSlug(slug);
  const allFaqs = [...expanded.faqs];
  for (const f of baseFaqs) {
    if (!allFaqs.some((x) => x.question.toLowerCase() === f.question.toLowerCase())) {
      allFaqs.push({ question: f.question, answer: f.answer });
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
    publisher: {
      "@type": "Organization",
      name: WRECKMATCH_ORG.legalName,
      url: WRECKMATCH_ORG.url,
      logo: { "@type": "ImageObject", url: WRECKMATCH_ORG.logo },
    },
  };
  const faqLd = faqPageJsonLd(allFaqs);

  return (
    <div className="min-h-screen bg-gray-100">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <SiteHeader />
      <article className="mx-auto max-w-3xl px-4 py-10 sm:py-14">
        <nav className="mb-6 text-sm text-gray-500">
          <Link href="/blog" className="hover:text-[#cc0000]">
            Blog
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-800">{meta.title}</span>
        </nav>
        <p className="text-xs font-semibold uppercase tracking-wide text-[#cc0000]">{meta.category}</p>
        <h1 className="mt-2 text-3xl font-extrabold text-gray-950 sm:text-4xl">{meta.title}</h1>
        <p className="mt-2 text-sm text-gray-500">
          {meta.date} · {meta.readTime}
        </p>

        {/* Cover image — topic-matched */}
        <div className="relative mt-6 aspect-[1200/630] w-full overflow-hidden rounded-xl border border-gray-200 bg-gray-900">
          <Image
            src={cover.src}
            alt={cover.alt}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 672px"
            priority
            quality={70}
          />
        </div>

        {/* Author / reviewer + per-post disclaimer */}
        <AuthorByline author={author} reviewer={reviewer} publishedAt={meta.date} />

        {expanded.introCallout ? (
          <div className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
            <strong className="font-bold">At a glance.</strong> {expanded.introCallout}
          </div>
        ) : null}

        <div className="prose prose-gray mt-6 max-w-none prose-headings:font-bold prose-a:text-emerald-600 prose-img:rounded-lg">
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
            Frequently asked questions
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
    </div>
  );
}
