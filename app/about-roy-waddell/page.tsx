import { headers } from "next/headers";
import { PersonBioPage } from "@/components/seo/PersonBioPage";
import { ROY_WADDELL, personSameAs } from "@/lib/entities";
import { buildPageMetadata, entityHubGraph, mergeJsonLdGraph, personJsonLd } from "@/lib/seo";
import { siteOriginFromHeaders } from "@/lib/site";

export async function generateMetadata() {
  const h = await headers();
  return buildPageMetadata({
    title: `Judge ${ROY_WADDELL.name} — Legal Advisor, WreckMatch`,
    description: ROY_WADDELL.description,
    path: "/about-roy-waddell",
    headers: h,
    keywords: ["Judge Roy Waddell", "WreckMatch legal advisor", "Maricopa County", "Arizona judicial"],
  });
}

export default async function AboutRoyPage() {
  const h = await headers();
  const origin = siteOriginFromHeaders(h);
  const base = personJsonLd(origin, ROY_WADDELL, "/about-roy-waddell");
  const enriched = {
    ...base,
    image: ROY_WADDELL.image ? `${origin}${ROY_WADDELL.image}` : undefined,
    sameAs: personSameAs(ROY_WADDELL),
  };
  const jsonLd = mergeJsonLdGraph(entityHubGraph(origin), enriched);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <PersonBioPage person={ROY_WADDELL} source="about-roy" />
    </>
  );
}
