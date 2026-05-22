import { hubSlugForPlace, priorityPlacesForState } from "@/lib/priority-places/registry";

export type PriorityMetroLink = { placeSlug: string; label: string; tier: 1 | 2 | 3 };

export function priorityMetroLinksForState(stateName: string): PriorityMetroLink[] {
  return priorityPlacesForState(stateName).map((p) => ({
    placeSlug: p.placeSlug,
    label: p.city,
    tier: p.tier,
  }));
}

export function priorityMetroHubPath(placeSlug: string): string {
  return `/${hubSlugForPlace(placeSlug)}`;
}
