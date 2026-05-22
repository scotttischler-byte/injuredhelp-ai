import Link from "next/link";
import { AuthorityPageShell } from "@/components/seo/AuthorityPageShell";
import { CTASection } from "@/components/seo/CTASection";
import { FAQAccordion } from "@/components/seo/FAQAccordion";
import { RelatedGuides } from "@/components/seo/RelatedGuides";
import { ReferralDisclaimer } from "@/components/ReferralDisclaimer";
import type { FaqItem } from "@/lib/seo/schema";
import type { TopicHub } from "@/lib/topic-hubs";
import { CITATION_ASSETS } from "@/lib/citation-assets";
import { priorityCitiesByState, stateHubPath, cityHubPath } from "@/lib/topic-hubs";
import { PRIORITY_STATE_NAMES } from "@/lib/priority-places/types";
import { ACCIDENT_VARIANT_CITIES } from "@/lib/priority-places/registry";

type Props = {
  hub: TopicHub;
  faqs: FaqItem[];
  extraLinks?: { href: string; label: string }[];
};

export function TopicHubPage({ hub, faqs, extraLinks = [] }: Props) {
  const isTruck = hub.slug === "truck";

  const stateLinks = PRIORITY_STATE_NAMES.map((s) => ({
    href: stateHubPath(s),
    label: `${s} car accident help`,
  }));

  const cityLinks = isTruck
    ? ACCIDENT_VARIANT_CITIES.map((c) => ({
        href: `/car-accident-help-${c.placeSlug}/truck`,
        label: `${c.city} truck accident guide`,
      }))
    : priorityCitiesByState("Texas").slice(0, 10).map((p) => ({
        href: cityHubPath(p.placeSlug),
        label: `${p.city}, ${p.state}`,
      }));

  const citationLinks = CITATION_ASSETS.map((a) => ({ href: a.path, label: a.title }));

  return (
    <AuthorityPageShell
      crumbs={[
        { label: "Home", href: "/" },
        { label: hub.title.split("—")[0]?.trim() ?? hub.title },
      ]}
    >
      <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">{hub.title}</h1>
      <p className="mt-4 text-lg leading-relaxed text-slate-400">{hub.description}</p>
      <p className="mt-2 text-xs text-slate-500">Last updated: May 2026 · Educational only — not legal advice</p>
      <ReferralDisclaimer variant="primary" className="mt-6 border-slate-700 bg-slate-900/60 text-slate-400" />

      <section className="mt-10">
        <h2 className="text-xl font-bold text-white">Priority states</h2>
        <RelatedGuides links={stateLinks} title="" />
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-bold text-white">{isTruck ? "Truck accident city guides" : "Featured cities"}</h2>
        <RelatedGuides links={cityLinks} title="" />
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-bold text-white">Citation-ready resources</h2>
        <RelatedGuides links={[...citationLinks, ...extraLinks]} title="" />
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-bold text-white">FAQ</h2>
        <FAQAccordion faqs={faqs} className="mt-4" />
      </section>

      <div className="mt-10">
        <CTASection source={`topic-${hub.slug}`} />
      </div>

      <p className="mt-8 text-center text-sm text-slate-500">
        <Link href="/ai-accident-help" className="text-emerald-400 hover:underline">
          AI accident help resource center →
        </Link>
      </p>
    </AuthorityPageShell>
  );
}
