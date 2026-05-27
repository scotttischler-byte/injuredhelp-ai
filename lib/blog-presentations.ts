import type { BlogLocale } from "@/lib/blog-locale";

/** Public PowerPoint companion for each blog post (SEO / GEO / indexing). */
export function presentationPathForSlug(slug: string, locale: BlogLocale = "en"): string {
  const safe = slug.toLowerCase().replace(/[^a-z0-9-]/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
  return locale === "es" ? `/blog/presentations/es/${safe}.pptx` : `/blog/presentations/${safe}.pptx`;
}

export function presentationUrlForSlug(
  slug: string,
  origin: string,
  locale: BlogLocale = "en",
): string {
  return `${origin}${presentationPathForSlug(slug, locale)}`;
}

export function presentationDiskPath(slug: string, locale: BlogLocale = "en"): string {
  const safe = slug.toLowerCase().replace(/[^a-z0-9-]/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
  return locale === "es"
    ? `public/blog/presentations/es/${safe}.pptx`
    : `public/blog/presentations/${safe}.pptx`;
}
