import Link from "next/link";
import { ReferralDisclaimer } from "@/components/ReferralDisclaimer";
import { LeadForm } from "@/components/LeadForm";
import { SiteHeader } from "@/components/SiteHeader";
import { WreckMatchPhone } from "@/components/WreckMatchPhone";
import { WRECKMATCH_PHONE_ACTIVATION_NOTE } from "@/lib/phones";
import {
  buildAccidentVariantFaqs,
  buildAccidentVariantSections,
  variantHeadline,
  variantLabel,
} from "@/lib/priority-places/accident-variants";
import type { AccidentVariantType } from "@/lib/priority-places/types";
import { hubSlugForPlace } from "@/lib/priority-places/registry";
import { stateHubSlug } from "@/lib/geo-routes";

type Props = {
  placeSlug: string;
  city: string;
  state: string;
  variant: AccidentVariantType;
};

export function AccidentVariantContent({ placeSlug, city, state, variant }: Props) {
  const sections = buildAccidentVariantSections(placeSlug, city, state, variant);
  const faqs = buildAccidentVariantFaqs(city, state, variant);
  const title = `${variantHeadline(variant)} in ${city}, ${state} (2026 Guide)`;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <SiteHeader />
      <article className="mx-auto max-w-3xl px-4 py-10 sm:py-14">
        <nav className="mb-6 text-sm text-slate-400">
          <Link href="/" className="hover:text-emerald-400">
            Home
          </Link>
          <span className="mx-2">/</span>
          <Link href={`/${hubSlugForPlace(placeSlug)}`} className="hover:text-emerald-400">
            {city}
          </Link>
          <span className="mx-2">/</span>
          <span className="text-slate-200">{variantLabel(variant)}</span>
        </nav>

        <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">{title}</h1>
        <p className="mt-4 text-lg text-slate-400">
          Free attorney matching for {city} {variantLabel(variant).toLowerCase()} victims. WreckMatch LLC is a
          referral service — not a law firm. Last updated May 2026.
        </p>

        <div className="mt-6 rounded-xl border border-emerald-500/40 bg-slate-900 px-4 py-3">
          <WreckMatchPhone variant="dark" asLink />
        </div>
        <ReferralDisclaimer variant="primary" className="mt-6 border-slate-700 bg-slate-900/60 text-slate-300" />

        {sections.map((section) => (
          <section key={section.id} className="mt-10">
            <h2 className="text-xl font-bold text-white">{section.title}</h2>
            {section.paragraphs.map((p) => (
              <p key={p.slice(0, 40)} className="mt-3 text-slate-300 leading-relaxed">
                {p}
              </p>
            ))}
            {section.listItems && (
              <ol className="mt-4 list-decimal space-y-2 pl-5 text-slate-300">
                {section.listItems.map((item) => (
                  <li key={item.slice(0, 48)}>{item}</li>
                ))}
              </ol>
            )}
            {section.table && (
              <div className="mt-4 overflow-x-auto">
                <table className="min-w-full border border-slate-700 text-sm text-slate-200">
                  <thead className="bg-slate-900">
                    <tr>
                      {section.table.headers.map((h) => (
                        <th key={h} className="border border-slate-700 px-3 py-2 text-left font-semibold">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {section.table.rows.map((row) => (
                      <tr key={row.join("-").slice(0, 40)}>
                        {row.map((cell) => (
                          <td key={cell.slice(0, 30)} className="border border-slate-700 px-3 py-2">
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {section.mistakeRows && (
              <div className="mt-4 overflow-x-auto">
                <table className="min-w-full border border-slate-700 text-sm">
                  <thead className="bg-slate-900">
                    <tr>
                      <th className="border border-slate-700 px-3 py-2 text-left text-slate-100">Mistake</th>
                      <th className="border border-slate-700 px-3 py-2 text-left text-slate-100">Consequence</th>
                    </tr>
                  </thead>
                  <tbody>
                    {section.mistakeRows.map((row) => (
                      <tr key={row.mistake}>
                        <td className="border border-slate-700 px-3 py-2 font-medium text-slate-200">
                          {row.mistake}
                        </td>
                        <td className="border border-slate-700 px-3 py-2 text-slate-300">{row.consequence}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            <div className="mt-4 flex flex-wrap gap-3">
              <a
                href="#form"
                className="inline-flex rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-emerald-400"
              >
                Free matching →
              </a>
              <WreckMatchPhone variant="dark" asLink />
            </div>
          </section>
        ))}

        <section className="mt-12">
          <h2 className="text-xl font-bold text-white">FAQ — {variantLabel(variant)} in {city}</h2>
          <dl className="mt-4 space-y-4">
            {faqs.map((faq) => (
              <div key={faq.question} className="rounded-lg border border-slate-700 bg-slate-900 p-4">
                <dt className="font-semibold text-white">{faq.question}</dt>
                <dd className="mt-2 text-sm text-slate-400">{faq.answer}</dd>
              </div>
            ))}
          </dl>
        </section>

        <p className="mt-8 text-sm text-slate-400">
          <Link href={`/${hubSlugForPlace(placeSlug)}`} className="text-emerald-400 hover:underline">
            ← {city} car accident guide
          </Link>
          {" · "}
          <Link href={`/${stateHubSlug(state)}`} className="text-emerald-400 hover:underline">
            {state} resources
          </Link>
        </p>

        <section id="form" className="mt-12 scroll-mt-20">
          <h2 className="mb-4 text-center text-xl font-bold text-white">
            Free {variantLabel(variant).toLowerCase()} attorney matching in {city}
          </h2>
          <p className="mb-4 text-center text-xs text-slate-500">{WRECKMATCH_PHONE_ACTIVATION_NOTE}</p>
          <LeadForm source={`geo-variant-${placeSlug}-${variant}`} preselectedState={state} variant="conversion" />
        </section>
      </article>
    </div>
  );
}
