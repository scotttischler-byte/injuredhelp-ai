import { BrandLogo } from "@/components/BrandLogo";

type LogoProps = {
  className?: string;
  href?: string;
};

/** @deprecated Use BrandLogo */
export function Logo({ className = "", href = "/" }: LogoProps) {
  return <BrandLogo className={className} href={href} variant="light" brand="wreckmatch" />;
}

/** @deprecated Use BrandLogo */
export function LogoLight({ className = "", href = "/" }: LogoProps) {
  return <BrandLogo className={className} href={href} variant="dark" brand="wreckmatch" />;
}
