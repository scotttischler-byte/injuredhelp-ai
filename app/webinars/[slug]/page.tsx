import Link from "next/link";
import { notFound } from "next/navigation";
import { WebinarRegisterForm } from "@/components/webinars/WebinarRegisterForm";
import { getWebinarBySlug } from "@/lib/webinars";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const w = getWebinarBySlug(slug);
  if (!w) return { title: "Webinar | WreckMatch" };
  return { title: `${w.title} | WreckMatch Webinars` };
}

export default async function WebinarDetailPage({ params }: Props) {
  const { slug } = await params;
  const w = getWebinarBySlug(slug);
  if (!w) notFound();

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="border-b border-gray-800">
        <div className="mx-auto max-w-3xl px-4 py-10">
          <Link href="/webinars" className="text-sm font-semibold text-red-400 hover:text-red-300">
            ← All webinars
          </Link>
          <h1 className="mt-4 text-3xl font-black sm:text-4xl">{w.title}</h1>
          <p className="mt-3 text-gray-300">{w.description}</p>
          <p className="mt-4 text-sm font-semibold text-gray-400">{w.schedule}</p>
        </div>
      </div>

      <div className="mx-auto grid max-w-3xl gap-8 px-4 py-10 md:grid-cols-2">
        <div className="rounded-2xl border border-gray-800 bg-gray-900/30 p-6">
          <p className="text-xs font-bold uppercase tracking-widest text-red-500">Registration</p>
          <h2 className="mt-2 text-xl font-bold">Save your seat</h2>
          <WebinarRegisterForm slug={slug} />
        </div>
        <div className="rounded-2xl border border-gray-800 bg-gray-900/30 p-6">
          <p className="text-xs font-bold uppercase tracking-widest text-gray-500">Replay</p>
          <h2 className="mt-2 text-xl font-bold">After the live session</h2>
          <p className="mt-3 text-sm text-gray-400">
            Replays are distributed by email when available. This page is a registration-focused placeholder for video embeds.
          </p>
          <div className="mt-6 aspect-video rounded-xl border border-dashed border-gray-700 bg-gray-950/40 p-4 text-sm text-gray-500">
            Video embed placeholder
          </div>
        </div>
      </div>
    </div>
  );
}
