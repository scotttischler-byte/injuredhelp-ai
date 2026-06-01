/** Lightweight blog file counts (no posts.ts / request headers — safe for API lambdas). */
import fs from "fs";
import path from "path";

const EN_ROOTS = ["content/blog", "sites/semitruckmatch/content/blog"];
const ES_ROOTS = ["content/blog/es", "sites/semitruckmatch/content/blog/es"];

export function countEnBlogMd(): number {
  let n = 0;
  for (const root of EN_ROOTS) {
    const dir = path.join(process.cwd(), root);
    if (!fs.existsSync(dir)) continue;
    n += fs.readdirSync(dir).filter((f) => f.endsWith(".md") || f.endsWith(".mdx")).length;
  }
  return n;
}

export function countEsBlogMd(): number {
  let n = 0;
  for (const root of ES_ROOTS) {
    const dir = path.join(process.cwd(), root);
    if (!fs.existsSync(dir)) continue;
    n += fs.readdirSync(dir).filter((f) => f.endsWith(".md")).length;
  }
  return n;
}

export function listEnSlugsMerged(limit?: number): string[] {
  const seen = new Set<string>();
  const slugs: string[] = [];
  for (const root of EN_ROOTS) {
    const dir = path.join(process.cwd(), root);
    if (!fs.existsSync(dir)) continue;
    for (const f of fs.readdirSync(dir)) {
      if (!f.endsWith(".md") && !f.endsWith(".mdx")) continue;
      const slug = f.replace(/\.mdx?$/, "");
      if (!seen.has(slug)) {
        seen.add(slug);
        slugs.push(slug);
      }
    }
  }
  return limit ? slugs.slice(0, limit) : slugs;
}

export function listEnSlugsForBrand(brand: "wreckmatch" | "injuredhelp" | "semitruckmatch", limit?: number): string[] {
  const roots =
    brand === "semitruckmatch"
      ? ["sites/semitruckmatch/content/blog"]
      : ["content/blog"];
  const slugs: string[] = [];
  for (const root of roots) {
    const dir = path.join(process.cwd(), root);
    if (!fs.existsSync(dir)) continue;
    for (const f of fs.readdirSync(dir)) {
      if (!f.endsWith(".md") && !f.endsWith(".mdx")) continue;
      slugs.push(f.replace(/\.mdx?$/, ""));
    }
  }
  return limit ? slugs.slice(0, limit) : slugs;
}

export function listEsSlugsForBrand(brand: "wreckmatch" | "injuredhelp" | "semitruckmatch", limit?: number): string[] {
  const roots =
    brand === "semitruckmatch"
      ? ["sites/semitruckmatch/content/blog/es"]
      : ["content/blog/es"];
  const slugs: string[] = [];
  for (const root of roots) {
    const dir = path.join(process.cwd(), root);
    if (!fs.existsSync(dir)) continue;
    for (const f of fs.readdirSync(dir)) {
      if (!f.endsWith(".md")) continue;
      slugs.push(f.replace(/\.md$/, ""));
    }
  }
  return limit ? slugs.slice(0, limit) : slugs;
}

export function listEsSlugsMerged(limit?: number): string[] {
  const seen = new Set<string>();
  const slugs: string[] = [];
  for (const root of ES_ROOTS) {
    const dir = path.join(process.cwd(), root);
    if (!fs.existsSync(dir)) continue;
    for (const f of fs.readdirSync(dir)) {
      if (!f.endsWith(".md")) continue;
      const slug = f.replace(/\.md$/, "");
      if (!seen.has(slug)) {
        seen.add(slug);
        slugs.push(slug);
      }
    }
  }
  return limit ? slugs.slice(0, limit) : slugs;
}
