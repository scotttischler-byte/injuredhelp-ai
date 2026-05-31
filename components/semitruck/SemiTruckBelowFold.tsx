"use client";

import Link from "next/link";
import type { HomeCopy, Lang } from "@/lib/homeTranslations";
import HomePageBelowFold from "@/components/HomePageBelowFold";
import { SEMITRUCK_ACTIVITY_MESSAGES } from "@/lib/semitruck-home-translations";

type Props = {
  lang: Lang;
  t: HomeCopy;
  formInView: boolean;
};

export default function SemiTruckBelowFold({ lang, t, formInView }: Props) {
  const isEn = lang === "en";

  const attorneyStrip = (
    <section className="border-t border-amber-500/20 bg-gradient-to-br from-slate-900 via-[#0c1222] to-slate-950 px-4 py-14">
      <div className="mx-auto max-w-4xl text-center">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-500/90">
          {isEn ? "For law firms" : "Para bufetes"}
        </p>
        <h2 className="mt-3 text-2xl font-bold text-white sm:text-3xl">
          {isEn
            ? "Attorneys: receive qualified semi-truck leads"
            : "Abogados: reciban leads calificados de camión"}
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-slate-400">
          {isEn
            ? "SemiTruckMatch routes FMCSA-aware truck crash victims to participating firms nationwide. Partner with us to grow your truck practice with intake-ready cases."
            : "SemiTruckMatch dirige víctimas de choques con tráiler a bufetes participantes en todo el país. Asóciese con nosotros para hacer crecer su práctica de camiones."}
        </p>
        <Link
          href="/for-attorneys"
          className="mt-8 inline-flex items-center justify-center rounded-xl border border-amber-500/50 bg-amber-500/10 px-8 py-3.5 text-base font-bold text-amber-400 transition-colors hover:bg-amber-500/20"
        >
          {isEn ? "Attorney partnership →" : "Alianza para abogados →"}
        </Link>
      </div>
    </section>
  );

  return (
    <HomePageBelowFold
      lang={lang}
      t={t}
      formInView={formInView}
      activityMessages={SEMITRUCK_ACTIVITY_MESSAGES}
      beforeStates={attorneyStrip}
    />
  );
}
