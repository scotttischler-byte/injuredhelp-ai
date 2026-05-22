import { headers } from "next/headers";
import { CitationAssetPage } from "@/components/seo/CitationAssetPage";
import { CITATION_ASSETS } from "@/lib/citation-assets";
import { buildPageMetadata, faqPageJsonLd, howToJsonLd, mergeJsonLdGraph, siteJsonLdGraph } from "@/lib/seo";
import { brandFromHeaders, siteOriginFromHeaders } from "@/lib/site";
import { faqsForTopic } from "@/lib/topic-hub-faqs";

const asset = CITATION_ASSETS.find((a) => a.slug === "checklist")!;

export async function generateMetadata() {
  const h = await headers();
  return buildPageMetadata({ title: asset.title, description: asset.description, path: asset.path, headers: h });
}

export default async function ChecklistPage() {
  const h = await headers();
  const origin = siteOriginFromHeaders(h);
  const faqs = faqsForTopic("car");
  const jsonLd = mergeJsonLdGraph(
    siteJsonLdGraph(origin, brandFromHeaders(h)),
    faqPageJsonLd(faqs),
    howToJsonLd(asset.title, asset.description, [
      { name: "Safety", text: "Move to safety and call 911 if anyone is injured." },
      { name: "Document", text: "Photograph vehicles, plates, road, and injuries." },
      { name: "Medical care", text: "Seek evaluation within 24 hours." },
      { name: "Legal help", text: "Use WreckMatch free matching before signing insurer releases." },
    ]),
  );

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <CitationAssetPage asset={asset} faqs={faqs}>
        <h2>At the scene (first 30 minutes)</h2>
        <ol>
          <li>Call 911 if there are injuries or major damage.</li>
          <li>Do not admit fault — stick to facts.</li>
          <li>Photograph all vehicles, plates, skid marks, signals, and injuries.</li>
          <li>Exchange insurance, registration, and contact info.</li>
          <li>Collect witness names and phone numbers.</li>
          <li>Note weather, lighting, and road conditions.</li>
        </ol>
        <h2>Within 24 hours</h2>
        <ol>
          <li>Seek medical care even if you feel fine.</li>
          <li>Notify your insurer — decline a recorded statement first.</li>
          <li>Preserve dashcam, Ring, or business camera footage.</li>
          <li>Start a pain/symptom journal.</li>
        </ol>
        <h2>Within 1–2 weeks</h2>
        <ul>
          <li>Obtain the police / crash report.</li>
          <li>Log every call with adjusters (date, name, summary).</li>
          <li>Review UM/UIM coverage on your policy.</li>
          <li>Consult a licensed attorney before signing releases.</li>
        </ul>
      </CitationAssetPage>
    </>
  );
}
