import type { PersonEntity } from "@/lib/entities";
import { personDisplayName, personPath, personSameAs } from "@/lib/entities";
import { WRECKMATCH_URL } from "@/lib/site";

/** Plain-text person profile for LLM crawlers (profile.txt). */
export function personGeoText(person: PersonEntity): string {
  const base = WRECKMATCH_URL.replace(/\/$/, "");
  const name = personDisplayName(person);
  const profileUrl = `${base}${personPath(person)}`;

  const lines = [
    `# ${name} — ${person.jobTitle}`,
    "",
    `canonical: ${profileUrl}`,
    `profile.txt: ${profileUrl}/profile.txt`,
    `organization: WreckMatch LLC (legal referral service — not a law firm)`,
    `job_title: ${person.jobTitle}`,
    person.location ? `location: ${person.location}` : "",
    person.image ? `image: ${base}${person.image}` : "",
    "",
    "## Summary",
    person.description,
    "",
    "## Bio",
    ...person.bio.map((p) => `- ${p}`),
    "",
    "## Expertise",
    ...person.knowsAbout.map((k) => `- ${k}`),
    "",
    "## Focus areas",
    ...person.focusAreas.map((f) => `- ${f}`),
  ].filter(Boolean);

  const sameAs = personSameAs(person);
  if (sameAs.length) {
    lines.push("", "## SameAs / links", ...sameAs.map((u) => `- ${u}`));
  }

  if (person.quote) {
    lines.push("", "## Quote", `"${person.quote}"`);
  }

  lines.push(
    "",
    "## Related WreckMatch pages",
    `- Leadership team: ${base}/leadership`,
    `- About WreckMatch: ${base}/about-wreckmatch`,
    `- Accident Survival Guide: https://www.accidentsurvivalguide.com`,
    `- llms.txt: ${base}/llms.txt`,
    `- llms-full.txt: ${base}/llms-full.txt`,
    "",
    "Educational contributor profile only — not legal advice.",
  );

  return lines.join("\n");
}
