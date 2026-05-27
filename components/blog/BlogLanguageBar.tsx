import Link from "next/link";
import { blogPath, BLOG_UI, type BlogLocale } from "@/lib/blog-locale";

type Props = {
  slug: string;
  locale: BlogLocale;
  hasEnglish: boolean;
  hasSpanish: boolean;
};

export function BlogLanguageBar({ slug, locale, hasEnglish, hasSpanish }: Props) {
  if (!hasEnglish || !hasSpanish) return null;
  const ui = BLOG_UI[locale];
  return (
    <div className="mb-6 flex flex-wrap items-center gap-3 rounded-lg border border-gray-300 bg-gray-100 px-4 py-3 text-sm">
      <span className="font-semibold text-gray-900">
        {locale === "es" ? "Idioma:" : "Language:"}
      </span>
      {locale === "es" ? (
        <Link href={blogPath(slug, "en")} className="font-bold text-[#cc0000] hover:underline">
          {ui.readInEnglish}
        </Link>
      ) : (
        <Link href={blogPath(slug, "es")} className="font-bold text-[#cc0000] hover:underline">
          {ui.readInSpanish}
        </Link>
      )}
    </div>
  );
}
