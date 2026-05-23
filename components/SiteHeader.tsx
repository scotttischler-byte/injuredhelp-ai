"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/components/LanguageContext";
import { LogoLight } from "@/components/Logo";
import { WreckMatchPhone } from "@/components/WreckMatchPhone";
import { WRECKMATCH_PHONE_TEL } from "@/lib/phones";

const RESOURCE_LINKS = [
  { href: "/what-to-do-after-a-car-accident", key: "linkWhatToDo" as const },
  { href: "/resources", key: "linkResources" as const },
  { href: "/blog", key: "linkBlog" as const },
  { href: "/states", key: "linkStates" as const },
  { href: "/press", key: "navPress" as const },
  { href: "/webinars", key: "navWebinars" as const },
] as const;

export function SiteHeader() {
  const { lang, setLang, t } = useLanguage();
  const [resourcesOpen, setResourcesOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!menuRef.current?.contains(e.target as Node)) {
        setResourcesOpen(false);
      }
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const closeMobile = () => setMobileOpen(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-800/90 bg-gray-950 shadow-sm shadow-black/20">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-2 px-3 sm:gap-3 sm:px-4">
        <LogoLight href="/" />

        {/* Desktop nav */}
        <nav className="hidden items-center gap-5 text-sm font-medium text-gray-200 md:flex">
          <div className="relative" ref={menuRef}>
            <button
              type="button"
              className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-white transition-opacity duration-200 hover:bg-gray-900/80"
              aria-expanded={resourcesOpen}
              aria-haspopup="menu"
              onClick={(e) => {
                e.stopPropagation();
                setResourcesOpen((v) => !v);
              }}
            >
              {t.navResources}
              <span className="text-xs" aria-hidden>
                ▾
              </span>
            </button>
            {resourcesOpen ? (
              <div
                role="menu"
                className="absolute right-0 z-[60] mt-2 w-56 rounded-xl border border-gray-800 bg-gray-900 py-2 shadow-xl"
              >
                {RESOURCE_LINKS.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    role="menuitem"
                    className="block px-4 py-2 text-sm text-gray-100 transition-colors hover:bg-gray-800"
                    onClick={() => setResourcesOpen(false)}
                  >
                    {t[item.key]}
                  </Link>
                ))}
              </div>
            ) : null}
          </div>
          <Link href="/advertising-legal-notice" className="text-white transition-opacity hover:text-red-300">
            {t.navAbout}
          </Link>
        </nav>

        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          <div
            className="hidden items-center rounded-lg border border-gray-700/90 bg-gray-900/80 p-0.5 shadow-inner sm:flex"
            role="group"
            aria-label="Site language"
          >
            <button
              type="button"
              onClick={() => setLang("en")}
              className={`rounded-md px-2 py-1 text-[11px] font-semibold sm:text-xs ${
                lang === "en" ? "bg-white text-gray-900 shadow-sm" : "text-gray-400 hover:text-gray-200"
              }`}
              aria-pressed={lang === "en"}
            >
              🇺🇸 EN
            </button>
            <button
              type="button"
              onClick={() => setLang("es")}
              className={`rounded-md px-2 py-1 text-[11px] font-semibold sm:text-xs ${
                lang === "es" ? "bg-white text-gray-900 shadow-sm" : "text-gray-400 hover:text-gray-200"
              }`}
              aria-pressed={lang === "es"}
            >
              🇲🇽 ES
            </button>
          </div>
          <a
            href={WRECKMATCH_PHONE_TEL}
            className="hidden sm:inline"
          >
            <WreckMatchPhone variant="dark" vanityClassName="!text-sm" digitsClassName="!text-xs" />
          </a>
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-gray-700 text-white md:hidden"
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen ? (
        <nav
          className="border-t border-gray-800 bg-gray-950 px-4 py-4 md:hidden"
          aria-label="Mobile navigation"
        >
          <p className="mb-2 text-xs font-bold uppercase tracking-wide text-gray-500">{t.navResources}</p>
          <ul className="space-y-1">
            {RESOURCE_LINKS.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="block rounded-lg px-3 py-2.5 text-sm font-medium text-gray-100 hover:bg-gray-900"
                  onClick={closeMobile}
                >
                  {t[item.key]}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/advertising-legal-notice"
                className="block rounded-lg px-3 py-2.5 text-sm font-medium text-gray-100 hover:bg-gray-900"
                onClick={closeMobile}
              >
                {t.navAbout}
              </Link>
            </li>
          </ul>
          <div className="mt-4 flex gap-2 border-t border-gray-800 pt-4">
            <button
              type="button"
              onClick={() => setLang("en")}
              className={`flex-1 rounded-lg py-2 text-xs font-semibold ${
                lang === "en" ? "bg-white text-gray-900" : "bg-gray-900 text-gray-400"
              }`}
            >
              English
            </button>
            <button
              type="button"
              onClick={() => setLang("es")}
              className={`flex-1 rounded-lg py-2 text-xs font-semibold ${
                lang === "es" ? "bg-white text-gray-900" : "bg-gray-900 text-gray-400"
              }`}
            >
              Español
            </button>
          </div>
          <a
            href={WRECKMATCH_PHONE_TEL}
            className="mt-4 flex w-full items-center justify-center rounded-xl border border-emerald-500/40 bg-slate-900 py-3"
            onClick={closeMobile}
          >
            <WreckMatchPhone variant="dark" />
          </a>
        </nav>
      ) : null}
    </header>
  );
}
