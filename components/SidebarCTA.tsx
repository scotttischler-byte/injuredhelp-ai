import Link from "next/link";

export function SidebarCTA() {
  return (
    <aside className="sticky top-24 hidden w-full max-w-xs shrink-0 lg:block">
      <div className="rounded-xl border border-gray-800 bg-white p-5 shadow-lg ring-1 ring-gray-200">
        <div className="mb-3 h-1 w-full rounded-full bg-red-600" />
        <p className="text-lg font-bold text-gray-900">Injured in an Accident?</p>
        <p className="mt-2 text-sm text-gray-600">
          Get matched with a licensed attorney in your state — free, in under 60 seconds.
        </p>
        <a
          href="tel:19785156063"
          className="mt-4 block rounded-lg bg-gray-950 py-2.5 text-center text-sm font-semibold text-white transition-all duration-200 hover:bg-gray-800"
        >
          (978) 515-6063
        </a>
        <Link
          href="/#form"
          className="mt-3 flex w-full items-center justify-center rounded-lg bg-red-600 py-2.5 text-sm font-bold text-white transition-all duration-200 hover:bg-red-500"
        >
          Get Free Help Now →
        </Link>
        <ul className="mt-4 space-y-1.5 text-xs text-gray-600">
          <li>✅ Free</li>
          <li>✅ 60 seconds</li>
          <li>✅ No win, no fee</li>
        </ul>
      </div>
    </aside>
  );
}
