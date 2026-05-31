import fs from "fs";
import path from "path";
import { cache } from "react";
import matter from "gray-matter";
import type { BlogLocale } from "@/lib/blog-locale";
import { contentRootForBrand } from "@/lib/site";
import { requestSiteBrand } from "@/lib/request-brand";

function blogRootsForBrand(brand: Awaited<ReturnType<typeof requestSiteBrand>>) {
  const root = path.join(process.cwd(), contentRootForBrand(brand));
  return {
    en: path.join(root, "blog"),
    es: path.join(root, "blog/es"),
  };
}

async function blogRoots() {
  const brand = await requestSiteBrand();
  return blogRootsForBrand(brand);
}

async function postsDir(locale: BlogLocale): Promise<string> {
  const roots = await blogRoots();
  return locale === "es" ? roots.es : roots.en;
}

export interface PostMeta {
  title: string;
  description: string;
  date: string;
  state?: string;
  category: string;
  slug: string;
  excerpt: string;
  readTime: string;
  coverImage?: string;
  coverAlt?: string;
  presentationUrl?: string;
  lang?: BlogLocale;
  canonicalSlug?: string;
  authorId?: string;
  reviewerId?: string;
}

async function ensureDir() {
  const roots = await blogRoots();
  if (!fs.existsSync(roots.en)) return false;
  return true;
}

function parseReadTime(body: string): string {
  const words = body.trim().split(/\s+/).length;
  const mins = Math.max(4, Math.round(words / 220));
  return `${mins} min read`;
}

async function readAllPosts(): Promise<PostMeta[]> {
  if (!(await ensureDir())) return [];
  const dir = (await blogRoots()).en;
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".md") || f.endsWith(".mdx"));
  const posts = files.map((filename) => {
    const slug = filename.replace(/\.mdx?$/, "");
    const raw = fs.readFileSync(path.join(dir, filename), "utf8");
    const { data, content } = matter(raw);
    const excerpt =
      typeof data.excerpt === "string"
        ? data.excerpt
        : content.replace(/^---[\s\S]*?---/, "").slice(0, 200).trim() + "…";
    return {
      title: String(data.title ?? slug),
      description: String(data.description ?? excerpt),
      date:
        data.date instanceof Date
          ? data.date.toISOString().slice(0, 10)
          : String(data.date ?? new Date().toISOString().slice(0, 10)),
      state: data.state ? String(data.state) : undefined,
      category: String(data.category ?? "Resources"),
      slug,
      excerpt,
      readTime: String(data.readTime ?? parseReadTime(content)),
      coverImage: data.coverImage ? String(data.coverImage) : undefined,
      coverAlt: data.coverAlt ? String(data.coverAlt) : undefined,
      presentationUrl: data.presentationUrl ? String(data.presentationUrl) : undefined,
      authorId: data.authorId ? String(data.authorId) : undefined,
      reviewerId: data.reviewerId ? String(data.reviewerId) : undefined,
    } satisfies PostMeta;
  });
  return posts.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export const getAllPosts = cache(async () => readAllPosts());

function readPostFile(
  dir: string,
  slug: string,
  locale: BlogLocale,
): { meta: PostMeta; content: string } | null {
  if (!fs.existsSync(dir)) return null;
  for (const ext of [".mdx", ".md"]) {
    const file = path.join(dir, `${slug}${ext}`);
    if (fs.existsSync(file)) {
      const raw = fs.readFileSync(file, "utf8");
      const { data, content } = matter(raw);
      const excerpt =
        typeof data.excerpt === "string"
          ? data.excerpt
          : content.replace(/^---[\s\S]*?---/, "").slice(0, 200).trim() + "…";
      const meta: PostMeta = {
        title: String(data.title ?? slug),
        description: String(data.description ?? excerpt),
        date:
        data.date instanceof Date
          ? data.date.toISOString().slice(0, 10)
          : String(data.date ?? new Date().toISOString().slice(0, 10)),
        state: data.state ? String(data.state) : undefined,
        category: String(data.category ?? "Resources"),
        slug,
        excerpt,
        readTime: String(data.readTime ?? parseReadTime(content)),
        coverImage: data.coverImage ? String(data.coverImage) : undefined,
        coverAlt: data.coverAlt ? String(data.coverAlt) : undefined,
        presentationUrl: data.presentationUrl ? String(data.presentationUrl) : undefined,
        authorId: data.authorId ? String(data.authorId) : undefined,
        reviewerId: data.reviewerId ? String(data.reviewerId) : undefined,
        lang: locale,
        canonicalSlug: data.canonicalSlug ? String(data.canonicalSlug) : slug,
      };
      return { meta, content };
    }
  }
  return null;
}

