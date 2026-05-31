import Link from "next/link";
import type { SiteBrand } from "@/lib/site";

type LogoProps = {
  className?: string;
  href?: string;
  variant?: "light" | "dark";
  brand?: SiteBrand;
};

function SemiTruckMark({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <rect x="4" y="14" width="28" height="18" rx="3" stroke="currentColor" strokeWidth="2" />
      <path
        d="M32 20h8l4 6v6h-12V20z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <circle cx="14" cy="34" r="4" fill="currentColor" opacity="0.9" />
      <circle cx="36" cy="34" r="4" fill="currentColor" opacity="0.9" />
      <path
        d="M8 14V10h18l6 4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function WreckMatchMark({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path
        d="M8 28 L20 8 L32 28 Z"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M14 26 L20 18 L26 26"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function BrandLogo({ className = "", href = "/", variant = "dark", brand = "wreckmatch" }: LogoProps) {
  const isLight = variant === "light";
  const isTruck = brand === "semitruckmatch";

  const inner = (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      {isTruck ? (
        <SemiTruckMark
          className={`h-10 w-10 shrink-0 ${isLight ? "text-amber-500" : "text-amber-400"}`}
        />
      ) : (
        <WreckMatchMark
          className={`h-9 w-9 shrink-0 ${isLight ? "text-orange-500" : "text-orange-400"}`}
        />
      )}
      <span className="flex flex-col leading-none">
        {isTruck ? (
          <>
            <span
              className={`text-lg font-black tracking-tight ${isLight ? "text-slate-900" : "text-white"}`}
            >
              SEMI<span className="text-amber-400">TRUCK</span>
              <span className={isLight ? "text-slate-800" : "text-slate-200"}>MATCH</span>
            </span>
            <span
              className={`text-[9px] font-semibold uppercase tracking-[0.18em] ${isLight ? "text-slate-500" : "text-slate-400"}`}
            >
              Truck accident help
            </span>
          </>
        ) : (
          <>
            <span
              className={`text-lg font-black tracking-tight ${isLight ? "text-gray-900" : "text-white"}`}
            >
              WRECK<span className="text-red-500">MATCH</span>
            </span>
            <span
              className={`text-[9px] font-semibold uppercase tracking-[0.2em] ${isLight ? "text-gray-500" : "text-gray-400"}`}
            >
              Legal Help
            </span>
          </>
        )}
      </span>
    </span>
  );

  if (href) {
    return (
      <Link href={href} className="transition-opacity duration-200 hover:opacity-90">
        {inner}
      </Link>
    );
  }
  return inner;
}

/** @deprecated Use BrandLogo */
export function LogoLight(props: Omit<LogoProps, "variant">) {
  return <BrandLogo {...props} variant="dark" />;
}
