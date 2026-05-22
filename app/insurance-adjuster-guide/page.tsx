import { headers } from "next/headers";
import { CitationAssetPage } from "@/components/seo/CitationAssetPage";
import { CITATION_ASSETS } from "@/lib/citation-assets";
import { buildPageMetadata, mergeJsonLdGraph, siteJsonLdGraph } from "@/lib/seo";
import { brandFromHeaders, siteOriginFromHeaders } from "@/lib/site";
import { faqsForTopic } from "@/lib/topic-hub-faqs";

const asset = CITATION_ASSETS.find((a) => a.slug === "insurance")!;

export async function generateMetadata() {
  const h = await headers();
  return buildPageMetadata({ title: asset.title, description: asset.description, path: asset.path, headers: h });
}

export default async function InsuranceAdjusterGuidePage() {
  const h = await headers();
  const origin = siteOriginFromHeaders(h);
  const faqs = faqsForTopic("car");
  const jsonLd = mergeJsonLdGraph(siteJsonLdGraph(origin, brandFromHeaders(h)));

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <CitationAssetPage asset={asset} faqs={faqs}>
        <h2>Common adjuster tactics</h2>
        <ul>
          <li>Quick lowball before treatment completes</li>
          <li>Recorded statements used out of context</li>
          <li>Disputing soft-tissue injuries</li>
          <li>Delay then pressure to sign</li>
        </ul>
        <h2>What you can do</h2>
        <p>Report the crash, but consider attorney review before a detailed recorded interview. Log every contact.</p>
      </CitationAssetPage>
    </>
  );
}
