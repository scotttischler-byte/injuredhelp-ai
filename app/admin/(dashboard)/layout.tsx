import Link from "next/link";
import { ReactNode } from "react";
import { AdminLogoutButton } from "@/components/admin/AdminLogoutButton";

const NAV = [
  { href: "/admin", label: "Overview", icon: "📊" },
  { href: "/admin/content", label: "Content Queue", icon: "📝" },
  { href: "/admin/automation", label: "Automation Status", icon: "🤖" },
  { href: "/admin/seo", label: "SEO Signals", icon: "📈" },
  { href: "/admin/webinars", label: "Webinars", icon: "🎙️" },
  { href: "/admin/email", label: "Email Sequences", icon: "📧" },
  { href: "/admin/keywords", label: "Keywords", icon: "🔑" },
  { href: "/admin/leads", label: "Leads", icon: "🧲" },
  { href: "/admin/settings", label: "Settings", icon: "⚙️" },
] as const;

export default function AdminDashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 md:flex">
      <aside className="border-b border-gray-800 bg-gray-950 p-4 md:w-64 md:border-b-0 md:border-r md:border-gray-800">
        <div className="mb-6 px-2">
          <p className="text-xs font-bold uppercase tracking-widest text-red-500">WreckMatch</p>
          <p className="text-lg font-black text-white">
            ADMIN<span className="text-red-500">.</span>
          </p>
        </div>
        <nav className="flex flex-wrap gap-2 md:flex-col md:gap-1">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-lg px-3 py-2 text-sm font-semibold text-gray-200 transition-colors hover:bg-gray-900 hover:text-white"
            >
              <span className="mr-2" aria-hidden>
                {item.icon}
              </span>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="mt-6 hidden px-2 md:block">
          <AdminLogoutButton />
        </div>
      </aside>
      <div className="min-w-0 flex-1">
        <header className="border-b border-gray-800 bg-gray-950 px-4 py-4 md:px-8">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm text-gray-400">Passive SEO + automation control center</p>
            <Link href="/" className="text-sm font-semibold text-red-400 hover:text-red-300">
              View site →
            </Link>
          </div>
        </header>
        <main className="px-4 py-6 md:px-8">{children}</main>
      </div>
    </div>
  );
}
