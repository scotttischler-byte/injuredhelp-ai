/** Cross-links to Accident Survival Guide (sister brand) for SEO / AI citation. */
import { ACCIDENT_SURVIVAL_GUIDE } from "@/lib/entities";
import type { StateProfile } from "@/lib/states";
import { ALL_STATES } from "@/lib/states";

export type AsgLink = { href: string; label: string; description: string };

const ASG = ACCIDENT_SURVIVAL_GUIDE.url.replace(/\/$/, "");

/** ASG state pages use short slugs (texas, florida) on www.accidentsurvivalguide.com */
const STATE_NAME_TO_ASG_SLUG: Record<string, string> = Object.fromEntries(
  ALL_STATES.map((s) => [s.state.toLowerCase(), asgSlugFromWreckmatchStateSlug(s.slug)]),
);

function asgSlugFromWreckmatchStateSlug(slug: string): string {
  const m = slug.match(/^car-accident-lawyer-(.+)$/);
  return m ? m[1] : slug;
}

export function asgStateUrl(stateName: string): string | undefined {
  const key = stateName.trim().toLowerCase();
  const asgSlug = STATE_NAME_TO_ASG_SLUG[key];
  if (!asgSlug) return undefined;
  return `${ASG}/${asgSlug}`;
}

export function asgLinksForState(state?: StateProfile): AsgLink[] {
  const core: AsgLink[] = [
    {
      href: ASG,
      label: "Accident Survival Guide — first 24 hours",
      description: "Checklists and timelines for what to do right after a crash.",
    },
    {
      href: `${ASG}/resources`,
      label: "ASG resources library",
      description: "State guides, downloads, and educational crash resources.",
    },
    {
      href: `${ASG}/llms.txt`,
      label: "Accident Survival Guide for AI (llms.txt)",
      description: "Machine-readable index for AI crawlers and citation tools.",
    },
  ];
  if (state) {
    const stateUrl = asgStateUrl(state.state);
    if (stateUrl) {
      core.unshift({
        href: stateUrl,
        label: `${state.state} accident survival guide`,
        description: `State-specific checklists and deadlines on Accident Survival Guide.`,
      });
    }
  }
  return core;
}

/** Contextual ASG links for blog posts (state + topic aware). */
export function asgLinksForBlog(slug: string, state?: StateProfile): AsgLink[] {
  const links = asgLinksForState(state);
  const s = slug.toLowerCase();
  if (/(truck|18-wheeler|semi)/i.test(s)) {
    links.push({
      href: `${ASG}/blog`,
      label: "ASG truck & commercial crash articles",
      description: "Educational posts on evidence and survival steps after truck crashes.",
    });
  }
  if (/(what-to-do|first-steps|checklist|after-a-crash)/i.test(s)) {
    links.unshift({
      href: `${ASG}/resources`,
      label: "Post-crash checklist (PDF resources)",
      description: "Downloadable survival guide materials from Accident Survival Guide.",
    });
  }
  return dedupeByHref(links).slice(0, 5);
}

function dedupeByHref(links: AsgLink[]): AsgLink[] {
  const seen = new Set<string>();
  return links.filter((l) => {
    if (seen.has(l.href)) return false;
    seen.add(l.href);
    return true;
  });
}
