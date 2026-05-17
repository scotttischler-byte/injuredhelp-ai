import type { FaqItem } from "@/lib/seo";

const DEFAULT_FAQS: FaqItem[] = [
  {
    question: "Is WreckMatch a law firm?",
    answer:
      "No. WreckMatch connects accident victims with experienced personal injury attorneys at no upfront cost. We are a legal referral service operated by WreckMatch LLC — not a law firm — and we do not provide legal advice.",
  },
  {
    question: "How fast will someone contact me?",
    answer:
      "After you call (978) 515-6063 or submit our form, we typically reach you within 60 seconds to start free matching.",
  },
];

const BY_SLUG: Record<string, FaqItem[]> = {
  "how-much-is-my-car-accident-case-worth-2026": [
    {
      question: "Can an online calculator tell me my exact case value?",
      answer:
        "No tool can guarantee a number. Attorneys evaluate medical records, liability, insurance limits, and permanency. WreckMatch can connect you with one for a free consultation.",
    },
    ...DEFAULT_FAQS,
  ],
  "statute-of-limitations-car-accidents-by-state": [
    {
      question: "Does the deadline vary by state?",
      answer:
        "Yes. Most states use a 2–3 year window for injury lawsuits, but exceptions exist. Use our state pages or speak with an attorney promptly.",
    },
    ...DEFAULT_FAQS,
  ],
};

export function blogFaqsForSlug(slug: string): FaqItem[] {
  return BY_SLUG[slug] ?? DEFAULT_FAQS;
}
