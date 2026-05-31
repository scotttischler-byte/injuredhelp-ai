import type { HomeCopy, Lang } from "@/lib/homeTranslations";
import { HOME_TRANSLATIONS } from "@/lib/homeTranslations";
import { SEMITRUCK_HOME_TRANSLATIONS } from "@/lib/semitruck-home-translations";
import type { SiteBrand } from "@/lib/site";

export function getHomeCopy(brand: SiteBrand, lang: Lang): HomeCopy {
  if (brand === "semitruckmatch") return SEMITRUCK_HOME_TRANSLATIONS[lang];
  return HOME_TRANSLATIONS[lang];
}

export function getHomeTranslations(brand: SiteBrand): Record<Lang, HomeCopy> {
  if (brand === "semitruckmatch") return SEMITRUCK_HOME_TRANSLATIONS;
  return HOME_TRANSLATIONS;
}
