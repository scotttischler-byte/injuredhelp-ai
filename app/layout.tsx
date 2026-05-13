import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Geist, Geist_Mono } from "next/font/google";
import { CookieConsent } from "@/components/CookieConsent";
import { Providers } from "@/components/Providers";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const legalServiceJsonLd = {
  "@context": "https://schema.org",
  "@type": "LegalService",
  name: "WreckMatch",
  description:
    "WreckMatch connects car accident victims with licensed personal injury attorneys in all 50 states.",
  url: "https://injuredhelp.ai",
  telephone: "+19785156063",
  areaServed: "US",
  serviceType: "Personal Injury Legal Referral",
  priceRange: "Free",
  availableLanguage: ["English", "Spanish"],
};

export const metadata: Metadata = {
  metadataBase: new URL("https://injuredhelp.ai"),
  title: "WreckMatch – Free Legal Help After Your Car Accident",
  description:
    "Were you injured in a car accident? WreckMatch connects you with a licensed personal injury attorney in your state in under 60 seconds. Free, no obligation, contingency only.",
  icons: { icon: "/favicon.svg" },
  manifest: "/manifest.json",
  openGraph: {
    title: "WreckMatch – Free Legal Help After Your Car Accident",
    description:
      "Injured in a car accident? Get matched with a licensed attorney in seconds. No fees unless you win.",
    url: "https://injuredhelp.ai",
    siteName: "WreckMatch",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#e53e3e",
};

const rawGtm = process.env.NEXT_PUBLIC_GTM_ID?.trim() ?? "";
const gtmId = /^GTM-[A-Z0-9]+$/i.test(rawGtm) ? rawGtm.toUpperCase() : "";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full scroll-smooth antialiased`}
    >
      <head>
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(legalServiceJsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col font-sans">
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
        <Providers>{children}</Providers>
        <CookieConsent />
      </body>
    </html>
  );
}
