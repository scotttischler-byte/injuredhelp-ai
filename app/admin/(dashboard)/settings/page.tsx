function envOk(name: string) {
  return Boolean(process.env[name]?.trim());
}

export default function AdminSettingsPage() {
  const rows = [
    { name: "DATABASE_URL", ok: envOk("DATABASE_URL") },
    { name: "RESEND_API_KEY", ok: envOk("RESEND_API_KEY") },
    { name: "ANTHROPIC_API_KEY", ok: envOk("ANTHROPIC_API_KEY") },
    { name: "CRON_SECRET", ok: envOk("CRON_SECRET") },
    { name: "CONTENT_API_KEY", ok: envOk("CONTENT_API_KEY") },
    { name: "ADMIN_PASSWORD", ok: envOk("ADMIN_PASSWORD") },
    { name: "REDDIT_CLIENT_ID", ok: envOk("REDDIT_CLIENT_ID") },
    { name: "TWITTER_API_KEY", ok: envOk("TWITTER_API_KEY") },
    { name: "FACEBOOK_PAGE_ACCESS_TOKEN", ok: envOk("FACEBOOK_PAGE_ACCESS_TOKEN") },
    { name: "PINTEREST_ACCESS_TOKEN", ok: envOk("PINTEREST_ACCESS_TOKEN") },
    { name: "LINKEDIN_ACCESS_TOKEN", ok: envOk("LINKEDIN_ACCESS_TOKEN") },
    { name: "PRWEB_API_KEY", ok: envOk("PRWEB_API_KEY") },
    { name: "EIN_PRESSWIRE_API_KEY", ok: envOk("EIN_PRESSWIRE_API_KEY") },
  ] as const;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-white">Settings</h1>
      <p className="text-sm text-gray-400">Environment readiness (values are not shown).</p>
      <div className="overflow-x-auto rounded-xl border border-gray-800">
        <table className="min-w-full divide-y divide-gray-800 text-sm">
          <thead className="bg-gray-900/60 text-left text-xs uppercase tracking-wide text-gray-500">
            <tr>
              <th className="px-4 py-3">Variable</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {rows.map((r) => (
              <tr key={r.name} className="bg-gray-950/30">
                <td className="px-4 py-3 font-mono text-gray-200">{r.name}</td>
                <td className="px-4 py-3">
                  <span className={r.ok ? "text-green-400" : "text-red-400"}>{r.ok ? "connected" : "missing"}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="rounded-xl border border-gray-800 bg-gray-900/40 p-5 text-sm text-gray-300">
        <p className="font-bold text-white">Cron schedule</p>
        <p className="mt-2 text-gray-400">Defined in `vercel.json` for this repo.</p>
      </div>
    </div>
  );
}
