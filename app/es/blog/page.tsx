import type { Metadata } from "next";
import { BlogSiteHeader } from "@/components/blog/BlogSiteHeader";
import { BlogIndex } from "@/components/blog/BlogIndex";
import { paginatePosts } from "@/lib/blog-pagination";
import { getAllPostsEs } from "@/lib/posts";
import { buildPageMetadata } from "@/lib/seo";

export const revalidate = 60;

export const metadata: Metadata = buildPageMetadata({
  title: "Blog en español | WreckMatch",
  description:
    "Guías educativas en español sobre accidentes automovilísticos, seguros y lesiones. Emparejamiento gratuito con abogados en ~60 segundos.",
  path: "/es/blog",
  keywords: ["accidente de auto", "abogado accidente", "guía legal español"],
});

export default function BlogIndexPageEs() {
  const allPosts = getAllPostsEs();
  const posts = paginatePosts(allPosts, 1);

  return (
    <>
      <BlogSiteHeader blogLocale="es" />
      <BlogIndex posts={posts} page={1} totalPosts={allPosts.length} locale="es" />
    </>
  );
}
