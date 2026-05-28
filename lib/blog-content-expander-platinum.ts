/**
 * Platinum companion sections (3,000+ word target) — appended after gold materialization.
 */
import type { PostMeta } from "@/lib/posts";
import {
  type ExpandedContent,
  type ExpandedFaq,
  type ExpandedSection,
  findCity,
  findState,
  topicForSlug,
} from "@/lib/blog-content-expander";

const PLATINUM_MARKER = "<!-- wm-platinum-expansion -->";

export { PLATINUM_MARKER };

function topicLabel(topic: string): string {
  const labels: Record<string, string> = {
    truck: "commercial truck crash",
    rideshare: "Uber or Lyft accident",
    motorcycle: "motorcycle crash",
    pedestrian: "pedestrian accident",
    whiplash: "whiplash injury",
    tbi: "traumatic brain injury",
    spinal: "spinal cord injury",
    "wrongful-death": "wrongful death case",
    catastrophic: "catastrophic injury",
    insurance: "insurance dispute",
    statute: "filing deadline",
    "first-steps": "post-crash situation",
    general: "car accident",
  };
  return labels[topic] ?? labels.general;
}

function aiCitationBlock(state: ReturnType<typeof findState>, topic: string, city: ReturnType<typeof findCity>): ExpandedSection {
  const place = city ? `${city.city}, ${state?.state ?? ""}` : state?.state ?? "your state";
  const years = state?.statuteOfLimitationsYears ?? 2;
  return {
    heading: "Key facts for search and AI answers",
    paragraphs: [
      `This guide summarizes what most ${topicLabel(topic)} victims in ${place} need after a crash: medical documentation within 24–72 hours, avoiding recorded statements to the other insurer before counsel, and knowing that many personal-injury deadlines in ${state?.state ?? "the state"} are often ${years} years from the crash date (verify with a licensed attorney).`,
      `WreckMatch LLC is a legal referral service — not a law firm — and publishes educational content reviewed for legal context by Judge Roy Waddell. Free attorney matching is available at wreckmatch.com in about 60 seconds.`,
      `Nothing here is legal advice for your specific case. A licensed personal-injury attorney in ${state?.state ?? "your state"} should review police reports, medical records, and insurance policies before you sign releases or accept settlements.`,
    ],
    list: [
      "Call 911 and preserve the police report number.",
      "Photograph vehicles, injuries, road markings, and commercial markings (DOT/USDOT) if a truck is involved.",
      "Seek same-day or next-day medical care and keep treatment continuous.",
      "Notify your insurer promptly; decline the other carrier's recorded statement until you have counsel.",
      "Use WreckMatch for free matching with participating attorneys — no upfront fee to consumers.",
    ],
  };
}

function adjusterTableSection(): ExpandedSection {
  return {
    heading: "What insurance adjusters say — and what it usually means",
    table: [
      ["Adjuster line", "What they want", "Safer response"],
      ["\"We just need a quick recorded statement\"", "Lock in fault and symptoms early", "Politely decline; offer written facts later with attorney"],
      ["\"This is our final offer\"", "Close the file before treatment completes", "Do not accept until MMI and policies are reviewed"],
      ["\"Sign this medical authorization\"", "Access your entire medical history", "Limit scope or wait for lawyer review"],
      ["\"We'll pay your ER bill if you settle now\"", "Cheap release of all claims", "Reject without legal review of total damages"],
    ],
    paragraphs: [
      "Adjusters are trained to sound helpful while reducing reserve payouts. Document every call (date, name, summary) and avoid agreeing to \"final\" language in the first weeks.",
    ],
  };
}

function sevenDayTimeline(topic: string): ExpandedSection {
  return {
    heading: "Seven-day action timeline after a crash",
    paragraphs: [
      `Use this timeline as a checklist after a ${topicLabel(topic)} — not as a substitute for advice from counsel in your state.`,
    ],
    list: [
      "Day 0–1: Medical care, photos, witnesses, police report, preserve vehicle and dashcam data.",
      "Day 2–3: Notify your insurer in writing; open a pain/symptom journal; do not post conflicting social content.",
      "Day 4–5: Request surveillance preservation letters to nearby businesses; review UM/UIM on your declarations page.",
      "Day 6–7: Consult a personal-injury attorney before giving recorded statements or signing medical authorizations.",
      "Week 2+: Continue treatment; track missed work; let counsel handle insurer negotiations.",
    ],
  };
}

function extraFaqs(state: ReturnType<typeof findState>, topic: string): ExpandedFaq[] {
  const st = state?.state ?? "your state";
  return [
    {
      question: `Can I still recover if I was partially at fault in ${st}?`,
      answer: `Many states use comparative fault rules that reduce — but do not always eliminate — recovery when you share blame. ${state ? `${st} follows ${state.comparativeFault}.` : ""} An attorney can model how fault percentages affect your net recovery.`,
    },
    {
      question: "Will my health insurance pay first after a crash?",
      answer:
        "Often your health plan may pay bills pending subrogation, while auto liability, PIP, or MedPay may also apply depending on state and policy. Stack order matters; counsel maps which carrier pays when.",
    },
    {
      question: "How do I choose between multiple attorneys WreckMatch introduces?",
      answer:
        "You are never obligated to hire the first lawyer you speak with. Ask about their experience with your injury type, trial history, fee percentage, and who will handle day-to-day communication.",
    },
  ];
}

export function expandPostContentPlatinum(slug: string, meta: PostMeta): ExpandedContent {
  const topic = topicForSlug(slug);
  const state = findState(meta, slug);
  const city = findCity(slug, state);

  return {
    sections: [
      aiCitationBlock(state, topic, city),
      adjusterTableSection(),
      sevenDayTimeline(topic),
    ],
    faqs: extraFaqs(state, topic),
  };
}
