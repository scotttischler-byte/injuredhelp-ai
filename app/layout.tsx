import type { Metadata, Viewport } from "next";
import { CookieConsent } from "@/components/CookieConsent";
import { DeferredAnalytics } from "@/components/DeferredAnalytics";
import { MobileGlobalCTA } from "@/components/MobileGlobalCTA";
import { Providers } from "@/components/Providers";
import { SiteFooter } from "@/components/SiteFooter";
import { siteJsonLdGraph } from "@/lib/seo";
import { BRAND_CONFIG, serverSiteBrand, serverSiteOrigin, WRECKMATCH_URL } from "@/lib/site";
import {
  shouldLoadTikTokPixel,
  tiktokPixelIdForBrand,
  tiktokPixelInlineScript,
} from "@/lib/tiktok-pixel";
import "./globals.css";

const origin = serverSiteOrigin();
const brand = serverSiteBrand();
const cfg = BRAND_CONFIG[brand];

export const metadata: Metadata = {
  metadataBase: new URL(origin),
  title: {
    default: `${cfg.name} – ${cfg.tagline}`,
    template: `%s | ${cfg.name}`,
  },
  description:
    brand === "wreckmatch"
      ? "Free legal referral for car accident victims. Matched with licensed attorneys in your state. No upfront fees."
      : `${cfg.name} uses AI to instantly connect accident victims with top personal injury attorneys. Free consultation, no fees unless you win.`,
  icons: { icon: "/favicon.svg" },
  manifest: "/manifest.json",
  robots: { index: true, follow: true },
  openGraph: {
    title: `${cfg.name} – ${cfg.tagline}`,
    description:
      "Injured in a car accident? Get matched with a licensed attorney in seconds. No fees unless you win.",
    siteName: cfg.name,
    type: "website",
    url: origin,
  },
  alternates: { canonical: `${origin}/` },
  verification: googleSiteVerification(),
};

function googleSiteVerification(): Metadata["verification"] {
  const token = process.env.GOOGLE_SITE_VERIFICATION?.trim();
  if (!token) return undefined;
  return { google: token };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#0f172a",
  viewportFit: "cover",
};

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

const jsonLd = siteJsonLdGraph(origin, brand);
const tiktokPixelId = tiktokPixelIdForBrand(brand);
const loadTikTokPixel = shouldLoadTikTokPixel(brand);
const tiktokPixelInline = loadTikTokPixel ? tiktokPixelInlineScript(tiktokPixelId) : "";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full scroll-smooth antialiased">
      <head>
        <link rel="alternate" type="application/rss+xml" href={`${WRECKMATCH_URL}/blog/rss.xml`} title="WreckMatch blog RSS" />
        <link rel="alternate" type="text/plain" href={`${WRECKMATCH_URL}/llms.txt`} title="LLM site summary" />
        <link rel="alternate" type="text/plain" href={`${WRECKMATCH_URL}/ai.txt`} title="AI crawler policy" />
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
        <Providers>
          {children}
          <SiteFooter />
        </Providers>
        <MobileGlobalCTA />
        <CookieConsent />
      </body>
    </html>
  );
}
