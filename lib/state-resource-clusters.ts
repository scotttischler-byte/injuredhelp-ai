import { asgStateUrl } from "@/lib/asg-links";
import { stateHubSlug } from "@/lib/geo-routes";
import { PRIORITY_PLACES } from "@/lib/priority-places/registry";
import { PRIORITY_STATE_NAMES, type PriorityStateName } from "@/lib/priority-places/types";

export type StateCityLink = {
  label: string;
  href: string;
  tier: 1 | 2 | 3;
};

export type StateResourceCluster = {
  state: PriorityStateName;
  stateHubHref: string;
  asgHref?: string;
  cities: StateCityLink[];
};

function cityHref(placeSlug: string): string {
  return `/car-accident-help-${placeSlug}`;
}

/** Priority state → city clusters for the public resource center (ASG-style). */
export function stateResourceClusters(): StateResourceCluster[] {
  return PRIORITY_STATE_NAMES.map((state) => {
    const cities = PRIORITY_PLACES.filter((p) => p.state === state)
      .sort((a, b) => a.tier - b.tier || a.city.localeCompare(b.city))
      .map((p) => ({
        label: p.city,
        href: cityHref(p.placeSlug),
        tier: p.tier,
      }));

    return {
      state,
      stateHubHref: `/${stateHubSlug(state)}`,
      asgHref: asgStateUrl(state),
      cities,
    };
  });
}
