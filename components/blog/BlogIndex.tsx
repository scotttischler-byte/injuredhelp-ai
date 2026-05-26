import Link from "next/link";
import { BlogCardByline } from "@/components/blog/BlogCardByline";
import { BlogCoverImage } from "@/components/blog/BlogCoverImage";
import { blogCoverForSlug, shouldUseGeneratedCover } from "@/lib/blog-images";
import { authorshipForSlug } from "@/lib/blog-authors";
import { blogPagePath, totalBlogPages } from "@/lib/blog-pagination";
import { WRECKMATCH_PHONE_DISPLAY } from "@/lib/phones";
import type { PostMeta } from "@/lib/posts";

type Props = {
  posts: PostMeta[];
  page: number;
  totalPosts: number;
};

export function BlogIndex({ posts, page, totalPosts }: Props) {
  const pages = totalBlogPages(totalPosts);

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-gray-50">
      <section className="border-b border-gray-200/80 bg-gradient-to-br from-gray-950 via-gray-900 to-slate-900 px-4 py-12 text-white sm:py-16">
        <div className="mx-auto max-w-6xl">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-red-300">WreckMatch resources</p>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
            Car accident help &amp; legal guides
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-gray-300 sm:text-lg">
            {totalPosts} educational guides — car, truck, severe injury, and insurance. Written by Scott Tischler
            and team; reviewed by Judge Roy Waddell. Free attorney matching in ~60 seconds.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/#form"
              className="inline-flex min-h-[48px] items-center justify-center rounded-xl bg-[#cc0000] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-red-900/30 transition hover:bg-red-700"
            >
              Free attorney matching →
            </Link>
            <a
              href={`tel:${WRECKMATCH_PHONE_DISPLAY.replace(/\D/g, "")}`}
              className="inline-flex min-h-[48px] items-center justify-center rounded-xl border border-white/25 bg-white/5 px-6 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/10"
            >
              {WRECKMATCH_PHONE_DISPLAY}
            </a>
          </div>
          <p className="mt-6 text-xs text-gray-500">
            WreckMatch LLC is a legal referral service, not a law firm. Educational only — not legal advice.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-10 sm:py-12">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-gray-500">
              Page {page} of {pages} · {posts.length} articles on this page
            </p>
            <p className="mt-1 text-sm text-gray-600">
              <Link href="/leadership" className="font-semibold text-[#cc0000] hover:underline">
                Meet our team
              </Link>
            </p>
          </div>
        </div>

        <ul className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => {
            const cover = shouldUseGeneratedCover(post.slug, post.coverImage)
              ? blogCoverForSlug(post.slug)
              : { src: post.coverImage!, alt: post.coverAlt ?? post.title };
            const { author } = authorshipForSlug(post.slug);
            return (
              <li key={post.slug}>
                <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200/90 bg-white shadow-sm ring-1 ring-black/[0.03] transition duration-200 hover:-translate-y-0.5 hover:border-[#cc0000]/25 hover:shadow-lg [content-visibility:auto] [contain-intrinsic-size:440px]">
                  <Link href={`/blog/${post.slug}`} prefetch={false} className="block">
                    <div className="relative aspect-[16/9] w-full overflow-hidden bg-gray-200">
                      <BlogCoverImage src={cover.src} alt={cover.alt} />
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-80" />
                      <span className="absolute bottom-3 left-3 rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-[#cc0000] shadow-sm">
                        {post.category}
                      </span>
                    </div>
                  </Link>
                  <div className="flex flex-1 flex-col p-5 sm:p-6">
                    <h2 className="text-lg font-bold leading-snug text-gray-900 group-hover:text-[#cc0000]">
                      <Link href={`/blog/${post.slug}`} prefetch={false}>
                        {post.title}
                      </Link>
                    </h2>
                    <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-gray-600">
                      {post.description}
                    </p>
                    <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4">
                      <BlogCardByline author={author} />
                      <span className="text-xs text-gray-500">{post.date}</span>
                    </div>
                  </div>
                </article>
              </li>
            );
          })}
        </ul>

        {posts.length === 0 ? (
          <p className="mt-8 rounded-xl border border-dashed border-gray-300 bg-white p-8 text-center text-gray-500">
            New articles are being published — check back soon.
          </p>
        ) : null}

        {pages > 1 ? (
          <nav className="mt-12 flex flex-wrap items-center justify-center gap-3" aria-label="Blog pagination">
            {page > 1 ? (
              <Link
                href={blogPagePath(page - 1)}
                prefetch={false}
                className="min-h-[44px] rounded-xl border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition hover:border-[#cc0000]/40 hover:text-[#cc0000]"
              >
                ← Previous
              </Link>
            ) : null}
            <span className="rounded-full bg-gray-100 px-4 py-2 text-sm font-medium text-gray-600">
              Page {page} of {pages}
            </span>
            {page < pages ? (
              <Link
                href={blogPagePath(page + 1)}
                prefetch={false}
                className="min-h-[44px] rounded-xl border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition hover:border-[#cc0000]/40 hover:text-[#cc0000]"
              >
                Next →
              </Link>
            ) : null}
          </nav>
        ) : null}
      </div>
    </main>
  );
}
