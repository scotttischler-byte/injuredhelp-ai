import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Geist, Geist_Mono } from "next/font/google";
import { headers } from "next/headers";
import { CookieConsent } from "@/components/CookieConsent";
import { Providers } from "@/components/Providers";
import { siteOriginFromHeaders } from "@/lib/site";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

function legalServiceJsonLd(origin: string) {
  return {
    "@context": "https://schema.org",
    "@type": "LegalService",
    name: "WreckMatch",
    description:
      "WreckMatch connects car accident victims with licensed personal injury attorneys in all 50 states.",
    url: origin,
    telephone: "+19785156063",
    areaServed: "US",
    serviceType: "Personal Injury Legal Referral",
    priceRange: "Free",
    availableLanguage: ["English", "Spanish"],
  };
}

export async function generateMetadata(): Promise<Metadata> {
  const h = await headers();
  const origin = siteOriginFromHeaders(h);
  return {
    metadataBase: new URL(origin),
    title: {
      default: "WreckMatch – Free Legal Help After Your Car Accident",
      template: "%s | WreckMatch",
    },
    description:
      "Were you injured in a car accident? WreckMatch connects you with a licensed personal injury attorney in your state in under 60 seconds. Free, no obligation, contingency only.",
    icons: { icon: "/favicon.svg" },
    manifest: "/manifest.json",
    robots: { index: true, follow: true },
    openGraph: {
      title: "WreckMatch – Free Legal Help After Your Car Accident",
      description:
        "Injured in a car accident? Get matched with a licensed attorney in seconds. No fees unless you win.",
      siteName: "WreckMatch",
      type: "website",
    },
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

const rawTikTokPixelId = process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID?.trim() ?? "D83MMQ3C77U9FQKB73JG";
const tiktokPixelId = /^[A-Z0-9]+$/i.test(rawTikTokPixelId) ? rawTikTokPixelId.toUpperCase() : "";
const tiktokPixelInline = tiktokPixelId
  ? `
!function (w, d, t) {
  w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie","holdConsent","revokeConsent","grantConsent"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(
var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var r="https://analytics.tiktok.com/i18n/pixel/events.js",o=n&&n.partner;ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=r,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};n=document.createElement("script")
;n.type="text/javascript",n.async=!0,n.src=r+"?sdkid="+e+"&lib="+t;e=document.getElementsByTagName("script")[0];e.parentNode.insertBefore(n,e)};
  ttq.load('${tiktokPixelId}');
  ttq.page();
}(window, document, 'ttq');
`.trim()
  : "";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const h = await headers();
  const origin = siteOriginFromHeaders(h);
  const jsonLd = legalServiceJsonLd(origin);

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full scroll-smooth antialiased`}
    >
      <head>
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        {tiktokPixelId ? (
          <>
            <link rel="preconnect" href="https://analytics.tiktok.com" />
            <link rel="dns-prefetch" href="https://analytics.tiktok.com" />
          </>
        ) : null}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col font-sans">
        {googleAdsTagId ? (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${googleAdsTagId}`}
              strategy="afterInteractive"
            />
            <Script id="google-ads-tag" strategy="afterInteractive">
              {googleAdsInline}
            </Script>
          </>
        ) : null}
        {gtmId ? (
          <>
            <Script
              id="gtm-head"
              strategy="afterInteractive"
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
        {tiktokPixelId ? (
          <Script id="tiktok-pixel" strategy="afterInteractive">
            {tiktokPixelInline}
          </Script>
        ) : null}
        <Providers>{children}</Providers>
        <CookieConsent />
      </body>
    </html>
  );
}
