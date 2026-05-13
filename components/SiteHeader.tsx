"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/components/LanguageContext";
import { LogoLight } from "@/components/Logo";

export function SiteHeader() {
  const { lang, setLang, t } = useLanguage();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!menuRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("click", onDoc);
    return () => document.removeEventListener("click", onDoc);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-800/90 bg-gray-950/95 shadow-sm shadow-black/20 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-2 px-3 sm:gap-3 sm:px-4">
        <LogoLight href="/" />
        <nav className="hidden items-center gap-5 text-sm font-medium text-gray-200 md:flex">
          <div className="relative" ref={menuRef}>
            <button
              type="button"
              className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-white transition-opacity duration-200 hover:bg-gray-900/80"
              aria-expanded={open}
              aria-haspopup="true"
              onClick={() => setOpen((v) => !v)}
            >
              {t.navResources}
              <span className="text-xs" aria-hidden>
                ▾
              </span>
            </button>
            {open ? (
              <div className="absolute right-0 mt-2 w-56 rounded-xl border border-gray-800 bg-gray-900 py-2 shadow-xl">
                <Link
                  href="/press"
                  className="block px-4 py-2 text-sm text-gray-100 transition-colors hover:bg-gray-800"
                  onClick={() => setOpen(false)}
                >
                  {t.navPress}
                </Link>
                <Link
                  href="/webinars"
                  className="block px-4 py-2 text-sm text-gray-100 transition-colors hover:bg-gray-800"
                  onClick={() => setOpen(false)}
                >
                  {t.navWebinars}
                </Link>
                <Link
                  href="/blog"
                  className="block px-4 py-2 text-sm text-gray-100 transition-colors hover:bg-gray-800"
                  onClick={() => setOpen(false)}
                >
                  {t.linkBlog}
                </Link>
                <Link
                  href="/states"
                  className="block px-4 py-2 text-sm text-gray-100 transition-colors hover:bg-gray-800"
                  onClick={() => setOpen(false)}
                >
                  {t.linkStates}
                </Link>
                <Link
                  href="/case-calculator"
                  className="block px-4 py-2 text-sm text-gray-100 transition-colors hover:bg-gray-800"
                  onClick={() => setOpen(false)}
                >
                  {t.linkCalculator}
                </Link>
                <Link
                  href="/survival-guide"
                  className="block px-4 py-2 text-sm text-gray-100 transition-colors hover:bg-gray-800"
                  onClick={() => setOpen(false)}
                >
                  {t.linkGuide}
                </Link>
              </div>
            ) : null}
          </div>
          <Link href="/about" className="text-white transition-opacity duration-200 hover:text-red-300">
            {t.navAbout}
          </Link>
        </nav>

        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          <div
            className="flex items-center rounded-lg border border-gray-700/90 bg-gray-900/80 p-0.5 shadow-inner"
            role="group"
            aria-label="Site language"
          >
            <button
              type="button"
              onClick={() => setLang("en")}
              className={`rounded-md px-2 py-1 text-[11px] font-semibold transition-all duration-200 sm:text-xs ${
                lang === "en" ? "bg-white text-gray-900 shadow-sm" : "text-gray-400 hover:text-gray-200"
              }`}
              aria-pressed={lang === "en"}
            >
              🇺🇸 English
            </button>
            <button
              type="button"
              onClick={() => setLang("es")}
              className={`rounded-md px-2 py-1 text-[11px] font-semibold transition-all duration-200 sm:text-xs ${
                lang === "es" ? "bg-white text-gray-900 shadow-sm" : "text-gray-400 hover:text-gray-200"
              }`}
              aria-pressed={lang === "es"}
            >
              🇲🇽 Español
            </button>
          </div>
          <a
            href="tel:19785156063"
            className="hidden text-xs font-semibold text-white transition-opacity duration-200 hover:text-red-300 sm:inline sm:text-sm md:text-base"
          >
            📞 (978) 515-6063
          </a>
        </div>
      </div>
    </header>
  );
}
