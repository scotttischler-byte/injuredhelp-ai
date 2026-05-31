import fs from "fs";
import path from "path";
import { cache } from "react";
import matter from "gray-matter";
import type { BlogLocale } from "@/lib/blog-locale";
import { contentRootForBrand, serverSiteBrand } from "@/lib/site";

function blogRoots() {
  const root = path.join(process.cwd(), contentRootForBrand(serverSiteBrand()));
  return {
    en: path.join(root, "blog"),
    es: path.join(root, "blog/es"),
  };
}

function postsDir(locale: BlogLocale): string {
  const roots = blogRoots();
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

function ensureDir() {
  if (!fs.existsSync(blogRoots().en)) return false;
  return true;
}

function parseReadTime(body: string): string {
  const words = body.trim().split(/\s+/).length;
  const mins = Math.max(4, Math.round(words / 220));
  return `${mins} min read`;
}

function readAllPosts(): PostMeta[] {
  if (!ensureDir()) return [];
  const dir = blogRoots().en;
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

export const getAllPosts = cache(readAllPosts);

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

export function getPostBySlug(
  slug: string,
  locale: BlogLocale = "en",
): { meta: PostMeta; content: string } | null {
  if (locale === "en" && !ensureDir()) return null;
  return readPostFile(postsDir(locale), slug, locale);
}

export function getAllPostsEs(): PostMeta[] {
  const esDir = blogRoots().es;
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

function readAllSlugs(): string[] {
  if (!ensureDir()) return [];
  return fs
    .readdirSync(blogRoots().en)
    .filter((f) => f.endsWith(".md") || f.endsWith(".mdx"))
    .map((f) => f.replace(/\.mdx?$/, ""));
}

export const getAllSlugs = cache(readAllSlugs);
