import { headers } from "next/headers";
import { CitationAssetPage } from "@/components/seo/CitationAssetPage";
import { CITATION_ASSETS } from "@/lib/citation-assets";
import { buildPageMetadata, faqPageJsonLd, mergeJsonLdGraph, siteJsonLdGraph } from "@/lib/seo";
import { brandFromHeaders, siteOriginFromHeaders } from "@/lib/site";
import { faqsForTopic } from "@/lib/topic-hub-faqs";

const asset = CITATION_ASSETS.find((a) => a.slug === "glossary")!;

const TERMS: [string, string][] = [
  ["Statute of limitations", "Deadline to file a lawsuit — often ~2 years for car accidents, varies by state."],
  ["Comparative fault", "Your recovery may be reduced by your percentage of fault; some states bar recovery at 50%+."],
  ["Contingency fee", "Attorney paid only if you win — typically a percentage of settlement."],
  ["UM/UIM", "Uninsured / underinsured motorist coverage on your policy."],
  ["Recorded statement", "Insurer interview that can be used against you — often best delayed until counsel reviews."],
  ["Demand letter", "Attorney's written settlement request to the insurer."],
  ["Lien", "Hospital or insurer right to be repaid from settlement proceeds."],
  ["Spoliation", "Destruction of evidence (e.g., truck ECM data) — can trigger sanctions."],
  ["FMCSA", "Federal Motor Carrier Safety Administration — regulates commercial trucks."],
  ["Soft tissue", "Whiplash, sprains — insurers often dispute these injuries."],
];

export async function generateMetadata() {
  const h = await headers();
  return buildPageMetadata({ title: asset.title, description: asset.description, path: asset.path, headers: h });
}

export default async function GlossaryPage() {
  const h = await headers();
  const origin = siteOriginFromHeaders(h);
  const faqs = faqsForTopic("car");
  const jsonLd = mergeJsonLdGraph(siteJsonLdGraph(origin, brandFromHeaders(h)), faqPageJsonLd(faqs));

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <CitationAssetPage asset={asset} faqs={faqs}>
        <p>Plain-English definitions for accident victims. Not legal advice.</p>
        <table>
          <thead>
            <tr>
              <th>Term</th>
              <th>Meaning</th>
            </tr>
          </thead>
          <tbody>
            {TERMS.map(([t, d]) => (
              <tr key={t}>
                <td>
                  <strong>{t}</strong>
                </td>
                <td>{d}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </CitationAssetPage>
    </>
  );
}
