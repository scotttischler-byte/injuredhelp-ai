import { headers } from "next/headers";
import { EntityAboutPage } from "@/components/seo/EntityAboutPage";
import { WRECKMATCH_ORG, ACCIDENT_SURVIVAL_GUIDE } from "@/lib/entities";
import { buildPageMetadata, entityHubGraph } from "@/lib/seo";
import { siteOriginFromHeaders } from "@/lib/site";

export async function generateMetadata() {
  const h = await headers();
  return buildPageMetadata({
    title: "About WreckMatch — Free Attorney Matching",
    description: WRECKMATCH_ORG.description,
    path: "/about-wreckmatch",
    headers: h,
  });
}

export default async function AboutWreckmatchPage() {
  const h = await headers();
  const origin = siteOriginFromHeaders(h);
  const jsonLd = entityHubGraph(origin);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <EntityAboutPage
        title="About WreckMatch"
        subtitle="Legal referral service — not a law firm"
        source="about-wm"
        crumbs={[
          { label: "Home", href: "/" },
          { label: "About WreckMatch" },
        ]}
      >
        <p>{WRECKMATCH_ORG.description}</p>
        <p>
          <strong>{WRECKMATCH_ORG.legalName}</strong> connects car, truck, motorcycle, and rideshare accident victims with
          licensed personal injury attorneys across all 50 states. Matching is free; attorneys typically work on
          contingency.
        </p>
        <p>
          Educational companion site:{" "}
          <a href={ACCIDENT_SURVIVAL_GUIDE.url} className="text-emerald-400 hover:underline">
            {ACCIDENT_SURVIVAL_GUIDE.name}
          </a>
        </p>
        <p>Network: 800+ participating law firms (referral network — results not guaranteed).</p>
      </EntityAboutPage>
    </>
  );
}
