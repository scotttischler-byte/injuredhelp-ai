"use client";

import Script from "next/script";
import { useEffect, useState } from "react";

const CONSENT_KEY = "wreckmatch_cookie_consent";
const LOAD_EVENT = "wreckmatch:load-analytics";

type Props = {
  gtmId: string;
  googleAdsTagId: string;
  googleAdsInline: string;
  tiktokInline: string;
  loadTikTok: boolean;
};

function consentGranted(): boolean {
  try {
    return localStorage.getItem(CONSENT_KEY) === "accepted";
  } catch {
    return false;
  }
}

/** Loads GTM / Ads / TikTok only after cookie consent — keeps Lighthouse clean pre-consent. */
export function DeferredAnalytics({
  gtmId,
  googleAdsTagId,
  googleAdsInline,
  tiktokInline,
  loadTikTok,
}: Props) {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (consentGranted()) setEnabled(true);

    const onLoad = () => setEnabled(true);
    window.addEventListener(LOAD_EVENT, onLoad);
    return () => window.removeEventListener(LOAD_EVENT, onLoad);
  }, []);

  if (!enabled) return null;

  return (
    <>
      {googleAdsTagId ? (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${googleAdsTagId}`} strategy="lazyOnload" />
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
      {loadTikTok && tiktokInline ? (
        <Script id="tiktok-pixel" strategy="lazyOnload">
          {tiktokInline}
        </Script>
      ) : null}
    </>
  );
}

export function signalAnalyticsLoad() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(LOAD_EVENT));
  }
}
