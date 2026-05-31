"use client";

import { BrandPhone } from "@/components/BrandPhone";
import { useBrand } from "@/lib/brand-context";
import { themeForBrand } from "@/lib/brand-theme";
import { BRAND_CONFIG } from "@/lib/site";
import { trackTikTokClickButton } from "@/lib/tiktok-attribution";

type Props = {
  visible: boolean;
  onScrollToForm: () => void;
  ctaLabel?: string;
};

export function StickyConversionBar({ visible, onScrollToForm, ctaLabel }: Props) {
  const { brand } = useBrand();
  const theme = themeForBrand(brand);
  const tel = `tel:${BRAND_CONFIG[brand].phone.replace(/[^\d+]/g, "")}`;
  const label = ctaLabel ?? "Free attorney match →";
  if (!visible) return null;

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-50 border-t ${theme.stickyBarBorder} ${theme.pageBg} px-3 py-3 shadow-[0_-8px_30px_rgba(0,0,0,0.4)] md:hidden`}
      style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
    >
      <div className="mx-auto flex max-w-lg items-center gap-2">
        <a
          href={tel}
          onClick={() => trackTikTokClickButton("sticky_call")}
          className={`flex shrink-0 flex-col items-center rounded-xl border ${theme.accentBorder} bg-slate-900 px-2 py-2`}
        >
          <BrandPhone variant="dark" vanityClassName="!text-sm" digitsClassName="!text-xs" />
        </a>
        <button
          type="button"
          onClick={() => {
            trackTikTokClickButton("sticky_form");
            onScrollToForm();
          }}
          className={`flex flex-1 items-center justify-center rounded-xl px-3 py-3 text-sm font-bold ${theme.btnPrimary}`}
        >
          {label}
        </button>
      </div>
    </div>
  );
}
