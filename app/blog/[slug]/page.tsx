import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { headers } from "next/headers";
import { SiteHeader } from "@/components/SiteHeader";
import { BLOG_FOOTER_DISCLAIMER, WRECKMATCH_PHONE_DISPLAY, WRECKMATCH_PHONE_TEL } from "@/lib/compliance";
import { getAllSlugs, getPostBySlug } from "@/lib/posts";
import { blogFaqsForSlug } from "@/lib/blog-faqs";
import { buildPageMetadata, faqPageJsonLd } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  const h = await headers();
  return buildPageMetadata({
    title: `${post.meta.title} | WreckMatch Blog`,
    description: post.meta.description,
    path: `/blog/${slug}`,
    headers: h,
  });
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const { meta, content } = post;

  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: meta.title,
    description: meta.description,
    datePublished: meta.date,
    author: { "@type": "Organization", name: "WreckMatch", legalName: "WreckMatch LLC" },
  };
  const faqLd = faqPageJsonLd(blogFaqsForSlug(slug));

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
        <div className="prose prose-gray mt-8 max-w-none prose-headings:font-bold prose-a:text-[#cc0000]">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
        </div>
        <div className="mt-10 rounded-xl border border-[#cc0000]/30 bg-red-50 p-6 text-center">
          <p className="font-semibold text-gray-900">Hurt in a crash? Get matched free in 60 seconds.</p>
          <div className="mt-4 flex flex-wrap justify-center gap-3">
            <a
              href={WRECKMATCH_PHONE_TEL}
              className="rounded-xl bg-[#cc0000] px-5 py-3 font-bold text-white hover:bg-[#b30000]"
            >
              Call {WRECKMATCH_PHONE_DISPLAY}
            </a>
            <Link
              href="/#form"
              className="rounded-xl border border-gray-300 bg-white px-5 py-3 font-semibold hover:bg-gray-50"
            >
              Submit the form
            </Link>
          </div>
        </div>
        <p className="mt-8 border-t border-gray-200 pt-6 text-xs leading-relaxed text-gray-500">
          {BLOG_FOOTER_DISCLAIMER}
        </p>
      </article>
    </div>
  );
}
