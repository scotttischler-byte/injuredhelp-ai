import { SiteHeader } from "@/components/SiteHeader";
import { Breadcrumbs, type Crumb } from "@/components/seo/Breadcrumbs";
import { TrustBar } from "@/components/seo/TrustBar";

type Props = {
  children: React.ReactNode;
  crumbs?: Crumb[];
  dark?: boolean;
};

export function AuthorityPageShell({ children, crumbs, dark = true }: Props) {
  const shell = dark
    ? "min-h-screen bg-slate-950 text-slate-100 pb-[calc(5rem+env(safe-area-inset-bottom,0px))] md:pb-0"
    : "min-h-screen bg-gray-50 text-gray-900";

  return (
    <div className={shell}>
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-4 py-8 sm:py-12">
        {crumbs ? <Breadcrumbs items={crumbs} className="mb-6" /> : null}
        <div className="mb-8">
          <TrustBar />
        </div>
        {children}
      </main>
    </div>
  );
}
