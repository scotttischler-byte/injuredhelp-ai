/** Rich geo page content (Texas metros + national priority cities). */
export type EnrichedCityContent = {
  slug: string;
  city: string;
  state: string;
  stats: { label: string; value: string }[];
  immediateSteps: string[];
  criticalSteps: string[];
  mistakes: { mistake: string; consequence: string }[];
  insuranceTactics: string[];
  highways: string;
  hospitals: string;
  localNote: string;
};

export type AccidentVariantType = "truck" | "rideshare" | "motorcycle";

export type PriorityPlaceEntry = {
  placeSlug: string;
  city: string;
  state: string;
  tier: 1 | 2 | 3;
  highways?: string;
  hospitals?: string;
  localNote?: string;
  crashVolume?: string;
  fatalities?: string;
  seriousInjuries?: string;
};

export const PRIORITY_STATE_NAMES = [
  "Texas",
  "California",
  "Florida",
  "Georgia",
  "Illinois",
  "Alabama",
  "Tennessee",
  "Colorado",
  "Washington",
] as const;

export type PriorityStateName = (typeof PRIORITY_STATE_NAMES)[number];
