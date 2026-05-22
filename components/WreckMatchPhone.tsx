import { WRECKMATCH_PHONE_DIGITS, WRECKMATCH_PHONE_TEL, WRECKMATCH_PHONE_VANITY } from "@/lib/phones";

type Props = {
  /** dark = hero/slate; light = white cards */
  variant?: "dark" | "light";
  showDigits?: boolean;
  className?: string;
  asLink?: boolean;
  vanityClassName?: string;
  digitsClassName?: string;
};

export function WreckMatchPhone({
  variant = "dark",
  showDigits = true,
  className = "",
  asLink = false,
  vanityClassName = "",
  digitsClassName = "",
}: Props) {
  const vanityColor = variant === "dark" ? "text-emerald-400" : "text-emerald-600";
  const digitsColor = variant === "dark" ? "text-slate-400" : "text-gray-500";

  const content = (
    <span className={`inline-flex flex-col items-center text-center leading-tight ${className}`}>
      <span
        className={`text-xl font-extrabold tracking-wide sm:text-2xl ${vanityColor} ${vanityClassName}`}
      >
        {WRECKMATCH_PHONE_VANITY}
      </span>
      {showDigits ? (
        <span className={`mt-0.5 text-sm font-semibold tabular-nums sm:text-base ${digitsColor} ${digitsClassName}`}>
          {WRECKMATCH_PHONE_DIGITS}
        </span>
      ) : null}
    </span>
  );

  if (asLink) {
    return (
      <a
        href={WRECKMATCH_PHONE_TEL}
        className="inline-block transition-opacity hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
      >
        {content}
      </a>
    );
  }

  return content;
}
