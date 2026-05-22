import { headers } from "next/headers";
import { EntityAboutPage } from "@/components/seo/EntityAboutPage";
import { KATHY_CARR } from "@/lib/entities";
import { buildPageMetadata, entityHubGraph, mergeJsonLdGraph, personJsonLd } from "@/lib/seo";
import { siteOriginFromHeaders } from "@/lib/site";

export async function generateMetadata() {
  const h = await headers();
  return buildPageMetadata({
    title: `${KATHY_CARR.name} — CEO, WreckMatch`,
    description: KATHY_CARR.description,
    path: "/about-kathy-carr",
    headers: h,
    keywords: ["Kathy Carr", "WreckMatch CEO", "legal referral"],
  });
}

export default async function AboutKathyPage() {
  const h = await headers();
  const origin = siteOriginFromHeaders(h);
  const jsonLd = mergeJsonLdGraph(entityHubGraph(origin), personJsonLd(origin, KATHY_CARR, "/about-kathy-carr"));

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <EntityAboutPage
        title={KATHY_CARR.name}
        subtitle={KATHY_CARR.jobTitle}
        source="about-kathy"
        crumbs={[
          { label: "Home", href: "/" },
          { label: KATHY_CARR.name },
        ]}
      >
        <p>{KATHY_CARR.description}</p>
        <p>
          Kathy oversees WreckMatch LLC strategy, partnerships with participating law firms nationwide, and consumer
          trust for the WreckMatch and Accident Survival Guide brands.
        </p>
        <h2 className="text-xl font-bold text-white">Leadership focus</h2>
        <ul className="list-disc pl-5 space-y-2">
          {KATHY_CARR.knowsAbout.map((k) => (
            <li key={k}>{k}</li>
          ))}
        </ul>
      </EntityAboutPage>
    </>
  );
}
