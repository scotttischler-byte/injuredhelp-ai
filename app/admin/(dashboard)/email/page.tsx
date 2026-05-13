import { getSql, listSubscribersDueForEmail, type SubscriberRow } from "@/lib/db";

export default async function AdminEmailPage() {
  const sql = getSql();
  const subs = sql ? await listSubscribersDueForEmail(200) : [];

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-white">Email sequences</h1>
      <p className="text-sm text-gray-400">
        Hourly automation sends nurture emails via Resend when <span className="font-mono">RESEND_API_KEY</span> is set.
      </p>
      {!sql ? (
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-100">
          DATABASE_URL is not configured.
        </div>
      ) : null}
      <div className="overflow-x-auto rounded-xl border border-gray-800">
        <table className="min-w-full divide-y divide-gray-800 text-sm">
          <thead className="bg-gray-900/60 text-left text-xs uppercase tracking-wide text-gray-500">
            <tr>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Sequence</th>
              <th className="px-4 py-3">Day</th>
              <th className="px-4 py-3">Last sent</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {subs.map((s: SubscriberRow) => (
              <tr key={s.id} className="bg-gray-950/30">
                <td className="px-4 py-3 text-white">{s.email}</td>
                <td className="px-4 py-3 text-gray-300">{s.first_name ?? "—"}</td>
                <td className="px-4 py-3 text-gray-300">{s.sequence_name ?? "main"}</td>
                <td className="px-4 py-3 text-gray-300">{s.sequence_day ?? 0}</td>
                <td className="px-4 py-3 text-gray-500">{s.last_email_sent ? new Date(s.last_email_sent).toLocaleString() : "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
