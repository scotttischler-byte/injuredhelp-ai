import { WreckMatchPhone } from "@/components/WreckMatchPhone";

export function TrustBar() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 rounded-xl border border-emerald-500/30 bg-slate-900/80 px-4 py-3 text-sm text-slate-300">
      <span>✅ Free matching</span>
      <span className="hidden sm:inline text-slate-600">|</span>
      <span>✅ 50 states</span>
      <span className="hidden sm:inline text-slate-600">|</span>
      <span>✅ ~60s callback</span>
      <span className="hidden sm:inline text-slate-600">|</span>
      <WreckMatchPhone variant="dark" asLink className="text-sm" />
    </div>
  );
}
