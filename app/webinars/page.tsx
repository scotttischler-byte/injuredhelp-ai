import Link from "next/link";
import { WEBINARS } from "@/lib/webinars";

export const metadata = {
  title: "Free Weekly Webinars | WreckMatch",
  description: "Free weekly webinars for accident victims — practical guidance, no fluff.",
};

function nextTuesdayCT() {
  const now = new Date();
  const day = now.getUTCDay();
  const daysUntilTuesday = (2 + 7 - day) % 7;
  const target = new Date(now);
  target.setUTCDate(now.getUTCDate() + (daysUntilTuesday === 0 ? 7 : daysUntilTuesday));
  target.setUTCHours(1, 0, 0, 0);
  return target;
}

export default function WebinarsHubPage() {
  const next = nextTuesdayCT();
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="border-b border-gray-800 bg-gray-950">
        <div className="mx-auto max-w-5xl px-4 py-14">
          <p className="text-xs font-bold uppercase tracking-widest text-red-500">Free weekly webinars</p>
          <h1 className="mt-3 text-4xl font-black sm:text-5xl">Free Weekly Webinars for Accident Victims</h1>
          <p className="mt-4 max-w-2xl text-lg text-gray-300">Every Tuesday at 7:00pm CT — practical guidance you can use immediately.</p>
          <div className="mt-8 rounded-2xl border border-gray-800 bg-gray-900/40 p-6">
            <p className="text-sm font-semibold text-gray-400">Next session starts (approx.)</p>
            <p className="mt-2 text-2xl font-bold text-white">{next.toUTCString()}</p>
            <p className="mt-2 text-xs text-gray-500">Timer uses a simple UTC estimate — swap for a precise CT countdown later.</p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-12">
        <h2 className="text-2xl font-bold">Upcoming topics</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {WEBINARS.map((w) => (
            <Link
              key={w.slug}
              href={`/webinars/${w.slug}`}
              className="rounded-2xl border border-gray-800 bg-gray-900/30 p-6 transition-colors hover:border-red-600"
            >
              <p className="text-lg font-bold text-white">{w.title}</p>
              <p className="mt-2 text-sm text-gray-400">{w.description}</p>
              <p className="mt-4 text-xs font-semibold text-red-400">{w.schedule}</p>
            </Link>
          ))}
        </div>

        <div className="mt-14 rounded-2xl border border-gray-800 bg-gray-900/30 p-6">
          <h3 className="text-xl font-bold">FAQ</h3>
          <div className="mt-4 space-y-3 text-sm text-gray-300">
            <p>
              <span className="font-semibold text-white">Is it really free?</span> Yes — WreckMatch hosts educational webinars for accident victims.
            </p>
            <p>
              <span className="font-semibold text-white">Do I need a lawyer to attend?</span> No. This is general information, not legal advice.
            </p>
            <p>
              <span className="font-semibold text-white">Will I get a replay?</span> Replays are emailed when available for that session.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
