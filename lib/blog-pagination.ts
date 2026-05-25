import type { PostMeta } from "@/lib/posts";

export const BLOG_POSTS_PER_PAGE = 24;

export function totalBlogPages(postCount: number): number {
  return Math.max(1, Math.ceil(postCount / BLOG_POSTS_PER_PAGE));
}

export function paginatePosts(posts: PostMeta[], page: number): PostMeta[] {
  const safePage = Number.isFinite(page) && page > 0 ? Math.floor(page) : 1;
  const start = (safePage - 1) * BLOG_POSTS_PER_PAGE;
  return posts.slice(start, start + BLOG_POSTS_PER_PAGE);
}

export function blogPagePath(page: number): string {
  return page <= 1 ? "/blog" : `/blog/page/${page}`;
}
