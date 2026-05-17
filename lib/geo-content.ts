import type { GeoHub } from "@/lib/geo-routes";
import { cityHubSlug, stateHubSlug } from "@/lib/geo-routes";
import type { FaqItem } from "@/lib/seo";
import type { CityProfile } from "@/lib/cities";
import { ALL_STATES, type StateProfile } from "@/lib/states";

const COMMON_CRASH_TYPES = [
  "rear-end collisions at signals and on highways",
  "T-bone crashes at busy intersections",
  "multi-vehicle pileups during rush hour",
  "hit-and-run incidents in parking lots and arterials",
  "distracted-driving crashes on commuter corridors",
];

function hashString(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

function pickVariants<T>(seed: string, items: T[], count: number): T[] {
  const h = hashString(seed);
  const out: T[] = [];
  for (let i = 0; i < count; i++) out.push(items[(h + i * 7) % items.length]!);
  return out;
}

export function stateProfileForName(stateName: string): StateProfile | undefined {
  return ALL_STATES.find((s) => s.state === stateName);
}

export function geoPlaceLabel(hub: GeoHub): string {
  return hub.type === "state" ? hub.profile.state : `${hub.profile.city}, ${hub.profile.state}`;
}

export function geoKeywords(hub: GeoHub): string[] {
  const place = geoPlaceLabel(hub);
  const city = hub.type === "city" ? hub.profile.city : hub.profile.majorCities[0];
  const base = [
    `${place} car accident lawyer`,
    `${place} injury attorney`,
    `car accident help ${place}`,
    `free attorney matching ${place}`,
  ];
  if (city) {
    base.push(`${city} car accident lawyer`, `${city} personal injury attorney`);
  }
  return base;
}

export function geoAccidentTypes(hub: GeoHub): string[] {
  const place = hub.type === "city" ? hub.profile.city : hub.profile.state;
  return pickVariants(hub.slug, COMMON_CRASH_TYPES, 3).map((t) => `${t} in ${place}`);
}

export function buildGeoFaqs(hub: GeoHub): FaqItem[] {
  const place = geoPlaceLabel(hub);
  const state =
    hub.type === "state" ? hub.profile : stateProfileForName(hub.profile.state);
  const solYears = state?.statuteOfLimitationsYears ?? 2;
  const settlement =
    hub.type === "state"
      ? hub.profile.avgSettlementRange
      : stateProfileForName(hub.profile.state)?.avgSettlementRange ?? "varies widely";

  return [
    {
      question: `Is WreckMatch a law firm in ${place}?`,
      answer:
        "No. WreckMatch connects accident victims with experienced personal injury attorneys at no upfront cost. We are a legal referral service operated by WreckMatch LLC — not a law firm — and we do not provide legal advice.",
    },
    {
      question: `How fast will someone call me in ${place}?`,
      answer:
        "After you submit the form or call (978) 515-6063, our team typically reaches you within 60 seconds to start free attorney matching.",
    },
    {
      question: `What is the statute of limitations for car accidents in ${hub.type === "state" ? place : hub.profile.state}?`,
      answer: `Many injury claims must be filed within about ${solYears} years, but deadlines vary for minors, government claims, and UM/UIM cases. Speak with an attorney promptly.`,
    },
    {
      question: `What do car accident settlements look like in ${place}?`,
      answer: `Reported ranges in our network for similar matters are often in the ${settlement} range, but every case is different. Past results do not guarantee future outcomes.`,
    },
    {
      question: `How much does it cost to use WreckMatch in ${place}?`,
      answer:
        "Matching is free. Referred attorneys typically work on contingency — you pay nothing unless you win, per your agreement with the lawyer you hire.",
    },
  ];
}

export type GeoContentSection = { id: string; title: string; paragraphs: string[] };

export function buildGeoSections(hub: GeoHub): GeoContentSection[] {
  const place = geoPlaceLabel(hub);
  const state =
    hub.type === "state" ? hub.profile : stateProfileForName(hub.profile.state);
  const accidents = geoAccidentTypes(hub);

  if (hub.type === "state" && state) {
    return [
      {
        id: "local-crashes",
        title: `Common car accident types in ${place}`,
        paragraphs: [
          `Drivers in ${place} frequently report ${accidents[0]}, ${accidents[1]}, and ${accidents[2]}.`,
          hub.profile.localTip,
        ],
      },
      {
        id: "deadlines",
        title: "Statute of limitations & insurance basics",
        paragraphs: [
          `Many ${place} personal injury lawsuits must be filed within about ${state.statuteOfLimitationsYears} years, but exceptions apply.`,
          `${place} uses a ${state.comparativeFault} negligence framework${state.noFault ? " and has no-fault insurance rules that can affect medical claims" : ""}. Minimum liability limits are commonly ${state.insuranceMinimums} (bodily injury / per person / property damage — verify current law).`,
        ],
      },
      {
        id: "settlements",
        title: "Settlement ranges (informational only)",
        paragraphs: [
          `Partner firms in our network report typical car-injury matter ranges around ${state.avgSettlementRange} in ${place}. This is not a quote or guarantee for your case.`,
          "Medical bills, lost wages, permanency, and insurance limits all affect value. An attorney licensed in your state should evaluate your facts.",
        ],
      },
      {
        id: "courts",
        title: "Courts & next steps",
        paragraphs: [
          `Claims may be negotiated with insurers or filed in ${place} state or federal courts depending on jurisdiction and damages.`,
          "Preserve photos, witness info, medical records, and avoid recorded statements until you understand your rights.",
        ],
      },
    ];
  }

  const city = hub.profile as CityProfile;
  const st = stateProfileForName(city.state);
  return [
    {
      id: "local-crashes",
      title: `Car accidents in ${city.city}, ${city.state}`,
      paragraphs: [
        `${city.city} sees ${accidents[0]} and ${accidents[1]} along ${city.majorHighways.slice(0, 2).join(" and ")}.`,
        city.localTip,
      ],
    },
    {
      id: "medical",
      title: "Medical care after a crash",
      paragraphs: [
        `Seek treatment promptly. Area facilities may include ${city.localHospitals.slice(0, 2).join(" and ")} — verify availability and your insurance network.`,
        "Document visits, imaging, and follow-up care; gaps in treatment are often used by insurers to dispute claims.",
      ],
    },
    {
      id: "deadlines",
      title: `${city.state} deadlines & insurance`,
      paragraphs: [
        st
          ? `Most ${city.state} injury claims face a statute of limitations of about ${st.statuteOfLimitationsYears} years.`
          : `Contact a ${city.state} attorney about filing deadlines as soon as possible.`,
        st
          ? `Typical informational settlement ranges reported in ${city.state}: ${st.avgSettlementRange}. Not a promise for your matter.`
          : "Settlement values depend on injuries, liability, and policy limits.",
      ],
    },
    {
      id: "attorney",
      title: `Finding a ${city.city} car accident lawyer`,
      paragraphs: [
        `Search terms like "${city.city} car accident lawyer" and "${city.city} injury attorney" often lead to referral services or law firms. WreckMatch LLC is a referral service — we help you speak with a licensed ${city.state} attorney at no upfront cost.`,
        `Use the related links below for ${city.state} statewide resources and nearby city pages.`,
      ],
    },
  ];
}

export function geoRelatedLinks(hub: GeoHub): { href: string; label: string }[] {
  const links: { href: string; label: string }[] = [
    { href: "/#form", label: "Free attorney matching form" },
    { href: "/blog", label: "Car accident blog" },
    { href: "/states", label: "All 50 states" },
  ];
  if (hub.type === "city") {
    links.push({
      href: `/${stateHubSlug(hub.profile.state)}`,
      label: `${hub.profile.state} car accident help`,
    });
  } else {
    hub.profile.majorCities.slice(0, 4).forEach((city) => {
      links.push({ href: `/${cityHubSlug(city)}`, label: `${city} car accident help` });
    });
  }
  return links;
}
