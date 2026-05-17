import Link from "next/link";
import { ReferralDisclaimer } from "@/components/ReferralDisclaimer";
import { LeadForm } from "@/components/LeadForm";
import { SiteHeader } from "@/components/SiteHeader";
import { WRECKMATCH_PHONE_DISPLAY, WRECKMATCH_PHONE_TEL } from "@/lib/compliance";
import {
  buildGeoFaqs,
  buildGeoSections,
  geoKeywords,
  geoPlaceLabel,
  geoRelatedLinks,
} from "@/lib/geo-content";
import type { GeoHub } from "@/lib/geo-routes";
import { cityHubSlug, stateHubSlug } from "@/lib/geo-routes";

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

  const title = isState
    ? `Car Accident Help in ${name}`
    : `Car Accident Help in ${name}, ${hub.profile.state}`;

  const intro = isState
    ? `Injured in a ${name} car crash? WreckMatch connects accident victims with experienced personal injury attorneys in ${name} at no upfront cost. We are a referral service operated by WreckMatch LLC — not a law firm. We call you back within 60 seconds.`
    : `${name} sees heavy traffic and serious crashes every year. If you were hurt in a ${name} accident, WreckMatch connects you with licensed ${hub.profile.state} attorneys at no upfront cost — we are not a law firm.`;

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      <SiteHeader />
      <article className="mx-auto max-w-3xl px-4 py-10 sm:py-14">
        <nav className="mb-6 text-sm text-gray-500">
          <Link href="/" className="hover:text-[#cc0000]">
            Home
          </Link>
          <span className="mx-2">/</span>
          <Link href="/states" className="hover:text-[#cc0000]">
            States
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-800">{name}</span>
        </nav>

        <h1 className="text-3xl font-extrabold tracking-tight text-gray-950 sm:text-4xl">{title}</h1>
        <p className="mt-4 text-lg leading-relaxed text-gray-600">{intro}</p>
        <p className="mt-2 text-xs text-gray-500">
          {keywords.slice(0, 3).join(" · ")}
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <a
            href={WRECKMATCH_PHONE_TEL}
            className="inline-flex items-center rounded-xl bg-[#cc0000] px-5 py-3 font-bold text-white hover:bg-[#b30000]"
          >
            Call {WRECKMATCH_PHONE_DISPLAY}
          </a>
          <a
            href="#form"
            className="inline-flex items-center rounded-xl border border-gray-300 bg-white px-5 py-3 font-semibold text-gray-900 hover:bg-gray-50"
          >
            Get matched free →
          </a>
        </div>

        <ReferralDisclaimer variant="primary" className="mt-8 border-gray-200 bg-white text-gray-600" />

        {sections.map((section) => (
          <section key={section.id} className="prose prose-gray mt-10 max-w-none">
            <h2>{section.title}</h2>
            {section.paragraphs.map((p) => (
              <p key={p.slice(0, 40)}>{p}</p>
            ))}
          </section>
        ))}

        {isState ? (
          <section className="mt-10">
            <h2 className="text-xl font-bold text-gray-900">Major cities we serve in {name}</h2>
            <ul className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
              {hub.profile.majorCities.map((city) => (
                <li key={city}>
                  <Link href={`/${cityHubSlug(city)}`} className="text-[#cc0000] hover:underline">
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

        <section className="mt-12">
          <h2 className="text-xl font-bold text-gray-900">Frequently asked questions — {place}</h2>
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
          <LeadForm source={`geo-${hub.slug}`} preselectedState={preselectedState} />
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
