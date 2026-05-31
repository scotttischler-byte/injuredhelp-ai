import type { Metadata, Viewport } from "next";
import { CookieConsent } from "@/components/CookieConsent";
import { DeferredAnalytics } from "@/components/DeferredAnalytics";
import { MobileGlobalCTA } from "@/components/MobileGlobalCTA";
import { Providers } from "@/components/Providers";
import { SiteFooter } from "@/components/SiteFooter";
import { siteJsonLdGraph } from "@/lib/seo";
import { requestSiteBrand, requestSiteOrigin } from "@/lib/request-brand";
import { BRAND_CONFIG, WRECKMATCH_URL, type SiteBrand } from "@/lib/site";
import {
  shouldLoadTikTokPixel,
  tiktokPixelIdForBrand,
  tiktokPixelInlineScript,
} from "@/lib/tiktok-pixel";
import "./globals.css";

export const dynamic = "force-dynamic";

function metadataForBrand(brand: SiteBrand, origin: string): Metadata {
  const cfg = BRAND_CONFIG[brand];
  return {
    metadataBase: new URL(origin),
    title: {
      default: `${cfg.name} – ${cfg.tagline}`,
      template: `%s | ${cfg.name}`,
    },
    description:
      brand === "semitruckmatch"
        ? "Free truck accident attorney matching after a semi, 18-wheeler, or commercial truck crash. Licensed counsel in all 50 states. No fees unless you win."
        : brand === "wreckmatch"
          ? "Free legal referral for car accident victims. Matched with licensed attorneys in your state. No upfront fees."
          : `${cfg.name} uses AI to instantly connect accident victims with top personal injury attorneys. Free consultation, no fees unless you win.`,
    icons: {
      icon: brand === "semitruckmatch" ? "/semitruck-favicon.svg" : "/favicon.svg",
    },
    manifest: "/manifest.json",
    robots: { index: true, follow: true },
    openGraph: {
      title: `${cfg.name} – ${cfg.tagline}`,
      description:
        brand === "semitruckmatch"
          ? "Free truck accident attorney matching. Licensed counsel nationwide."
          : "Injured in a car accident? Get matched with a licensed attorney in seconds. No fees unless you win.",
      siteName: cfg.name,
      type: "website",
      url: origin,
    },
    alternates: {
      canonical: `${origin}/`,
      languages: {
        "en-US": `${origin}/`,
        "es-US": `${origin}/`,
        "x-default": `${origin}/`,
      },
    },
    verification: googleSiteVerification(),
  };
}

function googleSiteVerification(): Metadata["verification"] {
  const token = process.env.GOOGLE_SITE_VERIFICATION?.trim();
  if (!token) return undefined;
  return { google: token };
}

export async function generateMetadata(): Promise<Metadata> {
  const brand = await requestSiteBrand();
  const origin = await requestSiteOrigin();
  return metadataForBrand(brand, origin);
}

export async function generateViewport(): Promise<Viewport> {
  const brand = await requestSiteBrand();
  return {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
    themeColor: brand === "semitruckmatch" ? "#070b14" : "#0f172a",
    viewportFit: "cover",
  };
}

const rawGtm = process.env.NEXT_PUBLIC_GTM_ID?.trim() ?? "";
const gtmId = /^GTM-[A-Z0-9]+$/i.test(rawGtm) ? rawGtm.toUpperCase() : "";

const googleAdsTagId = process.env.NEXT_PUBLIC_GOOGLE_ADS_TAG_ID?.trim() ?? "";
const googleAdsInline = googleAdsTagId
  ? `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${googleAdsTagId}');
`.trim()
  : "";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const brand = await requestSiteBrand();
  const origin = await requestSiteOrigin();
  const jsonLd = siteJsonLdGraph(origin, brand);
  const tiktokPixelId = tiktokPixelIdForBrand(brand);
  const loadTikTokPixel = shouldLoadTikTokPixel(brand);
  const tiktokPixelInline = loadTikTokPixel ? tiktokPixelInlineScript(tiktokPixelId) : "";

  return (
    <html lang="en" className="h-full scroll-smooth antialiased">
      <head>
        <link rel="alternate" type="application/rss+xml" href={`${origin}/blog/rss.xml`} title={`${BRAND_CONFIG[brand].name} blog RSS`} />
        <link rel="alternate" type="text/plain" href={`${origin}/llms.txt`} title="LLM site summary" />
        <link rel="alternate" type="text/plain" href={`${origin}/ai.txt`} title="AI crawler policy" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd),
          }}
        />
      </head>
      <body className="min-h-full flex flex-col font-sans">
        <DeferredAnalytics
          gtmId={gtmId}
          googleAdsTagId={googleAdsTagId}
          googleAdsInline={googleAdsInline}
          tiktokInline={tiktokPixelInline}
          loadTikTok={loadTikTokPixel}
        />
        <Providers brand={brand}>
          {children}
          <SiteFooter />
          <CookieConsent />
        </Providers>
        <MobileGlobalCTA />
      </body>
    </html>
  );
}
