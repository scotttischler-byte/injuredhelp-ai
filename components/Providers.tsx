"use client";

import { BrandProvider } from "@/lib/brand-context";
import { LanguageProvider } from "@/components/LanguageContext";
import type { SiteBrand } from "@/lib/site";

export function Providers({
  children,
  brand,
}: {
  children: React.ReactNode;
  brand: SiteBrand;
}) {
  return (
    <BrandProvider brand={brand}>
      <LanguageProvider brand={brand}>{children}</LanguageProvider>
    </BrandProvider>
  );
}
