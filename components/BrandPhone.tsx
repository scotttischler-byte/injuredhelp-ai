"use client";

import { useBrandOptional } from "@/lib/brand-context";
import { BRAND_CONFIG } from "@/lib/site";
import { WRECKMATCH_PHONE_DIGITS, WRECKMATCH_PHONE_VANITY } from "@/lib/phones";

type Props = {
  variant?: "dark" | "light";
  showDigits?: boolean;
  className?: string;
  asLink?: boolean;
  vanityClassName?: string;
  digitsClassName?: string;
  /** semitruck uses amber accent; wreckmatch emerald */
  accent?: "emerald" | "amber";
};

export function BrandPhone({
  variant = "dark",
  showDigits = true,
  className = "",
  asLink = false,
  vanityClassName = "",
  digitsClassName = "",
  accent,
}: Props) {
  const brandCtx = useBrandOptional();
  const brand = brandCtx?.brand ?? "wreckmatch";
  const useAmber = accent === "amber" || brand === "semitruckmatch";
  const tel = `tel:${BRAND_CONFIG[brand].phone.replace(/[^\d+]/g, "")}`;

  const vanityColor = variant === "dark"
    ? useAmber
      ? "text-amber-400"
      : "text-emerald-400"
    : useAmber
      ? "text-amber-600"
      : "text-emerald-600";
  const digitsColor = variant === "dark" ? "text-slate-400" : "text-gray-500";

  const content = (
    <span className={`inline-flex flex-col items-center text-center leading-tight ${className}`}>
      <span
        className={`text-xl font-extrabold tracking-wide sm:text-2xl ${vanityColor} ${vanityClassName}`}
      >
        {WRECKMATCH_PHONE_VANITY}
      </span>
      {showDigits ? (
        <span
          className={`mt-0.5 text-sm font-semibold tabular-nums sm:text-base ${digitsColor} ${digitsClassName}`}
        >
          {WRECKMATCH_PHONE_DIGITS}
        </span>
      ) : null}
    </span>
  );

  if (asLink) {
    return (
      <a
        href={tel}
        className={`inline-block transition-opacity hover:opacity-90 focus:outline-none focus-visible:ring-2 ${useAmber ? "focus-visible:ring-amber-500" : "focus-visible:ring-emerald-500"}`}
      >
        {content}
      </a>
    );
  }
  return content;
}
