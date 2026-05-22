"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import { useLanguage } from "@/components/LanguageContext";
import { ExitIntentModal } from "@/components/ExitIntentModal";
import { LeadForm } from "@/components/LeadForm";
import { ReferralDisclaimer } from "@/components/ReferralDisclaimer";
import { SiteHeader } from "@/components/SiteHeader";
import { StickyConversionBar } from "@/components/StickyConversionBar";
import { WreckMatchPhone } from "@/components/WreckMatchPhone";
import { WRECKMATCH_PHONE_ACTIVATION_NOTE } from "@/lib/phones";
import { trackTikTokClickButton } from "@/lib/tiktok-attribution";

const TikTokHomeFunnel = dynamic(
  () => import("@/components/TikTokFunnel").then((m) => ({ default: m.TikTokHomeFunnel })),
  { ssr: false },
);

import HomePageBelowFold from "@/components/HomePageBelowFold";

export function HomePageClient() {
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
      className={`min-h-screen bg-slate-950 text-slate-100 md:pb-0 ${!formInView ? "pb-[calc(4.5rem+env(safe-area-inset-bottom,0px))]" : ""}`}
    >
      <SiteHeader />
      <TikTokHomeFunnel />
      <ExitIntentModal />

      <section className="relative isolate overflow-hidden px-4 py-10 sm:py-14 lg:py-16">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(16,185,129,0.18) 0%, transparent 55%), radial-gradient(ellipse 60% 40% at 100% 100%, rgba(16,185,129,0.08) 0%, transparent 50%)",
          }}
          aria-hidden
        />
        <div className="relative z-10 mx-auto grid max-w-6xl gap-10 lg:grid-cols-2 lg:items-start lg:gap-12">
          <div className="text-center lg:text-left">
            <p className="mb-4 inline-flex flex-wrap items-center justify-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-4 py-2 text-xs font-bold uppercase tracking-wide text-emerald-400 lg:justify-start">
              {t.urgencyBadge}
            </p>
            <div className="mb-4 flex items-center justify-center gap-2 lg:justify-start" role="status">
              <span className="relative flex h-3 w-3">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-500" />
              </span>
              <span className="text-sm font-medium text-emerald-400">{t.liveIndicator}</span>
            </div>
            <h1 className="hero-lcp-heading text-4xl font-extrabold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-6xl">
              {t.headline1}
              <br />
              <span className="text-emerald-400">{t.headline2}</span>
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-slate-400 sm:text-lg lg:mx-0">
              {t.subheadline}
            </p>
            <div className="mx-auto mt-6 flex max-w-xl flex-wrap items-center justify-center gap-x-2 gap-y-2 text-sm text-slate-300 lg:mx-0 lg:justify-start">
              <span>✅ {t.trustItem1}</span>
              <span className="hidden text-slate-600 sm:inline">|</span>
              <span>✅ {t.trustItem2}</span>
              <span className="hidden text-slate-600 sm:inline">|</span>
              <span>✅ {t.trustItem3}</span>
              <span className="hidden text-slate-600 sm:inline">|</span>
              <span>✅ {t.trustItem4}</span>
              <span className="hidden text-slate-600 sm:inline">|</span>
              <span>🔒 {t.trustItem5}</span>
            </div>
            <p className="mx-auto mt-4 max-w-xl text-xs text-slate-500 lg:mx-0">{WRECKMATCH_PHONE_ACTIVATION_NOTE}</p>
            <ReferralDisclaimer variant="primary" className="mx-auto mt-6 max-w-xl border-slate-700 bg-slate-900/60 text-slate-300 lg:mx-0" />
            <div
              className="mt-6 inline-flex w-full max-w-md justify-center rounded-xl border border-emerald-500/50 bg-slate-900 px-6 py-4 lg:justify-start"
              onClick={() => trackTikTokClickButton("hero_call")}
              onKeyDown={() => undefined}
              role="presentation"
            >
              <WreckMatchPhone variant="dark" asLink className="lg:items-start" />
            </div>
          </div>

          <div ref={formCardRef}>
            <LeadForm source="homepage" language={lang} formCopy={t.form} variant="conversion" />
          </div>
        </div>
      </section>

      <HomePageBelowFold lang={lang} t={t} formInView={formInView} />
      <StickyConversionBar visible={!formInView} onScrollToForm={scrollToForm} />
    </div>
  );
}
