import { headers } from "next/headers";
import { TopicHubPage } from "@/components/seo/TopicHubPage";
import { TOPIC_HUBS } from "@/lib/topic-hubs";
import { faqsForTopic } from "@/lib/topic-hub-faqs";
import { buildPageMetadata, breadcrumbJsonLd, faqPageJsonLd, mergeJsonLdGraph, siteJsonLdGraph, webPageJsonLd } from "@/lib/seo";
import { brandFromHeaders, siteOriginFromHeaders } from "@/lib/site";

const hub = TOPIC_HUBS.find((h) => h.slug === "truck")!;

export async function generateMetadata() {
  const h = await headers();
  return buildPageMetadata({
    title: hub.title,
    description: hub.description,
    path: hub.path,
    headers: h,
    keywords: hub.keywords,
  });
}

export default async function TruckAccidentHelpPage() {
  const h = await headers();
  const origin = siteOriginFromHeaders(h);
  const brand = brandFromHeaders(h);
  const faqs = faqsForTopic("truck");
  const jsonLd = mergeJsonLdGraph(
    siteJsonLdGraph(origin, brand),
    webPageJsonLd({ origin, path: hub.path, name: hub.title, description: hub.description }),
    breadcrumbJsonLd(origin, [
      { name: "Home", path: "/" },
      { name: "Truck accident help", path: hub.path },
    ]),
    faqPageJsonLd(faqs),
  );

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <TopicHubPage hub={hub} faqs={faqs} extraLinks={[{ href: "/truck-accident-evidence-guide", label: "Truck evidence guide" }]} />
    </>
  );
}
