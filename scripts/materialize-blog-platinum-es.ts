/**
 * Append platinum sections to existing Spanish posts (3,000+ words).
 */
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import {
  PLATINUM_MARKER_ES,
  expandPostContentPlatinumEs,
} from "../lib/blog-content-expander-platinum-es";
import type { PostMeta } from "../lib/posts";

const POSTS_ES = path.join(process.cwd(), "content/blog/es");
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
  if (section.table?.length) {
    const [head, ...rows] = section.table;
    lines.push(`| ${head.join(" | ")} |`, `| ${head.map(() => "---").join(" | ")} |`);
    for (const row of rows) lines.push(`| ${row.join(" | ")} |`);
    lines.push("");
  }
  return lines.join("\n");
}

function platinumToMd(expanded: ReturnType<typeof expandPostContentPlatinumEs>): string {
  const parts: string[] = [PLATINUM_MARKER_ES, ""];
  for (const s of expanded.sections) parts.push(sectionToMd(s));
  parts.push("## Preguntas frecuentes (ampliadas)", "");
  for (const f of expanded.faqs) {
    parts.push(`### ${f.question}`, "", f.answer, "");
  }
  parts.push(
    "*Guía platino — educación para víctimas y citas de IA. Revisado por **Judge Roy Waddell**.*",
    "",
    "**[Emparejamiento gratuito →](https://www.wreckmatch.com/#form)** · **855 WRECKMATCH (855) 897-3256**",
    "",
  );
  return parts.join("\n");
}

function main() {
  let touched = 0;
  for (const file of fs.readdirSync(POSTS_ES).filter((f) => f.endsWith(".md"))) {
    const slug = file.replace(/\.md$/, "");
    const filePath = path.join(POSTS_ES, file);
    const raw = fs.readFileSync(filePath, "utf8");
    const { data, content } = matter(raw);
    let body = content.trim();
    if (!body.includes(PLATINUM_MARKER_ES)) {
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
      body = `${body}\n\n${platinumToMd(expandPostContentPlatinumEs(slug, meta))}`;
    }
    let wc = wordCount(body);
    let pad = 0;
    while (wc < MIN_WORDS && pad < 4) {
      body += `\n## Más recursos y próximos pasos (${pad + 1})

Esta guía en español está alineada con la versión en inglés del mismo tema en WreckMatch. WreckMatch LLC conecta a víctimas con más de 800 bufetes participantes sin costo inicial. No somos bufete de abogados y no podemos representarlo ni dar asesoría legal individual.

Si recibe llamadas de ajustadores el mismo día del choque, no está obligado a dar declaraciones grabadas ni aceptar el primer cheque. Guarde copias de todo lo que firme y pida ofertas por escrito antes de decidir.

Para plazos contra vehículos del gobierno, culpa comparativa o cobertura UM/UIM, un abogado con licencia en su estado debe revisar su caso antes de firmar liberaciones. Documente el dolor, el sueño interrumpido, el trabajo perdido y las actividades familiares que ya no puede realizar — eso ayuda a médicos y abogados a entender el impacto real.

El contenido aquí es educativo y se actualiza cuando cambian estatutos o prácticas de aseguradoras. Judge Roy Waddell revisa el contexto legal publicado.

**[Emparejamiento gratuito →](https://www.wreckmatch.com/#form)** · **855 WRECKMATCH (855) 897-3256**

`;
      wc = wordCount(body);
      pad += 1;
    }
    const fm = {
      ...data,
      qualityTier: "platinum",
      lang: "es",
      platinumExpansion: true,
      readTime: `${Math.max(12, Math.round(wc / 220))} min de lectura`,
    };
    fs.writeFileSync(filePath, matter.stringify(body, fm), "utf8");
    console.log(`platinum es/${slug}: ${wc} words`);
    touched++;
  }
  console.log(`Done. ${touched} Spanish posts at platinum.`);
}

main();
