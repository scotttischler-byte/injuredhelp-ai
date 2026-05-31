"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { BrandPhone } from "@/components/BrandPhone";
import { ReferralDisclaimer } from "@/components/ReferralDisclaimer";
import { SiteHeader } from "@/components/SiteHeader";
import { StickyConversionBar } from "@/components/StickyConversionBar";
import { LeadForm } from "@/components/LeadForm";
import { useLanguage } from "@/components/LanguageContext";
import { themeForBrand } from "@/lib/brand-theme";
import { WRECKMATCH_PHONE_ACTIVATION_NOTE } from "@/lib/phones";
import { trackTikTokClickButton } from "@/lib/tiktok-attribution";

const TikTokHomeFunnel = dynamic(
  () => import("@/components/TikTokFunnel").then((m) => ({ default: m.TikTokHomeFunnel })),
  { ssr: false },
);

const ExitIntentModal = dynamic(
  () => import("@/components/ExitIntentModal").then((m) => ({ default: m.ExitIntentModal })),
  { ssr: false },
);

const SemiTruckBelowFold = dynamic(() => import("@/components/semitruck/SemiTruckBelowFold"), {
  ssr: true,
  loading: () => <div className="min-h-[40vh] bg-[#070b14]" aria-hidden />,
});

const TRUCK_DIFFERENT = {
  en: [
    {
      title: "Higher policy limits",
      body: "Commercial policies often exceed $1M. The right attorney knows how to pursue full coverage.",
      icon: "💰",
    },
    {
      title: "FMCSA & black-box evidence",
      body: "Hours-of-service, ELD logs, and dash video must be preserved quickly.",
      icon: "📋",
    },
    {
      title: "Multiple liable parties",
      body: "Driver, carrier, broker, and maintenance vendors may share responsibility.",
      icon: "⚖️",
    },
  ],
  es: [
    {
      title: "Pólizas más altas",
      body: "Las pólizas comerciales suelen superar $1M. El abogado correcto sabe cómo exigir cobertura completa.",
      icon: "💰",
    },
    {
      title: "FMCSA y caja negra",
      body: "Horas de servicio, ELD y video deben preservarse rápido.",
      icon: "📋",
    },
    {
      title: "Varios responsables",
      body: "Conductor, transportista, broker y mantenimiento pueden compartir responsabilidad.",
      icon: "⚖️",
    },
  ],
};

export function SemiTruckHomePage() {
  const { lang, t } = useLanguage();
  const theme = themeForBrand("semitruckmatch");
  const [formInView, setFormInView] = useState(false);
  const formCardRef = useRef<HTMLDivElement>(null);
  const diff = TRUCK_DIFFERENT[lang];

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
      className={`min-h-screen ${theme.pageBg} text-slate-100 md:pb-0 ${!formInView ? "pb-[calc(4.5rem+env(safe-area-inset-bottom,0px))]" : ""}`}
    >
      <SiteHeader />
      <TikTokHomeFunnel />
      <ExitIntentModal />

      <section className="relative isolate overflow-hidden px-4 py-10 sm:py-14 lg:py-16">
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: theme.heroGradient }}
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#070b14] to-transparent"
          aria-hidden
        />
        <div className="relative z-10 mx-auto grid max-w-6xl gap-10 lg:grid-cols-2 lg:items-start lg:gap-12">
          <div className="text-center lg:text-left">
            <p
              className={`mb-4 inline-flex flex-wrap items-center justify-center gap-2 rounded-full border ${theme.accentBorder} bg-amber-500/10 px-4 py-2 text-xs font-bold uppercase tracking-wide ${theme.accentText} lg:justify-start`}
            >
              {t.urgencyBadge}
            </p>
            <div className="mb-4 flex items-center justify-center gap-2 lg:justify-start" role="status">
              <span className="inline-flex h-3 w-3 animate-pulse rounded-full bg-amber-500" aria-hidden />
              <span className={`text-sm font-medium ${theme.accentText}`}>{t.liveIndicator}</span>
            </div>
            <h1 className="hero-lcp-heading text-4xl font-extrabold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-6xl">
              {t.headline1}
              <br />
              <span className={theme.accentText}>{t.headline2}</span>
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-slate-300 sm:text-lg lg:mx-0">
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
            <ReferralDisclaimer
              variant="primary"
              className="mx-auto mt-6 max-w-xl border-slate-700/80 bg-slate-900/50 text-slate-300 lg:mx-0"
            />
            <div
              className={`mt-6 inline-flex w-full max-w-md justify-center rounded-xl border ${theme.accentBorder} bg-slate-900/80 px-6 py-4 lg:justify-start`}
              onClick={() => trackTikTokClickButton("hero_call")}
              onKeyDown={() => undefined}
              role="presentation"
            >
              <BrandPhone variant="dark" asLink className="lg:items-start" />
            </div>
          </div>

          <div ref={formCardRef}>
            <LeadForm
              source="homepage"
              language={lang}
              formCopy={t.form}
              variant="conversion"
              defaultAccidentType="Truck Accident"
            />
          </div>
        </div>
      </section>

      <section className="border-y border-slate-800/80 bg-slate-900/40 px-4 py-12">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-center text-2xl font-bold text-white sm:text-3xl">
            {lang === "en" ? "Why truck crashes need specialized help" : "Por qué los choques de camión requieren ayuda especializada"}
          </h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            {diff.map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-slate-700/80 bg-slate-950/60 p-6 text-center sm:text-left"
              >
                <span className="text-3xl" aria-hidden>
                  {item.icon}
                </span>
                <h3 className="mt-3 text-lg font-bold text-amber-400">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">{item.body}</p>
              </div>
            ))}
          </div>
          <p className="mt-8 text-center text-sm text-slate-500">
            {lang === "en" ? "Read state-by-state guides on our " : "Lee guías por estado en el "}
            <Link href="/blog" className="font-semibold text-amber-400 underline-offset-2 hover:underline">
              {t.linkBlog}
            </Link>
            {lang === "en" ? " — updated daily." : " — actualizado a diario."}
          </p>
        </div>
      </section>

      <SemiTruckBelowFold lang={lang} t={t} formInView={formInView} />
      <StickyConversionBar
        visible={!formInView}
        onScrollToForm={scrollToForm}
        ctaLabel={lang === "en" ? "Free truck case help →" : "Ayuda gratis →"}
      />
    </div>
  );
}