export async function getPostBySlug(
  slug: string,
  locale: BlogLocale = "en",
): Promise<{ meta: PostMeta; content: string } | null> {
  if (locale === "en" && !(await ensureDir())) return null;
  return readPostFile(await postsDir(locale), slug, locale);
}

export async function getAllPostsEs(): Promise<PostMeta[]> {
  const esDir = (await blogRoots()).es;
  if (!fs.existsSync(esDir)) return [];
  const files = fs.readdirSync(esDir).filter((f) => f.endsWith(".md"));
  return files
    .map((filename) => {
      const slug = filename.replace(/\.md$/, "");
      const post = readPostFile(esDir, slug, "es");
      return post?.meta;
    })
    .filter((p): p is PostMeta => Boolean(p))
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

async function readAllSlugs(): Promise<string[]> {
  if (!(await ensureDir())) return [];
  return fs
    .readdirSync((await blogRoots()).en)
    .filter((f) => f.endsWith(".md") || f.endsWith(".mdx"))
    .map((f) => f.replace(/\.mdx?$/, ""));
}

export const getAllSlugs = cache(async () => readAllSlugs());

function readAllPostsSync(brand: ReturnType<typeof import("@/lib/site").serverSiteBrand>): PostMeta[] {
  const dir = blogRootsForBrand(brand).en;
  if (!fs.existsSync(dir)) return [];
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".md") || f.endsWith(".mdx"));
  const posts = files.map((filename) => {
    const slug = filename.replace(/\.mdx?$/, "");
    const raw = fs.readFileSync(path.join(dir, filename), "utf8");
    const { data, content } = matter(raw);
    const excerpt =
      typeof data.excerpt === "string"
        ? data.excerpt
        : content.replace(/^---[\s\S]*?---/, "").slice(0, 200).trim() + "…";
    return {
      title: String(data.title ?? slug),
      description: String(data.description ?? excerpt),
      date:
        data.date instanceof Date
          ? data.date.toISOString().slice(0, 10)
          : String(data.date ?? new Date().toISOString().slice(0, 10)),
      state: data.state ? String(data.state) : undefined,
      category: String(data.category ?? "Resources"),
      slug,
      excerpt,
      readTime: String(data.readTime ?? parseReadTime(content)),
      coverImage: data.coverImage ? String(data.coverImage) : undefined,
      coverAlt: data.coverAlt ? String(data.coverAlt) : undefined,
      presentationUrl: data.presentationUrl ? String(data.presentationUrl) : undefined,
      authorId: data.authorId ? String(data.authorId) : undefined,
      reviewerId: data.reviewerId ? String(data.reviewerId) : undefined,
    } satisfies PostMeta;
  });
  return posts.sort((a, b) => (a.date < b.date ? 1 : -1));
}

/** Cron/scripts: merge EN posts from wreckmatch + semitruckmatch corpora. */
export function getAllPostsMerged(): PostMeta[] {
  const seen = new Set<string>();
  const out: PostMeta[] = [];
  for (const brand of ["wreckmatch", "semitruckmatch"] as const) {
    for (const p of readAllPostsSync(brand)) {
      if (!seen.has(p.slug)) {
        seen.add(p.slug);
        out.push(p);
      }
    }
  }
  return out.sort((a, b) => (a.date < b.date ? 1 : -1));
}

/** All EN slugs across wreckmatch + semitruckmatch (static generation). */
export function allBlogSlugsUnion(): string[] {
  const slugs = new Set<string>();
  for (const brand of ["wreckmatch", "semitruckmatch"] as const) {
    const en = blogRootsForBrand(brand).en;
    if (!fs.existsSync(en)) continue;
    for (const f of fs.readdirSync(en)) {
      if (f.endsWith(".md") || f.endsWith(".mdx")) slugs.add(f.replace(/\.mdx?$/, ""));
    }
  }
  return [...slugs];
}
