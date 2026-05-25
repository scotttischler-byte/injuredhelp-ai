import type { Metadata } from "next";
import { headers } from "next/headers";
import { SiteHeader } from "@/components/SiteHeader";
import { BlogIndex } from "@/components/blog/BlogIndex";
import { paginatePosts } from "@/lib/blog-pagination";
import { getAllPosts } from "@/lib/posts";
import { buildPageMetadata } from "@/lib/seo";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const h = await headers();
  return buildPageMetadata({
    title: "Car Accident & Injury Blog | WreckMatch",
    description:
      "Educational car accident, truck crash, and injury guides authored by WreckMatch operators and reviewed for legal context. WreckMatch LLC is a referral service — not a law firm.",
    path: "/blog",
    headers: h,
  });
}

export default function BlogIndexPage() {
  const allPosts = getAllPosts();
  const posts = paginatePosts(allPosts, 1);

  return (
    <div className="min-h-screen bg-gray-100">
      <SiteHeader />
      <BlogIndex posts={posts} page={1} totalPosts={allPosts.length} />
    </div>
  );
}
