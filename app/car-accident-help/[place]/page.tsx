import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { GeoHubContent } from "@/components/GeoHubContent";
import { getAllGeoHubSlugs, getGeoHubBySlug } from "@/lib/geo-routes";
import { buildGeoFaqs } from "@/lib/geo-content";
import {
  breadcrumbJsonLd,
  buildPageMetadata,
  faqPageJsonLd,
  howToJsonLd,
  localBusinessJsonLd,
  mergeJsonLdGraph,
  siteJsonLdGraph,
} from "@/lib/seo";
import { texasCitySlugFromHubSlug } from "@/lib/texas-city-content";
import { brandFromHeaders } from "@/lib/site";
import { headers } from "next/headers";

type Props = { params: Promise<{ place: string }> };

function resolveHub(place: string) {
  const slug = `car-accident-help-${place}`;
  return getGeoHubBySlug(slug);
}

export const dynamicParams = true;

export async function generateStaticParams() {
  const slugs = getAllGeoHubSlugs();
  return slugs.map((slug) => ({
    place: slug.replace(/^car-accident-help-/, ""),
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { place } = await params;
  const hub = resolveHub(place);
  if (!hub) return {};
  const h = await headers();
  const name = hub.type === "state" ? hub.profile.state : `${hub.profile.city}, ${hub.profile.state}`;
  const tcSlug = hub.type === "city" ? texasCitySlugFromHubSlug(hub.slug) : null;
  const title =
    hub.type === "state"
      ? `Car Accident Lawyer Referral in ${hub.profile.state} | WreckMatch`
      : tcSlug
        ? `What to Do After a Car Accident in ${hub.profile.city}, Texas (2026) | WreckMatch`
        : `Car Accident Help in ${hub.profile.city}, ${hub.profile.state} | WreckMatch`;
  const description =
    hub.type === "city" && tcSlug
      ? `Step-by-step ${hub.profile.city} car accident guide: Texas 2-year SOL, insurance tactics, common mistakes, and free attorney matching. Not legal advice.`
      : `Free legal referral after a car accident in ${name}. WreckMatch is not a law firm — we connect you with licensed attorneys in 60 seconds. Call (855) 897-3256.`;
  return buildPageMetadata({
    title,
    description,
    path: `/car-accident-help-${place}`,
    headers: h,
  });
}

export default async function GeoHubPage({ params }: Props) {
  const { place } = await params;
  const hub = resolveHub(place);
  if (!hub) notFound();

  const h = await headers();
  const brand = brandFromHeaders(h);
  const origin = (await import("@/lib/site")).siteOriginFromHeaders(h);
  const faqs = buildGeoFaqs(hub);
  const tcSlug = hub.type === "city" ? texasCitySlugFromHubSlug(hub.slug) : null;
  const graphs: Record<string, unknown>[] = [siteJsonLdGraph(origin, brand), faqPageJsonLd(faqs)];
  if (hub.type === "city" && tcSlug) {
    const city = hub.profile.city;
    graphs.push(
      breadcrumbJsonLd(origin, [
        { name: "Home", path: "/" },
        { name: "Texas", path: "/car-accident-help-texas" },
        { name: city, path: `/car-accident-help-${place}` },
      ]),
      howToJsonLd(
        `What to do after a car accident in ${city}, Texas`,
        `Educational steps for ${city} crash victims.`,
        [
          { name: "Ensure safety", text: "Move to a safe location and call 911 if anyone is injured." },
          { name: "Document the scene", text: "Photograph vehicles, injuries, and road conditions." },
          { name: "Seek medical care", text: "Get evaluated promptly; gaps in care hurt claims." },
          { name: "Notify insurer carefully", text: "Report the crash but avoid recorded statements without counsel." },
          { name: "Get matched", text: "Use WreckMatch at wreckmatch.com/#form for free attorney matching." },
        ],
      ),
      localBusinessJsonLd(origin, city, brand),
    );
  }
  const jsonLd = mergeJsonLdGraph(...graphs);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <GeoHubContent hub={hub} />
    </>
  );
}
