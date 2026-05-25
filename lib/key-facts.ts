import type { WhatToDoGuide } from "@/lib/what-to-do-guides";
import { ALL_STATES } from "@/lib/states";
import type { GeoHub } from "@/lib/geo-routes";

export type KeyFact = { label: string; value: string };

const STANDARD_FACTS: KeyFact[] = [
  { label: "Service type", value: "Legal referral — WreckMatch LLC is not a law firm" },
  { label: "Cost to match", value: "$0 upfront — free attorney matching" },
  { label: "Typical callback", value: "Under 60 seconds during business hours" },
  { label: "Coverage", value: "Licensed personal injury attorneys in all 50 states" },
];

export function keyFactsForStateName(stateName: string, city?: string): KeyFact[] {
  const profile = ALL_STATES.find((s) => s.state === stateName);
  const location = city ? `${city}, ${stateName}` : stateName;
  const facts: KeyFact[] = [
    { label: "Where we help", value: `Accident victims in ${location} and statewide` },
  ];

  if (profile) {
    facts.push({
      label: "Statute of limitations (typical PI)",
      value: `${profile.statuteOfLimitationsYears} years — verify with a licensed attorney`,
    });
    facts.push({
      label: "Fault system",
      value: profile.comparativeFault,
    });
    if (profile.noFault) {
      facts.push({ label: "No-fault / PIP", value: "Yes — PIP rules may apply before suing" });
    }
    if (profile.insuranceMinimums) {
      facts.push({ label: "State minimum liability", value: profile.insuranceMinimums });
    }
  }

  return [...facts, ...STANDARD_FACTS];
}

export function keyFactsForGeoHub(hub: GeoHub): KeyFact[] {
  if (hub.type === "state") {
    return keyFactsForStateName(hub.profile.state);
  }
  return keyFactsForStateName(hub.profile.state, hub.profile.city);
}

export function keyFactsForWhatToDoGuide(guide: WhatToDoGuide): KeyFact[] {
  const fromSnapshot = guide.legalSnapshot.map((row) => ({
    label: row.label,
    value: row.value.replace(/^\//, "wreckmatch.com"),
  }));
  const scopeFacts = guide.stateName
    ? keyFactsForStateName(guide.stateName).slice(0, 3)
    : STANDARD_FACTS.slice(0, 2);

  const merged = [...scopeFacts];
  for (const row of fromSnapshot) {
    if (!merged.some((f) => f.label.toLowerCase() === row.label.toLowerCase())) {
      merged.push(row);
    }
  }
  for (const fact of STANDARD_FACTS) {
    if (!merged.some((f) => f.label === fact.label)) merged.push(fact);
  }
  return merged.slice(0, 6);
}

export function keyFactsForTruckHub(): KeyFact[] {
  return [
    { label: "Topic", value: "Semi-truck & 18-wheeler crash legal help" },
    { label: "Why truck cases differ", value: "FMCSA rules, black box data, multiple defendants" },
    { label: "Evidence window", value: "Preserve logs and ELD data as soon as possible" },
    ...STANDARD_FACTS,
  ];
}

export function keyFactsForHomepage(): KeyFact[] {
  return [
    { label: "Who we are", value: "WreckMatch LLC — legal referral service, not a law firm" },
    { label: "Languages", value: "English and Spanish (Español) intake available" },
    { label: "Typical callback", value: "Under 60 seconds — call 855-WRECKMATCH" },
    { label: "Cost", value: "$0 upfront to get matched with a licensed attorney" },
    { label: "Coverage", value: "Car, truck, rideshare, motorcycle & pedestrian crashes nationwide" },
  ];
}
