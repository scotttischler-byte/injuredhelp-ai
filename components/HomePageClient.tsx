"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import { useLanguage } from "@/components/LanguageContext";
import { LeadForm } from "@/components/LeadForm";
import { ReferralDisclaimer } from "@/components/ReferralDisclaimer";
import { SiteHeader } from "@/components/SiteHeader";
import { trackTikTokClickButton } from "@/lib/tiktok-attribution";

const TikTokHomeFunnel = dynamic(
  () => import("@/components/TikTokFunnel").then((m) => ({ default: m.TikTokHomeFunnel })),
  { ssr: false },
);

import HomePageBelowFold from "@/components/HomePageBelowFold";
import type { ReactNode } from "react";

type Props = {
  tcpaConsent?: ReactNode;
};

export function HomePageClient({ tcpaConsent }: Props) {
  const { lang, t } = useLanguage();
  const [formInView, setFormInView] = useState(false);
  const formCardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = formCardRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => setFormInView(e.isIntersecting),
      { rootMargin: "-8% 0px -8% 0px", threshold: 0.05 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const scrollToForm = useCallback(() => {
    trackTikTokClickButton("scroll_to_form");
    document.getElementById("form")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  return (
    <div
      className={`min-h-screen bg-gray-100 text-gray-900 md:pb-0 ${!formInView ? "pb-[calc(4.5rem+env(safe-area-inset-bottom,0px))]" : ""}`}
    >
      <SiteHeader />
      <TikTokHomeFunnel />

      {/* Hero — LCP target; CSS gradients only */}
      <section className="relative isolate overflow-hidden bg-gray-950 px-4 py-14 sm:py-24">
        <div
          className="pointer-events-none absolute inset-0 hero-radial-pulse"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% 20%, rgba(220,38,38,0.22) 0%, transparent 55%), radial-gradient(ellipse 70% 50% at 50% 100%, rgba(59,130,246,0.08) 0%, transparent 50%)",
          }}
          aria-hidden
        />
        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <p className="animate-urgency-in mb-5 inline-flex flex-wrap items-center justify-center gap-2 rounded-full border border-red-500/40 bg-red-500/10 px-4 py-2 text-xs font-bold uppercase tracking-wide text-red-400 sm:text-sm">
            {t.urgencyBadge}
          </p>
          <div
            className="mb-4 flex items-center justify-center gap-2"
            role="status"
            aria-live="polite"
            aria-atomic="true"
          >
            <span className="relative flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex h-3 w-3 rounded-full bg-green-500" />
            </span>
            <span className="text-sm font-medium text-green-400 transition-opacity duration-200">
              {t.liveIndicator}
            </span>
          </div>
          <h1 className="hero-lcp-heading text-4xl font-extrabold leading-[1.08] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
            {t.headline1}
            <br />
            <span className="text-white">{t.headline2}</span>
          </h1>
          <div className="mx-auto mt-6 h-1 w-24 max-w-full rounded-full bg-gradient-to-r from-transparent via-red-500 to-transparent opacity-90" />
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-gray-400 sm:text-lg md:text-xl">
            {t.subheadline}
          </p>
          <div className="mx-auto mt-8 flex max-w-3xl flex-wrap items-center justify-center gap-x-3 gap-y-2 text-sm text-white sm:text-base">
            <span className="transition-opacity duration-200">✅ {t.trustItem1}</span>
            <span className="hidden text-gray-600 sm:inline">|</span>
            <span>✅ {t.trustItem2}</span>
            <span className="hidden text-gray-600 sm:inline">|</span>
            <span>✅ {t.trustItem3}</span>
            <span className="hidden text-gray-600 sm:inline">|</span>
            <span>✅ {t.trustItem4}</span>
            <span className="hidden text-gray-600 sm:inline">|</span>
            <span>✅ {t.trustItem5}</span>
          </div>
          <p className="mx-auto mt-4 max-w-2xl text-center text-xs leading-relaxed text-gray-500">
            <a
              href="/advertising-legal-notice"
              className="font-medium text-red-400 underline decoration-red-400/50 underline-offset-2 transition-opacity duration-200 hover:text-red-300"
            >
              {t.heroLegalReadMore}
            </a>
          </p>
          <ReferralDisclaimer variant="primary" className="mx-auto mt-8 max-w-2xl text-left" />
          <div className="mt-6 flex flex-col items-center gap-3">
            <a
              href="tel:+19785156063"
              onClick={() => trackTikTokClickButton("hero_call")}
              className="inline-flex w-full max-w-md items-center justify-center rounded-xl bg-[#cc0000] px-6 py-4 text-lg font-bold text-white shadow-lg shadow-red-900/40 transition-transform duration-200 hover:scale-[1.02] hover:bg-[#b30000] sm:text-xl"
            >
              {t.callBtn}
            </a>
            <p className="text-sm text-gray-500">{t.formHint}</p>
          </div>
        </div>
      </section>

      <section className="px-4 py-12 sm:py-16" aria-labelledby="lead-form-heading">
        <p id="lead-form-heading" className="sr-only">
          {t.leadFormSr}
        </p>
        <ReferralDisclaimer className="mx-auto mb-4 max-w-[560px] border-gray-300 bg-white text-gray-600" />
        <LeadForm ref={formCardRef} source="homepage" language={lang} formCopy={t.form} tcpaConsent={tcpaConsent} />
      </section>

      <HomePageBelowFold lang={lang} t={t} formInView={formInView} scrollToForm={scrollToForm} />
    </div>
  );
}
