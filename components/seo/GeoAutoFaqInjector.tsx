import { headers } from "next/headers";
import { PageFaqBlock } from "@/components/seo/PageFaqBlock";
import { geoFaqsForPath } from "@/lib/geo/pillar-faqs";
import { requestSiteBrand } from "@/lib/request-brand";

const PATH_HEADER = "x-pathname";

/** Injects FAQPage + &lt;details&gt; FAQs on pillar routes without duplicating hub/blog pages. */
export async function GeoAutoFaqInjector() {
  const h = await headers();
  const pathname = h.get(PATH_HEADER) ?? "/";
  const brand = await requestSiteBrand();
  const faqs = geoFaqsForPath(pathname, brand);
  if (!faqs?.length) return null;

  const dark = brand === "semitruckmatch";

  return (
    <div className="mx-auto max-w-4xl px-4 pb-12">
      <PageFaqBlock faqs={faqs} dark={dark} className="mt-0" />
    </div>
  );
}
