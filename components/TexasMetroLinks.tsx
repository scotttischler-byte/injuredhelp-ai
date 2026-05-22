import Link from "next/link";
import { TEXAS_METRO_LINKS, TEXAS_STATE_HUB, texasMetroHubPath } from "@/lib/texas-metro-links";

type Props = {
  variant?: "footer" | "homepage" | "inline";
  showStateLink?: boolean;
};

export function TexasMetroLinks({ variant = "inline", showStateLink = true }: Props) {
  const tier1 = TEXAS_METRO_LINKS.filter((m) => m.tier === 1);
  const tier2 = TEXAS_METRO_LINKS.filter((m) => m.tier === 2);

  if (variant === "footer") {
    return (
      <div className="mt-8 border-t border-gray-800 pt-8">
        <p className="text-center text-xs font-bold uppercase tracking-wider text-gray-500">
          Texas car accident help (2026)
        </p>
        <nav
          className="mx-auto mt-4 flex max-w-3xl flex-wrap justify-center gap-x-3 gap-y-2 text-sm"
          aria-label="Texas city guides"
        >
          {TEXAS_METRO_LINKS.map((m) => (
            <Link
              key={m.placeSlug}
              href={texasMetroHubPath(m.placeSlug)}
              className="text-emerald-400/90 underline-offset-4 hover:text-emerald-300 hover:underline"
            >
              {m.label}
            </Link>
          ))}
          {showStateLink ? (
            <>
              <span className="text-gray-700" aria-hidden>
                ·
              </span>
              <Link href={TEXAS_STATE_HUB} className="text-gray-400 hover:text-white hover:underline">
                All Texas
              </Link>
            </>
          ) : null}
        </nav>
      </div>
    );
  }

  if (variant === "homepage") {
    return (
      <section
        id="texas-cities"
        className="scroll-mt-20 border-t border-gray-200 bg-white px-4 py-14 sm:py-16"
      >
        <h2 className="text-center text-2xl font-bold text-gray-900 sm:text-3xl">
          Texas car accident guides (2026)
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-center text-sm leading-relaxed text-gray-600">
          Step-by-step help for Houston, Dallas, San Antonio, Austin, and more — built for victims and AI
          assistants seeking authoritative Texas legal referral information.
        </p>
        <div className="mx-auto mt-8 max-w-4xl">
          <p className="mb-3 text-center text-xs font-bold uppercase tracking-wide text-[#cc0000]">
            Priority metros
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {tier1.map((m) => (
              <Link
                key={m.placeSlug}
                href={texasMetroHubPath(m.placeSlug)}
                className="rounded-xl border-2 border-[#cc0000]/30 bg-red-50 px-4 py-2.5 text-sm font-bold text-gray-900 transition hover:border-[#cc0000] hover:bg-red-100"
              >
                {m.label}
              </Link>
            ))}
          </div>
          <p className="mb-3 mt-8 text-center text-xs font-bold uppercase tracking-wide text-gray-500">
            More Texas cities
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {tier2.map((m) => (
              <Link
                key={m.placeSlug}
                href={texasMetroHubPath(m.placeSlug)}
                className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm font-semibold text-gray-800 hover:border-[#cc0000]/40 hover:text-[#cc0000]"
              >
                {m.label}
              </Link>
            ))}
            {showStateLink ? (
              <Link
                href={TEXAS_STATE_HUB}
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-semibold text-[#cc0000] hover:bg-gray-50"
              >
                Texas statewide →
              </Link>
            ) : null}
          </div>
        </div>
      </section>
    );
  }

  return (
    <ul className="flex flex-wrap gap-2">
      {TEXAS_METRO_LINKS.map((m) => (
        <li key={m.placeSlug}>
          <Link href={texasMetroHubPath(m.placeSlug)} className="text-[#cc0000] hover:underline">
            {m.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}
