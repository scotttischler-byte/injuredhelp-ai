import type { Metadata } from "next";
import Link from "next/link";
import { headers } from "next/headers";
import { SiteHeader } from "@/components/SiteHeader";
import { getAllPosts } from "@/lib/posts";
import { buildPageMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const h = await headers();
  return buildPageMetadata({
    title: "Car Accident & Injury Blog | WreckMatch",
    description:
      "Practical guides after a car accident: insurance, medical care, and finding an attorney. General information from WreckMatch referral service.",
    path: "/blog",
    headers: h,
  });
}

export default function BlogIndexPage() {
  const posts = getAllPosts();

  return (
    <div className="min-h-screen bg-gray-100">
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-4 py-12">
        <h1 className="text-3xl font-extrabold text-gray-950 sm:text-4xl">Car accident help & resources</h1>
        <p className="mt-4 text-gray-600">
          Educational articles from WreckMatch — we connect accident victims with experienced personal injury
          attorneys at no upfront cost. WreckMatch LLC is a legal referral service, not a law firm.
        </p>
        <ul className="mt-10 space-y-6">
          {posts.map((post) => (
            <li key={post.slug} className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-[#cc0000]">{post.category}</p>
              <h2 className="mt-2 text-xl font-bold text-gray-900">
                <Link href={`/blog/${post.slug}`} className="hover:text-[#cc0000]">
                  {post.title}
                </Link>
              </h2>
              <p className="mt-2 text-sm text-gray-600">{post.description}</p>
              <p className="mt-3 text-xs text-gray-400">
                {post.date} · {post.readTime}
              </p>
            </li>
          ))}
        </ul>
        {posts.length === 0 ? (
          <p className="mt-8 text-gray-500">New articles are being published — check back soon.</p>
        ) : null}
        <p className="mt-10 text-center">
          <Link href="/#form" className="font-bold text-[#cc0000] hover:underline">
            Get free attorney matching →
          </Link>
        </p>
      </main>
    </div>
  );
}
