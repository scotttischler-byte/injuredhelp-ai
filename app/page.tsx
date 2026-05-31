import type { Metadata } from "next";
import { HomePageClient } from "@/components/HomePageClient";
import { PRIORITY_PAGE_SEO } from "@/lib/priority-page-seo";
import { BRAND_CONFIG, serverSiteBrand, serverSiteOrigin } from "@/lib/site";

export const revalidate = 3600;

const origin = serverSiteOrigin();
const brand = serverSiteBrand();
const cfg = BRAND_CONFIG[brand];
const homeSeo = PRIORITY_PAGE_SEO["/"];

export const metadata: Metadata =
  brand === "semitruckmatch"
    ? {
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
      }
    : {
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

export default function HomePage() {
  return <HomePageClient />;
}
