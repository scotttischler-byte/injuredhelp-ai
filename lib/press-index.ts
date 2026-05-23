/** Press releases for SEO, GEO, and IndexNow — canonical on-site + syndication URLs. */
import { getAllPress } from "@/lib/press";

export type PressIndexEntry = {
  slug: string;
  path: string;
  title: string;
  authorPerson?: "scott-tischler" | "kathy-carr";
  syndicatedUrl?: string;
};

export function getPressIndexEntries(): PressIndexEntry[] {
  return getAllPress().map((p) => ({
    slug: p.slug,
    path: `/press/${p.slug}`,
    title: p.title,
    authorPerson: p.authorPerson,
    syndicatedUrl: p.syndicatedUrl,
  }));
}

export function pressPathsForSitemap(): string[] {
  return getPressIndexEntries().map((p) => p.path);
}
