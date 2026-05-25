import { SiteHeader } from "@/components/SiteHeader";

export default function BlogPostLoading() {
  return (
    <div className="min-h-screen bg-gray-100">
      <SiteHeader />
      <article className="mx-auto max-w-3xl px-4 py-10">
        <div className="h-4 w-32 animate-pulse rounded bg-gray-200" />
        <div className="mt-4 h-10 w-full animate-pulse rounded-lg bg-gray-200" />
        <div className="mt-6 aspect-[1200/630] animate-pulse rounded-2xl bg-gradient-to-br from-gray-300 to-gray-100" />
        <div className="mt-8 space-y-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-4 animate-pulse rounded bg-gray-100" style={{ width: `${70 + (i % 3) * 10}%` }} />
          ))}
        </div>
      </article>
    </div>
  );
}
