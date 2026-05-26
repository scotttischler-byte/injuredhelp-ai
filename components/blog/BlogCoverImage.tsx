import { blogCoverIsUnoptimized } from "@/lib/blog-images";

type Props = {
  src: string;
  alt: string;
  priority?: boolean;
  className?: string;
};

/** Static blog covers: native img (fast CDN). No /_next/image under traffic. */
export function BlogCoverImage({ src, alt, priority = false, className = "object-cover" }: Props) {
  const imgSrc = src.startsWith("http") ? src : src;

  // Always render — never return null (broken cards looked like "no images").
  if (!blogCoverIsUnoptimized(imgSrc) && !imgSrc.split("?")[0].startsWith("/blog/covers/")) {
    return (
      <div
        className={`absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-950 ${className}`}
        role="img"
        aria-label={alt}
      />
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={imgSrc}
      alt={alt}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      fetchPriority={priority ? "high" : "auto"}
      className={`absolute inset-0 h-full w-full ${className}`}
    />
  );
}
