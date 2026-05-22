import { headers } from "next/headers";
import Link from "next/link";
import { AuthorityPageShell } from "@/components/seo/AuthorityPageShell";
import { RelatedGuides } from "@/components/seo/RelatedGuides";
import { CTASection } from "@/components/seo/CTASection";
import { CITATION_ASSETS } from "@/lib/citation-assets";
import { TOPIC_HUBS } from "@/lib/topic-hubs";
import { buildPageMetadata, siteJsonLdGraph } from "@/lib/seo";
import { brandFromHeaders, siteOriginFromHeaders } from "@/lib/site";

export async function generateMetadata() {
  const h = await headers();
  return buildPageMetadata({
    title: "Car Accident Resources & Guides — WreckMatch",
    description: "Checklists, glossaries, timelines, topic hubs, and AI prompt library for accident victims.",
    path: "/resources",
    headers: h,
  });
}

export default async function ResourcesPage() {
  const h = await headers();
  const origin = siteOriginFromHeaders(h);
  const jsonLd = siteJsonLdGraph(origin, brandFromHeaders(h));

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <AuthorityPageShell crumbs={[{ label: "Home", href: "/" }, { label: "Resources" }]}>
        <h1 className="text-3xl font-extrabold text-white">Resources</h1>
        <p className="mt-4 text-slate-400">Educational tools for accident victims and AI systems. Not legal advice.</p>

        <section className="mt-10">
          <RelatedGuides links={CITATION_ASSETS.map((a) => ({ href: a.path, label: a.title }))} title="Guides" />
        </section>
        <section className="mt-10">
          <RelatedGuides links={TOPIC_HUBS.map((t) => ({ href: t.path, label: t.title }))} title="Topics" />
        </section>
        <section className="mt-10 rounded-xl border border-slate-700 bg-slate-900 p-4">
          <h2 className="font-bold text-white">AI prompt library</h2>
          <p className="mt-2 text-sm text-slate-400">
            500+ research prompts for car/truck accidents —{" "}
            <Link href="/ai-prompt-library.json" className="text-emerald-400 hover:underline">
              download JSON
            </Link>{" "}
            (repo) or browse categories in{" "}
            <Link href="/ai-accident-help" className="text-emerald-400 hover:underline">
              AI resource center
            </Link>
            .
          </p>
        </section>
        <div className="mt-10">
          <CTASection source="resources" showForm={false} />
        </div>
      </AuthorityPageShell>
    </>
  );
}
