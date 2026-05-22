import { ALL_CITIES, type CityProfile } from "@/lib/cities";
import { ALL_STATES } from "@/lib/states";

function stateProfileForName(stateName: string) {
  return ALL_STATES.find((s) => s.state === stateName);
}
import { TEXAS_CITY_CONTENT } from "@/lib/texas-city-content";
import type { EnrichedCityContent, PriorityPlaceEntry } from "@/lib/priority-places/types";
import { PRIORITY_PLACE_BY_SLUG } from "@/lib/priority-places/registry";

function cityProfileForPlace(entry: PriorityPlaceEntry): CityProfile | undefined {
  return ALL_CITIES.find(
    (c) =>
      c.city === entry.city &&
      c.state === entry.state &&
      (entry.placeSlug === (c.placeSlug ?? entry.placeSlug.replace(/-texas|-illinois|-colorado|-georgia$/, "").replace(/-/g, " ")) ||
        c.placeSlug === entry.placeSlug ||
        (!c.placeSlug && entry.city.toLowerCase().replace(/\s+/g, "-") === entry.placeSlug)),
  );
}

function buildGenericEnriched(entry: PriorityPlaceEntry): EnrichedCityContent {
  const profile = cityProfileForPlace(entry);
  const state = stateProfileForName(entry.state);
  const highways =
    entry.highways ?? profile?.majorHighways.join(", ") ?? "Major interstates and state routes";
  const hospitals =
    entry.hospitals ?? profile?.localHospitals.join(", ") ?? "Regional trauma centers (verify locally)";
  const localNote =
    entry.localNote ??
    profile?.localTip ??
    `${entry.city} sees heavy commuter traffic and intersection crashes. Seek care promptly and preserve evidence.`;
  const sol = state?.statuteOfLimitationsYears ?? 2;
  const fault = state?.comparativeFault ?? "Modified comparative";

  return {
    slug: entry.placeSlug,
    city: entry.city,
    state: entry.state,
    highways,
    hospitals,
    localNote,
    stats: [
      { label: "Annual reported crashes", value: entry.crashVolume ?? "Thousands annually in metro reports" },
      { label: "Traffic fatalities", value: entry.fatalities ?? "Varies by year — verify local DOT data" },
      {
        label: "Serious injuries",
        value: entry.seriousInjuries ?? `Common on ${highways.split(",")[0]?.trim() ?? "major corridors"}`,
      },
      { label: "High-risk corridors", value: highways },
      { label: "Trauma centers", value: hospitals },
    ],
    immediateSteps: [
      "Move to safety and call 911 if anyone is injured.",
      "Do not admit fault — document facts only.",
      `Photograph vehicles, plates, injuries, and conditions in ${entry.city}.`,
      "Exchange insurance and registration with all drivers.",
      "Collect witness names and phone numbers.",
      "Seek medical care within 24 hours.",
      "Notify your insurer — decline recorded statements first.",
      "Preserve dashcam, traffic camera, or business security video.",
    ],
    criticalSteps: [
      `Get medical evaluation within 24 hours — insurers in ${entry.city} dispute treatment gaps.`,
      `Obtain the police / crash report for your ${entry.city} jurisdiction.`,
      "Log every adjuster contact with dates and names.",
      "Do not post about the crash on social media.",
      `Track lost wages; ${entry.state} SOL is typically ${sol} years — confirm with counsel.`,
      "Review UM/UIM coverage on your policy.",
      "Do not accept the first low settlement offer.",
      "Use free WreckMatch matching before signing releases.",
    ],
    mistakes: [
      { mistake: "Recorded statement too early", consequence: "Insurer uses contradictions to reduce payout" },
      { mistake: "Delayed medical treatment", consequence: "Claim treated as minor injury" },
      { mistake: `Missing ${entry.state} filing deadline`, consequence: "Claim may be barred" },
      { mistake: "Accepting quick settlement", consequence: "Future damages waived" },
      { mistake: "No photos or witnesses", consequence: "Harder to prove fault and damages" },
    ],
    insuranceTactics: [
      "Quick lowball before treatment completes",
      "Recorded statements used out of context",
      "Disputing soft-tissue and whiplash injuries",
      "Delay tactics then pressure to sign",
      `Blaming pre-existing conditions in ${entry.city} claims`,
    ],
  };
}

/** Merged enriched map: Texas hand-tuned + generated priority cities. */
export function buildEnrichedCityMap(): Record<string, EnrichedCityContent> {
  const map: Record<string, EnrichedCityContent> = {};

  for (const [slug, tc] of Object.entries(TEXAS_CITY_CONTENT)) {
    map[slug] = { ...tc, state: "Texas" };
  }

  for (const [placeSlug, entry] of PRIORITY_PLACE_BY_SLUG) {
    if (map[placeSlug]) continue;
    if (entry.state === "Texas" && placeSlug in TEXAS_CITY_CONTENT) continue;
    map[placeSlug] = buildGenericEnriched(entry);
  }

  return map;
}

let cachedMap: Record<string, EnrichedCityContent> | null = null;

export function getEnrichedCityContent(placeSlug: string): EnrichedCityContent | null {
  if (!cachedMap) cachedMap = buildEnrichedCityMap();
  return cachedMap[placeSlug] ?? null;
}

export function enrichedPlaceSlugFromHubSlug(hubSlug: string): string | null {
  const place = hubSlug.replace(/^car-accident-help-/, "");
  if (!cachedMap) cachedMap = buildEnrichedCityMap();
  return place in cachedMap ? place : null;
}
