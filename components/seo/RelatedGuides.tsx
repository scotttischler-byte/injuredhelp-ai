import Link from "next/link";

export type RelatedLink = { href: string; label: string };

type Props = { links: RelatedLink[]; title?: string };

export function RelatedGuides({ links, title = "Related guides" }: Props) {
  if (links.length === 0) return null;
  return (
    <section>
      {title ? <h2 className="text-lg font-bold text-white">{title}</h2> : null}
      <ul className={`grid gap-2 sm:grid-cols-2 ${title ? "mt-3" : ""}`}>
        {links.map((l) => {
          const className =
            "flex min-h-[48px] items-center rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-sm font-medium text-emerald-400 hover:bg-slate-800 touch-manipulation";
          return (
            <li key={l.href}>
              {l.href.startsWith("http") ? (
                <a href={l.href} className={className} rel="noopener noreferrer">
                  {l.label}
                </a>
              ) : (
                <Link href={l.href} className={className}>
                  {l.label}
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
