import Link from "next/link";

type LogoProps = {
  className?: string;
  href?: string;
};

/** WreckMatch wordmark + shield mark — orange accent, dark + red text */
export function Logo({ className = "", href = "/" }: LogoProps) {
  const inner = (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <svg
        className="h-9 w-9 shrink-0 text-orange-500"
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
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
      <span className="flex flex-col leading-none">
        <span className="text-lg font-black tracking-tight text-gray-900">
          WRECK<span className="text-red-600">MATCH</span>
        </span>
        <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-gray-500">
          Legal Help
        </span>
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

/** Logo for dark backgrounds (nav) */
export function LogoLight({ className = "", href = "/" }: LogoProps) {
  const inner = (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <svg
        className="h-9 w-9 shrink-0 text-orange-400"
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
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
      <span className="flex flex-col leading-none">
        <span className="text-lg font-black tracking-tight text-white">
          WRECK<span className="text-red-500">MATCH</span>
        </span>
        <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-gray-400">
          Legal Help
        </span>
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
