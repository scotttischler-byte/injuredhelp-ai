"use client";

import type { HomeCopy } from "@/lib/homeTranslations";

type Props = {
  t: HomeCopy;
};

/** Collapsed section for performance stats — not above the fold. */
export function HowWeHelpSection({ t }: Props) {
  return (
    <section className="border-t border-gray-200 bg-white px-4 py-10">
      <details className="group mx-auto max-w-3xl">
        <summary className="cursor-pointer list-none text-center text-lg font-bold text-gray-900 marker:content-none [&::-webkit-details-marker]:hidden">
          <span className="inline-flex items-center gap-2">
            How we help
            <span className="text-sm font-normal text-gray-500 transition-transform group-open:rotate-180">
              ▾
            </span>
          </span>
        </summary>
        <div className="mt-8 space-y-8">
          <div className="grid grid-cols-2 gap-4 text-center md:grid-cols-4">
            <div>
              <p className="text-xl font-bold text-gray-900 sm:text-2xl">{t.stat1Value}</p>
              <p className="mt-1 text-xs text-gray-600 sm:text-sm">{t.stat1Label}</p>
            </div>
            <div>
              <p className="text-xl font-bold text-gray-900 sm:text-2xl">{t.stat2Value}</p>
              <p className="mt-1 text-xs text-gray-600 sm:text-sm">{t.stat2Label}</p>
            </div>
            <div>
              <p className="text-xl font-bold text-gray-900 sm:text-2xl">{t.stat3Value}</p>
              <p className="mt-1 text-xs text-gray-600 sm:text-sm">{t.stat3Label}</p>
            </div>
            <div>
              <p className="text-xl font-bold text-gray-900 sm:text-2xl">{t.stat4Value}</p>
              <p className="mt-1 text-xs text-gray-600 sm:text-sm">{t.stat4Label}</p>
            </div>
          </div>
          <p className="text-center text-xs leading-relaxed text-gray-500">
            <sup className="font-semibold text-red-600">*</sup> {t.statsDisclaimer}{" "}
            <a href="/advertising-legal-notice" className="text-red-600 underline hover:text-red-500">
              {t.statsDisclaimerLink}
            </a>
          </p>
        </div>
      </details>
    </section>
  );
}
