import type { Metadata } from "next";
import { headers } from "next/headers";
import { HomePageClient } from "@/components/HomePageClient";
import { TcpaConsentField } from "@/components/TcpaConsentField";
import { siteOriginFromHeaders } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  const h = await headers();
  const origin = siteOriginFromHeaders(h);
  return {
    alternates: { canonical: `${origin}/` },
    openGraph: {
      url: `${origin}/`,
    },
  };
}

export default function HomePage() {
  return <HomePageClient tcpaConsent={<TcpaConsentField />} />;
}
