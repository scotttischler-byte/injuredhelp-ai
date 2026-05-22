import type { FaqItem } from "@/lib/seo";
import type { AccidentVariantType } from "@/lib/priority-places/types";
import { getEnrichedCityContent } from "@/lib/priority-places/content-builder";
import { ALL_STATES } from "@/lib/states";

function stateProfileForName(stateName: string) {
  return ALL_STATES.find((s) => s.state === stateName);
}
import type { GeoContentSection } from "@/lib/geo-content";

const VARIANT_META: Record<
  AccidentVariantType,
  { label: string; headline: string; keywords: string[]; intro: string }
> = {
  truck: {
    label: "Truck / 18-Wheeler Accident",
    headline: "Truck & 18-Wheeler Accident",
    keywords: ["semi truck accident", "FMCSA", "commercial liability", "black box"],
    intro:
      "Commercial truck crashes often involve federal regulations, multiple defendants, and severe injuries. Preserve ECM/black box data quickly.",
  },
  rideshare: {
    label: "Uber / Lyft / Rideshare Accident",
    headline: "Uber, Lyft & Rideshare Accident",
    keywords: ["Uber accident lawyer", "Lyft insurance period", "rideshare coverage"],
    intro:
      "Rideshare claims depend on which insurance period applied (app off, waiting, or trip in progress). Document the app status and trip ID immediately.",
  },
  motorcycle: {
    label: "Motorcycle Accident",
    headline: "Motorcycle Accident",
    keywords: ["motorcycle injury attorney", "helmet laws", "bias against riders"],
    intro:
      "Motorcycle victims face insurer bias and serious injury risk. Gear, lane-splitting rules, and medical documentation matter from day one.",
  },
};

export function buildAccidentVariantSections(
  placeSlug: string,
  city: string,
  state: string,
  variant: AccidentVariantType,
): GeoContentSection[] {
  const base = getEnrichedCityContent(placeSlug);
  const meta = VARIANT_META[variant];
  const st = stateProfileForName(state);

  return [
    {
      id: "overview",
      title: `${meta.headline} in ${city}, ${state} — what to know (2026)`,
      paragraphs: [
        meta.intro,
        base?.localNote ?? `${city} injury claims require fast documentation and licensed ${state} counsel.`,
        "Educational only — not legal advice. WreckMatch LLC is a referral service, not a law firm.",
      ],
    },
    {
      id: "immediate",
      title: `Immediate steps after a ${meta.label.toLowerCase()} in ${city}`,
      paragraphs: [`Protect your health and claim in ${city} with these steps:`],
      listItems: [
        "Call 911 and accept EMS transport if injured.",
        variant === "truck"
          ? "Identify motor carrier, USDOT number, and trailer plates."
          : variant === "rideshare"
            ? "Screenshot Uber/Lyft app status, trip ID, and driver info."
            : "Photograph bike damage, gear, and road conditions.",
        "Do not repair vehicles or discard evidence before photos.",
        "Decline recorded statements until you understand coverage.",
        "Seek medical care within 24 hours.",
        "Contact WreckMatch for free attorney matching — 855 WRECKMATCH.",
      ],
    },
    {
      id: "liability",
      title: "Who may be liable?",
      paragraphs: ["Multiple parties are common in these cases:"],
      table: {
        headers: ["Party", "Why it matters"],
        rows:
          variant === "truck"
            ? [
                ["Truck driver", "Negligence, hours-of-service, distraction"],
                ["Motor carrier", "Vicarious liability, maintenance records"],
                ["Shipper / loader", "Cargo securement defects"],
                ["Truck manufacturer", "Defect claims (rare)"],
              ]
            : variant === "rideshare"
              ? [
                  ["Rideshare driver", "Negligent driving"],
                  ["Uber / Lyft", "Commercial policy by period"],
                  ["Other motorists", "Third-party liability"],
                  ["Your UM/UIM", "Gap coverage when others underinsured"],
                ]
              : [
                  ["Other driver", "Primary negligence claim"],
                  ["City / county", "Dangerous road design (fact-specific)"],
                  ["Helmet / gear defects", "Product claims if applicable"],
                  ["Your insurer", "UM/UIM and med-pay"],
                ],
      },
    },
    {
      id: "deadlines",
      title: `${state} deadlines & insurance`,
      paragraphs: [
        st
          ? `Most ${state} injury claims face about ${st.statuteOfLimitationsYears} years to sue, with exceptions. Fault rules: ${st.comparativeFault}.`
          : `Confirm ${state} filing deadlines with a licensed attorney immediately.`,
        `Informational settlement ranges in ${state}: ${st?.avgSettlementRange ?? "vary widely"}. Not a guarantee.`,
      ],
    },
    {
      id: "mistakes",
      title: `Costly mistakes after a ${city} ${variant} crash`,
      paragraphs: ["Avoid these errors that reduce payouts:"],
      mistakeRows:
        variant === "truck"
          ? [
              { mistake: "No spoliation letter for ECM/black box", consequence: "Data overwritten — liability harder to prove" },
              { mistake: "Only suing the driver", consequence: "Policy limits too low for catastrophic injury" },
              { mistake: "Delayed medical care", consequence: "Severity disputed" },
            ]
          : variant === "rideshare"
            ? [
                { mistake: "No proof of rideshare period", consequence: "Wrong policy — coverage denied" },
                { mistake: "Signing insurer releases early", consequence: "Future damages waived" },
                { mistake: "Assuming Uber pays everything", consequence: "Complex layered policies" },
              ]
            : [
                { mistake: "No helmet / gear photos", consequence: "Damages and liability disputed" },
                { mistake: "Admitting fault at scene", consequence: "Used against rider" },
                { mistake: "Skipping follow-up care", consequence: "Soft-tissue claims minimized" },
              ],
    },
  ];
}

export function buildAccidentVariantFaqs(
  city: string,
  state: string,
  variant: AccidentVariantType,
): FaqItem[] {
  const meta = VARIANT_META[variant];
  return [
    {
      question: `Should I hire a lawyer after a ${meta.label.toLowerCase()} in ${city}?`,
      answer:
        "Serious injury, disputed fault, or commercial/rideshare policies usually require counsel. WreckMatch offers free matching with licensed attorneys — we are not a law firm.",
    },
    {
      question: `How much does WreckMatch cost in ${city}?`,
      answer: "Free matching. Attorneys typically work on contingency per your agreement.",
    },
    {
      question: `Is WreckMatch a law firm?`,
      answer:
        "No. WreckMatch LLC is a legal referral service. We do not provide legal advice.",
    },
    {
      question: `How fast will someone call me?`,
      answer: "Typically within 60 seconds at 855 WRECKMATCH — (855) 897-3256.",
    },
    {
      question: `What insurance applies in ${city}, ${state}?`,
      answer:
        variant === "truck"
          ? "Commercial auto, motor carrier, and sometimes cargo policies may stack. An attorney should identify all policies quickly."
          : variant === "rideshare"
            ? "Coverage depends on whether the driver was offline, available, or on a trip. Document app status immediately."
            : "UM/UIM, med-pay, and the at-fault driver's liability policy may all apply. Helmet and gear rules vary in New York and other states.",
    },
  ];
}

export function variantLabel(variant: AccidentVariantType): string {
  return VARIANT_META[variant].label;
}

export function variantHeadline(variant: AccidentVariantType): string {
  return VARIANT_META[variant].headline;
}
