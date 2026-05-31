import type { SiteBrand } from "@/lib/site";

export type BrandTheme = {
  pageBg: string;
  accentText: string;
  accentBg: string;
  accentBorder: string;
  accentRing: string;
  heroGradient: string;
  btnPrimary: string;
  stickyBarBorder: string;
};

export const BRAND_THEME: Record<SiteBrand, BrandTheme> = {
  wreckmatch: {
    pageBg: "bg-slate-950",
    accentText: "text-emerald-400",
    accentBg: "bg-emerald-500",
    accentBorder: "border-emerald-500/40",
    accentRing: "focus-visible:ring-emerald-500",
    heroGradient:
      "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(16,185,129,0.18) 0%, transparent 55%), radial-gradient(ellipse 60% 40% at 100% 100%, rgba(16,185,129,0.08) 0%, transparent 50%)",
    btnPrimary: "bg-emerald-500 text-slate-950",
    stickyBarBorder: "border-emerald-500/40",
  },
  injuredhelp: {
    pageBg: "bg-slate-950",
    accentText: "text-emerald-400",
    accentBg: "bg-emerald-500",
    accentBorder: "border-emerald-500/40",
    accentRing: "focus-visible:ring-emerald-500",
    heroGradient:
      "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(16,185,129,0.18) 0%, transparent 55%)",
    btnPrimary: "bg-emerald-500 text-slate-950",
    stickyBarBorder: "border-emerald-500/40",
  },
  semitruckmatch: {
    pageBg: "bg-[#070b14]",
    accentText: "text-amber-400",
    accentBg: "bg-amber-500",
    accentBorder: "border-amber-500/45",
    accentRing: "focus-visible:ring-amber-500",
    heroGradient:
      "radial-gradient(ellipse 85% 55% at 50% -10%, rgba(245,158,11,0.22) 0%, transparent 52%), radial-gradient(ellipse 50% 35% at 0% 100%, rgba(59,130,246,0.08) 0%, transparent 50%), linear-gradient(180deg, #070b14 0%, #0c1222 100%)",
    btnPrimary: "bg-amber-500 text-slate-950 hover:bg-amber-400",
    stickyBarBorder: "border-amber-500/45",
  },
};

export function themeForBrand(brand: SiteBrand): BrandTheme {
  return BRAND_THEME[brand];
}
