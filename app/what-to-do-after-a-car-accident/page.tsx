import { WhatToDoGuidePage } from "@/components/seo/WhatToDoGuidePage";
import { NATIONAL_WHAT_TO_DO } from "@/lib/what-to-do-guides";
import { PRIORITY_PAGE_SEO } from "@/lib/priority-page-seo";
import {
  buildPageMetadata,
  breadcrumbJsonLd,
  faqPageJsonLd,
  howToJsonLd,
  mergeJsonLdGraph,
  siteJsonLdGraph,
  webPageJsonLd,
} from "@/lib/seo";
import { serverSiteBrand, serverSiteOrigin } from "@/lib/site";

const guide = NATIONAL_WHAT_TO_DO;
const seo = PRIORITY_PAGE_SEO[guide.path]!;

export const revalidate = 86400;

export const metadata = buildPageMetadata({
  title: seo.title,
  description: seo.description,
  path: guide.path,
  keywords: seo.keywords ?? [
    "what to do after a car accident",
    "car accident steps",
    "after car crash checklist",
    "should I call a lawyer after accident",
  ],
});

export default async function WhatToDoNationalPage() {
  const origin = serverSiteOrigin();
  const brand = serverSiteBrand();
  const jsonLd = mergeJsonLdGraph(
    siteJsonLdGraph(origin, brand),
    webPageJsonLd({ origin, path: guide.path, name: guide.title, description: guide.metaDescription }),
    howToJsonLd(guide.title, guide.directAnswer, guide.steps),
    faqPageJsonLd(guide.faqs),
    breadcrumbJsonLd(origin, [
      { name: "Home", path: "/" },
      { name: "Resources", path: "/resources" },
      { name: "What to do after a car accident", path: guide.path },
    ]),
  );

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <WhatToDoGuidePage guide={guide} />
    </>
  );
}
