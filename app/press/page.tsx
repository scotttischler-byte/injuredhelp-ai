import Link from "next/link";
import { headers } from "next/headers";
import { getAllPress } from "@/lib/press";
import { siteOriginFromHeaders } from "@/lib/site";

export const metadata = {
  title: "WreckMatch in the News | Press",
  description: "Press releases, media kit, and contact information for WreckMatch / InjuredHelp.ai.",
};

export default async function PressIndexPage() {
  const items = getAllPress();
  const h = await headers();
  const siteOrigin = siteOriginFromHeaders(h);
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="mx-auto max-w-5xl px-4 py-14">
        <p className="text-xs font-bold uppercase tracking-widest text-red-500">Media</p>
        <h1 className="mt-3 text-4xl font-black">WreckMatch in the News</h1>
        <p className="mt-4 max-w-2xl text-gray-300">
          Official announcements, milestones, and downloadable brand assets for journalists and partners.
        </p>

        <div className="mt-10 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-gray-800 bg-gray-900/30 p-6">
            <h2 className="text-lg font-bold">Press kit</h2>
            <p className="mt-2 text-sm text-gray-400">Placeholder ZIP — add finalized assets in `public/press-kit.zip`.</p>
            <a
              href="/favicon.svg"
              className="mt-4 inline-flex rounded-lg bg-red-600 px-4 py-2 text-sm font-bold text-white hover:bg-red-500"
            >
              Download logo (SVG)
            </a>
          </div>
          <div className="rounded-2xl border border-gray-800 bg-gray-900/30 p-6">
            <h2 className="text-lg font-bold">Media contact</h2>
            <p className="mt-2 text-sm text-gray-300">
              WreckMatch Media Relations
              <br />
              Phone: <a className="text-red-400" href="tel:19785156063">(978) 515-6063</a>
              <br />
              Web: <span className="text-red-400">{siteOrigin}</span>
            </p>
          </div>
        </div>

        <div className="mt-12">
          <h2 className="text-2xl font-bold">Press releases</h2>
          <div className="mt-6 space-y-3">
            {items.length === 0 ? (
              <p className="text-sm text-gray-500">No releases published yet.</p>
            ) : (
              items.map((p) => (
                <Link
                  key={p.slug}
                  href={`/press/${p.slug}`}
                  className="block rounded-2xl border border-gray-800 bg-gray-900/30 p-5 transition-colors hover:border-red-600"
                >
                  <p className="text-xs text-gray-500">{p.date}</p>
                  <p className="mt-2 text-lg font-bold text-white">{p.title}</p>
                  <p className="mt-2 text-sm text-gray-400">{p.description}</p>
                </Link>
              ))
            )}
          </div>
        </div>

        <div className="mt-12 rounded-2xl border border-gray-800 bg-gray-900/30 p-6 text-sm text-gray-300">
          <h3 className="text-lg font-bold text-white">Boilerplate</h3>
          <p className="mt-3">
            WreckMatch connects injured car accident victims with licensed personal injury attorneys nationwide. WreckMatch is a legal referral service, not a law firm, and does not provide legal advice.
          </p>
        </div>
      </div>
    </div>
  );
}
