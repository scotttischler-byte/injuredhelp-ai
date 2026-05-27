import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import fs from "fs";
import path from "path";
import { BlogSiteHeader } from "@/components/blog/BlogSiteHeader";
import { BlogLanguageBar } from "@/components/blog/BlogLanguageBar";
import { WreckMatchPhone } from "@/components/WreckMatchPhone";
import { AuthorByline } from "@/components/blog/AuthorByline";
import { BLOG_FOOTER_DISCLAIMER } from "@/lib/compliance";
import { BlogCoverImage } from "@/components/blog/BlogCoverImage";
import { BlogPresentationDeck } from "@/components/blog/BlogPresentationDeck";
import { presentationPathForSlug } from "@/lib/blog-presentations";
import { blogCoverForSlug } from "@/lib/blog-images";
import { getPostBySlug } from "@/lib/posts";
import { authorshipForSlug } from "@/lib/blog-authors";
import { asgLinksForBlog } from "@/lib/asg-links";
import { expandPostContentEs } from "@/lib/blog-content-expander-es";
import { AccidentSurvivalGuideCrossLink } from "@/components/seo/AccidentSurvivalGuideCrossLink";
import { ALL_STATES } from "@/lib/states";
import { BLOG_UI, type BlogLocale } from "@/lib/blog-locale";
import { personPath, personSameAs, personDisplayName } from "@/lib/entities";
import { buildPageMetadata, faqPageJsonLd } from "@/lib/seo";
import { serverSiteOrigin } from "@/lib/site";
import { WRECKMATCH_ORG } from "@/lib/entities";

export const revalidate = 86400;

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const dir = path.join(process.cwd(), "content/blog/es");
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter((f) => f.endsWith(".md")).map((f) => ({
    slug: f.replace(/\.md$/, ""),
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug, "es");
  if (!post) return {};
  return buildPageMetadata({
    title: `${post.meta.title} | WreckMatch Blog`,
    description: post.meta.description,
    path: `/es/blog/${slug}`,
    keywords: ["accidente de auto", "abogado", "guía en español", post.meta.state ?? ""].filter(Boolean),
  });
}

export default async function BlogPostPageEs({ params }: Props) {
  const locale: BlogLocale = "es";
  const { slug } = await params;
  const post = getPostBySlug(slug, "es");
  if (!post) notFound();

  const origin = serverSiteOrigin();
  const hasEnglish = Boolean(getPostBySlug(slug, "en"));
  const ui = BLOG_UI[locale];
  const { meta, content } = post;
  const cover = blogCoverForSlug(slug);
  const cleanContent = content.replace(/^\s*!\[[^\]]*\]\([^)]+\)\s*\n+/, "");
  const { author, reviewer } = authorshipForSlug(slug);
  const sourceWordCount = cleanContent.split(/\s+/).filter(Boolean).length;
  const materialized =
    cleanContent.includes("<!-- wm-materialized-expansion-es -->") || sourceWordCount >= 1800;
  const expanded = materialized
    ? { sections: [], faqs: [], introCallout: undefined }
    : expandPostContentEs(slug, meta);
  const postState = meta.state
    ? ALL_STATES.find((s) => s.state.toLowerCase() === meta.state?.toLowerCase())
    : undefined;
  const asgLinks = asgLinksForBlog(slug, postState);
  const allFaqs = expanded.faqs;

  const authorPerson = {
    "@type": "Person" as const,
    name: personDisplayName(author),
    url: `${origin}${personPath(author)}`,
  };

  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: meta.title,
    description: meta.description,
    inLanguage: "es",
    datePublished: meta.date,
    dateModified: meta.date,
    mainEntityOfPage: { "@type": "WebPage", "@id": `${origin}/es/blog/${slug}` },
    author: authorPerson,
    associatedMedia: {
      "@type": "MediaObject",
      contentUrl: `${origin}${meta.presentationUrl ?? presentationPathForSlug(slug, "es")}`,
      encodingFormat: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
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
          <Link href="/es/blog" prefetch={false} className="hover:text-[#cc0000]">
            {ui.allGuides}
          </Link>
        </nav>
        <BlogLanguageBar slug={slug} locale={locale} hasEnglish={hasEnglish} hasSpanish />
        <p className="inline-flex rounded-full bg-red-50 px-3 py-1 text-xs font-bold uppercase tracking-wide text-[#cc0000]">
          {meta.category}
        </p>
        <h1 className="mt-4 text-3xl font-extrabold leading-tight tracking-tight text-gray-950 sm:text-4xl">
          {meta.title}
        </h1>
        <p className="mt-3 text-sm font-medium text-gray-600">{meta.date} · {meta.readTime}</p>
        <div className="relative mt-8 aspect-[1200/630] w-full overflow-hidden rounded-2xl border border-gray-200 bg-gray-900 shadow-lg">
          <BlogCoverImage src={cover.src} alt={cover.alt} priority />
        </div>
        <AuthorByline author={author} reviewer={reviewer} publishedAt={meta.date} />
        <BlogPresentationDeck slug={slug} title={meta.title} locale={locale} presentationUrl={meta.presentationUrl} />
        {expanded.introCallout ? (
          <div className="mt-6 rounded-xl border border-emerald-300 bg-emerald-50 p-4 text-base text-emerald-950">
            <strong className="font-bold">{ui.atAGlance}</strong> {expanded.introCallout}
          </div>
        ) : null}
        <div className="prose prose-lg prose-slate mt-6 max-w-none prose-headings:text-gray-950 prose-p:text-gray-900 prose-a:text-[#b91c1c]">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{cleanContent}</ReactMarkdown>
        </div>
        {!materialized ? (
          <div className="mt-12 space-y-12">
            {expanded.sections.map((section) => (
              <section key={section.heading}>
                <h2 className="text-2xl font-extrabold text-gray-950">{section.heading}</h2>
                {section.paragraphs?.map((p, i) => (
                  <p key={i} className="mt-4 text-base leading-7 text-gray-900">
                    {p}
                  </p>
                ))}
                {section.list ? (
                  <ol className="mt-5 list-decimal space-y-2 pl-5 text-base leading-7 text-gray-900">
                    {section.list.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ol>
                ) : null}
              </section>
            ))}
          </div>
        ) : null}
        {allFaqs.length ? (
          <section className="mt-12">
            <h2 className="text-2xl font-extrabold text-gray-950">{ui.faqHeading}</h2>
            <div className="mt-6 space-y-5">
              {allFaqs.map((f) => (
                <details key={f.question} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                  <summary className="cursor-pointer font-bold text-gray-950">{f.question}</summary>
                  <p className="mt-3 text-base leading-7 text-gray-900">{f.answer}</p>
                </details>
              ))}
            </div>
          </section>
        ) : null}
        <AccidentSurvivalGuideCrossLink links={asgLinks} variant="light" />
        <div className="mt-10 rounded-xl border border-[#cc0000]/30 bg-red-50 p-6 text-center">
          <p className="text-lg font-semibold text-gray-950">¿Herido en un choque? Emparejamiento gratis en 60 segundos.</p>
          <div className="mt-4 flex flex-wrap justify-center gap-3">
            <WreckMatchPhone variant="light" asLink />
            <Link href="/#form" className="rounded-xl border border-gray-300 bg-white px-5 py-3 font-semibold text-gray-900">
              Enviar formulario
            </Link>
          </div>
        </div>
        <p className="mt-8 border-t border-gray-200 pt-6 text-sm leading-relaxed text-gray-600">
          {BLOG_FOOTER_DISCLAIMER}
        </p>
      </article>
    </div>
  );
}
