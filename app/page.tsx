import type { Metadata } from "next";
import { HomePageClient } from "@/components/HomePageClient";
import { PRIORITY_PAGE_SEO } from "@/lib/priority-page-seo";
import { requestSiteBrand, requestSiteOrigin } from "@/lib/request-brand";
import { BRAND_CONFIG } from "@/lib/site";

export const dynamic = "force-dynamic";

export const revalidate = 0;
export async function generateMetadata(): Promise<Metadata> {
  const origin = await requestSiteOrigin();
  const brand = await requestSiteBrand();
  const cfg = BRAND_CONFIG[brand];
  const homeSeo = PRIORITY_PAGE_SEO["/"];

  if (brand === "semitruckmatch") {
    return {
      title: `${cfg.name} – Free Truck Accident Attorney Matching`,
      description:
        "Hit by a semi truck? Get matched with an experienced truck accident lawyer in under 60 seconds. Free, confidential, nationwide. No fees unless you win.",
      keywords: [
        "truck accident lawyer",
        "semi truck accident attorney",
        "18 wheeler crash lawyer",
        "FMCSA accident attorney",
        "commercial truck injury",
      ],
      alternates: { canonical: `${origin}/` },
      openGraph: {
        url: `${origin}/`,
        title: `${cfg.name} – ${cfg.tagline}`,
        description:
          "Free truck accident attorney matching after a semi or 18-wheeler crash. Licensed counsel in all 50 states.",
      },
    };
  }

  return {
    title: homeSeo!.title,
    description: homeSeo!.description,
    keywords: homeSeo!.keywords,
    alternates: { canonical: `${origin}/` },
    openGraph: {
      url: `${origin}/`,
      title: homeSeo!.title,
      description: homeSeo!.description,
    },
  };
}

export default function HomePage() {
  return <HomePageClient />;
}
