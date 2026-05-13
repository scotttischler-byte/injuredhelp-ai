export type Webinar = {
  slug: string;
  title: string;
  description: string;
  schedule: string;
  isPast?: boolean;
  recordingUrl?: string;
};

export const WEBINARS: Webinar[] = [
  {
    slug: "what-to-do-first-72-hours",
    title: "What to Do in the First 72 Hours After a Crash",
    description: "A practical walkthrough of medical care, documentation, insurance calls, and when to talk to an attorney.",
    schedule: "Every Tuesday at 7:00pm CT",
  },
  {
    slug: "insurance-adjuster-scripts",
    title: "Insurance Adjuster Scripts: Protect Your Settlement",
    description: "Word-for-word patterns adjusters use — and how to respond without hurting your case.",
    schedule: "Every Tuesday at 7:00pm CT",
  },
  {
    slug: "pain-and-suffering-explained",
    title: "Pain and Suffering: How It’s Calculated (Realistically)",
    description: "Multiplier vs per diem, documentation, and what attorneys look for.",
    schedule: "Every Tuesday at 7:00pm CT",
  },
  {
    slug: "missed-work-and-lost-wages",
    title: "Missed Work & Lost Wages: Proving Income Loss",
    description: "Pay stubs, gig work, self-employment, and building a defensible wage claim.",
    schedule: "Every Tuesday at 7:00pm CT",
  },
  {
    slug: "whiplash-and-soft-tissue",
    title: "Whiplash & Soft Tissue Injuries: Evidence That Holds Up",
    description: "Why imaging isn’t everything — and what documentation still moves cases forward.",
    schedule: "Every Tuesday at 7:00pm CT",
  },
  {
    slug: "fault-disputes-and-state-laws",
    title: "Fault Disputes: Comparative Fault in Plain English",
    description: "How fault rules can change outcomes by state — and what to do if you’re blamed.",
    schedule: "Every Tuesday at 7:00pm CT",
  },
  {
    slug: "statute-of-limitations-warnings",
    title: "Deadlines That Can End Your Case (Statute of Limitations)",
    description: "A survivor-focused checklist to avoid missing the window to pursue compensation.",
    schedule: "Every Tuesday at 7:00pm CT",
  },
  {
    slug: "when-to-hire-a-lawyer",
    title: "When You Should Hire a Lawyer — and When You Might Not Need To",
    description: "Honest criteria, red flags, and how free consultations actually work.",
    schedule: "Every Tuesday at 7:00pm CT",
  },
];

export function getWebinarBySlug(slug: string): Webinar | undefined {
  return WEBINARS.find((w) => w.slug === slug);
}
