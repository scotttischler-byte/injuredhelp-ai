export default function AdminSeoPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-white">SEO signals</h1>
      <p className="text-sm text-gray-400">
        Placeholder dashboard for keyword positions, Search Console import, and backlink totals. Wire these to your
        reporting warehouse when ready.
      </p>
      <div className="rounded-xl border border-gray-800 bg-gray-900/40 p-6 text-sm text-gray-400">
        No external SEO APIs are connected in this build yet. Autocomplete tracking runs daily via{" "}
        <span className="font-mono">/api/automation/autocomplete</span> and stores rows in{" "}
        <span className="font-mono">autocomplete_tracking</span>.
      </div>
    </div>
  );
}
