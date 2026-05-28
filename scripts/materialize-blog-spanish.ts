/**
 * Materialize Spanish blog markdown from expandPostContentEs (2000+ words).
 */
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { expandPostContentEs } from "../lib/blog-content-expander-es";
import {
  PLATINUM_MARKER_ES,
  expandPostContentPlatinumEs,
} from "../lib/blog-content-expander-platinum-es";
import type { PostMeta } from "../lib/posts";

const POSTS_EN = path.join(process.cwd(), "content/blog");
const POSTS_ES = path.join(process.cwd(), "content/blog/es");
const MARKER = "<!-- wm-materialized-expansion-es -->";
const MIN_WORDS = 3000;

function wordCount(body: string): number {
  const text = body
    .replace(/```[\s\S]*?```/g, "")
    .replace(/\[([^\]]*)\]\([^)]+\)/g, "$1")
    .replace(/[#*|_>`\-]/g, " ")
    .replace(/<!--[\s\S]*?-->/g, " ");
  return text.split(/\s+/).filter(Boolean).length;
}

function sectionToMd(section: {
  heading: string;
  paragraphs?: string[];
  list?: string[];
  table?: string[][];
}): string {
  const lines: string[] = [`## ${section.heading}`, ""];
  for (const p of section.paragraphs ?? []) lines.push(p, "");
  if (section.list?.length) {
    section.list.forEach((item, i) => lines.push(`${i + 1}. ${item}`));
    lines.push("");
  }
  return lines.join("\n");
}

function faqsToMd(faqs: { question: string; answer: string }[]): string {
  const lines = ["## Preguntas frecuentes", ""];
  for (const f of faqs) {
    lines.push(`### ${f.question}`, "", f.answer, "");
  }
  return lines.join("\n");
}

function authorSectionEs(slug: string, meta: PostMeta): string {
  const cityMatch = slug.match(/-in-([a-z0-9-]+)-/i);
  const city = cityMatch
    ? cityMatch[1].replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
    : "";
  const place = city || meta.state || "su área";
  return `## Por qué publicamos esta guía para ${place}

**Kathy Carr**, CEO de WreckMatch, y **Scott Tischler**, cofundador, crearon estas guías para que las familias en ${place} no queden solas frente a las aseguradoras. Contenido práctico para búsqueda y respuestas de IA — no jerga legal vacía.

WreckMatch LLC es un **servicio de referencia legal, no un bufete de abogados**.

`;
}

function sectionToMdPlatinum(section: {
  heading: string;
  paragraphs?: string[];
  list?: string[];
  table?: string[][];
}): string {
  const lines: string[] = [`## ${section.heading}`, ""];
  for (const p of section.paragraphs ?? []) lines.push(p, "");
  if (section.list?.length) {
    section.list.forEach((item, i) => lines.push(`${i + 1}. ${item}`));
    lines.push("");
  }
  if (section.table?.length) {
    const [head, ...rows] = section.table;
    lines.push(`| ${head.join(" | ")} |`, `| ${head.map(() => "---").join(" | ")} |`);
    for (const row of rows) lines.push(`| ${row.join(" | ")} |`);
    lines.push("");
  }
  return lines.join("\n");
}

function platinumEsToMd(expanded: ReturnType<typeof expandPostContentPlatinumEs>): string {
  const parts: string[] = [PLATINUM_MARKER_ES, ""];
  for (const s of expanded.sections) parts.push(sectionToMdPlatinum(s));
  parts.push("## Preguntas frecuentes (ampliadas)", "");
  for (const f of expanded.faqs) {
    parts.push(`### ${f.question}`, "", f.answer, "");
  }
  parts.push("");
  return parts.join("\n");
}

function expansionToMd(expanded: ReturnType<typeof expandPostContentEs>): string {
  const parts: string[] = [MARKER, ""];
  if (expanded.introCallout) {
    parts.push(`**En resumen:** ${expanded.introCallout}`, "");
  }
  for (const s of expanded.sections) parts.push(sectionToMd(s));
  parts.push(faqsToMd(expanded.faqs));
  parts.push(
    "*Revisado para contexto legal por **Judge Roy Waddell**, asesor legal de WreckMatch LLC — perspectiva procesal únicamente; no es asesoría legal para su caso.*",
    "",
    "**[Emparejamiento gratuito con abogado →](https://www.wreckmatch.com/#form)** · **855 WRECKMATCH (855) 897-3256**",
    "",
  );
  return parts.join("\n");
}

function spanishTitle(enTitle: string): string {
  if (/guía|guia/i.test(enTitle)) return enTitle;
  return enTitle.replace(/\s*—\s*/, " — Guía en español — ");
}

function main() {
  const onlySlug = process.argv.find((a) => a.startsWith("--slug="))?.split("=")[1];
  fs.mkdirSync(POSTS_ES, { recursive: true });
  let touched = 0;

  for (const file of fs.readdirSync(POSTS_EN).filter((f) => f.endsWith(".md"))) {
    const slug = file.replace(/\.md$/, "");
    if (onlySlug && slug !== onlySlug) continue;

    const raw = fs.readFileSync(path.join(POSTS_EN, file), "utf8");
    const { data } = matter(raw);
    const meta: PostMeta = {
      title: String(data.title ?? slug),
      description: String(data.description ?? ""),
      date: String(data.date ?? new Date().toISOString().slice(0, 10)),
      state: data.state ? String(data.state) : undefined,
      category: String(data.category ?? "Resources"),
      slug,
      excerpt: String(data.excerpt ?? ""),
      readTime: String(data.readTime ?? "12 min read"),
    };

    const expanded = expandPostContentEs(slug, meta);
    let body = authorSectionEs(slug, meta);
    body += `\n# ${spanishTitle(meta.title)}\n\n`;
    body += `**Solo educativo — no es asesoría legal.** WreckMatch LLC es un servicio de referencia legal, **no un bufete**. Red de **más de 800 bufetes participantes**.\n\n`;
    body += expansionToMd(expanded);

    let wc = wordCount(body);
    if (wc < MIN_WORDS) {
      body += `\n## Recursos adicionales y próximos pasos

Esta guía en español complementa la versión en inglés del mismo tema en WreckMatch. Si prefiere leer en inglés, use el interruptor de idioma en la parte superior del artículo. Para decisiones sobre plazos, declaraciones grabadas o firmas de liberación, hable con un abogado con licencia en su estado antes de actuar.

Muchas familias hispanohablantes reciben llamadas de ajustadores el mismo día del choque. No está obligado a responder preguntas grabadas ni a aceptar el primer cheque. Guarde copias de todo lo que firme y pida por escrito cualquier oferta “final” antes de decidir.

WreckMatch LLC conecta víctimas con más de 800 bufetes participantes en minutos, sin costo para usted. No somos bufete y no podemos representarlo ni dar asesoría legal individual. El contenido aquí es educativo y se actualiza cuando cambian estatutos o prácticas comunes de aseguradoras. Judge Roy Waddell revisa el contexto legal publicado; su caso particular requiere un abogado con licencia en su estado.

Si tiene dudas sobre culpa comparativa, cobertura UM/UIM o plazos contra un vehículo del gobierno, anote las fechas del choque y llame antes de que venza cualquier aviso corto.

**[Emparejamiento gratuito →](https://www.wreckmatch.com/#form)** · **855 WRECKMATCH (855) 897-3256**

`;
      wc = wordCount(body);
    }
    const fm = {
      ...data,
      title: spanishTitle(meta.title),
      description: `Guía en español: ${String(data.description ?? meta.excerpt).slice(0, 200)}`,
      excerpt: meta.excerpt
        ? `Guía en español — ${meta.excerpt}`
        : `Guía en español para víctimas de accidentes. Emparejamiento gratuito en ~60 segundos.`,
      lang: "es",
      canonicalSlug: slug,
      presentationUrl: `/blog/presentations/es/${slug}.pptx`,
      presentationUrlEn: data.presentationUrl ?? `/blog/presentations/${slug}.pptx`,
      qualityTier: "platinum",
      platinumExpansion: true,
      readTime: `${Math.max(12, Math.round(wc / 220))} min de lectura`,
    };

    fs.writeFileSync(path.join(POSTS_ES, file), matter.stringify(body, fm), "utf8");
    console.log(`wrote es/${slug}: ${wc} words`);
    touched++;
  }
  console.log(`Done. ${touched} Spanish posts.`);
}

main();
