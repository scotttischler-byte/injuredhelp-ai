import Link from "next/link";
import { ReferralDisclaimer } from "@/components/ReferralDisclaimer";
import { LeadForm } from "@/components/LeadForm";
import { SiteHeader } from "@/components/SiteHeader";
import { WRECKMATCH_PHONE_DISPLAY, WRECKMATCH_PHONE_TEL } from "@/lib/compliance";
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

  const title = isState
    ? `Car Accident Help in ${name}`
    : `Car Accident Help in ${name}, ${hub.profile.state}`;

  const intro = isState
    ? `Injured in a ${name} car crash? WreckMatch is a free legal referral service — not a law firm — that connects you with a licensed personal injury attorney in ${name}. We call you back within 60 seconds.`
    : `${name} sees heavy traffic and serious crashes every year. If you were hurt in a ${name} accident, WreckMatch connects you with licensed ${hub.profile.state} attorneys at no upfront cost.`;

  const localTip = isState ? hub.profile.localTip : hub.profile.localTip;
  const sol = isState ? hub.profile.statuteOfLimitationsYears : undefined;

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

        <ReferralDisclaimer className="mt-8 border-gray-200 bg-white text-gray-600" />

        <section className="prose prose-gray mt-10 max-w-none">
          <h2>What to do after a crash in {name}</h2>
          <p>{localTip}</p>
          {sol ? (
            <p>
              <strong>Statute of limitations:</strong> Many {name} injury claims must be filed within about{" "}
              {sol} years, but deadlines vary — speak with an attorney promptly.
            </p>
          ) : null}
          {isState ? (
            <>
              <h2>Major cities we serve in {name}</h2>
              <ul>
                {hub.profile.majorCities.slice(0, 8).map((city) => (
                  <li key={city}>
                    <Link href={`/${cityHubSlug(city)}`} className="text-[#cc0000] hover:underline">
                      Car accident help in {city}
                    </Link>
                  </li>
                ))}
              </ul>
              <p>
                <strong>Average settlement range (informational):</strong> {hub.profile.avgSettlementRange}.
                Not a guarantee for your case.
              </p>
            </>
          ) : (
            <p>
              <Link href={`/${stateHubSlug(hub.profile.state)}`} className="text-[#cc0000] hover:underline">
                View {hub.profile.state} car accident resources →
              </Link>
            </p>
          )}
        </section>

        <section id="form" className="mt-12 scroll-mt-20">
          <h2 className="mb-4 text-center text-xl font-bold text-gray-900">Free attorney matching in {name}</h2>
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
