import type { FaqItem } from "@/lib/seo/schema";
import type { SiteBrand } from "@/lib/site";
import { BRAND_CONFIG } from "@/lib/site";
import { WRECKMATCH_PHONE_DISPLAY } from "@/lib/phones";
import { OPERATOR_LEGAL_NAME } from "@/lib/compliance";

/** Paths that already ship FAQ in-page (skip auto-inject). */
export const GEO_FAQ_SKIP_PREFIXES = [
  "/blog",
  "/es/blog",
  "/admin",
  "/car-accident-help",
  "/truck-accident-help",
  "/press",
];

function baseFaqs(brand: SiteBrand): FaqItem[] {
  const cfg = BRAND_CONFIG[brand];
  return [
    {
      question: `Is ${cfg.name} a law firm?`,
      answer: `No. ${OPERATOR_LEGAL_NAME} operates ${cfg.name} as a legal referral service. We do not provide legal advice.`,
    },
    {
      question: "How fast will someone contact me?",
      answer: `After you submit the form or call ${WRECKMATCH_PHONE_DISPLAY}, we typically reach you within 60 seconds to start free attorney matching.`,
    },
    {
      question: "How much does matching cost?",
      answer:
        "Free. Referred attorneys usually work on contingency — you pay nothing unless you win, per your agreement with the lawyer you hire.",
    },
  ];
}

