import { notFound } from "next/navigation";
import { WhatToDoGuidePage } from "@/components/seo/WhatToDoGuidePage";
import { ALL_WHAT_TO_DO_GUIDES, getWhatToDoGuideBySlug } from "@/lib/what-to-do-guides";
import { prioritySeoForPath } from "@/lib/priority-page-seo";
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

export const revalidate = 86400;

type Props = { params: Promise<{ state: string }> };

const STATE_SLUGS = ALL_WHAT_TO_DO_GUIDES.filter((g) => g.slug !== "national").map((g) => g.slug);

export function generateStaticParams() {
  return STATE_SLUGS.map((state) => ({ state }));
}

export async function generateMetadata({ params }: Props) {
  const { state } = await params;
  const guide = getWhatToDoGuideBySlug(state);
  if (!guide) return {};
  const priority = prioritySeoForPath(guide.path);
  return buildPageMetadata({
    title: priority?.title ?? guide.title,
    description: priority?.description ?? guide.metaDescription,
    path: guide.path,
    keywords: priority?.keywords ?? [
      `what to do after car accident ${guide.stateName}`,
      `${guide.stateAbbr} car accident steps`,
      `${guide.stateName} statute of limitations car accident`,
    ],
  });
}

export default async function WhatToDoStatePage({ params }: Props) {
  const { state } = await params;
  const guide = getWhatToDoGuideBySlug(state);
  if (!guide || guide.slug === "national") notFound();

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
      { name: guide.stateName ?? "State guide", path: guide.path },
    ]),
  );

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <WhatToDoGuidePage guide={guide} />
    </>
  );
}
