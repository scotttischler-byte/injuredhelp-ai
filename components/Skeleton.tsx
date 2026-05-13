export function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-lg bg-gray-800/80 will-change-opacity ${className}`}
      aria-hidden
    />
  );
}

export function BlogCardSkeleton() {
  return (
    <div className="rounded-xl border border-gray-800 bg-gray-900/60 p-5">
      <Skeleton className="mb-3 h-5 w-24" />
      <Skeleton className="mb-2 h-6 w-full" />
      <Skeleton className="mb-2 h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
    </div>
  );
}
