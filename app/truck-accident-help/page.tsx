import { TopicHubPage } from "@/components/seo/TopicHubPage";
import { TOPIC_HUBS } from "@/lib/topic-hubs";
import { faqsForTopic } from "@/lib/topic-hub-faqs";
import { PRIORITY_PAGE_SEO } from "@/lib/priority-page-seo";
import { buildPageMetadata, breadcrumbJsonLd, faqPageJsonLd, mergeJsonLdGraph, siteJsonLdGraph, webPageJsonLd } from "@/lib/seo";
import { serverSiteBrand, serverSiteOrigin } from "@/lib/site";

const hub = TOPIC_HUBS.find((h) => h.slug === "truck")!;
const seo = PRIORITY_PAGE_SEO[hub.path]!;

export const revalidate = 86400;

export const metadata = buildPageMetadata({
  title: seo.title,
  description: seo.description,
  path: hub.path,
  keywords: seo.keywords ?? hub.keywords,
});

export default async function TruckAccidentHelpPage() {
  const origin = serverSiteOrigin();
  const brand = serverSiteBrand();
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
      <TopicHubPage hub={{ ...hub, title: seo.title, description: seo.description }} faqs={faqs} extraLinks={[{ href: "/truck-accident-evidence-guide", label: "Truck evidence guide" }]} />
    </>
  );
}
