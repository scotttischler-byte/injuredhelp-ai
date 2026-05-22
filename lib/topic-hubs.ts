import { hubSlugForPlace, PRIORITY_PLACES } from "@/lib/priority-places/registry";
import { PRIORITY_STATE_NAMES } from "@/lib/priority-places/types";
import { hubSlugFromName } from "@/lib/geo-routes";

export type TopicHub = {
  slug: string;
  path: string;
  title: string;
  description: string;
  keywords: string[];
  priority: boolean;
};

export const TOPIC_HUBS: TopicHub[] = [
  {
    slug: "car",
    path: "/car-accident-help",
    title: "Car Accident Help — Free Attorney Matching (2026)",
    description:
      "Nationwide car accident guides: what to do after a crash, deadlines, insurance tactics, and free lawyer matching in 60 seconds.",
    keywords: ["car accident lawyer", "car accident help", "personal injury attorney"],
    priority: true,
  },
  {
    slug: "truck",
    path: "/truck-accident-help",
    title: "Truck & 18-Wheeler Accident Help (2026)",
    description:
      "Semi truck crash guides: FMCSA, black box data, multiple defendants, and free attorney matching. Educational — not legal advice.",
    keywords: ["truck accident lawyer", "18 wheeler accident", "semi truck crash"],
    priority: true,
  },
  {
    slug: "motorcycle",
    path: "/motorcycle-accident-help",
    title: "Motorcycle Accident Help — Free Lawyer Matching",
    description:
      "Motorcycle crash victim guides: helmet laws, insurer bias, medical documentation, and free attorney referral.",
    keywords: ["motorcycle accident lawyer", "motorcycle injury attorney"],
    priority: false,
  },
  {
    slug: "rideshare",
    path: "/rideshare-accident-help",
    title: "Uber & Lyft Accident Help (2026)",
    description:
      "Rideshare accident insurance periods, trip documentation, and free matching with licensed attorneys.",
    keywords: ["Uber accident lawyer", "Lyft accident claim", "rideshare accident"],
    priority: false,
  },
  {
    slug: "pedestrian",
    path: "/pedestrian-accident-help",
    title: "Pedestrian Accident Help",
    description: "Hit by a car while walking? Steps, deadlines, and free attorney matching nationwide.",
    keywords: ["pedestrian accident lawyer", "hit by car walking"],
    priority: false,
  },
  {
    slug: "uninsured",
    path: "/uninsured-driver-accident-help",
    title: "Uninsured Driver Accident Help",
    description: "Hit by an uninsured or underinsured driver? UM/UIM basics and free lawyer matching.",
    keywords: ["uninsured motorist claim", "underinsured driver"],
    priority: false,
  },
];

export function stateHubPath(stateName: string): string {
  return `/${hubSlugFromName(stateName)}`;
}

export function cityHubPath(placeSlug: string): string {
  return `/${hubSlugForPlace(placeSlug)}`;
}

export function priorityCitiesByState(state: string) {
  return PRIORITY_PLACES.filter((p) => p.state === state);
}

