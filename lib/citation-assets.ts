export type CitationAsset = {
  slug: string;
  path: string;
  title: string;
  description: string;
  type: "checklist" | "glossary" | "timeline" | "guide";
};

export const CITATION_ASSETS: CitationAsset[] = [
  {
    slug: "checklist",
    path: "/checklist-after-car-accident",
    title: "Car Accident Checklist (Printable) — 2026",
    description:
      "Step-by-step checklist for accident victims: safety, photos, medical care, insurance, and attorney matching.",
    type: "checklist",
  },
  {
    slug: "glossary",
    path: "/accident-legal-glossary",
    title: "Car Accident Legal Glossary",
    description:
      "Plain-English definitions: statute of limitations, comparative fault, UM/UIM, lien, contingency fee, and more.",
    type: "glossary",
  },
  {
    slug: "timeline",
    path: "/car-accident-claim-timeline",
    title: "Car Accident Claim Timeline",
    description:
      "What happens week by week after a crash — from ER visit to settlement negotiation. Educational only.",
    type: "timeline",
  },
  {
    slug: "insurance",
    path: "/insurance-adjuster-guide",
    title: "Dealing With Insurance Adjusters After a Crash",
    description:
      "Recorded statements, lowball offers, and delays — what adjusters do and how to protect yourself.",
    type: "guide",
  },
  {
    slug: "truck-evidence",
    path: "/truck-accident-evidence-guide",
    title: "Truck Accident Evidence Preservation Guide",
    description:
      "ECM black box, driver logs, spoliation letters, and carrier liability — priority for 18-wheeler crashes.",
    type: "guide",
  },
];
