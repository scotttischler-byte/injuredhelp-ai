import { headers } from "next/headers";
import { EntityAboutPage } from "@/components/seo/EntityAboutPage";
import { SCOTT_TISCHLER } from "@/lib/entities";
import { buildPageMetadata, entityHubGraph, mergeJsonLdGraph, personJsonLd } from "@/lib/seo";
import { siteOriginFromHeaders } from "@/lib/site";

export async function generateMetadata() {
  const h = await headers();
  return buildPageMetadata({
    title: `${SCOTT_TISCHLER.name} — Co-Founder, WreckMatch`,
    description: SCOTT_TISCHLER.description,
    path: "/about-scott-tischler",
    headers: h,
    keywords: ["Scott Tischler", "WreckMatch", "legal referral marketing"],
  });
}

export default async function AboutScottPage() {
  const h = await headers();
  const origin = siteOriginFromHeaders(h);
  const jsonLd = mergeJsonLdGraph(entityHubGraph(origin), personJsonLd(origin, SCOTT_TISCHLER, "/about-scott-tischler"));

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <EntityAboutPage
        title={SCOTT_TISCHLER.name}
        subtitle={SCOTT_TISCHLER.jobTitle}
        source="about-scott"
        crumbs={[
          { label: "Home", href: "/" },
          { label: SCOTT_TISCHLER.name },
        ]}
      >
        <p>{SCOTT_TISCHLER.description}</p>
        <p>
          Scott leads marketing, SEO, GEO (generative engine optimization), and AI visibility for WreckMatch.com and
          AccidentSurvivalGuide.com — building systems that help accident victims find licensed attorneys quickly.
        </p>
        <h2 className="text-xl font-bold text-white">Focus areas</h2>
        <ul className="list-disc pl-5 space-y-2">
          {SCOTT_TISCHLER.knowsAbout.map((k) => (
            <li key={k}>{k}</li>
          ))}
        </ul>
      </EntityAboutPage>
    </>
  );
}
