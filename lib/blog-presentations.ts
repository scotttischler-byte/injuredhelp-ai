/** Public PowerPoint companion for each blog post (SEO / GEO / indexing). */
export function presentationPathForSlug(slug: string): string {
  const safe = slug.toLowerCase().replace(/[^a-z0-9-]/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
  return `/blog/presentations/${safe}.pptx`;
}

export function presentationUrlForSlug(slug: string, origin: string): string {
  return `${origin}${presentationPathForSlug(slug)}`;
}
