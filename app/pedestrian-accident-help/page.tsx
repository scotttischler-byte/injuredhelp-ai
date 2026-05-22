import { headers } from "next/headers";
import { TopicHubPage } from "@/components/seo/TopicHubPage";
import { TOPIC_HUBS } from "@/lib/topic-hubs";
import { faqsForTopic } from "@/lib/topic-hub-faqs";
import { buildPageMetadata, mergeJsonLdGraph, siteJsonLdGraph, faqPageJsonLd } from "@/lib/seo";
import { brandFromHeaders, siteOriginFromHeaders } from "@/lib/site";

const hub = TOPIC_HUBS.find((h) => h.slug === "pedestrian")!;

export async function generateMetadata() {
  const h = await headers();
  return buildPageMetadata({ title: hub.title, description: hub.description, path: hub.path, headers: h, keywords: hub.keywords });
}

export default async function PedestrianAccidentHelpPage() {
  const h = await headers();
  const origin = siteOriginFromHeaders(h);
  const faqs = faqsForTopic("car");
  const jsonLd = mergeJsonLdGraph(siteJsonLdGraph(origin, brandFromHeaders(h)), faqPageJsonLd(faqs));
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <TopicHubPage hub={hub} faqs={faqs} />
    </>
  );
}
