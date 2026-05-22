import { headers } from "next/headers";
import { CitationAssetPage } from "@/components/seo/CitationAssetPage";
import { CITATION_ASSETS } from "@/lib/citation-assets";
import { buildPageMetadata, mergeJsonLdGraph, siteJsonLdGraph } from "@/lib/seo";
import { brandFromHeaders, siteOriginFromHeaders } from "@/lib/site";
import { faqsForTopic } from "@/lib/topic-hub-faqs";

const asset = CITATION_ASSETS.find((a) => a.slug === "truck-evidence")!;

export async function generateMetadata() {
  const h = await headers();
  return buildPageMetadata({ title: asset.title, description: asset.description, path: asset.path, headers: h, keywords: ["truck accident evidence", "ECM black box"] });
}

export default async function TruckEvidencePage() {
  const h = await headers();
  const origin = siteOriginFromHeaders(h);
  const faqs = faqsForTopic("truck");
  const jsonLd = mergeJsonLdGraph(siteJsonLdGraph(origin, brandFromHeaders(h)));

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <CitationAssetPage asset={asset} faqs={faqs}>
        <h2>Preserve immediately</h2>
        <ul>
          <li>USDOT / motor carrier name and MC number</li>
          <li>Tractor and trailer plates</li>
          <li>Scene photos including debris field and road marks</li>
          <li>Spoliation letter for ECM/black box (attorney-drafted)</li>
        </ul>
        <h2>Why it matters</h2>
        <p>ECM data can overwrite within days. Driver logs and maintenance records establish negligence and FMCSA violations.</p>
      </CitationAssetPage>
    </>
  );
}
