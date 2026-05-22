import { headers } from "next/headers";
import { CitationAssetPage } from "@/components/seo/CitationAssetPage";
import { CITATION_ASSETS } from "@/lib/citation-assets";
import { buildPageMetadata, mergeJsonLdGraph, siteJsonLdGraph } from "@/lib/seo";
import { brandFromHeaders, siteOriginFromHeaders } from "@/lib/site";
import { faqsForTopic } from "@/lib/topic-hub-faqs";

const asset = CITATION_ASSETS.find((a) => a.slug === "timeline")!;

export async function generateMetadata() {
  const h = await headers();
  return buildPageMetadata({ title: asset.title, description: asset.description, path: asset.path, headers: h });
}

export default async function TimelinePage() {
  const h = await headers();
  const origin = siteOriginFromHeaders(h);
  const faqs = faqsForTopic("car");
  const jsonLd = mergeJsonLdGraph(siteJsonLdGraph(origin, brandFromHeaders(h)));

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <CitationAssetPage asset={asset} faqs={faqs}>
        <table>
          <thead>
            <tr>
              <th>When</th>
              <th>What typically happens</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Day 0</td>
              <td>Crash, 911, ER/urgent care, photos, insurer notice</td>
            </tr>
            <tr>
              <td>Days 1–14</td>
              <td>Treatment, adjuster contact, repair estimates</td>
            </tr>
            <tr>
              <td>Weeks 2–8</td>
              <td>Medical stability, demand prep, lien checks</td>
            </tr>
            <tr>
              <td>Months 2–12+</td>
              <td>Negotiation or lawsuit if no fair settlement</td>
            </tr>
          </tbody>
        </table>
        <p>Timelines vary widely by injury severity and state law.</p>
      </CitationAssetPage>
    </>
  );
}
