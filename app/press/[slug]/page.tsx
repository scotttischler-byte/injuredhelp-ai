import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { absoluteUrl } from "@/lib/site";
import { getPressBySlug } from "@/lib/press";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPressBySlug(slug);
  if (!post) return { title: "Press | WreckMatch" };
  return {
    title: `${post.meta.title} | WreckMatch`,
    description: post.meta.description,
    alternates: { canonical: absoluteUrl(`/press/${slug}`) },
  };
}

export default async function PressReleasePage({ params }: Props) {
  const { slug } = await params;
  const post = getPressBySlug(slug);
  if (!post) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: post.meta.title,
    datePublished: post.meta.date,
    author: { "@type": "Organization", name: "WreckMatch" },
    publisher: { "@type": "Organization", name: "WreckMatch" },
    mainEntityOfPage: absoluteUrl(`/press/${slug}`),
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="mx-auto max-w-3xl px-4 py-12">
        <Link href="/press" className="text-sm font-semibold text-red-400 hover:text-red-300">
          ← Press home
        </Link>
        <p className="mt-4 text-xs text-gray-500">{post.meta.date}</p>
        <h1 className="mt-2 text-3xl font-black sm:text-4xl">{post.meta.title}</h1>
        <div className="mt-8 max-w-none space-y-4 leading-relaxed text-gray-200 [&_a]:text-red-400 [&_h1]:text-3xl [&_h1]:font-bold [&_h2]:text-2xl [&_h2]:font-bold [&_strong]:text-white">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
