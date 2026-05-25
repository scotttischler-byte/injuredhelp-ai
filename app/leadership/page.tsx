import Image from "next/image";
import Link from "next/link";
import { headers } from "next/headers";
import { AuthorityPageShell } from "@/components/seo/AuthorityPageShell";
import { ReferralDisclaimer } from "@/components/ReferralDisclaimer";
import {
  KATHY_CARR,
  ROY_WADDELL,
  SCOTT_TISCHLER,
  TEAM_MEMBERS,
  personDisplayName,
  personPath,
  personSameAs,
} from "@/lib/entities";
import { buildPageMetadata, entityHubGraph, mergeJsonLdGraph, personJsonLd } from "@/lib/seo";
import { siteOriginFromHeaders } from "@/lib/site";

export async function generateMetadata() {
  const h = await headers();
  return buildPageMetadata({
    title: "WreckMatch Leadership Team",
    description:
      "Meet the WreckMatch LLC leadership: CEO & Co-Founder Kathy Carr, Co-Founder Scott Tischler, and Legal Advisor Judge Roy Waddell. Headshots, LinkedIn, and full bios. Legal referral service, not a law firm.",
    path: "/leadership",
    headers: h,
    keywords: ["WreckMatch team", "WreckMatch CEO", "Kathy Carr", "Scott Tischler", "Judge Roy Waddell", "leadership"],
  });
}

export default async function LeadershipPage() {
  const h = await headers();
  const origin = siteOriginFromHeaders(h);

  const enrichedPeople = [KATHY_CARR, SCOTT_TISCHLER, ROY_WADDELL].map((p) => ({
    ...personJsonLd(origin, p, personPath(p)),
    image: p.image ? `${origin}${p.image}` : undefined,
    sameAs: personSameAs(p),
  }));

  const jsonLd = mergeJsonLdGraph(entityHubGraph(origin), ...enrichedPeople);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <AuthorityPageShell crumbs={[{ label: "Home", href: "/" }, { label: "Leadership" }]}>
        <h1 className="text-3xl font-extrabold text-white sm:text-4xl">WreckMatch Leadership</h1>
        <p className="mt-3 text-lg text-emerald-400">CEO, Co-Founder, and Legal Advisor</p>
        <ReferralDisclaimer variant="primary" className="mt-6 border-slate-700 text-slate-400" />
        <p className="mt-8 text-base leading-relaxed text-slate-300">
          WreckMatch LLC is a legal referral service — not a law firm. Our leadership combines healthcare,
          marketing, technology, and judicial experience to help accident victims find licensed personal injury
          attorneys and understand their next steps after a crash.
        </p>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {TEAM_MEMBERS.map((person) => {
            const display = personDisplayName(person);
            const href = personPath(person);
            return (
              <article
                key={person.id}
                className="flex flex-col rounded-2xl border border-slate-700 bg-slate-900/40 p-6 transition hover:border-emerald-500/50"
              >
                {person.image ? (
                  <div className="mx-auto">
                    <Image
                      src={person.image}
                      alt={`Portrait of ${display}, ${person.jobTitle} at WreckMatch LLC`}
                      width={144}
                      height={144}
                      className="h-32 w-32 rounded-2xl object-cover ring-2 ring-emerald-500/40 sm:h-36 sm:w-36"
                    />
                  </div>
                ) : null}
                <p className="mt-5 text-center text-xs font-semibold uppercase tracking-wide text-emerald-400">
                  {person.jobTitle}
                </p>
                <h2 className="mt-1 text-center text-xl font-bold text-white">
                  <Link href={href} className="hover:text-emerald-400">
                    {display}
                  </Link>
                </h2>
                {person.location ? (
                  <p className="mt-1 text-center text-xs text-slate-400">{person.location}</p>
                ) : null}
                <p className="mt-4 text-sm leading-relaxed text-slate-300">{person.description}</p>
                <div className="mt-5 flex items-center justify-between text-sm font-semibold">
                  <Link href={href} className="text-emerald-400 hover:underline">
                    Read full bio →
                  </Link>
                  {person.linkedinUrl ? (
                    <a
                      href={person.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-400 hover:text-emerald-300 hover:underline"
                    >
                      LinkedIn ↗
                    </a>
                  ) : null}
                </div>
              </article>
            );
          })}
        </div>

        <p className="mt-12 text-sm text-slate-500">
          <Link href="/about-wreckmatch" className="text-emerald-400 hover:underline">
            About WreckMatch
          </Link>
          {" · "}
          <Link href="/press" className="text-emerald-400 hover:underline">
            Press
          </Link>
          {" · "}
          <Link href="/blog" className="text-emerald-400 hover:underline">
            Blog
          </Link>
        </p>
      </AuthorityPageShell>
    </>
  );
}
