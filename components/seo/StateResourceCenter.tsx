import Link from "next/link";
import { AccidentSurvivalGuideCrossLink } from "@/components/seo/AccidentSurvivalGuideCrossLink";
import { asgLinksForState } from "@/lib/asg-links";
import { stateResourceClusters } from "@/lib/state-resource-clusters";
import { ALL_STATES } from "@/lib/states";
import { stateHubSlug } from "@/lib/geo-routes";

export function StateResourceCenter() {
  const clusters = stateResourceClusters();

  return (
    <div className="space-y-12">
      <section className="rounded-2xl border border-emerald-500/25 bg-gradient-to-br from-slate-900 to-gray-950 p-6 text-white shadow-lg sm:p-8">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-300">Resource center</p>
        <h2 className="mt-2 text-2xl font-extrabold sm:text-3xl">State → city accident help</h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-300 sm:text-base">
          Start with your state hub, then drill into priority metros for local highways, hospitals, insurance
          tactics, and free attorney matching. Sister checklists live on{" "}
          <a
            href="https://www.accidentsurvivalguide.com/resources"
            className="font-semibold text-emerald-300 hover:underline"
            rel="noopener noreferrer"
          >
            Accident Survival Guide
          </a>
          .
        </p>
        <div className="mt-6 flex flex-wrap gap-3 text-sm">
          <Link
            href="/resources"
            className="rounded-lg border border-white/20 bg-white/5 px-4 py-2 font-semibold hover:bg-white/10"
          >
            All guides &amp; downloads →
          </Link>
          <Link
            href="/what-to-do-after-a-car-accident"
            className="rounded-lg border border-white/20 bg-white/5 px-4 py-2 font-semibold hover:bg-white/10"
          >
            What to do after a crash →
          </Link>
        </div>
      </section>

      {clusters.map((cluster) => (
        <section
          key={cluster.state}
          id={cluster.state.toLowerCase().replace(/\s+/g, "-")}
          className="scroll-mt-24 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8"
        >
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h2 className="text-xl font-extrabold text-gray-950 sm:text-2xl">{cluster.state}</h2>
              <p className="mt-1 text-sm text-gray-600">
                {cluster.cities.length} priority metros · state hub + city guides
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link
                href={cluster.stateHubHref}
                className="rounded-lg bg-[#cc0000] px-4 py-2 text-sm font-bold text-white hover:bg-red-700"
              >
                {cluster.state} state hub →
              </Link>
              {cluster.asgHref ? (
                <a
                  href={cluster.asgHref}
                  rel="noopener noreferrer"
                  className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-800 hover:border-emerald-600 hover:text-emerald-700"
                >
                  ASG {cluster.state} guide ↗
                </a>
              ) : null}
            </div>
          </div>

          <ul className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {cluster.cities.map((city) => (
              <li key={city.href}>
                <Link
                  href={city.href}
                  className="flex min-h-[44px] items-center justify-center rounded-lg border border-gray-200 px-2 py-2.5 text-center text-sm font-semibold text-gray-800 transition hover:border-[#cc0000]/40 hover:text-[#cc0000]"
                >
                  {city.label}
                  {city.tier === 1 ? (
                    <span className="sr-only"> (priority metro)</span>
                  ) : null}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}

      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
        <h2 className="text-xl font-extrabold text-gray-950">All 50 states</h2>
        <p className="mt-2 text-sm text-gray-600">
          Every state has a WreckMatch hub. Priority clusters above include enriched city data; other states link
          directly to state-level help.
        </p>
        <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8">
          {ALL_STATES.map((s) => (
            <Link
              key={s.slug}
              href={`/${stateHubSlug(s.state)}`}
              className="rounded-lg border border-gray-200 py-2.5 text-center text-sm font-semibold text-gray-800 hover:border-[#cc0000] hover:text-[#cc0000]"
              title={s.state}
            >
              {s.abbreviation}
            </Link>
          ))}
        </div>
      </section>

      <AccidentSurvivalGuideCrossLink links={asgLinksForState()} />
    </div>
  );
}
