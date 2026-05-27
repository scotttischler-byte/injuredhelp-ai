import fs from "fs";
import path from "path";
import { cache } from "react";
import matter from "gray-matter";
import type { BlogLocale } from "@/lib/blog-locale";

const POSTS_DIR = path.join(process.cwd(), "content/blog");
const POSTS_ES_DIR = path.join(process.cwd(), "content/blog/es");

function postsDir(locale: BlogLocale): string {
  return locale === "es" ? POSTS_ES_DIR : POSTS_DIR;
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
}

function ensureDir() {
  if (!fs.existsSync(POSTS_DIR)) return false;
  return true;
}

function parseReadTime(body: string): string {
  const words = body.trim().split(/\s+/).length;
  const mins = Math.max(4, Math.round(words / 220));
  return `${mins} min read`;
}

function readAllPosts(): PostMeta[] {
  if (!ensureDir()) return [];
  const files = fs.readdirSync(POSTS_DIR).filter((f) => f.endsWith(".md") || f.endsWith(".mdx"));
  const posts = files.map((filename) => {
    const slug = filename.replace(/\.mdx?$/, "");
    const raw = fs.readFileSync(path.join(POSTS_DIR, filename), "utf8");
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
  if (!fs.existsSync(POSTS_ES_DIR)) return [];
  const files = fs.readdirSync(POSTS_ES_DIR).filter((f) => f.endsWith(".md"));
  return files
    .map((filename) => {
      const slug = filename.replace(/\.md$/, "");
      const post = readPostFile(POSTS_ES_DIR, slug, "es");
      return post?.meta;
    })
    .filter((p): p is PostMeta => Boolean(p))
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

function readAllSlugs(): string[] {
  if (!ensureDir()) return [];
  return fs
    .readdirSync(POSTS_DIR)
    .filter((f) => f.endsWith(".md") || f.endsWith(".mdx"))
    .map((f) => f.replace(/\.mdx?$/, ""));
}

export const getAllSlugs = cache(readAllSlugs);
