import { ALL_CITIES, type CityProfile } from "@/lib/cities";
import { ALL_STATES, type StateProfile } from "@/lib/states";

export function hubSlugFromName(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/['.]/g, "")
    .replace(/\s+/g, "-");
}

export function cityPlaceSlug(profile: CityProfile): string {
  return profile.placeSlug ?? hubSlugFromName(profile.city);
}

export function stateHubSlug(stateName: string): string {
  return `car-accident-help-${hubSlugFromName(stateName)}`;
}

/** Full hub slug for a city profile (used in sitemap and lookups). */
export function cityHubSlugFromProfile(profile: CityProfile): string {
  return `car-accident-help-${cityPlaceSlug(profile)}`;
}

/** @deprecated Prefer cityHubSlugFromProfile when you have a CityProfile. */
export function cityHubSlug(cityName: string): string {
  const match = ALL_CITIES.find((c) => c.city === cityName);
  if (match) return cityHubSlugFromProfile(match);
  return `car-accident-help-${hubSlugFromName(cityName)}`;
}

const STATE_BY_HUB = new Map<string, StateProfile>(
  ALL_STATES.map((s) => [stateHubSlug(s.state), s]),
);

const CITY_BY_HUB = new Map<string, CityProfile>(
  ALL_CITIES.map((c) => [cityHubSlugFromProfile(c), c]),
);

export type GeoHub =
  | { type: "state"; profile: StateProfile; slug: string }
  | { type: "city"; profile: CityProfile; slug: string };

export function getGeoHubBySlug(slug: string): GeoHub | null {
  const state = STATE_BY_HUB.get(slug);
  if (state) return { type: "state", profile: state, slug };
  const city = CITY_BY_HUB.get(slug);
  if (city) return { type: "city", profile: city, slug };
  return null;
}

export function getAllGeoHubSlugs(): string[] {
  const slugs = new Set<string>();
  for (const s of ALL_STATES) slugs.add(stateHubSlug(s.state));
  for (const c of ALL_CITIES) slugs.add(cityHubSlugFromProfile(c));
  return [...slugs];
}
