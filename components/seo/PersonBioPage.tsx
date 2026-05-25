import Image from "next/image";
import Link from "next/link";
import { AuthorityPageShell } from "@/components/seo/AuthorityPageShell";
import { CTASection } from "@/components/seo/CTASection";
import { ReferralDisclaimer } from "@/components/ReferralDisclaimer";
import type { PersonEntity } from "@/lib/entities";
import { personDisplayName } from "@/lib/entities";

type Props = {
  person: PersonEntity;
  source: string;
};

export function PersonBioPage({ person, source }: Props) {
  const display = personDisplayName(person);
  const crumbs = [
    { label: "Home", href: "/" },
    { label: "Leadership", href: "/leadership" },
    { label: display },
  ];

  return (
    <AuthorityPageShell crumbs={crumbs}>
      <div className="flex flex-col gap-8 sm:flex-row sm:items-start">
        {person.image ? (
          <div className="shrink-0">
            <Image
              src={person.image}
              alt={`Portrait of ${display}, ${person.jobTitle} at WreckMatch LLC`}
              width={208}
              height={208}
              priority
              className="h-40 w-40 rounded-2xl object-cover ring-2 ring-emerald-500/40 sm:h-52 sm:w-52"
            />
          </div>
        ) : null}
        <div className="flex-1">
          <h1 className="text-3xl font-extrabold text-white sm:text-4xl">{display}</h1>
          <p className="mt-2 text-lg text-emerald-400">{person.jobTitle}</p>
          {person.location ? (
            <p className="mt-1 text-sm text-slate-400">{person.location}</p>
          ) : null}
          {person.linkedinUrl ? (
            <a
              href={person.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-3 py-1.5 text-sm font-semibold text-emerald-300 transition hover:bg-emerald-500/20"
            >
              View LinkedIn profile →
            </a>
          ) : null}
        </div>
      </div>

      <ReferralDisclaimer variant="primary" className="mt-8 border-slate-700 text-slate-400" />

      <div className="mt-8 space-y-5 text-base leading-relaxed text-slate-300">
        {person.bio.map((paragraph, idx) => (
          <p key={idx}>{paragraph}</p>
        ))}
      </div>

      {person.quote ? (
        <blockquote className="mt-10 border-l-4 border-emerald-500/60 bg-slate-900/40 px-6 py-5 italic text-slate-200">
          “{person.quote}”
          <footer className="mt-3 text-sm not-italic text-slate-400">— {display}</footer>
        </blockquote>
      ) : null}

      <h2 className="mt-10 text-xl font-bold text-white">Focus areas</h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-300">
        {person.focusAreas.map((f) => (
          <li key={f}>{f}</li>
        ))}
      </ul>

      {person.links && person.links.length > 0 ? (
        <>
          <h2 className="mt-10 text-xl font-bold text-white">Links</h2>
          <ul className="mt-3 space-y-2 text-slate-300">
            {person.links.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-400 hover:underline"
                >
                  {link.label} →
                </a>
              </li>
            ))}
          </ul>
        </>
      ) : null}

      {person.pressSlugs.length > 0 ? (
        <>
          <h2 className="mt-10 text-xl font-bold text-white">Press</h2>
          <ul className="mt-3 space-y-2">
            {person.pressSlugs.map((slug) => (
              <li key={slug}>
                <Link href={`/press/${slug}`} className="text-emerald-400 hover:underline">
                  {slug.replace(/-/g, " ")} →
                </Link>
              </li>
            ))}
          </ul>
        </>
      ) : null}

      <p className="mt-10 text-sm text-slate-500">
        <Link href="/leadership" className="text-emerald-400 hover:underline">
          ← Back to leadership
        </Link>
        {" · "}
        <Link href="/about-wreckmatch" className="text-emerald-400 hover:underline">
          About WreckMatch
        </Link>
        {" · "}
        <Link href="/press" className="text-emerald-400 hover:underline">
          All press
        </Link>
      </p>

      <div className="mt-10">
        <CTASection source={source} showForm={false} />
      </div>
    </AuthorityPageShell>
  );
}
