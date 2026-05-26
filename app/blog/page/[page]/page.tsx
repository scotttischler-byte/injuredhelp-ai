import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/SiteHeader";
import { BlogIndex } from "@/components/blog/BlogIndex";
import { paginatePosts, totalBlogPages } from "@/lib/blog-pagination";
import { getAllPosts } from "@/lib/posts";
import { buildPageMetadata } from "@/lib/seo";

export const revalidate = 60;

type Props = { params: Promise<{ page: string }> };

export async function generateStaticParams() {
  const total = getAllPosts().length;
  const pages = totalBlogPages(total);
  return Array.from({ length: Math.max(0, pages - 1) }, (_, i) => ({
    page: String(i + 2),
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { page: pageParam } = await params;
  const page = Number.parseInt(pageParam, 10);
  const total = getAllPosts().length;
  const pages = totalBlogPages(total);
  if (!Number.isFinite(page) || page < 2 || page > pages) return {};

  return buildPageMetadata({
    title: `Car Accident Blog — Page ${page} | WreckMatch`,
    description: `Page ${page} of WreckMatch educational car accident and injury guides. Legal referral service — not a law firm.`,
    path: `/blog/page/${page}`,
  });
}

export default async function BlogPaginatedPage({ params }: Props) {
  const { page: pageParam } = await params;
  const page = Number.parseInt(pageParam, 10);
  const allPosts = getAllPosts();
  const pages = totalBlogPages(allPosts.length);

  if (!Number.isFinite(page) || page < 2 || page > pages) notFound();

  const posts = paginatePosts(allPosts, page);

  return (
    <>
      <SiteHeader />
      <BlogIndex posts={posts} page={page} totalPosts={allPosts.length} />
      <p className="-mt-4 pb-10 text-center text-sm text-gray-500">
        <Link href="/blog" prefetch={false} className="font-semibold text-[#cc0000] hover:underline">
          Back to latest articles
        </Link>
      </p>
    </>
  );
}
