import Image from "next/image";
import Link from "next/link";
import { blogCoverForSlug } from "@/lib/blog-images";
import { authorshipForSlug } from "@/lib/blog-authors";
import { blogPagePath, totalBlogPages } from "@/lib/blog-pagination";
import { personDisplayName } from "@/lib/entities";
import type { PostMeta } from "@/lib/posts";

type Props = {
  posts: PostMeta[];
  page: number;
  totalPosts: number;
};

export function BlogIndex({ posts, page, totalPosts }: Props) {
  const pages = totalBlogPages(totalPosts);

  return (
    <main className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="text-3xl font-extrabold text-gray-950 sm:text-4xl">Car accident help & resources</h1>
      <p className="mt-4 max-w-3xl text-gray-600">
        {totalPosts} educational guides on car, truck, rideshare, motorcycle, and pedestrian accidents.
        Authored by the WreckMatch team and reviewed by Judge Roy Waddell for legal context. WreckMatch LLC
        is a legal referral service, not a law firm.
      </p>
      <p className="mt-2 text-sm text-gray-500">
        Meet the team on the{" "}
        <Link href="/leadership" className="font-semibold text-[#cc0000] hover:underline">
          Leadership page
        </Link>
        .
      </p>

      <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => {
          const isLegacySvgCover = /^\/blog\/covers\/[a-z0-9-]+\.svg$/i.test(post.coverImage ?? "");
          const cover = post.coverImage && !isLegacySvgCover
            ? { src: post.coverImage, alt: post.coverAlt ?? post.title }
            : blogCoverForSlug(post.slug);
          const { author } = authorshipForSlug(post.slug);
          return (
            <li
              key={post.slug}
              className="flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:border-[#cc0000]/40 hover:shadow-md"
            >
              <Link href={`/blog/${post.slug}`} className="block">
                <div className="relative aspect-[1200/630] w-full overflow-hidden bg-gray-900">
                  <Image
                    src={cover.src}
                    alt={cover.alt}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 400px"
                    className="object-cover transition group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
              </Link>
              <div className="flex flex-1 flex-col p-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-[#cc0000]">{post.category}</p>
                <h2 className="mt-2 text-lg font-bold text-gray-900">
                  <Link href={`/blog/${post.slug}`} className="hover:text-[#cc0000]">
                    {post.title}
                  </Link>
                </h2>
                <p className="mt-2 line-clamp-3 text-sm text-gray-600">{post.description}</p>
                <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3 text-xs text-gray-500">
                  <span>By {personDisplayName(author)}</span>
                  <span>{post.date}</span>
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      {posts.length === 0 ? (
        <p className="mt-8 text-gray-500">New articles are being published — check back soon.</p>
      ) : null}

      {pages > 1 ? (
        <nav className="mt-12 flex flex-wrap items-center justify-center gap-2" aria-label="Blog pagination">
          {page > 1 ? (
            <Link
              href={blogPagePath(page - 1)}
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:border-[#cc0000]/40"
            >
              ← Previous
            </Link>
          ) : null}
          <span className="px-3 text-sm text-gray-500">
            Page {page} of {pages}
          </span>
          {page < pages ? (
            <Link
              href={blogPagePath(page + 1)}
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:border-[#cc0000]/40"
            >
              Next →
            </Link>
          ) : null}
        </nav>
      ) : null}

      <p className="mt-12 text-center">
        <Link href="/#form" className="font-bold text-[#cc0000] hover:underline">
          Get free attorney matching →
        </Link>
      </p>
    </main>
  );
}
