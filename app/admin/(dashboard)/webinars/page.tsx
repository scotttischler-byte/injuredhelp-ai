import Link from "next/link";
import { WEBINARS } from "@/lib/webinars";

export default function AdminWebinarsPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-white">Webinars</h1>
      <p className="text-sm text-gray-400">Public registration pages live under `/webinars`.</p>
      <div className="grid gap-3">
        {WEBINARS.map((w) => (
          <div key={w.slug} className="flex flex-col gap-2 rounded-xl border border-gray-800 bg-gray-900/40 p-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="font-bold text-white">{w.title}</p>
              <p className="text-sm text-gray-400">{w.schedule}</p>
            </div>
            <Link href={`/webinars/${w.slug}`} className="text-sm font-semibold text-red-400 hover:text-red-300">
              View page →
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
