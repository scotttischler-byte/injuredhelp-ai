import { headers } from "next/headers";
import { WhatToDoGuidePage } from "@/components/seo/WhatToDoGuidePage";
import { NATIONAL_WHAT_TO_DO } from "@/lib/what-to-do-guides";
import {
  buildPageMetadata,
  breadcrumbJsonLd,
  faqPageJsonLd,
  howToJsonLd,
  mergeJsonLdGraph,
  siteJsonLdGraph,
  webPageJsonLd,
} from "@/lib/seo";
import { brandFromHeaders, siteOriginFromHeaders } from "@/lib/site";

const guide = NATIONAL_WHAT_TO_DO;

export async function generateMetadata() {
  const h = await headers();
  return buildPageMetadata({
    title: guide.title,
    description: guide.metaDescription,
    path: guide.path,
    headers: h,
    keywords: [
      "what to do after a car accident",
      "car accident steps",
      "after car crash checklist",
      "should I call a lawyer after accident",
    ],
  });
}

export default async function WhatToDoNationalPage() {
  const h = await headers();
  const origin = siteOriginFromHeaders(h);
  const brand = brandFromHeaders(h);
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
