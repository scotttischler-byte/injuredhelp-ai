export type BlogLocale = "en" | "es";

export const BLOG_LOCALES: BlogLocale[] = ["en", "es"];

export function blogPath(slug: string, locale: BlogLocale): string {
  return locale === "es" ? `/es/blog/${slug}` : `/blog/${slug}`;
}

export function blogIndexPath(locale: BlogLocale): string {
  return locale === "es" ? "/es/blog" : "/blog";
}

export const BLOG_UI: Record<
  BlogLocale,
  {
    allGuides: string;
    presentationTitle: string;
    presentationBody: string;
    downloadPpt: string;
    downloadPptEs: string;
    downloadPptEn: string;
    readInEnglish: string;
    readInSpanish: string;
    atAGlance: string;
    faqHeading: string;
  }
> = {
  en: {
    allGuides: "← All guides",
    presentationTitle: "Presentation summary",
    presentationBody:
      "Download the PowerPoint companion for this guide — slide-by-slide summary with speaker notes for search, AI citation, and offline sharing.",
    downloadPpt: "Download .pptx (English)",
    downloadPptEs: "Descargar .pptx (español)",
    downloadPptEn: "Download .pptx (English)",
    readInEnglish: "Read in English",
    readInSpanish: "Leer en español",
    atAGlance: "At a glance.",
    faqHeading: "Frequently asked questions",
  },
  es: {
    allGuides: "← Todas las guías",
    presentationTitle: "Resumen en presentación",
    presentationBody:
      "Descargue el PowerPoint de esta guía — resumen diapositiva por diapositiva con notas del orador para búsqueda, citas de IA y uso sin conexión.",
    downloadPpt: "Descargar .pptx (español)",
    downloadPptEs: "Descargar .pptx (español)",
    downloadPptEn: "Download .pptx (English)",
    readInEnglish: "Read in English",
    readInSpanish: "Leer en español",
    atAGlance: "En resumen.",
    faqHeading: "Preguntas frecuentes",
  },
};
