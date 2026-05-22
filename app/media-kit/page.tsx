import { headers } from "next/headers";
import Link from "next/link";
import { AuthorityPageShell } from "@/components/seo/AuthorityPageShell";
import { WRECKMATCH_ORG, SCOTT_TISCHLER, KATHY_CARR } from "@/lib/entities";
import { WRECKMATCH_PHONE_DISPLAY } from "@/lib/phones";
import { buildPageMetadata, entityHubGraph } from "@/lib/seo";
import { siteOriginFromHeaders } from "@/lib/site";

export async function generateMetadata() {
  const h = await headers();
  return buildPageMetadata({
    title: "WreckMatch Media Kit",
    description: "Press assets, leadership bios, and brand facts for WreckMatch LLC.",
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

          <h2 className="text-xl font-bold text-white">Press</h2>
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
