"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { HomeCopy, Lang } from "@/lib/homeTranslations";
import { ACTIVITY_MESSAGES } from "@/lib/homeTranslations";
import { HowWeHelpSection } from "@/components/HowWeHelpSection";
import { TexasMetroLinks } from "@/components/TexasMetroLinks";
import { stateHubSlug } from "@/lib/geo-routes";
import { ALL_STATES } from "@/lib/states";
import { trackTikTokClickButton } from "@/lib/tiktok-attribution";

type Props = {
  lang: Lang;
  t: HomeCopy;
  formInView: boolean;
};

export default function HomePageBelowFold({ lang, t, formInView }: Props) {
  const [toastVisible, setToastVisible] = useState(false);
  const [toastIndex, setToastIndex] = useState(0);
  const [toastDismissed, setToastDismissed] = useState(false);
  const [faqOpen, setFaqOpen] = useState<number | null>(null);
  const [stepsVisible, setStepsVisible] = useState(false);
  const stepsSectionRef = useRef<HTMLElement>(null);

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
    <>
      <div className="flex flex-wrap justify-center gap-4 border-t border-slate-800 bg-slate-950 py-4 text-sm text-slate-500">
        {trustMarquee.map((line) => (
          <span key={line}>{line}</span>
        ))}
      </div>

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
            href="/advertising-legal-notice"
            className="text-red-400 underline transition-opacity duration-200 hover:text-red-300"
          >
            {t.statsDisclaimerLink}
          </a>
        </p>
      </section>

      <section id="testimonials" className="scroll-mt-20 bg-gray-200 px-4 py-14 sm:py-16">
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
              className="rounded-xl border border-gray-100 bg-white p-6 shadow-md shadow-gray-900/5 transition-transform duration-200 hover:-translate-y-1 hover:shadow-xl"
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
        </div>
      </section>

      <section id="how-it-works" ref={stepsSectionRef} className="scroll-mt-20 bg-white px-4 py-14 sm:py-16">
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

      <section className="bg-[#cc0000] px-4 py-14 text-center">
        <h2 className="text-2xl font-bold text-white sm:text-3xl">{t.urgencyCta}</h2>
        <p className="mx-auto mt-4 max-w-2xl text-base text-red-100">{t.urgencyCtaBody}</p>
        <Link
          href="#form"
          onClick={() => trackTikTokClickButton("urgency_cta")}
          className="mt-8 inline-flex items-center justify-center rounded-xl bg-white px-8 py-4 text-lg font-bold text-[#cc0000] shadow-lg transition-transform duration-200 hover:scale-[1.02] hover:bg-gray-100"
        >
          {t.urgencyCtaBtn}
        </Link>
      </section>

      <section id="faq" className="scroll-mt-20 border-t border-gray-200 bg-gray-100 px-4 py-14 sm:py-16">
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

      <TexasMetroLinks variant="homepage" />

      <section id="states" className="scroll-mt-20 border-t border-gray-800 bg-gray-950 px-4 py-12">
        <h2 className="mb-6 text-center text-xl font-bold text-white sm:text-2xl">{t.coverageHeading}</h2>
        <div className="mx-auto grid max-w-5xl grid-cols-5 gap-2 sm:grid-cols-8 md:grid-cols-9 lg:grid-cols-[repeat(13,minmax(0,1fr))]">
          {ALL_STATES.map((s) => (
            <Link
              key={s.slug}
              href={`/${stateHubSlug(s.state)}`}
              className="rounded-lg border border-gray-800 bg-gray-900 py-2 text-center text-xs font-bold text-gray-200 transition-colors hover:border-red-600 hover:text-white"
            >
              {s.abbreviation}
            </Link>
          ))}
        </div>
      </section>

      {toastVisible && !toastDismissed && (
        <div
          className={`fixed left-4 z-[55] max-w-sm rounded-xl border border-gray-200 bg-white p-4 shadow-lg transition-all duration-300 ease-out ${
            formInView ? "bottom-6" : "bottom-[calc(4.5rem+env(safe-area-inset-bottom,0px))]"
          } md:bottom-6`}
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

    </>
  );
}
