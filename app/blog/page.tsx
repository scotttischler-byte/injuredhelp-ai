import type { Metadata } from "next";
import { SiteHeader } from "@/components/SiteHeader";
import { BlogIndex } from "@/components/blog/BlogIndex";
import { paginatePosts } from "@/lib/blog-pagination";
import { PRIORITY_PAGE_SEO } from "@/lib/priority-page-seo";
import { getAllPosts } from "@/lib/posts";
import { buildPageMetadata } from "@/lib/seo";

export const revalidate = 60;

const blogSeo = PRIORITY_PAGE_SEO["/blog"]!;

export const metadata: Metadata = buildPageMetadata({
  title: blogSeo.title,
  description: blogSeo.description,
  path: "/blog",
  keywords: blogSeo.keywords,
});

export default function BlogIndexPage() {
  const allPosts = getAllPosts();
  const posts = paginatePosts(allPosts, 1);

  return (
    <>
      <SiteHeader />
      <BlogIndex posts={posts} page={1} totalPosts={allPosts.length} />
    </>
  );
}
