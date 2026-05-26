import Link from "next/link";
import { ReferralDisclaimer } from "@/components/ReferralDisclaimer";
import { LeadForm } from "@/components/LeadForm";
import { SiteHeader } from "@/components/SiteHeader";
import { WreckMatchPhone } from "@/components/WreckMatchPhone";
import { WRECKMATCH_PHONE_ACTIVATION_NOTE } from "@/lib/phones";
import {
  buildGeoFaqs,
  buildGeoSections,
  geoKeywords,
  geoPlaceLabel,
  geoRelatedLinks,
} from "@/lib/geo-content";
import { TexasMetroLinks } from "@/components/TexasMetroLinks";
import type { GeoHub } from "@/lib/geo-routes";
import { cityPlaceSlug, cityHubSlug, stateHubSlug } from "@/lib/geo-routes";
import { enrichedPlaceSlugFromHubSlug } from "@/lib/priority-places/content-builder";
import { isPriorityState, priorityPlacesForState } from "@/lib/priority-places/registry";
import { priorityMetroHubPath } from "@/lib/priority-metro-links";
import { AccidentSurvivalGuideCrossLink } from "@/components/seo/AccidentSurvivalGuideCrossLink";
import { GeoLatestGuides } from "@/components/seo/GeoLatestGuides";
import { KeyFactsBox } from "@/components/seo/KeyFactsBox";
import { asgLinksForState } from "@/lib/asg-links";
import { keyFactsForGeoHub } from "@/lib/key-facts";
import { ALL_STATES } from "@/lib/states";

type Props = {
  hub: GeoHub;
};

