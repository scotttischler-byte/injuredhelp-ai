"use client";

import { createContext, useContext } from "react";
import { BRAND_CONFIG, type SiteBrand } from "@/lib/site";

type BrandContextValue = {
  brand: SiteBrand;
  config: (typeof BRAND_CONFIG)[SiteBrand];
};

const BrandContext = createContext<BrandContextValue | null>(null);

export function BrandProvider({
  brand,
  children,
}: {
  brand: SiteBrand;
  children: React.ReactNode;
}) {
  return (
    <BrandContext.Provider value={{ brand, config: BRAND_CONFIG[brand] }}>
      {children}
    </BrandContext.Provider>
  );
}

export function useBrand(): BrandContextValue {
  const ctx = useContext(BrandContext);
  if (!ctx) {
    throw new Error("useBrand must be used within BrandProvider");
  }
  return ctx;
}

export function useBrandOptional(): BrandContextValue | null {
  return useContext(BrandContext);
}
