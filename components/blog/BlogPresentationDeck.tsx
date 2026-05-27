import fs from "fs";
import path from "path";
import Link from "next/link";
import { BLOG_UI, type BlogLocale } from "@/lib/blog-locale";
import { presentationDiskPath, presentationPathForSlug } from "@/lib/blog-presentations";

type Props = {
  slug: string;
  title: string;
  locale: BlogLocale;
  presentationUrl?: string;
};

export function BlogPresentationDeck({ slug, title, locale, presentationUrl }: Props) {
  const ui = BLOG_UI[locale];
  const enPath = presentationPathForSlug(slug, "en");
  const esPath = presentationPathForSlug(slug, "es");
  const enExists = fs.existsSync(path.join(process.cwd(), presentationDiskPath(slug, "en")));
  const esExists = fs.existsSync(path.join(process.cwd(), presentationDiskPath(slug, "es")));
  const primaryHref = presentationUrl ?? (locale === "es" ? esPath : enPath);

  if (!enExists && !esExists) return null;

  return (
    <section
      className="mt-8 rounded-xl border-2 border-[#cc0000]/25 bg-white p-5 shadow-md ring-1 ring-gray-200"
      aria-labelledby="blog-presentation-heading"
    >
      <div className="flex flex-wrap items-start gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-[#cc0000] text-lg font-black text-white">
          PPT
        </div>
        <div className="min-w-0 flex-1">
          <h2 id="blog-presentation-heading" className="text-xl font-bold text-gray-950">
            {ui.presentationTitle}
          </h2>
          <p className="mt-2 text-base leading-relaxed text-gray-800">
            {ui.presentationBody}{" "}
            <span className="font-semibold text-gray-950">{title}</span>
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            {enExists ? (
              <Link
                href={enPath}
                download
                className="inline-flex items-center gap-2 rounded-lg bg-[#cc0000] px-4 py-2.5 text-sm font-bold text-white hover:bg-[#a80000]"
              >
                {ui.downloadPptEn}
              </Link>
            ) : null}
            {esExists ? (
              <Link
                href={esPath}
                download
                className="inline-flex items-center gap-2 rounded-lg border-2 border-[#cc0000] bg-white px-4 py-2.5 text-sm font-bold text-[#cc0000] hover:bg-red-50"
              >
                {ui.downloadPptEs}
              </Link>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
