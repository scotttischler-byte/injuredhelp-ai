import type { FaqItem } from "@/lib/seo/schema";
import { WRECKMATCH_PHONE_DISPLAY } from "@/lib/phones";
import { OPERATOR_LEGAL_NAME } from "@/lib/compliance";

const base: FaqItem[] = [
  {
    question: "Is WreckMatch a law firm?",
    answer: `No. ${OPERATOR_LEGAL_NAME} operates WreckMatch as a legal referral service. We do not provide legal advice.`,
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

export function faqsForTopic(slug: string): FaqItem[] {
  const specific: Record<string, FaqItem[]> = {
    truck: [
      {
        question: "Why are truck accident cases different?",
        answer:
          "Commercial carriers often have higher policy limits, FMCSA regulations, and multiple defendants. Black box (ECM) data must be preserved quickly.",
      },
      {
        question: "What evidence matters most in a semi crash?",
        answer:
          "ECM downloads, driver logs, maintenance records, cargo loading docs, and police reconstruction reports.",
      },
    ],
    car: [
      {
        question: "What should I do right after a car accident?",
        answer:
          "Call 911 if injured, document the scene, exchange insurance, seek medical care within 24 hours, and avoid recorded statements before understanding your rights.",
      },
    ],
    rideshare: [
      {
        question: "Does Uber or Lyft insurance cover my crash?",
        answer:
          "Coverage depends on the driver's app period (offline, waiting, or on-trip). Document app status and trip ID immediately.",
      },
    ],
    motorcycle: [
      {
        question: "Are motorcycle claims harder?",
        answer:
          "Insurers often bias against riders. Prompt medical care, gear photos, and counsel familiar with motorcycle law help.",
      },
    ],
  };
  return [...(specific[slug] ?? []), ...base];
}
