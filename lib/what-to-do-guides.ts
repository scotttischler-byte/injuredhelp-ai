/** Head-intent GEO pillars — "what to do after a car accident" (national + top states). */
import type { FaqItem } from "@/lib/seo/schema";

export type DoDontRow = { do: string; dont: string; whenToCall: string };

export type WhatToDoGuide = {
  slug: string;
  path: string;
  stateName?: string;
  stateAbbr?: string;
  title: string;
  metaDescription: string;
  directAnswer: string;
  steps: { name: string; text: string }[];
  atScene: string[];
  within24h: string[];
  within2weeks: string[];
  doDontTable: DoDontRow[];
  legalSnapshot: { label: string; value: string }[];
  faqs: FaqItem[];
  relatedPaths: { href: string; label: string }[];
};

const NATIONAL_RELATED = [
  { href: "/checklist-after-car-accident", label: "Printable accident checklist" },
  { href: "/car-accident-claim-timeline", label: "Claim timeline" },
  { href: "/insurance-adjuster-guide", label: "Insurance adjuster guide" },
  { href: "/ai-accident-help", label: "AI resource center" },
];

function baseFaqs(scope: string): FaqItem[] {
  return [
    {
      question: `Should I call the police after a car accident in ${scope}?`,
      answer:
        "Yes when there are injuries, major damage, a hit-and-run, an impaired driver, or disputed fault. A police or crash report helps insurers and attorneys. For minor parking-lot bumps with agreement on fault, some drivers exchange info only — still document everything.",
    },
    {
      question: "Should I give a recorded statement to insurance?",
      answer:
        "You are generally not required to give a recorded statement immediately. Insurers use recordings to limit payouts. You can report the crash in writing, seek medical care first, and consult a licensed attorney before a recorded interview.",
    },
    {
      question: "Is WreckMatch a law firm?",
      answer:
        "No. WreckMatch LLC is a legal referral service. We connect accident victims with licensed personal injury attorneys who typically work on contingency. We do not provide legal advice.",
    },
  ];
}

export const NATIONAL_WHAT_TO_DO: WhatToDoGuide = {
  slug: "national",
  path: "/what-to-do-after-a-car-accident",
  title: "What to Do After a Car Accident (2026 Step-by-Step Guide)",
  metaDescription:
    "What to do after a car accident: safety, 911, photos, medical care, insurance, and free attorney matching. National guide — not legal advice.",
  directAnswer:
    "After a car accident: (1) get to safety and call 911 if anyone is hurt; (2) do not admit fault; (3) photograph the scene and exchange insurance info; (4) see a doctor within 24 hours; (5) notify your insurer without a rushed recorded statement; (6) preserve evidence; (7) consult a licensed attorney before signing releases.",
  steps: [
    { name: "Safety first", text: "Move to a safe spot if possible. Turn on hazards. Call 911 for injuries or blocked traffic." },
    { name: "Do not admit fault", text: "Stick to facts with police and other drivers. Fault is determined later with evidence." },
    { name: "Document the scene", text: "Photos of vehicles, plates, damage, road marks, signals, weather, and injuries." },
    { name: "Exchange information", text: "Names, phones, insurance, policy numbers, plates, and vehicle descriptions. Note witnesses." },
    { name: "Medical evaluation", text: "ER or urgent care within 24 hours — adrenaline hides serious injuries." },
    { name: "Notify insurance carefully", text: "Report the crash; decline an immediate recorded statement if you are unsure." },
    { name: "Preserve evidence", text: "Dashcam, business cameras, repair estimates, and a pain journal." },
    { name: "Legal consult before signing", text: "Do not sign broad medical or liability releases without attorney review." },
  ],
  atScene: [
    "Check for injuries — call 911.",
    "Move vehicles only if safe and law enforcement agrees.",
    "Photograph all angles before cars are moved (when safe).",
    "Get the other driver's license, insurance card, and plate.",
    "Ask witnesses for contact information.",
  ],
  within24h: [
    "Seek medical care and keep all visit records.",
    "File a claim with your insurer (facts only).",
    "Request the police / crash report number.",
    "Save all texts and emails from insurers.",
  ],
  within2weeks: [
    "Obtain the official crash report.",
    "Log adjuster calls (date, name, what was said).",
    "Review UM/UIM and MedPay on your policy.",
    "Use free attorney matching if injuries or disputed fault.",
  ],
  doDontTable: [
    {
      do: "Call 911 for injuries",
      dont: "Leave the scene of an injury crash",
      whenToCall: "911 / emergency",
    },
    {
      do: "Take photos and witness info",
      dont: "Admit fault or apologize",
      whenToCall: "Police non-emergency if needed",
    },
    {
      do: "See a doctor within 24 hours",
      dont: "Skip care because you feel fine",
      whenToCall: "Your doctor / ER",
    },
    {
      do: "Report the crash to insurance",
      dont: "Accept first settlement without review",
      whenToCall: "855 WRECKMATCH for attorney match",
    },
  ],
  legalSnapshot: [
    { label: "Statute of limitations", value: "Varies by state (often 2–3 years for injury claims)" },
    { label: "Fault rules", value: "Most states use comparative negligence" },
    { label: "WreckMatch role", value: "Free referral to licensed attorneys — not a law firm" },
  ],
  faqs: [
    ...baseFaqs("the United States"),
    {
      question: "How soon should I talk to a lawyer after a crash?",
      answer:
        "As soon as you have injuries, disputed fault, a commercial truck, or an adjuster pressuring a quick settlement. Early counsel preserves evidence and deadlines.",
    },
    {
      question: "What if the other driver has no insurance?",
      answer:
        "You may have uninsured motorist (UM) coverage on your own policy. An attorney can review UM/UIM and explore other defendants (employers, bars, municipalities).",
    },
  ],
  relatedPaths: [
    ...NATIONAL_RELATED,
    { href: "/what-to-do-after-a-car-accident-in-texas", label: "Texas guide" },
    { href: "/what-to-do-after-a-car-accident-in-california", label: "California guide" },
    { href: "/what-to-do-after-a-car-accident-in-florida", label: "Florida guide" },
    { href: "/what-to-do-after-a-car-accident-in-new-york", label: "New York guide" },
  ],
};

