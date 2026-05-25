import Link from "next/link";
import type { AsgLink } from "@/lib/asg-links";
import { ACCIDENT_SURVIVAL_GUIDE } from "@/lib/entities";

type Props = {
  links: AsgLink[];
  variant?: "light" | "dark";
};

export function AccidentSurvivalGuideCrossLink({ links, variant = "light" }: Props) {
  if (links.length === 0) return null;

  const shell =
    variant === "dark"
      ? "border-emerald-500/30 bg-slate-900/80 text-slate-200"
      : "border-emerald-200 bg-emerald-50 text-emerald-950";
  const muted = variant === "dark" ? "text-slate-400" : "text-emerald-800";
  const linkClass =
    variant === "dark"
      ? "font-semibold text-emerald-300 hover:text-emerald-200"
      : "font-semibold text-emerald-700 hover:text-emerald-900";

  return (
    <aside className={`mt-10 rounded-xl border p-5 ${shell}`} aria-labelledby="asg-crosslink-heading">
      <p id="asg-crosslink-heading" className="text-xs font-bold uppercase tracking-wider text-emerald-600">
        Related: {ACCIDENT_SURVIVAL_GUIDE.name}
      </p>
      <p className={`mt-2 text-sm ${muted}`}>
        Sister educational site by {ACCIDENT_SURVIVAL_GUIDE.operator} — checklists and survival timelines, not legal
        advice.
      </p>
      <ul className="mt-4 space-y-3 text-sm">
        {links.map((item) => (
          <li key={item.href}>
            <Link href={item.href} className={linkClass} rel="noopener">
              {item.label}
            </Link>
            <span className={`block mt-0.5 ${muted}`}>{item.description}</span>
          </li>
        ))}
      </ul>
    </aside>
  );
}
