import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Geist, Geist_Mono } from "next/font/google";
import { headers } from "next/headers";
import { CookieConsent } from "@/components/CookieConsent";
import { Providers } from "@/components/Providers";
import { SiteFooter } from "@/components/SiteFooter";
import { siteJsonLdGraph } from "@/lib/seo";
import {
  brandFromHeaders,
  BRAND_CONFIG,
  siteOriginFromHeaders,
  type SiteBrand,
} from "@/lib/site";
import {
  shouldLoadTikTokPixel,
  tiktokPixelIdForBrand,
  tiktokPixelInlineScript,
} from "@/lib/tiktok-pixel";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const h = await headers();
  const origin = siteOriginFromHeaders(h);
  const brand = brandFromHeaders(h);
  const cfg = BRAND_CONFIG[brand];
  return {
    metadataBase: new URL(origin),
    title: {
      default: `${cfg.name} – ${cfg.tagline}`,
      template: `%s | ${cfg.name}`,
    },
    description:
      brand === "wreckmatch"
        ? "Were you injured in a car accident? WreckMatch connects you with a licensed personal injury attorney in your state in under 60 seconds. Free, no obligation, contingency only."
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
  };
}

export const viewport: Viewport = {
  themeColor: "#e53e3e",
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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const h = await headers();
  const origin = siteOriginFromHeaders(h);
  const brand = brandFromHeaders(h);
  const jsonLd = siteJsonLdGraph(origin, brand);
  const tiktokPixelId = tiktokPixelIdForBrand(brand);
  const loadTikTokPixel = shouldLoadTikTokPixel(brand);
  const tiktokPixelInline = loadTikTokPixel ? tiktokPixelInlineScript(tiktokPixelId) : "";

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full scroll-smooth antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd),
          }}
        />
      </head>
      <body className="min-h-full flex flex-col font-sans">
        {googleAdsTagId ? (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${googleAdsTagId}`}
              strategy="lazyOnload"
            />
            <Script id="google-ads-tag" strategy="lazyOnload">
              {googleAdsInline}
            </Script>
          </>
        ) : null}
        {gtmId ? (
          <>
            <Script
              id="gtm-head"
              strategy="lazyOnload"
              dangerouslySetInnerHTML={{
                __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${gtmId}');`,
              }}
            />
            <noscript>
              <iframe
                title="Google Tag Manager"
                src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
                height={0}
                width={0}
                className="hidden"
              />
            </noscript>
          </>
        ) : null}
        {loadTikTokPixel ? (
          <Script id="tiktok-pixel" strategy="afterInteractive">
            {tiktokPixelInline}
          </Script>
        ) : null}
        <Providers>
          {children}
          <SiteFooter />
        </Providers>
        <CookieConsent />
      </body>
    </html>
  );
}
