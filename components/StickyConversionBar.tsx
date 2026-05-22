"use client";

import { WreckMatchPhone } from "@/components/WreckMatchPhone";
import { WRECKMATCH_PHONE_TEL } from "@/lib/phones";
import { trackTikTokClickButton } from "@/lib/tiktok-attribution";

type Props = {
  visible: boolean;
  onScrollToForm: () => void;
};

export function StickyConversionBar({ visible, onScrollToForm }: Props) {
  if (!visible) return null;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-emerald-500/40 bg-slate-950 px-3 py-3 shadow-[0_-8px_30px_rgba(0,0,0,0.4)] md:hidden"
      style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
    >
      <div className="mx-auto flex max-w-lg items-center gap-2">
        <a
          href={WRECKMATCH_PHONE_TEL}
          onClick={() => trackTikTokClickButton("sticky_call")}
          className="flex shrink-0 flex-col items-center rounded-xl border border-emerald-500/50 bg-slate-900 px-2 py-2"
        >
          <WreckMatchPhone variant="dark" vanityClassName="!text-sm" digitsClassName="!text-xs" />
        </a>
        <button
          type="button"
          onClick={() => {
            trackTikTokClickButton("sticky_form");
            onScrollToForm();
          }}
          className="flex flex-1 items-center justify-center rounded-xl bg-emerald-500 px-3 py-3 text-sm font-bold text-slate-950"
        >
          Free attorney match →
        </button>
      </div>
    </div>
  );
}
