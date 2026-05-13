"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { useLanguage } from "@/components/LanguageContext";
import { LeadForm } from "@/components/LeadForm";
import { SiteHeader } from "@/components/SiteHeader";
import { ACTIVITY_MESSAGES } from "@/lib/homeTranslations";
import { ALL_STATES } from "@/lib/states";

const EXIT_MODAL_KEY = "wreckmatch_exit_modal_shown";

export function HomePageClient() {
  const { lang, t } = useLanguage();
  const [slotsRemaining, setSlotsRemaining] = useState<number | null>(null);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastIndex, setToastIndex] = useState(0);
  const [toastDismissed, setToastDismissed] = useState(false);
  const [exitModalOpen, setExitModalOpen] = useState(false);
  const [faqOpen, setFaqOpen] = useState<number | null>(null);
  const [formInView, setFormInView] = useState(false);
  const [stepsVisible, setStepsVisible] = useState(false);

  const stepsSectionRef = useRef<HTMLElement>(null);
  const formCardRef = useRef<HTMLDivElement>(null);
  const lastActivityRef = useRef(0);

  /* Urgency slots: UI-only random 3–7 on client mount (not a live inventory system). */
  useEffect(() => {
    queueMicrotask(() => {
      setSlotsRemaining(Math.floor(Math.random() * 5) + 3);
    });
  }, []);

  /* Social proof toast: first show after 8s, then cycle every 12s */
  useEffect(() => {
    if (toastDismissed) return;
    const t1 = setTimeout(() => setToastVisible(true), 8000);
    return () => clearTimeout(t1);
  }, [toastDismissed]);

  useEffect(() => {
    if (toastDismissed || !toastVisible) return;
    const id = setInterval(() => {
      setToastIndex((i) => (i + 1) % ACTIVITY_MESSAGES[lang].length);
    }, 12000);
    return () => clearInterval(id);
  }, [toastDismissed, toastVisible, lang]);

  /* How it works: fade-in when section visible */
  useEffect(() => {
    const el = stepsSectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setStepsVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.12 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  /* Form in view → hide floating mobile CTA */
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

  const tryShowExitModal = useCallback(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem(EXIT_MODAL_KEY)) return;
    sessionStorage.setItem(EXIT_MODAL_KEY, "1");
    setExitModalOpen(true);
  }, []);

  /* Desktop exit intent */
  useEffect(() => {
    const onLeave = (e: MouseEvent) => {
      if (e.clientY > 24) return;
      tryShowExitModal();
    };
    document.documentElement.addEventListener("mouseleave", onLeave);
    return () => document.documentElement.removeEventListener("mouseleave", onLeave);
  }, [tryShowExitModal]);

  /* Mobile: 45s inactivity */
  useEffect(() => {
    const isCoarse = window.matchMedia("(pointer: coarse)").matches;
    if (!isCoarse) return;

    const bump = () => {
      lastActivityRef.current = Date.now();
    };
    bump();
    const events = ["touchstart", "scroll", "keydown", "click"] as const;
    events.forEach((ev) => window.addEventListener(ev, bump, { passive: true }));

    const tick = () => {
      if (Date.now() - lastActivityRef.current >= 45000) {
        tryShowExitModal();
        clearInterval(iv);
      }
    };
    const iv = setInterval(tick, 1000);

    return () => {
      events.forEach((ev) => window.removeEventListener(ev, bump));
      clearInterval(iv);
    };
  }, [tryShowExitModal]);

  const scrollToForm = useCallback(() => {
    document.getElementById("form")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const activityMessages = ACTIVITY_MESSAGES[lang];
  const trustMarquee = [
    `🔒 ${t.trustStripEnc}`,
    `⚖️ ${t.trustStripLicensed}`,
    `🇺🇸 ${t.trustStripStates}`,
    `📋 ${t.trustStripHipaa}`,
    `⭐ ${t.trustStripRating}`,
    `🏆 ${t.trustStripRecoveries}`,
  ];
  const howSteps = [
    { n: "01", emoji: "📋", title: t.step1title, body: t.step1body },
    { n: "02", emoji: "📞", title: t.step2title, body: t.step2body },
    { n: "03", emoji: "⚖️", title: t.step3title, body: t.step3body },
    { n: "04", emoji: "💰", title: t.step4title, body: t.step4body },
  ];

  return (
    <div
      className={`min-h-screen bg-gray-100 text-gray-900 md:pb-0 ${!formInView ? "pb-[calc(4.5rem+env(safe-area-inset-bottom,0px))]" : ""}`}
    >
      <SiteHeader />

      {/* SECTION B — HERO */}
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
          <h1 className="text-4xl font-extrabold leading-[1.08] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
            {t.headline1}
            <br />
            <span className="text-white">{t.headline2}</span>
          </h1>
          <div className="mx-auto mt-6 h-1 w-24 max-w-full rounded-full bg-gradient-to-r from-transparent via-red-500 to-transparent opacity-90" />
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-gray-400 sm:text-lg md:text-xl">
            {t.subheadline}
          </p>
          {slotsRemaining !== null && (
            <p className="mx-auto mt-5 inline-flex items-center gap-2 rounded-full border border-red-500/50 bg-red-950/40 px-4 py-2 text-sm font-semibold text-red-300">
              <span aria-hidden>⏱</span>
              <span>
                {t.slotsLine} — <span className="text-white">{slotsRemaining}</span> {t.slotsRemaining}
              </span>
            </p>
          )}
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
            <sup className="font-semibold text-red-400">*</sup>
            <strong className="text-gray-400"> {t.heroLegalPrefix}</strong> {t.heroLegalText}{" "}
            <a
              href="#advertising-legal-notice"
              className="font-medium text-red-400 underline decoration-red-400/50 underline-offset-2 transition-opacity duration-200 hover:text-red-300"
            >
              {t.heroLegalReadMore}
            </a>
            .
          </p>
          <div className="mt-10 flex flex-col items-center gap-3">
            <a
              href="tel:19785156063"
              className="inline-flex w-full max-w-md items-center justify-center rounded-xl bg-[#cc0000] px-6 py-4 text-lg font-bold text-white shadow-lg shadow-red-900/40 transition-transform duration-200 hover:scale-[1.02] hover:bg-[#b30000] sm:text-xl"
            >
              {t.callBtn}
            </a>
            <p className="text-sm text-gray-500">{t.formHint}</p>
          </div>
        </div>
      </section>

      <div className="flex flex-wrap justify-center gap-4 border-t border-gray-200 bg-gray-100 py-4 text-sm text-gray-400">
        {trustMarquee.map((line) => (
          <span key={line}>{line}</span>
        ))}
      </div>

      {/* SECTION C — LEAD FORM */}
      <section className="px-4 py-12 sm:py-16" aria-labelledby="lead-form-heading">
        <p id="lead-form-heading" className="sr-only">
          {t.leadFormSr}
        </p>
        <LeadForm ref={formCardRef} source="homepage" language={lang} formCopy={t.form} />
      </section>

      {/* SECTION D — STATS */}
      <section className="bg-gray-950 px-4 py-10">
        <div className="mx-auto grid min-h-[120px] max-w-5xl grid-cols-2 divide-y divide-gray-800 text-center md:grid-cols-4 md:divide-x md:divide-y-0 md:divide-gray-800">
          <div className="stat-reveal px-2 py-6 md:py-8">
            <p className="text-xl font-bold leading-tight text-white sm:text-2xl md:text-3xl">{t.stat1Value}</p>
            <p className="mt-1 text-sm text-gray-400">{t.stat1Label}</p>
          </div>
          <div className="stat-reveal px-2 py-6 md:py-8" style={{ animationDelay: "0.08s" }}>
            <p className="text-2xl font-bold text-white sm:text-3xl">{t.stat2Value}</p>
            <p className="mt-1 text-sm text-gray-400">{t.stat2Label}</p>
          </div>
          <div className="stat-reveal px-2 py-6 md:py-8" style={{ animationDelay: "0.16s" }}>
            <p className="text-2xl font-bold text-white sm:text-3xl">{t.stat3Value}</p>
            <p className="mt-1 text-sm text-gray-400">{t.stat3Label}</p>
          </div>
          <div className="stat-reveal px-2 py-6 md:py-8" style={{ animationDelay: "0.24s" }}>
            <p className="text-2xl font-bold text-white sm:text-3xl">{t.stat4Value}</p>
            <p className="mt-1 text-sm text-gray-400">{t.stat4Label}</p>
          </div>
        </div>
        <p className="mx-auto mt-8 max-w-3xl text-center text-xs leading-relaxed text-gray-500">
          <sup className="font-semibold text-red-400">*</sup> {t.statsDisclaimer}{" "}
          <a
            href="#advertising-legal-notice"
            className="text-red-400 underline transition-opacity duration-200 hover:text-red-300"
          >
            {t.statsDisclaimerLink}
          </a>
        </p>
      </section>

      {/* SECTION E — TESTIMONIALS */}
      <section className="bg-gray-200 px-4 py-14 sm:py-16">
        <h2 className="mb-3 text-center text-2xl font-bold text-gray-900 sm:text-3xl">
          {t.testimonialsHeading}
        </h2>
        <p className="mx-auto mb-6 max-w-2xl text-center text-sm text-gray-600 sm:text-base">
          {t.testimonialsSubheading}
          <sup className="font-semibold text-red-600">*</sup>
        </p>
        <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-3">
          {[
            { quote: t.testimonial1, who: t.testimonial1name },
            { quote: t.testimonial2, who: t.testimonial2name },
            { quote: t.testimonial3, who: t.testimonial3name },
          ].map((row) => (
            <blockquote
              key={row.who}
              className="rounded-xl border border-gray-100 bg-white p-6 shadow-md shadow-gray-900/5 transition-transform duration-200 will-change-transform hover:-translate-y-1 hover:shadow-xl"
            >
              <p className="mb-3 text-yellow-400" aria-label="5 out of 5 stars">
                ★★★★★
              </p>
              <p className="text-gray-700">&ldquo;{row.quote}&rdquo;</p>
              <footer className="mt-4 text-sm text-gray-500">{row.who}</footer>
              <p className="mt-2 text-xs font-semibold text-green-600">✓ {t.verifiedClient}</p>
            </blockquote>
          ))}
        </div>
      </section>

      <section className="border-y border-gray-300 bg-white px-4 py-6">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-center gap-3 text-center text-sm font-semibold text-gray-800 sm:flex-row sm:flex-wrap sm:gap-6">
          <Link href="/blog" className="text-[#cc0000] underline-offset-4 hover:underline">
            📖 {t.linkBlog}
          </Link>
          <span className="hidden text-gray-300 sm:inline">|</span>
          <Link href="/states" className="text-[#cc0000] underline-offset-4 hover:underline">
            🗺️ {t.linkStates}
          </Link>
          <span className="hidden text-gray-300 sm:inline">|</span>
          <Link href="/case-calculator" className="text-[#cc0000] underline-offset-4 hover:underline">
            📊 {t.linkCalculator}
          </Link>
          <span className="hidden text-gray-300 sm:inline">|</span>
          <Link href="/survival-guide" className="text-[#cc0000] underline-offset-4 hover:underline">
            📥 {t.linkGuide}
          </Link>
        </div>
      </section>

      {/* SECTION F — HOW IT WORKS */}
      <section ref={stepsSectionRef} className="bg-white px-4 py-14 sm:py-16">
        <h2 className="mb-12 text-center text-2xl font-bold text-gray-900 sm:text-3xl">{t.howHeading}</h2>
        <div className="relative mx-auto max-w-5xl">
          <div
            className="pointer-events-none absolute left-6 right-6 top-7 hidden h-px bg-gray-200 md:block"
            aria-hidden
          />
          <ol className="relative grid gap-0 divide-y divide-gray-200 md:grid-cols-4 md:divide-x md:divide-y-0">
            {howSteps.map((step, i) => (
              <li
                key={step.title}
                className={`step-reveal relative flex flex-col gap-2 overflow-hidden bg-white px-2 py-8 text-center md:px-4 md:pt-10 ${
                  stepsVisible ? "step-reveal-visible" : ""
                }`}
                style={{ transitionDelay: `${120 + i * 90}ms` }}
              >
                <span
                  className="pointer-events-none absolute left-1/2 top-4 -translate-x-1/2 select-none text-7xl font-black leading-none text-gray-200/25 sm:text-8xl md:top-6"
                  aria-hidden
                >
                  {step.n}
                </span>
                <span className="relative z-10 text-3xl" aria-hidden>
                  {step.emoji}
                </span>
                <p className="relative z-10 font-bold text-gray-900">{step.title}</p>
                <p className="relative z-10 text-sm leading-relaxed text-gray-600">{step.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* SECTION G — TRUST BAR */}
      <section className="bg-gray-950 py-5 md:py-6">
        <div className="hidden flex-wrap items-center justify-center gap-x-2 gap-y-2 px-4 text-center text-sm text-white md:flex md:text-base">
          {trustMarquee.map((line, i) => (
            <span key={line} className="contents">
              {i > 0 && <span className="text-gray-600">&nbsp;|&nbsp;</span>}
              <span>{line}</span>
            </span>
          ))}
        </div>
        <div className="md:hidden">
          <div className="overflow-hidden">
            <div className="trust-marquee-track flex w-max gap-16 px-4 text-sm text-white">
              {[...trustMarquee, ...trustMarquee].map((line, i) => (
                <span key={`${line}-${i}`} className="shrink-0 whitespace-nowrap">
                  {line}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION H — SECOND CTA */}
      <section className="bg-[#cc0000] px-4 py-14 text-center">
        <h2 className="text-2xl font-bold text-white sm:text-3xl">{t.urgencyCta}</h2>
        <p className="mx-auto mt-4 max-w-2xl text-base text-red-100">{t.urgencyCtaBody}</p>
        <Link
          href="#form"
          className="mt-8 inline-flex items-center justify-center rounded-xl bg-white px-8 py-4 text-lg font-bold text-[#cc0000] shadow-lg transition-transform duration-200 hover:scale-[1.02] hover:bg-gray-100"
        >
          {t.urgencyCtaBtn}
        </Link>
      </section>

      {/* FAQ */}
      <section className="border-t border-gray-200 bg-gray-100 px-4 py-14 sm:py-16">
        <h2 className="mb-8 text-center text-2xl font-bold text-gray-900 sm:text-3xl">{t.faqHeading}</h2>
        <div className="mx-auto max-w-3xl space-y-3">
          {t.faq.map((item, i) => {
            const open = faqOpen === i;
            return (
              <div
                key={item.q}
                className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all duration-200"
              >
                <button
                  type="button"
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-base font-semibold text-gray-900 transition-all duration-200 hover:bg-gray-50"
                  onClick={() => setFaqOpen(open ? null : i)}
                  aria-expanded={open}
                >
                  {item.q}
                  <span className="shrink-0 text-xl text-[#cc0000] transition-transform duration-200">
                    {open ? "−" : "+"}
                  </span>
                </button>
                <div
                  className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                    open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  }`}
                >
                  <div className="min-h-0 overflow-hidden">
                    <p className="border-t border-gray-100 px-5 pb-4 pt-2 text-sm leading-relaxed text-gray-600">
                      {item.a}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ADVERTISING & LEGAL NOTICE */}
      <section
        id="advertising-legal-notice"
        className="scroll-mt-20 border-t border-gray-800 bg-gray-900 px-4 py-12"
      >
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-4 text-center text-sm font-bold uppercase tracking-wider text-gray-400">
            {t.advertisingHeading}
          </h2>
          <div className="space-y-4 text-xs leading-relaxed text-gray-500 sm:text-sm">
            {t.advertisingBlocks.map((block) => (
              <p key={block.slice(0, 48)}>{block}</p>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-gray-800 bg-gray-950 px-4 py-12">
        <h2 className="mb-6 text-center text-xl font-bold text-white sm:text-2xl">{t.coverageHeading}</h2>
        <div className="mx-auto grid max-w-5xl grid-cols-5 gap-2 sm:grid-cols-8 md:grid-cols-9 lg:grid-cols-[repeat(13,minmax(0,1fr))]">
          {ALL_STATES.map((s) => (
            <Link
              key={s.slug}
              href={`/states/${s.slug}`}
              className="rounded-lg border border-gray-800 bg-gray-900 py-2 text-center text-xs font-bold text-gray-200 transition-colors hover:border-red-600 hover:text-white"
            >
              {s.abbreviation}
            </Link>
          ))}
        </div>
      </section>

      <footer className="bg-gray-950 px-4 py-10">
        <div className="mx-auto max-w-3xl text-center text-xs leading-relaxed text-gray-500">
          <p className="mb-2 text-gray-400">{t.footerCopyright}</p>
          <p className="mb-3">{t.footerP1}</p>
          <p>
            <sup className="text-gray-600">*</sup> {t.footerP2}{" "}
            <a
              href="#advertising-legal-notice"
              className="text-gray-400 underline transition-opacity duration-200 hover:text-gray-300"
            >
              {t.advertisingHeading}
            </a>
          </p>
        </div>
      </footer>

      {/* Exit intent modal */}
      {exitModalOpen && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4 transition-opacity duration-200"
          role="dialog"
          aria-modal="true"
          aria-labelledby="exit-modal-title"
        >
          <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl transition-all duration-200">
            <button
              type="button"
              className="absolute right-3 top-3 rounded-lg px-2 py-1 text-sm text-gray-500 transition-all duration-200 hover:bg-gray-100"
              onClick={() => setExitModalOpen(false)}
              aria-label="Close"
            >
              ✕
            </button>
            <p className="text-center text-xs font-bold uppercase tracking-wider text-[#cc0000]">{t.exitBadge}</p>
            <h2 id="exit-modal-title" className="mt-2 text-center text-xl font-bold text-gray-900 sm:text-2xl">
              {t.exitTitle}
            </h2>
            <p className="mt-3 text-center text-sm text-gray-600">{t.exitBody}</p>
            <button
              type="button"
              className="mt-6 w-full rounded-xl bg-[#cc0000] py-3 text-base font-bold text-white transition-opacity duration-200 hover:bg-[#b30000]"
              onClick={() => {
                setExitModalOpen(false);
                scrollToForm();
              }}
            >
              {t.exitCta}
            </button>
            <button
              type="button"
              className="mt-3 w-full text-center text-xs text-gray-500 transition-opacity duration-200 hover:text-gray-700"
              onClick={() => setExitModalOpen(false)}
            >
              {t.exitDismiss}
            </button>
          </div>
        </div>
      )}

      {/* Activity toast */}
      {toastVisible && !toastDismissed && (
        <div
          className={`fixed left-4 z-[55] max-w-sm rounded-xl border border-gray-200 bg-white p-4 shadow-lg transition-all duration-300 ease-out will-change-transform ${
            formInView ? "bottom-6" : "bottom-[calc(4.5rem+env(safe-area-inset-bottom,0px))]"
          } md:bottom-6`}
          style={{ transform: toastVisible ? "translateY(0)" : "translateY(12px)", opacity: 1 }}
        >
          <button
            type="button"
            className="absolute right-2 top-2 text-gray-400 transition-opacity duration-200 hover:text-gray-700"
            onClick={() => {
              setToastDismissed(true);
              setToastVisible(false);
            }}
            aria-label="Dismiss notification"
          >
            ✕
          </button>
          <p className="pr-6 text-xs font-bold uppercase tracking-wide text-gray-500">{t.activityLabel}</p>
          <div className="mt-2 flex items-start gap-2">
            <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-green-500" aria-hidden />
            <div>
              <p className="text-sm text-gray-800">
                <span className="font-bold text-gray-900">{activityMessages[toastIndex]?.line}</span>
              </p>
              <p className="mt-1 text-xs text-gray-500">{activityMessages[toastIndex]?.ago}</p>
            </div>
          </div>
        </div>
      )}

      {/* Floating mobile CTA */}
      <div
        className={`fixed inset-x-0 bottom-0 z-50 flex h-14 items-stretch gap-0 border-t border-gray-800 bg-gray-950 pb-[env(safe-area-inset-bottom,0px)] transition-transform duration-300 ease-out md:hidden ${
          formInView ? "translate-y-full" : "translate-y-0"
        }`}
      >
        <a
          href="tel:19785156063"
          className="flex flex-1 items-center justify-center bg-gray-900 text-sm font-semibold text-white transition-opacity duration-200 hover:bg-gray-800"
        >
          📞 {t.mobileCtaCall}
        </a>
        <button
          type="button"
          className="flex flex-1 items-center justify-center bg-[#cc0000] text-sm font-semibold text-white transition-opacity duration-200 hover:bg-[#b30000]"
          onClick={scrollToForm}
        >
          {t.mobileCtaForm}
        </button>
      </div>
    </div>
  );
}
