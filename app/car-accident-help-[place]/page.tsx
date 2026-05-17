import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { GeoHubContent } from "@/components/GeoHubContent";
import { getAllGeoHubSlugs, getGeoHubBySlug } from "@/lib/geo-routes";
import { buildPageMetadata } from "@/lib/seo";
import { headers } from "next/headers";

type Props = { params: Promise<{ place: string }> };

function resolveHub(place: string) {
  const slug = `car-accident-help-${place}`;
  return getGeoHubBySlug(slug);
}

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
  const title =
    hub.type === "state"
      ? `Car Accident Lawyer Referral in ${hub.profile.state} | WreckMatch`
      : `Car Accident Help in ${hub.profile.city}, ${hub.profile.state} | WreckMatch`;
  const description = `Free legal referral after a car accident in ${name}. WreckMatch is not a law firm — we connect you with licensed attorneys in 60 seconds. Call (978) 515-6063.`;
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
  const origin = (await import("@/lib/site")).siteOriginFromHeaders(h);
  const name = hub.type === "state" ? hub.profile.state : hub.profile.city;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: `Car accident help in ${name}`,
    description: `Legal referral service for car accident victims in ${name}.`,
    url: `${origin}/car-accident-help-${place}`,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <GeoHubContent hub={hub} />
    </>
  );
}
