"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { WreckMatchPhone } from "@/components/WreckMatchPhone";

const HIDE_PREFIXES = ["/admin", "/thank-you"];

export function MobileGlobalCTA() {
  const pathname = usePathname() ?? "";
  if (HIDE_PREFIXES.some((p) => pathname.startsWith(p))) return null;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-40 flex items-stretch gap-0 border-t border-emerald-500/50 bg-slate-950 pb-[env(safe-area-inset-bottom,0px)] shadow-[0_-8px_24px_rgba(0,0,0,0.5)] md:hidden"
      role="region"
      aria-label="Quick contact"
    >
      <div className="flex flex-1 items-center justify-center border-r border-slate-800 px-2 py-2">
        <WreckMatchPhone variant="dark" asLink className="text-xs" />
      </div>
      <Link
        href="/#form"
        className="flex flex-1 items-center justify-center bg-emerald-500 px-3 py-3 text-sm font-bold text-slate-950 touch-manipulation hover:bg-emerald-400 min-h-[52px]"
      >
        Free match →
      </Link>
    </div>
  );
}