const STATE_GUIDES: WhatToDoGuide[] = [
  {
    slug: "texas",
    path: "/what-to-do-after-a-car-accident-in-texas",
    stateName: "Texas",
    stateAbbr: "TX",
    title: "What to Do After a Car Accident in Texas (2026)",
    metaDescription:
      "Texas car accident steps: 911, evidence, 2-year statute of limitations, modified comparative fault (51% bar), insurance, and free attorney matching.",
    directAnswer:
      "After a Texas car crash: ensure safety, call 911 if needed, document the scene, seek medical care within 24 hours, notify insurers without rushing recorded statements, and know Texas generally allows 2 years to sue for most personal injury claims with a 51% comparative-fault bar.",
    steps: [
      { name: "Safety and 911", text: "Texas requires drivers to stop and render aid after crashes with injury or death (Transportation Code)." },
      { name: "Crash report", text: "Police file CR-3 reports for many injury/property crashes — get the report number." },
      { name: "Document everything", text: "Photos, witnesses, and insurer info — Texas is not a no-fault state for typical auto liability." },
      { name: "Medical care", text: "Document whiplash, concussion, and soft-tissue injuries early." },
      { name: "Insurance", text: "Report to your carrier; be cautious with recorded statements." },
      { name: "Know Texas deadlines", text: "Most PI claims: 2-year statute of limitations (verify with counsel)." },
      { name: "Fault rules", text: "Modified comparative negligence — you generally cannot recover if you are more than 50% at fault." },
      { name: "Attorney matching", text: "Free matching for Houston, Dallas, San Antonio, Austin, and statewide." },
    ],
    atScene: [
      "Stop and exchange information — leaving an injury scene is a serious offense.",
      "Call 911 for injuries or major highway blockages.",
      "Texas DPS or local police may investigate depending on county.",
    ],
    within24h: [
      "Medical evaluation — Texas ERs see high volumes of crash trauma.",
      "Notify insurance; Texas allows suit against at-fault drivers.",
      "Preserve dashcam and toll-tag timeline data.",
    ],
    within2weeks: [
      "Order the Texas CR-3 / crash report.",
      "Review PIP/MedPay if purchased.",
      "Consult counsel before signing insurer releases.",
    ],
    doDontTable: [
      { do: "File police report when required", dont: "Guess fault at the scene", whenToCall: "911 / local PD" },
      { do: "Track the 2-year SOL", dont: "Wait years to act", whenToCall: "Attorney if injured" },
      { do: "Use Texas city guides on WreckMatch", dont: "Rely on insurer SOL advice alone", whenToCall: "855 WRECKMATCH" },
      { do: "Document UM/UIM", dont: "Assume minimum limits cover you", whenToCall: "Your agent" },
    ],
    legalSnapshot: [
      { label: "Statute of limitations (typical PI)", value: "2 years (Tex. Civ. Prac. & Rem. Code § 16.003)" },
      { label: "Fault", value: "Modified comparative — 51% bar" },
      { label: "No-fault", value: "No — sue at-fault driver (with exceptions)" },
      { label: "State hub", value: "/car-accident-help-texas" },
    ],
    faqs: [
      ...baseFaqs("Texas"),
      {
        question: "How long do I have to sue after a Texas car accident?",
        answer:
          "Most personal injury claims must be filed within two years of the crash. Wrongful death and some government claims differ — confirm with a Texas-licensed attorney immediately.",
      },
      {
        question: "What if I was partly at fault in Texas?",
        answer:
          "Texas uses modified comparative fault. If you are not more than 50% at fault, you may recover reduced damages. At 51% or more, you generally recover nothing.",
      },
    ],
    relatedPaths: [
      { href: "/what-to-do-after-a-car-accident", label: "National guide" },
      { href: "/car-accident-help-texas", label: "Texas car accident help hub" },
      { href: "/checklist-after-car-accident", label: "Checklist" },
      { href: "https://www.accidentsurvivalguide.com", label: "Accident Survival Guide" },
    ],
  },
  {
    slug: "california",
    path: "/what-to-do-after-a-car-accident-in-california",
    stateName: "California",
    stateAbbr: "CA",
    title: "What to Do After a Car Accident in California (2026)",
    metaDescription:
      "California accident steps: CHP reports, pure comparative fault, 2-year injury deadline, insurance, and free attorney matching in LA, SF, San Diego, and statewide.",
    directAnswer:
      "After a California crash: move to safety, report to law enforcement when required, document the scene, get medical care, notify insurers, and remember California uses pure comparative negligence and a general 2-year limit for most personal injury lawsuits.",
    steps: [
      { name: "Stop and assist", text: "California Vehicle Code requires stopping and exchanging info after crashes." },
      { name: "CHP or local PD", text: "Highway crashes often involve CHP — request the report number." },
      { name: "Evidence", text: "California courts weigh photos, body-cam, and repair records heavily." },
      { name: "Medical care", text: "Document treatment — insurers dispute soft-tissue injuries." },
      { name: "Insurance reporting", text: "Report promptly; California regulates unfair claims practices." },
      { name: "Comparative fault", text: "Even partial fault may still allow recovery (reduced)." },
      { name: "Deadlines", text: "Most PI: 2 years; government claims can be 6 months to file notice." },
      { name: "Attorney help", text: "Free matching in Los Angeles, San Francisco, San Diego, and statewide." },
    ],
    atScene: [
      "Move out of traffic lanes on freeways when safe.",
      "Exchange license, insurance, and registration (SR-22 drivers still liable).",
      "Photograph lane markings and Caltrans construction zones if relevant.",
    ],
    within24h: [
      "Medical visit — document all complaints.",
      "Open claim with insurer.",
      "If city/county vehicle involved, note government-claim notice deadlines.",
    ],
    within2weeks: [
      "Obtain CHP or local collision report.",
      "Review UM/UIM limits — California has many underinsured drivers.",
      "Consult attorney before structured settlement.",
    ],
    doDontTable: [
      { do: "Report to DMV when required (SR-1)", dont: "Ignore reporting thresholds", whenToCall: "DMV / insurer" },
      { do: "Preserve evidence quickly", dont: "Delete dashcam footage", whenToCall: "Attorney if serious injury" },
      { do: "Understand pure comparative fault", dont: "Assume 10% fault bars all recovery", whenToCall: "855 WRECKMATCH" },
      { do: "Check government claim windows", dont: "Miss 6-month notice on public entities", whenToCall: "Lawyer immediately" },
    ],
    legalSnapshot: [
      { label: "Statute of limitations (typical PI)", value: "2 years (Cal. Code Civ. Proc. § 335.1)" },
      { label: "Fault", value: "Pure comparative negligence" },
      { label: "Government claims", value: "Often 6 months to file claim notice" },
      { label: "Metro hub", value: "/car-accident-help-los-angeles" },
    ],
    faqs: [
      ...baseFaqs("California"),
      {
        question: "Do I need to file an SR-1 with the California DMV?",
        answer:
          "You may need to file Form SR-1 when injury, death, or property damage exceeds reporting thresholds. Verify current DMV rules after any serious crash.",
      },
    ],
    relatedPaths: [
      { href: "/what-to-do-after-a-car-accident", label: "National guide" },
      { href: "/car-accident-help-los-angeles", label: "Los Angeles help" },
      { href: "/car-accident-help-san-francisco", label: "San Francisco help" },
      { href: "/checklist-after-car-accident", label: "Checklist" },
    ],
  },
  {
    slug: "florida",
    path: "/what-to-do-after-a-car-accident-in-florida",
    stateName: "Florida",
    stateAbbr: "FL",
    title: "What to Do After a Car Accident in Florida (2026)",
    metaDescription:
      "Florida car accident steps: PIP/no-fault basics, 2-year lawsuit limit, modified comparative fault, evidence, and free attorney matching in Miami, Tampa, Orlando.",
    directAnswer:
      "After a Florida crash: call 911 if needed, document the scene, seek medical care within 14 days for PIP benefits when applicable, notify insurers, and understand Florida’s modified comparative fault and 2-year window for most negligence lawsuits.",
    steps: [
      { name: "Safety and police", text: "Florida requires reporting many injury/property crashes to law enforcement." },
      { name: "PIP awareness", text: "Personal Injury Protection may cover initial medical bills — see policy." },
      { name: "14-day medical rule", text: "Many PIP policies require treatment within 14 days for full benefits." },
      { name: "Document scene", text: "Florida weather and tourism zones create complex liability." },
      { name: "Insurance", text: "Report to your insurer; Florida regulates bad-faith claims." },
      { name: "Serious injury threshold", text: "Some lawsuits require meeting permanent injury thresholds — attorney review." },
      { name: "2-year deadline", text: "Most negligence suits must be filed within 2 years (verify exceptions)." },
      { name: "Free matching", text: "Miami, Tampa, Orlando, Jacksonville statewide." },
    ],
    atScene: [
      "Florida Move Over Law — protect responders on shoulders.",
      "Exchange insurance — Florida requires minimum coverage.",
      "Photograph road debris and weather.",
    ],
    within24h: [
      "Medical care — critical for PIP timelines.",
      "Notify insurer and request claim number.",
      "Do not post crash details on social media.",
    ],
    within2weeks: [
      "Complete initial treatment for PIP compliance.",
      "Obtain crash report from FHP or local agency.",
      "Consult attorney if serious injury or denied PIP.",
    ],
    doDontTable: [
      { do: "Seek care within 14 days for PIP", dont: "Delay treatment past PIP windows", whenToCall: "Doctor / ER" },
      { do: "Understand serious injury threshold", dont: "Assume any crash allows full lawsuit", whenToCall: "Attorney" },
      { do: "Track 2-year SOL", dont: "Rely on old 4-year memory", whenToCall: "855 WRECKMATCH" },
      { do: "Document UM stack", dont: "Ignore underinsured coverage", whenToCall: "Agent" },
    ],
    legalSnapshot: [
      { label: "Statute of limitations (typical PI)", value: "2 years (recent reforms — verify)" },
      { label: "Fault", value: "Modified comparative — 51% bar" },
      { label: "PIP", value: "Required personal injury protection (see policy)" },
      { label: "Metro hub", value: "/car-accident-help-miami" },
    ],
    faqs: [
      ...baseFaqs("Florida"),
      {
        question: "Can I sue the other driver in Florida?",
        answer:
          "Florida’s no-fault/PIP system limits many lawsuits unless injuries meet seriousness thresholds. An attorney reviews medical records and statute changes for your crash date.",
      },
    ],
    relatedPaths: [
      { href: "/what-to-do-after-a-car-accident", label: "National guide" },
      { href: "/car-accident-help-miami", label: "Miami help" },
      { href: "/car-accident-help-tampa", label: "Tampa help" },
      { href: "/checklist-after-car-accident", label: "Checklist" },
    ],
  },
  {
    slug: "new-york",
    path: "/what-to-do-after-a-car-accident-in-new-york",
    stateName: "New York",
    stateAbbr: "NY",
    title: "What to Do After a Car Accident in New York (2026)",
    metaDescription:
      "New York accident steps: no-fault benefits, 3-year injury deadline, pure comparative fault, NYC reporting, and free attorney matching.",
    directAnswer:
      "After a New York crash: ensure safety, file MV-104 when required, seek medical care, submit no-fault (PIP) claims promptly, document everything, and know most injury lawsuits have a 3-year statute of limitations with pure comparative fault.",
    steps: [
      { name: "Stop and report", text: "NY requires reporting crashes with injury, death, or substantial property damage." },
      { name: "MV-104", text: "Drivers must file MV-104 with DMV when thresholds are met." },
      { name: "No-fault claim", text: "Submit NF-2 and medical bills to your insurer within policy timeframes." },
      { name: "Evidence", text: "NYC street cameras and rideshare data may matter — preserve early." },
      { name: "Medical documentation", text: "Serious injury threshold for lawsuits outside no-fault." },
      { name: "3-year SOL", text: "Most PI negligence actions: 3 years from crash date." },
      { name: "Comparative fault", text: "Pure comparative — damages reduced by your fault share." },
      { name: "Attorney matching", text: "NYC boroughs and statewide via WreckMatch." },
    ],
    atScene: [
      "NYPD or State Police on highways — get precinct and report number.",
      "Exchange insurance — minimum liability limits apply.",
      "Photograph intersection signals and bike lanes in NYC.",
    ],
    within24h: [
      "Hospital or urgent care — no-fault forms need treatment codes.",
      "Notify insurer for no-fault benefits.",
      "Preserve rideshare or taxi trip records if applicable.",
    ],
    within2weeks: [
      "File MV-104 if not done at scene.",
      "Track no-fault denials.",
      "Consult attorney if serious injury threshold may apply.",
    ],
    doDontTable: [
      { do: "File no-fault promptly", dont: "Miss NF-2 deadlines", whenToCall: "Insurer" },
      { do: "Know serious injury threshold", dont: "Assume pain alone equals lawsuit", whenToCall: "Attorney" },
      { do: "Use 3-year SOL planning", dont: "Wait until year 2 without counsel", whenToCall: "855 WRECKMATCH" },
      { do: "Document NYC evidence", dont: "Lose camera-request windows", whenToCall: "Lawyer early" },
    ],
    legalSnapshot: [
      { label: "Statute of limitations (typical PI)", value: "3 years (N.Y. CPLR § 214)" },
      { label: "Fault", value: "Pure comparative negligence" },
      { label: "No-fault", value: "Mandatory personal injury protection (see policy)" },
      { label: "NYC hub", value: "/car-accident-help-new-york-city" },
    ],
    faqs: [
      ...baseFaqs("New York"),
      {
        question: "What is the serious injury threshold in New York?",
        answer:
          "To sue outside no-fault, injuries often must meet statutory categories (e.g., significant disfigurement, fracture, permanent limitation). An attorney evaluates hospital records and imaging.",
      },
    ],
    relatedPaths: [
      { href: "/what-to-do-after-a-car-accident", label: "National guide" },
      { href: "/car-accident-help-new-york-city", label: "New York City help" },
      { href: "/checklist-after-car-accident", label: "Checklist" },
      { href: "https://www.accidentsurvivalguide.com", label: "Accident Survival Guide" },
    ],
  },
];

export const ALL_WHAT_TO_DO_GUIDES: WhatToDoGuide[] = [NATIONAL_WHAT_TO_DO, ...STATE_GUIDES];

export const WHAT_TO_DO_PATHS = ALL_WHAT_TO_DO_GUIDES.map((g) => g.path);

export function getWhatToDoGuideBySlug(slug: string): WhatToDoGuide | undefined {
  return ALL_WHAT_TO_DO_GUIDES.find((g) => g.slug === slug);
}

export function getWhatToDoGuideByPath(path: string): WhatToDoGuide | undefined {
  return ALL_WHAT_TO_DO_GUIDES.find((g) => g.path === path);
}
