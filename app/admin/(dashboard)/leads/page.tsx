import Link from "next/link";
import { listLeads } from "@/lib/db";

type Props = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function AdminLeadsPage({ searchParams }: Props) {
  const sp = (await searchParams) ?? {};
  const q = typeof sp.q === "string" ? sp.q.trim().toLowerCase() : "";
  const state = typeof sp.state === "string" ? sp.state : "";
  const source = typeof sp.source === "string" ? sp.source : "";

  const rows = await listLeads(800);
  const filtered = rows.filter((l) => {
    if (state && l.state !== state) return false;
    if (source && (l.source ?? "") !== source) return false;
    if (!q) return true;
    const hay = `${l.first_name} ${l.last_name ?? ""} ${l.phone}`.toLowerCase();
    return hay.includes(q);
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Leads</h1>
          <p className="mt-2 text-sm text-gray-400">
            Leads are logged to Neon when forms successfully submit (see <span className="font-mono">/api/leads</span>).
          </p>
        </div>
        <Link
          href="/api/admin/leads/export"
          className="inline-flex items-center justify-center rounded-lg bg-red-600 px-4 py-2 text-sm font-bold text-white hover:bg-red-500"
        >
          Export CSV
        </Link>
      </div>

      <form className="grid gap-3 rounded-xl border border-gray-800 bg-gray-900/40 p-4 md:grid-cols-4" method="get">
        <input
          name="q"
          defaultValue={q}
          placeholder="Search name or phone"
          className="rounded-lg border border-gray-800 bg-gray-950 px-3 py-2 text-sm text-white"
        />
        <input
          name="state"
          defaultValue={state}
          placeholder="Filter state (exact)"
          className="rounded-lg border border-gray-800 bg-gray-950 px-3 py-2 text-sm text-white"
        />
        <input
          name="source"
          defaultValue={source}
          placeholder="Filter source (exact)"
          className="rounded-lg border border-gray-800 bg-gray-950 px-3 py-2 text-sm text-white"
        />
        <button
          type="submit"
          className="rounded-lg border border-gray-800 bg-gray-950 px-3 py-2 text-sm font-semibold text-white hover:border-red-600"
        >
          Apply
        </button>
      </form>

      <div className="overflow-x-auto rounded-xl border border-gray-800">
        <table className="min-w-full divide-y divide-gray-800 text-sm">
          <thead className="bg-gray-900/60 text-left text-xs uppercase tracking-wide text-gray-500">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Phone</th>
              <th className="px-4 py-3">State</th>
              <th className="px-4 py-3">Injuries</th>
              <th className="px-4 py-3">Timing</th>
              <th className="px-4 py-3">Source</th>
              <th className="px-4 py-3">GHL</th>
              <th className="px-4 py-3">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {filtered.map((l) => (
              <tr key={l.id} className="bg-gray-950/30">
                <td className="px-4 py-3 text-white">
                  {l.first_name} {l.last_name ?? ""}
                </td>
                <td className="px-4 py-3 text-gray-200">{l.phone}</td>
                <td className="px-4 py-3 text-gray-200">{l.state}</td>
                <td className="px-4 py-3 text-gray-400">{l.injuries ?? "—"}</td>
                <td className="px-4 py-3 text-gray-400">{l.timing ?? "—"}</td>
                <td className="px-4 py-3 text-gray-400">{l.source ?? "—"}</td>
                <td className="px-4 py-3 text-gray-400">{l.ghl_synced ? "synced" : "unknown"}</td>
                <td className="px-4 py-3 text-gray-500">{new Date(l.created_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
