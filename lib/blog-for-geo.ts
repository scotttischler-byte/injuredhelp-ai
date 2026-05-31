import { getAllPosts, type PostMeta } from "@/lib/posts";

function slugToken(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

/** Match blog posts to a geo hub place slug (e.g. houston, dallas, texas). */
export async function latestBlogPostsForPlace(placeSlug: string, limit = 3): Promise<PostMeta[]> {
  const place = slugToken(placeSlug);
  if (!place) return [];

  const posts = await getAllPosts();
  const scored: { post: PostMeta; score: number }[] = [];

  for (const post of posts) {
    const s = post.slug.toLowerCase();
    let score = 0;
    if (s.includes(`-in-${place}-`) || s.includes(`-${place}-`) || s.endsWith(`-${place}`)) score += 12;
    else if (s.includes(place)) score += 6;
    if (score > 0) scored.push({ post, score });
  }

  scored.sort((a, b) => b.score - a.score || (a.post.date < b.post.date ? 1 : -1));
  return scored.slice(0, limit).map((x) => x.post);
}
