import Link from "next/link";
import type { SiteBrand } from "@/lib/site";
import { BRAND_CONFIG } from "@/lib/site";

export function LegalPageShell({
  brand,
  title,
  children,
}: {
  brand: SiteBrand;
  title: string;
  children: React.ReactNode;
}) {
  const cfg = BRAND_CONFIG[brand];
  const digits = cfg.phone.replace(/\D/g, "");
  const phoneHref = digits.length === 10 ? `+1${digits}` : `+${digits}`;
  const phoneDisplay = cfg.phone.startsWith("+") ? cfg.phone : `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <header className="border-b border-gray-800">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-4">
          <Link href="/" className="text-sm font-semibold text-red-400 hover:text-red-300">
            ← Back to {cfg.name}
          </Link>
          <a href={`tel:${phoneHref}`} className="text-sm text-gray-400 hover:text-white">
            {phoneDisplay}
          </a>
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-4 py-14 pb-20">
        <p className="text-xs font-bold uppercase tracking-widest text-red-500">Legal</p>
        <h1 className="mt-3 text-4xl font-black">{title}</h1>
        {children}
      </main>
    </div>
  );
}
