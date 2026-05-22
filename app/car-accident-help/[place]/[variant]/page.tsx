import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { headers } from "next/headers";
import { AccidentVariantContent } from "@/components/AccidentVariantContent";
import {
  ACCIDENT_VARIANT_CITIES,
  hubSlugForPlace,
} from "@/lib/priority-places/registry";
import {
  buildAccidentVariantFaqs,
  variantHeadline,
} from "@/lib/priority-places/accident-variants";
import type { AccidentVariantType } from "@/lib/priority-places/types";
import {
  buildPageMetadata,
  faqPageJsonLd,
  howToJsonLd,
  localBusinessJsonLd,
  mergeJsonLdGraph,
  siteJsonLdGraph,
} from "@/lib/seo";
import { brandFromHeaders, siteOriginFromHeaders } from "@/lib/site";

const VARIANTS: AccidentVariantType[] = ["truck", "rideshare", "motorcycle"];

type Props = { params: Promise<{ place: string; variant: string }> };

function resolveVariant(variant: string): AccidentVariantType | null {
  return VARIANTS.includes(variant as AccidentVariantType) ? (variant as AccidentVariantType) : null;
}

function resolveCity(place: string) {
  return ACCIDENT_VARIANT_CITIES.find((c) => c.placeSlug === place) ?? null;
}

export async function generateStaticParams() {
  return ACCIDENT_VARIANT_CITIES.flatMap((c) =>
    VARIANTS.map((variant) => ({ place: c.placeSlug, variant })),
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { place, variant: v } = await params;
  const city = resolveCity(place);
  const variant = resolveVariant(v);
  if (!city || !variant) return {};
  const h = await headers();
  const title = `${variantHeadline(variant)} in ${city.city}, ${city.state} | WreckMatch`;
  const description = `2026 ${city.city} ${variant} accident guide: liability, insurance, deadlines, and free attorney matching. Not legal advice.`;
  return buildPageMetadata({
    title,
    description,
    path: `/car-accident-help-${place}/${variant}`,
    headers: h,
  });
}

export default async function AccidentVariantPage({ params }: Props) {
  const { place, variant: v } = await params;
  const city = resolveCity(place);
  const variant = resolveVariant(v);
  if (!city || !variant) notFound();

  const h = await headers();
  const brand = brandFromHeaders(h);
  const origin = siteOriginFromHeaders(h);
  const faqs = buildAccidentVariantFaqs(city.city, city.state, variant);
  const jsonLd = mergeJsonLdGraph(
    siteJsonLdGraph(origin, brand),
    faqPageJsonLd(faqs),
    howToJsonLd(
      `${variantHeadline(variant)} in ${city.city}, ${city.state}`,
      `Steps after a ${variant} crash in ${city.city}.`,
      [
        { name: "Ensure safety", text: "Call 911 and document the scene." },
        { name: "Preserve evidence", text: "Photos, witness info, and variant-specific records (ECM, rideshare app, gear)." },
        { name: "Seek care", text: "Medical evaluation within 24 hours." },
        { name: "Get matched", text: "Use WreckMatch at wreckmatch.com/#form or 855 WRECKMATCH." },
      ],
    ),
    localBusinessJsonLd(origin, city.city, brand),
  );

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <AccidentVariantContent
        placeSlug={place}
        city={city.city}
        state={city.state}
        variant={variant}
      />
    </>
  );
}
