import { SiteHeader } from "@/components/SiteHeader";

function CardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-sm">
      <div className="aspect-[16/9] animate-pulse bg-gradient-to-br from-gray-200 to-gray-100" />
      <div className="space-y-3 p-5">
        <div className="h-3 w-24 animate-pulse rounded bg-gray-200" />
        <div className="h-5 w-full animate-pulse rounded bg-gray-200" />
        <div className="h-4 w-4/5 animate-pulse rounded bg-gray-100" />
        <div className="mt-4 h-3 w-32 animate-pulse rounded bg-gray-100" />
      </div>
    </div>
  );
}

export default function BlogLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-gray-100">
      <SiteHeader />
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="h-10 w-2/3 max-w-lg animate-pulse rounded-lg bg-gray-200" />
        <div className="mt-4 h-4 w-full max-w-2xl animate-pulse rounded bg-gray-100" />
        <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <li key={i}>
              <CardSkeleton />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
