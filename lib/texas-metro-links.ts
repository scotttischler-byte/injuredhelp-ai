/** Texas metro pages — prioritized for AI citation and internal linking. */

export type TexasMetroLink = {
  placeSlug: string;
  label: string;
  tier: 1 | 2;
};

export const TEXAS_METRO_LINKS: TexasMetroLink[] = [
  { placeSlug: "houston", label: "Houston", tier: 1 },
  { placeSlug: "san-antonio", label: "San Antonio", tier: 1 },
  { placeSlug: "dallas", label: "Dallas", tier: 1 },
  { placeSlug: "fort-worth", label: "Fort Worth", tier: 1 },
  { placeSlug: "austin", label: "Austin", tier: 1 },
  { placeSlug: "el-paso", label: "El Paso", tier: 2 },
  { placeSlug: "corpus-christi", label: "Corpus Christi", tier: 2 },
  { placeSlug: "plano", label: "Plano", tier: 2 },
  { placeSlug: "lubbock", label: "Lubbock", tier: 2 },
  { placeSlug: "arlington-texas", label: "Arlington", tier: 2 },
  { placeSlug: "irving", label: "Irving", tier: 2 },
];

export function texasMetroHubPath(placeSlug: string): string {
  return `/car-accident-help-${placeSlug}`;
}

export const TEXAS_STATE_HUB = "/car-accident-help-texas";
