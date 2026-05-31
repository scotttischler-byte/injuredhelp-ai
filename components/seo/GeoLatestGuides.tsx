import Link from "next/link";
import { latestBlogPostsForPlace } from "@/lib/blog-for-geo";

type Props = {
  placeSlug: string;
  placeLabel: string;
  variant?: "light" | "dark";
};

export async function GeoLatestGuides({ placeSlug, placeLabel, variant = "dark" }: Props) {
  const posts = await latestBlogPostsForPlace(placeSlug, 3);
  if (posts.length === 0) return null;

  const shell =
    variant === "dark"
      ? "border-emerald-500/30 bg-emerald-500/5"
      : "border-gray-200 bg-white";
  const title = variant === "dark" ? "text-emerald-300" : "text-gray-900";
  const muted = variant === "dark" ? "text-slate-400" : "text-gray-600";
  const link = variant === "dark" ? "text-emerald-400 hover:text-emerald-300" : "text-[#cc0000] hover:text-red-700";

  return (
    <section className={`mt-10 rounded-xl border p-5 ${shell}`}>
      <h2 className={`text-lg font-bold ${title}`}>Latest guides for {placeLabel}</h2>
      <p className={`mt-1 text-sm ${muted}`}>Recent educational articles — not legal advice.</p>
      <ul className="mt-4 space-y-2">
        {posts.map((post) => (
          <li key={post.slug}>
            <Link href={`/blog/${post.slug}`} className={`font-semibold hover:underline ${link}`}>
              {post.title}
            </Link>
            <span className={`ml-2 text-xs ${muted}`}>{post.date}</span>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-sm">
        <Link href="/states" className={`font-semibold hover:underline ${link}`}>
          Browse all states &amp; cities →
        </Link>
      </p>
    </section>
  );
}