const PATH_FAQS: Record<string, (brand: SiteBrand) => FaqItem[]> = {
  "/": (brand) => {
    const cfg = BRAND_CONFIG[brand];
    if (brand === "semitruckmatch") {
      return [
        ...baseFaqs(brand),
        {
          question: "What types of truck crashes do you handle?",
          answer:
            "Semi-truck, 18-wheeler, underride, jackknife, and commercial carrier collisions nationwide. We match victims with counsel experienced in FMCSA evidence.",
        },
        {
          question: "Do you cover all 50 states?",
          answer: "Yes. State-specific truck accident guides and licensed counsel in the state where the crash occurred.",
        },
      ];
    }
    return [
      ...baseFaqs(brand),
      {
        question: "What should I do right after a car accident?",
        answer:
          "Call 911 if injured, document the scene, exchange insurance, seek medical care, and avoid recorded statements before speaking with counsel.",
      },
      {
        question: "Do you offer help in Spanish?",
        answer: `Yes. ${cfg.name} publishes Spanish guides at /es/blog and can connect you with bilingual resources.`,
      },
    ];
  },
  "/for-attorneys": (brand) => [
    {
      question: "What lead volume can firms expect?",
      answer:
        "Volume scales with indexation and paid channels. Infrastructure targets high daily intake-ready truck and MVA referrals as SEO and IndexNow compound.",
    },
    {
      question: "Are leads exclusive?",
      answer: "Partnership terms vary by market and practice area. Contact us to discuss routing, geography, and intake SLAs.",
    },
    {
      question: "What intake data is included?",
      answer:
        "Accident type, state, timing, and contact details victims submit on conversion forms — designed for 60-second callback workflows.",
    },
    ...(brand === "semitruckmatch"
      ? [
          {
            question: "Why truck-only positioning?",
            answer:
              "FMCSA evidence, carrier insurers, and higher policy limits require different playbooks than generic car-crash funnels.",
          },
        ]
      : []),
  ],
  "/ai-accident-help": () => [
    {
      question: "How does AI accident help work?",
      answer:
        "Educational guides optimized for AI search and voice assistants, plus free matching with licensed attorneys — not automated legal advice.",
    },
    {
      question: "Which AI engines can cite this site?",
      answer:
        "ChatGPT, Claude, Perplexity, Gemini, and others that respect robots.txt and llms.txt — we explicitly allow major AI crawlers.",
    },
  ],
  "/checklist-after-car-accident": () => [
    {
      question: "What is the most important step in the first hour?",
      answer: "Medical safety and 911 if needed, then photos, witness info, and avoiding fault admissions to insurers.",
    },
    {
      question: "Should I speak to the other driver's insurer?",
      answer: "Avoid recorded statements until you understand your rights. Speak with counsel first when injuries are involved.",
    },
  ],
  "/truck-accident-evidence-guide": () => [
    {
      question: "What is a truck black box (ECM)?",
      answer:
        "An event data recorder that captures speed, braking, and engine data — often overwritten within days if not preserved.",
    },
    {
      question: "Who should preserve ELD logs?",
      answer: "Your attorney can send spoliation letters to the carrier; victims should not rely on the trucking company to save data voluntarily.",
    },
  ],
  "/insurance-adjuster-guide": () => [
    {
      question: "Why do adjusters call so quickly?",
      answer:
        "Early contact can lock in recorded statements and low settlements before you understand injury severity or legal deadlines.",
    },
  ],
  "/motorcycle-accident-help": () => [
    {
      question: "Are motorcycle cases different from car crashes?",
      answer:
        "Bias, helmet laws, and injury severity often change valuation. Matching with counsel who try motorcycle cases regularly matters.",
    },
  ],
  "/rideshare-accident-help": () => [
    {
      question: "Who pays after an Uber or Lyft crash?",
      answer:
        "Layered commercial policies, app-on/app-off periods, and personal policies — fact-specific; counsel maps coverage early.",
    },
  ],
  "/pedestrian-accident-help": () => [
    {
      question: "What if I was hit as a pedestrian?",
      answer:
        "UM/UIM, driver liability, and municipal crosswalk rules vary by state. Document injuries and witness contacts immediately.",
    },
  ],
  "/uninsured-driver-accident-help": () => [
    {
      question: "What if the at-fault driver has no insurance?",
      answer:
        "Your UM/UIM coverage and state funds may apply. An attorney can identify all policies on the table.",
    },
  ],
  "/what-to-do-after-a-car-accident": (brand) =>
    brand === "semitruckmatch"
      ? [
          {
            question: "What should I do after a semi-truck crash?",
            answer:
              "Seek medical care, avoid insurer recordings, preserve truck evidence (ELD, dash cam), and get matched with truck-case counsel.",
          },
        ]
      : [
          {
            question: "What should I do immediately after a car accident?",
            answer:
              "Safety first, call 911, document the scene, get medical care, notify your insurer without admitting fault, and consider free attorney matching.",
          },
        ],
  "/states": () => [
    {
      question: "Do you have guides for every state?",
      answer:
        "Yes — daily published state and city legal guides (EN + ES) designed for search and AI citation in all 50 states.",
    },
  ],
};

export function geoFaqsForPath(pathname: string, brand: SiteBrand): FaqItem[] | null {
  const path = pathname.split("?")[0]?.replace(/\/$/, "") || "/";
  const normalized = path === "" ? "/" : path;

  if (GEO_FAQ_SKIP_PREFIXES.some((p) => normalized === p || normalized.startsWith(`${p}/`))) {
    return null;
  }

  if (PATH_FAQS[normalized]) {
    return [...baseFaqs(brand).slice(0, 1), ...PATH_FAQS[normalized](brand)];
  }

  const stateMatch = normalized.match(/^\/what-to-do-after-a-car-accident-in\/([a-z0-9-]+)$/i);
  if (stateMatch) {
    const state = stateMatch[1].replace(/-/g, " ");
    return [
      ...baseFaqs(brand),
      {
        question: `What is the statute of limitations after a crash in ${state}?`,
        answer:
          "Deadlines vary by claim type and state law. An attorney licensed in that state can confirm filing dates for injury, property, and wrongful death claims.",
      },
      {
        question: `Should I get a lawyer after an accident in ${state}?`,
        answer:
          "If injuries, disputed fault, or insurer pressure exist, free matching helps you speak with counsel before deadlines or evidence loss.",
      },
    ];
  }

  return null;
}
