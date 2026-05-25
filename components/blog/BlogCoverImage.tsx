import { blogCoverIsUnoptimized } from "@/lib/blog-images";

type Props = {
  src: string;
  alt: string;
  priority?: boolean;
  className?: string;
};

/** Static blog covers: native img (fast CDN). No /_next/image under traffic. */
export function BlogCoverImage({ src, alt, priority = false, className = "object-cover" }: Props) {
  if (blogCoverIsUnoptimized(src)) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        fetchPriority={priority ? "high" : "low"}
        className={`absolute inset-0 h-full w-full ${className}`}
      />
    );
  }
  return null;
}
