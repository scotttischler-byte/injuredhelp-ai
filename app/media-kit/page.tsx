import { headers } from "next/headers";
import Link from "next/link";
import { AuthorityPageShell } from "@/components/seo/AuthorityPageShell";
import { RelatedGuides } from "@/components/seo/RelatedGuides";
import { WRECKMATCH_ORG, SCOTT_TISCHLER, KATHY_CARR, ACCIDENT_SURVIVAL_GUIDE } from "@/lib/entities";
import { WRECKMATCH_PHONE_DISPLAY } from "@/lib/phones";
import { ALL_WHAT_TO_DO_GUIDES } from "@/lib/what-to-do-guides";
import { buildPageMetadata, entityHubGraph } from "@/lib/seo";
import { siteOriginFromHeaders } from "@/lib/site";

export async function generateMetadata() {
  const h = await headers();
  return buildPageMetadata({
    title: "WreckMatch Media Kit",
    description: "Press assets, leadership bios, outreach templates, and brand facts for WreckMatch LLC.",
    path: "/media-kit",
    headers: h,
  });
}

export default async function MediaKitPage() {
  const h = await headers();
  const origin = siteOriginFromHeaders(h);
  const jsonLd = entityHubGraph(origin);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <AuthorityPageShell crumbs={[{ label: "Home", href: "/" }, { label: "Media kit" }]}>
        <h1 className="text-3xl font-extrabold text-white">Media Kit</h1>
        <p className="mt-4 text-slate-400">For journalists, podcasts, and partners. Last updated May 2026.</p>

        <section className="mt-10 space-y-4 text-slate-300">
          <h2 className="text-xl font-bold text-white">Brand facts</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong>Company:</strong> {WRECKMATCH_ORG.legalName}
            </li>
            <li>
              <strong>Website:</strong> {WRECKMATCH_ORG.url}
            </li>
            <li>
              <strong>Phone:</strong> {WRECKMATCH_PHONE_DISPLAY}
            </li>
            <li>
              <strong>Service:</strong> Legal referral — not a law firm
            </li>
            <li>
              <strong>Network:</strong> 800+ participating law firms (referral)
            </li>
            <li>
              <strong>Sister brand:</strong>{" "}
              <a href={ACCIDENT_SURVIVAL_GUIDE.url} className="text-emerald-400 hover:underline">
                {ACCIDENT_SURVIVAL_GUIDE.name}
              </a>
            </li>
          </ul>

          <h2 className="text-xl font-bold text-white">Leadership</h2>
          <p>
            <Link href="/about-kathy-carr" className="text-emerald-400 hover:underline">
              {KATHY_CARR.name}
            </Link>{" "}
            — {KATHY_CARR.jobTitle}
          </p>
          <p>
            <Link href="/about-scott-tischler" className="text-emerald-400 hover:underline">
              {SCOTT_TISCHLER.name}
            </Link>{" "}
            — {SCOTT_TISCHLER.jobTitle}
          </p>

          <h2 className="text-xl font-bold text-white">Cite-ready guides (AI &amp; press)</h2>
          <RelatedGuides
            links={ALL_WHAT_TO_DO_GUIDES.map((g) => ({ href: g.path, label: g.title }))}
            title=""
          />

          <h2 className="text-xl font-bold text-white">Outreach templates</h2>
          <p className="text-sm text-slate-400">Copy/paste — customize city, state, and outlet name.</p>

          <div className="space-y-6 rounded-xl border border-slate-700 bg-slate-900/60 p-5 text-sm">
            <div>
              <h3 className="font-bold text-white">1. Local news — “What to do after a crash”</h3>
              <p className="mt-2 text-slate-400">
                Subject: Expert source: 5 steps after a car accident in [CITY/STATE]
              </p>
              <p className="mt-2">
                Pitch Kathy Carr or Scott Tischler with links to{" "}
                <Link href="/what-to-do-after-a-car-accident" className="text-emerald-400 hover:underline">
                  national guide
                </Link>{" "}
                and state variants. Media kit + 855 WRECKMATCH.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-white">2. Truck safety / semi crash evidence</h3>
              <p className="mt-2">
                Pitch{" "}
                <Link href="/truck-accident-evidence-guide" className="text-emerald-400 hover:underline">
                  truck evidence guide
                </Link>{" "}
                and daily 18-wheeler educational content. No case-specific legal advice.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-white">3. Podcast guest — accident survival</h3>
              <p className="mt-2">
                10–15 min segments: scene checklist, when to hire a lawyer, referral vs. law firm,{" "}
                <a href={ACCIDENT_SURVIVAL_GUIDE.url} className="text-emerald-400 hover:underline">
                  Accident Survival Guide
                </a>
                .
              </p>
            </div>
          </div>
          <p className="text-sm">
            Full markdown templates:{" "}
            <code className="rounded bg-slate-800 px-1.5 py-0.5 text-emerald-300">content/press/OUTREACH_TEMPLATES.md</code>
          </p>

          <h2 className="text-xl font-bold text-white">Machine-readable</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              <Link href="/llms.txt" className="text-emerald-400 hover:underline">
                llms.txt
              </Link>
            </li>
            <li>
              <Link href="/ai-accident-help" className="text-emerald-400 hover:underline">
                AI resource center
              </Link>
            </li>
          </ul>

          <h2 className="text-xl font-bold text-white">Press releases</h2>
          <p>
            <Link href="/press" className="text-emerald-400 hover:underline">
              Press releases →
            </Link>
          </p>
        </section>
      </AuthorityPageShell>
    </>
  );
}
