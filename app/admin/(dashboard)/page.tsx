import Link from "next/link";
import {
  contentStats,
  getSql,
  leadStats,
  recentAutomationLogs,
  signalStatsToday,
  subscriberStats,
} from "@/lib/db";

export default async function AdminOverviewPage() {
  const sqlConfigured = Boolean(getSql());
  const leads = sqlConfigured ? await leadStats() : { total: 0, today: 0, guideDownloads: 0 };
  const content = sqlConfigured ? await contentStats() : { published: 0, pending: 0 };
  const subs = sqlConfigured ? await subscriberStats() : { active: 0 };
  const signals = sqlConfigured ? await signalStatsToday() : 0;
  const logs = sqlConfigured ? await recentAutomationLogs(20) : [];

  const cards = [
    { label: "Total leads captured", value: leads.total },
    { label: "Leads today", value: leads.today },
    { label: "Published content pieces", value: content.published },
    { label: "Signals logged today", value: signals },
    { label: "Guide downloads (DB)", value: leads.guideDownloads },
    { label: "Active email subscribers", value: subs.active },
  ] as const;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Overview</h1>
        <p className="mt-2 text-sm text-gray-400">
          Operational snapshot for WreckMatch automation. Connect <span className="font-mono">DATABASE_URL</span>{" "}
          and run the SQL migration in <span className="font-mono">lib/migrations/001_automation.sql</span>.
        </p>
      </div>

      {!sqlConfigured ? (
        <div className="rounded-xl border border-amber-500/40 bg-amber-500/10 p-4 text-sm text-amber-100">
          Database is not configured — metrics will stay at zero until <span className="font-mono">DATABASE_URL</span>{" "}
          is set.
        </div>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {cards.map((c) => (
          <div key={c.label} className="rounded-xl border border-gray-800 bg-gray-900/40 p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">{c.label}</p>
            <p className="mt-3 text-3xl font-black text-white">{c.value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-gray-800 bg-gray-900/40 p-5">
          <h2 className="text-lg font-bold text-white">Live activity</h2>
          <p className="mt-1 text-xs text-gray-500">Last 20 automation log rows</p>
          <div className="mt-4 space-y-3">
            {logs.length === 0 ? (
              <p className="text-sm text-gray-500">No automation logs yet.</p>
            ) : (
              logs.map((l) => (
                <div key={l.id} className="rounded-lg border border-gray-800 bg-gray-950/40 p-3 text-sm">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-semibold text-white">{l.channel}</span>
                    <span className="text-xs text-gray-500">{new Date(l.created_at).toLocaleString()}</span>
                  </div>
                  <p className="mt-1 text-gray-300">{l.action}</p>
                  <p className="mt-1 text-xs text-gray-500">Status: {l.status}</p>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="rounded-xl border border-gray-800 bg-gray-900/40 p-5">
          <h2 className="text-lg font-bold text-white">Quick actions</h2>
          <div className="mt-4 grid gap-3">
            <Link
              href="/admin/content"
              className="rounded-lg border border-gray-800 bg-gray-950 px-4 py-3 text-sm font-semibold text-white hover:border-red-600"
            >
              Manage content queue
            </Link>
            <Link
              href="/admin/automation"
              className="rounded-lg border border-gray-800 bg-gray-950 px-4 py-3 text-sm font-semibold text-white hover:border-red-600"
            >
              Review automation channels
            </Link>
            <Link
              href="/admin/leads"
              className="rounded-lg border border-gray-800 bg-gray-950 px-4 py-3 text-sm font-semibold text-white hover:border-red-600"
            >
              View + export leads
            </Link>
            <Link
              href="/admin/webinars"
              className="rounded-lg border border-gray-800 bg-gray-950 px-4 py-3 text-sm font-semibold text-white hover:border-red-600"
            >
              Webinar schedule
            </Link>
          </div>
          <p className="mt-4 text-xs text-gray-500">
            Scheduled jobs are triggered by Vercel Cron using <span className="font-mono">Authorization: Bearer CRON_SECRET</span>.
          </p>
        </div>
      </div>
    </div>
  );
}
