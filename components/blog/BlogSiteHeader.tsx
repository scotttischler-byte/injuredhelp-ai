"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/components/LanguageContext";
import { Logo } from "@/components/Logo";
import { WreckMatchPhone } from "@/components/WreckMatchPhone";
import { blogIndexPath, type BlogLocale } from "@/lib/blog-locale";

const RESOURCE_LINKS = [
  { href: "/what-to-do-after-a-car-accident", key: "linkWhatToDo" as const },
  { href: "/resources", key: "linkResources" as const },
  { href: "/blog", key: "linkBlog" as const },
  { href: "/es/blog", label: "Blog (ES)" },
  { href: "/states", key: "linkStates" as const },
] as const;

type Props = { blogLocale?: BlogLocale };

/** Light header for blog readability (dark text on light page). */
export function BlogSiteHeader({ blogLocale = "en" }: Props) {
  const { lang, setLang, t } = useLanguage();
  const [resourcesOpen, setResourcesOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!menuRef.current?.contains(e.target as Node)) setResourcesOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/95 shadow-sm backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-2 px-3 sm:px-4">
        <Logo href="/" />
        <nav className="hidden items-center gap-5 text-sm font-medium text-gray-800 md:flex" ref={menuRef}>
          <div className="relative">
            <button
              type="button"
              className="hover:text-[#cc0000]"
              onClick={() => setResourcesOpen((o) => !o)}
            >
              {t.navResources} ▾
            </button>
            {resourcesOpen ? (
              <div className="absolute left-0 top-full z-50 mt-2 min-w-[200px] rounded-lg border border-gray-200 bg-white py-2 shadow-lg">
                {RESOURCE_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="block px-4 py-2 text-gray-800 hover:bg-gray-50 hover:text-[#cc0000]"
                    onClick={() => setResourcesOpen(false)}
                  >
                    {"label" in link ? link.label : t[link.key]}
                  </Link>
                ))}
              </div>
            ) : null}
          </div>
          <Link href={blogIndexPath(blogLocale)} className="hover:text-[#cc0000]">
            {blogLocale === "es" ? "Blog" : t.linkBlog}
          </Link>
          <Link href="/#form" className="font-bold text-[#cc0000] hover:underline">
            {t.urgencyCtaBtn}
          </Link>
        </nav>
        <div className="flex items-center gap-2">
          <div className="flex rounded-lg border border-gray-300 p-0.5 text-xs font-bold">
            <button
              type="button"
              className={`rounded-md px-2 py-1 ${lang === "en" ? "bg-gray-900 text-white" : "text-gray-600"}`}
              onClick={() => setLang("en")}
            >
              EN
            </button>
            <button
              type="button"
              className={`rounded-md px-2 py-1 ${lang === "es" ? "bg-gray-900 text-white" : "text-gray-600"}`}
              onClick={() => setLang("es")}
            >
              ES
            </button>
          </div>
          <WreckMatchPhone variant="light" className="hidden sm:inline-flex" />
        </div>
      </div>
    </header>
  );
}
