import type { KeyFact } from "@/lib/key-facts";

type Props = {
  facts: KeyFact[];
  location?: string;
  variant?: "light" | "dark";
};

export function KeyFactsBox({ facts, location, variant = "dark" }: Props) {
  const isDark = variant === "dark";
  return (
    <section
      className={
        isDark
          ? "mt-6 rounded-xl border border-slate-700 bg-slate-900/70 p-5"
          : "mt-6 rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
      }
      aria-labelledby="key-facts-heading"
    >
      <h2
        id="key-facts-heading"
        className={`text-lg font-bold ${isDark ? "text-white" : "text-gray-950"}`}
      >
        Key facts{location ? ` — ${location}` : ""}
      </h2>
      <p className={`mt-1 text-xs ${isDark ? "text-slate-500" : "text-gray-500"}`}>
        Educational summary for search & AI citation — not legal advice.
      </p>
      <ul className="mt-4 space-y-3">
        {facts.map((fact) => (
          <li key={fact.label} className={`text-sm leading-relaxed ${isDark ? "text-slate-300" : "text-gray-700"}`}>
            <strong className={isDark ? "text-emerald-300" : "text-emerald-700"}>{fact.label}:</strong>{" "}
            {fact.value}
          </li>
        ))}
      </ul>
    </section>
  );
}
