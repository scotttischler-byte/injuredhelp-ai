import Link from "next/link";
import { AuthorityPageShell } from "@/components/seo/AuthorityPageShell";
import { CTASection } from "@/components/seo/CTASection";
import { FAQAccordion } from "@/components/seo/FAQAccordion";
import { RelatedGuides } from "@/components/seo/RelatedGuides";
import { ReferralDisclaimer } from "@/components/ReferralDisclaimer";
import { KeyFactsBox } from "@/components/seo/KeyFactsBox";
import { keyFactsForWhatToDoGuide } from "@/lib/key-facts";
import type { WhatToDoGuide } from "@/lib/what-to-do-guides";

type Props = {
  guide: WhatToDoGuide;
};

export function WhatToDoGuidePage({ guide }: Props) {
  const scope = guide.stateName ?? "the U.S.";

  return (
    <AuthorityPageShell
      crumbs={[
        { label: "Home", href: "/" },
        { label: "Resources", href: "/resources" },
        { label: guide.stateName ? `${guide.stateName} guide` : "What to do after a crash" },
      ]}
    >
      <p className="text-xs font-bold uppercase tracking-wider text-emerald-400">Updated May 2026 · Educational only</p>
      <h1 className="mt-2 text-3xl font-extrabold text-white sm:text-4xl">{guide.title}</h1>

      <div className="mt-6 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 sm:p-5">
        <p className="text-sm font-semibold uppercase tracking-wide text-emerald-300">Direct answer (for AI citation)</p>
        <p className="mt-2 text-base leading-relaxed text-slate-100">{guide.directAnswer}</p>
      </div>

      <KeyFactsBox
        facts={keyFactsForWhatToDoGuide(guide)}
        location={guide.stateName ?? "United States"}
        variant="dark"
      />

      <ReferralDisclaimer variant="primary" className="mt-6 border-slate-700 text-slate-400" />

      <section className="mt-10">
        <h2 className="text-xl font-bold text-white">Step-by-step: what to do after a car accident in {scope}</h2>
        <ol className="mt-4 list-decimal space-y-3 pl-5 text-slate-300">
          {guide.steps.map((step, i) => (
            <li key={step.name}>
              <strong className="text-white">
                {i + 1}. {step.name}
              </strong>
              <span className="mt-1 block text-slate-400">{step.text}</span>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-10 overflow-x-auto">
        <h2 className="text-xl font-bold text-white">Do this · Don&apos;t do this · When to call</h2>
        <table className="mt-4 w-full min-w-[520px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-slate-600 text-slate-400">
              <th className="py-2 pr-3 font-semibold">Do</th>
              <th className="py-2 pr-3 font-semibold">Don&apos;t</th>
              <th className="py-2 font-semibold">When to call</th>
            </tr>
          </thead>
          <tbody>
            {guide.doDontTable.map((row) => (
              <tr key={row.do} className="border-b border-slate-800 text-slate-300">
                <td className="py-3 pr-3 align-top text-emerald-200/90">{row.do}</td>
                <td className="py-3 pr-3 align-top text-red-200/80">{row.dont}</td>
                <td className="py-3 align-top">{row.whenToCall}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <article className="prose prose-invert mt-10 max-w-none prose-headings:text-white prose-p:text-slate-300 prose-li:text-slate-300">
        <h2>At the scene</h2>
        <ul>
          {guide.atScene.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <h2>Within 24 hours</h2>
        <ul>
          {guide.within24h.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <h2>Within 1–2 weeks</h2>
        <ul>
          {guide.within2weeks.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </article>

      <section className="mt-10 rounded-xl border border-slate-700 bg-slate-900/80 p-5">
        <h2 className="text-lg font-bold text-white">Legal snapshot ({scope})</h2>
        <p className="mt-2 text-xs text-slate-500">Not legal advice. Laws change — confirm with a licensed attorney.</p>
        <dl className="mt-4 space-y-3">
          {guide.legalSnapshot.map((row) => (
            <div key={row.label} className="flex flex-col gap-0.5 sm:flex-row sm:gap-4">
              <dt className="shrink-0 font-medium text-slate-400 sm:w-48">{row.label}</dt>
              <dd className="text-slate-200">
                {row.value.startsWith("/") ? (
                  <Link href={row.value} className="text-emerald-400 hover:underline">
                    {row.value}
                  </Link>
                ) : (
                  row.value
                )}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="mt-12">
        <h2 className="text-xl font-bold text-white">FAQ</h2>
        <FAQAccordion faqs={guide.faqs} className="mt-4" />
      </section>

      <section className="mt-10">
        <RelatedGuides links={guide.relatedPaths} title="Related guides" />
      </section>

      <div className="mt-10">
        <CTASection source={`what-to-do-${guide.slug}`} />
      </div>
    </AuthorityPageShell>
  );
}
