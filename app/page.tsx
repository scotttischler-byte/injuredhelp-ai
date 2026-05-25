import type { Metadata } from "next";
import { HomePageClient } from "@/components/HomePageClient";
import { serverSiteOrigin } from "@/lib/site";

export const revalidate = 3600;

const origin = serverSiteOrigin();

export const metadata: Metadata = {
  alternates: { canonical: `${origin}/` },
  openGraph: {
    url: `${origin}/`,
  },
};

export default function HomePage() {
  return <HomePageClient />;
}