export function GeoHubContent({ hub }: Props) {
  const isState = hub.type === "state";
  const name = isState ? hub.profile.state : hub.profile.city;
  const stateName = isState ? hub.profile.state : hub.profile.state;
  const preselectedState = stateName;
  const place = geoPlaceLabel(hub);
  const sections = buildGeoSections(hub);
  const faqs = buildGeoFaqs(hub);
  const keywords = geoKeywords(hub);
  const related = geoRelatedLinks(hub);
  const enrichedSlug = !isState ? enrichedPlaceSlugFromHubSlug(hub.slug) : null;
  const isEnrichedCity = enrichedSlug !== null;
  const isPriorityStateHub = isState && isPriorityState(name);
  const stateProfile = isState
    ? ALL_STATES.find((s) => s.state === name)
    : ALL_STATES.find((s) => s.state === stateName);
  const asgLinks = asgLinksForState(stateProfile);

  const title =
    isEnrichedCity && !isState
      ? `What to Do After a Car Accident in ${name} (2026 Guide)`
      : isPriorityStateHub
        ? `Car Accident Lawyer ${name} — What to Do After a Crash (2026)`
        : isState
          ? `Car Accident Help in ${name}`
          : `Car Accident Help in ${name}, ${hub.profile.state}`;
  const intro = isState
    ? isPriorityStateHub
      ? `Injured in a ${name} car crash? This hub links every major ${name} city guide plus statewide deadlines, insurance basics, and free attorney matching. WreckMatch LLC is a referral service — not a law firm. Last updated May 2026.`
      : `Injured in a ${name} car crash? WreckMatch connects accident victims with experienced personal injury attorneys in ${name} at no upfront cost. We are a referral service operated by WreckMatch LLC — not a law firm. We call you back within 60 seconds.`
    : isEnrichedCity
      ? `Hurt in a ${name} car accident? This 2026 guide covers immediate steps, ${hub.profile.state} statute of limitations, insurance tactics, and free attorney matching. WreckMatch LLC is a referral service — not a law firm. Last updated May 2026.`
      : `${name} sees heavy traffic and serious crashes every year. If you were hurt in a ${name} accident, WreckMatch connects you with licensed ${hub.profile.state} attorneys at no upfront cost — we are not a law firm.`;

  const shellClass =
    isEnrichedCity || isPriorityStateHub
      ? "min-h-screen bg-slate-950 text-slate-100"
      : "min-h-screen bg-gray-100 text-gray-900";
  const proseMuted = isEnrichedCity || isPriorityStateHub ? "text-slate-300" : "text-gray-700";
  const proseHeading = isEnrichedCity || isPriorityStateHub ? "text-white" : "text-gray-950";
  const guideVariant = isEnrichedCity || isPriorityStateHub ? "dark" : "light";
  const blogPlaceSlug = isState
    ? stateHubSlug(name).replace(/^car-accident-help-/, "")
    : (enrichedSlug ?? cityPlaceSlug(hub.profile));

  return (
    <div className={shellClass}>
      <SiteHeader />
      <article className="mx-auto max-w-3xl px-4 py-10 sm:py-14">
        <nav className={`mb-6 text-sm ${isEnrichedCity || isPriorityStateHub ? "text-slate-400" : "text-gray-500"}`}>
          <Link href="/" className="hover:text-emerald-400">
            Home
          </Link>
          <span className="mx-2">/</span>
          <Link href="/states" className="hover:text-emerald-400">
            States
          </Link>
          <span className="mx-2">/</span>
          <span className={isEnrichedCity || isPriorityStateHub ? "text-slate-200" : "text-gray-800"}>{name}</span>
        </nav>

        <h1 className={`text-3xl font-extrabold tracking-tight sm:text-4xl ${proseHeading}`}>{title}</h1>
        <p className={`mt-4 text-lg leading-relaxed ${isEnrichedCity || isPriorityStateHub ? "text-slate-400" : "text-gray-600"}`}>
          {intro}
        </p>
        <p className={`mt-2 text-xs ${isEnrichedCity || isPriorityStateHub ? "text-slate-500" : "text-gray-500"}`}>
          {keywords.slice(0, 3).join(" · ")}
        </p>

        <KeyFactsBox
          facts={keyFactsForGeoHub(hub)}
          location={place}
          variant={isEnrichedCity || isPriorityStateHub ? "dark" : "light"}
        />

        <AccidentSurvivalGuideCrossLink
          links={asgLinks}
          variant={isEnrichedCity || isPriorityStateHub ? "dark" : "light"}
        />

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <div className="rounded-xl border border-emerald-500/40 bg-slate-900 px-4 py-3">
            <WreckMatchPhone variant="dark" asLink />
          </div>
          <a
            href="#form"
            className="inline-flex items-center rounded-xl border border-gray-300 bg-white px-5 py-3 font-semibold text-gray-900 hover:bg-gray-50"
          >
            Get matched free →
          </a>
        </div>

        <ReferralDisclaimer variant="primary" className="mt-8 border-gray-200 bg-white text-gray-600" />

        {sections.map((section) => (
          <section key={section.id} className="mt-10 max-w-none">
            <h2 className={`text-xl font-bold ${proseHeading}`}>{section.title}</h2>
            {section.paragraphs.map((p) => (
              <p key={p.slice(0, 40)} className={`mt-3 leading-relaxed ${proseMuted}`}>
                {p}
              </p>
            ))}
            {section.listItems && section.listItems.length > 0 && (
              <ol className={`mt-4 list-decimal space-y-2 pl-5 ${proseMuted}`}>
                {section.listItems.map((item) => (
                  <li key={item.slice(0, 48)}>{item}</li>
                ))}
              </ol>
            )}
            {section.table && (
              <div className="mt-4 overflow-x-auto">
                <table className="min-w-full border border-gray-200 text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      {section.table.headers.map((h) => (
                        <th key={h} className="border border-gray-200 px-3 py-2 text-left font-semibold">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {section.table.rows.map((row) => (
                      <tr key={row.join("-").slice(0, 40)}>
                        {row.map((cell) => (
                          <td key={cell.slice(0, 30)} className="border border-gray-200 px-3 py-2">
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {section.mistakeRows && section.mistakeRows.length > 0 && (
              <div className="mt-4 overflow-x-auto">
                <table className="min-w-full border border-gray-200 text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="border border-gray-200 px-3 py-2 text-left font-semibold">Mistake</th>
                      <th className="border border-gray-200 px-3 py-2 text-left font-semibold">Consequence</th>
                    </tr>
                  </thead>
                  <tbody>
                    {section.mistakeRows.map((row) => (
                      <tr key={row.mistake}>
                        <td className="border border-gray-200 px-3 py-2 font-medium">{row.mistake}</td>
                        <td className="border border-gray-200 px-3 py-2">{row.consequence}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        ))}

        {isState && name === "Texas" ? (
          <section className="mt-10 rounded-2xl border border-emerald-500/30 bg-slate-900 p-6">
            <h2 className="text-xl font-bold text-white">Texas city guides (2026)</h2>
            <p className="mt-2 text-sm text-slate-400">
              Hyper-local guides for the busiest Texas metros: statute of limitations, insurance tactics,
              and free attorney matching.
            </p>
            <div className="mt-4">
              <TexasMetroLinks variant="inline" showStateLink={false} />
            </div>
          </section>
        ) : isState && isPriorityStateHub ? (
          <section className="mt-10 rounded-2xl border border-emerald-500/30 bg-slate-900 p-6">
            <h2 className="text-xl font-bold text-white">Major {name} city guides (2026)</h2>
            <p className="mt-2 text-sm text-slate-400">
              Car accident lawyer {name} resources by metro — local stats, deadlines, and free matching.
            </p>
            <ul className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
              {priorityPlacesForState(name).map((p) => (
                <li key={p.placeSlug}>
                  <Link href={priorityMetroHubPath(p.placeSlug)} className="text-emerald-400 hover:underline">
                    {p.city}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ) : isState ? (
          <section className="mt-10">
            <h2 className={`text-xl font-bold ${proseHeading}`}>Major cities we serve in {name}</h2>
            <ul className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
              {hub.profile.majorCities.map((city) => (
                <li key={city}>
                  <Link href={`/${cityHubSlug(city)}`} className="text-emerald-500 hover:underline">
                    {city}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ) : (
          <p className="mt-8 text-sm">
            <Link href={`/${stateHubSlug(hub.profile.state)}`} className="font-semibold text-[#cc0000] hover:underline">
              View {hub.profile.state} car accident resources →
            </Link>
          </p>
        )}

        <GeoLatestGuides placeSlug={blogPlaceSlug} placeLabel={name} variant={guideVariant} />

        <section className="mt-12">
          <h2 className={`text-xl font-bold ${isEnrichedCity || isPriorityStateHub ? "text-white" : "text-gray-900"}`}>
            Frequently asked questions — {place}
          </h2>
          <dl className="mt-4 space-y-4">
            {faqs.map((faq) => (
              <div key={faq.question} className="rounded-lg border border-gray-200 bg-white p-4">
                <dt className="font-semibold text-gray-900">{faq.question}</dt>
                <dd className="mt-2 text-sm leading-relaxed text-gray-600">{faq.answer}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="mt-10">
          <h2 className="text-sm font-bold uppercase tracking-wide text-gray-500">Related pages</h2>
          <ul className="mt-3 flex flex-wrap gap-2">
            {related.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="inline-block rounded-full border border-gray-200 bg-white px-3 py-1.5 text-sm text-[#cc0000] hover:bg-gray-50"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section id="form" className="mt-12 scroll-mt-20">
          <h2 className="mb-4 text-center text-xl font-bold text-gray-900">Free attorney matching in {place}</h2>
          <ReferralDisclaimer className="mb-4 border-gray-200 bg-white text-gray-600" />
          <p className="mb-4 text-center text-xs text-slate-500">{WRECKMATCH_PHONE_ACTIVATION_NOTE}</p>
          <LeadForm source={`geo-${hub.slug}`} preselectedState={preselectedState} variant="conversion" />
        </section>

        <p className="mt-8 text-center text-sm text-gray-500">
          <Link href="/blog" className="text-[#cc0000] hover:underline">
            Read our blog
          </Link>
          {" · "}
          <Link href="/advertising-legal-notice" className="text-[#cc0000] hover:underline">
            Advertising & legal notice
          </Link>
        </p>
      </article>
    </div>
  );
}
