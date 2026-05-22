import { headers } from "next/headers";
import { EntityAboutPage } from "@/components/seo/EntityAboutPage";
import { ACCIDENT_SURVIVAL_GUIDE, WRECKMATCH_ORG } from "@/lib/entities";
import { buildPageMetadata, entityHubGraph } from "@/lib/seo";
import { siteOriginFromHeaders } from "@/lib/site";

export async function generateMetadata() {
  const h = await headers();
  return buildPageMetadata({
    title: "About Accident Survival Guide",
    description: ACCIDENT_SURVIVAL_GUIDE.description,
    path: "/about-accident-survival-guide",
    headers: h,
  });
}

export default async function AboutASGPage() {
  const h = await headers();
  const origin = siteOriginFromHeaders(h);
  const jsonLd = entityHubGraph(origin);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <EntityAboutPage
        title="About Accident Survival Guide"
        subtitle="Educational authority for accident victims"
        source="about-asg"
        crumbs={[
          { label: "Home", href: "/" },
          { label: "Accident Survival Guide" },
        ]}
      >
        <p>{ACCIDENT_SURVIVAL_GUIDE.description}</p>
        <p>
          Operated by <strong>{WRECKMATCH_ORG.legalName}</strong> — the same team behind WreckMatch.com. Content is
          educational only; not legal advice.
        </p>
        <p>
          Visit{" "}
          <a href={ACCIDENT_SURVIVAL_GUIDE.url} className="text-emerald-400 hover:underline">
            {ACCIDENT_SURVIVAL_GUIDE.url}
          </a>{" "}
          for checklists, state guides, and survival resources.
        </p>
      </EntityAboutPage>
    </>
  );
}
