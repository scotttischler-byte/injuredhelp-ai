/**
 * GEO (Generative Engine Optimization) score — same weights as public/secret-sauce.html.
 * Use in audits, CI, or Cursor agents validating a page before publish.
 */
export type GeoAuditInput = {
  /** robots.txt explicitly allows GPTBot, ClaudeBot, PerplexityBot, etc. */
  robotsAllowsAiCrawlers?: boolean;
  llmsTxt?: boolean;
  aiTxt?: boolean;
  indexNowKeyDeployed?: boolean;
  articleJsonLd?: boolean;
  faqPageJsonLd?: boolean;
  organizationJsonLd?: boolean;
  /** Semantic <article> with h1 + date */
  semanticArticleDom?: boolean;
  /** FAQ block uses <details> or explicit Q/A headings */
  faqDetailsOrHeadings?: boolean;
  /** At least one data table in body */
  hasComparisonTable?: boolean;
  wordCount?: number;
  authorByline?: boolean;
  /** ISO date within last 120 days */
  contentDateRecent?: boolean;
  /** Explicit last-updated in copy or schema */
  showsLastUpdated?: boolean;
  /** Internal links to pillar / state hub */
  hubInternalLinks?: boolean;
};

export type GeoScoreResult = {
  score: number;
  grade: "A" | "B" | "C" | "D" | "F";
  breakdown: { label: string; points: number; max: number }[];
  gaps: string[];
};

const WEIGHTS: { key: keyof GeoAuditInput; label: string; max: number; test: (v: GeoAuditInput) => boolean }[] = [
  { key: "robotsAllowsAiCrawlers", label: "AI crawlers allowed in robots.txt", max: 12, test: (i) => !!i.robotsAllowsAiCrawlers },
  { key: "llmsTxt", label: "llms.txt present", max: 8, test: (i) => !!i.llmsTxt },
  { key: "aiTxt", label: "ai.txt policy file", max: 5, test: (i) => !!i.aiTxt },
  { key: "indexNowKeyDeployed", label: "IndexNow key on host", max: 10, test: (i) => !!i.indexNowKeyDeployed },
  { key: "articleJsonLd", label: "Article JSON-LD", max: 12, test: (i) => !!i.articleJsonLd },
  { key: "faqPageJsonLd", label: "FAQPage JSON-LD", max: 10, test: (i) => !!i.faqPageJsonLd },
  { key: "organizationJsonLd", label: "Organization JSON-LD", max: 6, test: (i) => !!i.organizationJsonLd },
  { key: "semanticArticleDom", label: "Semantic article DOM", max: 10, test: (i) => !!i.semanticArticleDom },
  { key: "faqDetailsOrHeadings", label: "FAQ block (details or H3 Q/A)", max: 8, test: (i) => !!i.faqDetailsOrHeadings },
  { key: "hasComparisonTable", label: "Comparison / data table", max: 7, test: (i) => !!i.hasComparisonTable },
  { key: "authorByline", label: "Named author + credentials", max: 6, test: (i) => !!i.authorByline },
  { key: "contentDateRecent", label: "Published/updated within 120 days", max: 6, test: (i) => !!i.contentDateRecent },
  { key: "showsLastUpdated", label: "Visible last-updated signal", max: 4, test: (i) => !!i.showsLastUpdated },
  { key: "hubInternalLinks", label: "Hub + pillar internal links", max: 6, test: (i) => !!i.hubInternalLinks },
];

function wordCountPoints(count: number): number {
  if (count >= 3000) return 10;
  if (count >= 2000) return 8;
  if (count >= 1200) return 5;
  if (count >= 800) return 3;
  return 0;
}

export function calculateGeoScore(input: GeoAuditInput): GeoScoreResult {
  const breakdown: GeoScoreResult["breakdown"] = [];
  const gaps: string[] = [];
  let score = 0;

  for (const w of WEIGHTS) {
    const ok = w.test(input);
    const points = ok ? w.max : 0;
    score += points;
    breakdown.push({ label: w.label, points, max: w.max });
    if (!ok) gaps.push(w.label);
  }

  const wcMax = 10;
  const wcPts = wordCountPoints(input.wordCount ?? 0);
  score += wcPts;
  breakdown.push({ label: "Word count depth", points: wcPts, max: wcMax });
  if (wcPts < 5) gaps.push(`Increase word count (current ~${input.wordCount ?? 0}, target 2000+)`);

  const maxTotal = WEIGHTS.reduce((s, w) => s + w.max, 0) + wcMax;
  const pct = Math.round((score / maxTotal) * 100);
  const grade: GeoScoreResult["grade"] =
    pct >= 90 ? "A" : pct >= 78 ? "B" : pct >= 65 ? "C" : pct >= 50 ? "D" : "F";

  return { score: pct, grade, breakdown, gaps };
}
