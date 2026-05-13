import { listContentQueue } from "@/lib/db";
import { AdminAddTopicForm } from "@/components/admin/AdminAddTopicForm";

export default async function AdminContentPage() {
  const items = await listContentQueue(300);
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Content queue</h1>
        <p className="mt-2 text-sm text-gray-400">Track generated assets and publishing status.</p>
      </div>

      <AdminAddTopicForm />

      <div className="overflow-x-auto rounded-xl border border-gray-800">
        <table className="min-w-full divide-y divide-gray-800 text-sm">
          <thead className="bg-gray-900/60 text-left text-xs uppercase tracking-wide text-gray-500">
            <tr>
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">Topic</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">State</th>
              <th className="px-4 py-3">City</th>
              <th className="px-4 py-3">Created</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {items.map((i) => (
              <tr key={i.id} className="bg-gray-950/30">
                <td className="px-4 py-3 text-gray-400">{i.id}</td>
                <td className="px-4 py-3 text-white">{i.topic}</td>
                <td className="px-4 py-3 text-gray-300">{i.type}</td>
                <td className="px-4 py-3 text-gray-300">{i.status}</td>
                <td className="px-4 py-3 text-gray-400">{i.state ?? "—"}</td>
                <td className="px-4 py-3 text-gray-400">{i.city ?? "—"}</td>
                <td className="px-4 py-3 text-gray-500">{new Date(i.created_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
