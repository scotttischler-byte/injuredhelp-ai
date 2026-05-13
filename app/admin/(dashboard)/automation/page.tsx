const CHANNELS = [
  { key: "reddit", label: "Reddit", path: "/api/automation/reddit" },
  { key: "social", label: "Social (X/FB/Pinterest/LinkedIn)", path: "/api/automation/social" },
  { key: "press", label: "Press releases", path: "/api/automation/press-release" },
  { key: "email", label: "Email sequences", path: "/api/automation/email" },
  { key: "autocomplete", label: "Autocomplete tracker", path: "/api/automation/autocomplete" },
  { key: "outreach", label: "Backlink outreach", path: "/api/automation/outreach" },
  { key: "youtube", label: "YouTube scripts", path: "/api/automation/youtube" },
  { key: "generate", label: "AI content cron", path: "/api/generate-content/cron" },
] as const;

export default function AdminAutomationPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Automation status</h1>
        <p className="mt-2 text-sm text-gray-400">
          Vercel Cron calls these endpoints with <span className="font-mono">Authorization: Bearer CRON_SECRET</span>.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {CHANNELS.map((c) => (
          <div key={c.key} className="rounded-xl border border-gray-800 bg-gray-900/40 p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-lg font-bold text-white">{c.label}</p>
                <p className="mt-2 break-all text-xs text-gray-500">{c.path}</p>
              </div>
              <span className="rounded-full border border-gray-800 bg-gray-950 px-3 py-1 text-xs text-gray-300">
                cron
              </span>
            </div>
            <p className="mt-3 text-sm text-gray-400">
              Enable/disable and rate limits are managed in Settings (stored in <span className="font-mono">automation_settings</span> when configured).
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
