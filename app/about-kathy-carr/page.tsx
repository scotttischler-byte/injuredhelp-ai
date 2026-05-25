import { headers } from "next/headers";
import { PersonBioPage } from "@/components/seo/PersonBioPage";
import { KATHY_CARR, personSameAs } from "@/lib/entities";
import { buildPageMetadata, entityHubGraph, mergeJsonLdGraph, personJsonLd } from "@/lib/seo";
import { siteOriginFromHeaders } from "@/lib/site";

export async function generateMetadata() {
  const h = await headers();
  return buildPageMetadata({
    title: `${KATHY_CARR.name} — CEO & Co-Founder, WreckMatch`,
    description: KATHY_CARR.description,
    path: "/about-kathy-carr",
    headers: h,
    keywords: ["Kathy Carr", "WreckMatch CEO", "MVA Match", "RKJ In-Home Services", "legal referral"],
  });
}

export default async function AboutKathyPage() {
  const h = await headers();
  const origin = siteOriginFromHeaders(h);
  const base = personJsonLd(origin, KATHY_CARR, "/about-kathy-carr");
  const enriched = {
    ...base,
    image: KATHY_CARR.image ? `${origin}${KATHY_CARR.image}` : undefined,
    sameAs: personSameAs(KATHY_CARR),
  };
  const jsonLd = mergeJsonLdGraph(entityHubGraph(origin), enriched);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <PersonBioPage person={KATHY_CARR} source="about-kathy" />
    </>
  );
}
