const PHRASES = [
  "wreckmatch",
  "wreck match attorney",
  "car accident attorney match",
  "injured help",
  "accident survival guide",
  "car accident survival guide",
  "car accident legal help free",
  "free car accident attorney",
  "car accident lawyer free match",
  "injured in car accident help",
] as const;

export default function AdminKeywordsPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-white">Keywords</h1>
      <p className="text-sm text-gray-400">Target autocomplete phrases (mirrors automation tracker list).</p>
      <div className="overflow-x-auto rounded-xl border border-gray-800">
        <table className="min-w-full divide-y divide-gray-800 text-sm">
          <thead className="bg-gray-900/60 text-left text-xs uppercase tracking-wide text-gray-500">
            <tr>
              <th className="px-4 py-3">Phrase</th>
              <th className="px-4 py-3">Notes</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {PHRASES.map((p) => (
              <tr key={p} className="bg-gray-950/30">
                <td className="px-4 py-3 text-white">{p}</td>
                <td className="px-4 py-3 text-gray-400">Tracked daily via Google Suggest proxy</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
