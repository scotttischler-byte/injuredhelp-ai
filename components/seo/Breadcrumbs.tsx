import Link from "next/link";

export type Crumb = { label: string; href?: string };

type Props = { items: Crumb[]; className?: string };

export function Breadcrumbs({ items, className = "" }: Props) {
  return (
    <nav aria-label="Breadcrumb" className={`text-sm text-slate-400 ${className}`}>
      <ol className="flex flex-wrap items-center gap-1">
        {items.map((item, i) => (
          <li key={`${item.label}-${i}`} className="flex items-center gap-1">
            {i > 0 ? <span aria-hidden className="text-slate-600">/</span> : null}
            {item.href ? (
              <Link href={item.href} className="min-h-[44px] inline-flex items-center hover:text-emerald-400 touch-manipulation">
                {item.label}
              </Link>
            ) : (
              <span className="text-slate-200">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
