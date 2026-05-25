import type { Metadata } from "next";
import { HomePageClient } from "@/components/HomePageClient";
import { PRIORITY_PAGE_SEO } from "@/lib/priority-page-seo";
import { serverSiteOrigin } from "@/lib/site";

export const revalidate = 3600;

const origin = serverSiteOrigin();
const homeSeo = PRIORITY_PAGE_SEO["/"]!;

export const metadata: Metadata = {
  title: homeSeo.title,
  description: homeSeo.description,
  keywords: homeSeo.keywords,
  alternates: { canonical: `${origin}/` },
  openGraph: {
    url: `${origin}/`,
    title: homeSeo.title,
    description: homeSeo.description,
  },
};

export default function HomePage() {
  return <HomePageClient />;
}
