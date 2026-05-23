import fs from "fs";
import path from "path";
import matter from "gray-matter";

const DIR = path.join(process.cwd(), "content", "press");

export type PressMeta = {
  title: string;
  description: string;
  date: string;
  slug: string;
  authorPerson?: "scott-tischler" | "kathy-carr";
  syndicatedUrl?: string;
};

const SKIP_FILES = new Set(["OUTREACH_TEMPLATES.md"]);

export function getAllPress(): PressMeta[] {
  if (!fs.existsSync(DIR)) return [];
  return fs
    .readdirSync(DIR)
    .filter((f) => f.endsWith(".md") && !SKIP_FILES.has(f))
    .map((file) => {
      const raw = fs.readFileSync(path.join(DIR, file), "utf8");
      const { data } = matter(raw);
      const slug = String(data.slug ?? file.replace(/\.md$/, ""));
      const author = data.authorPerson;
      return {
        title: String(data.title ?? slug),
        description: String(data.description ?? ""),
        date: String(data.date ?? new Date().toISOString().slice(0, 10)),
        slug,
        authorPerson:
          author === "scott-tischler" || author === "kathy-carr" ? author : undefined,
        syndicatedUrl: typeof data.syndicatedUrl === "string" ? data.syndicatedUrl : undefined,
      };
    })
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getPressBySlug(slug: string): { meta: PressMeta; content: string } | null {
  const file = path.join(DIR, `${slug}.md`);
  if (!fs.existsSync(file)) return null;
  const raw = fs.readFileSync(file, "utf8");
  const { data, content } = matter(raw);
  const author = data.authorPerson;
  const meta: PressMeta = {
    title: String(data.title ?? slug),
    description: String(data.description ?? ""),
    date: String(data.date ?? new Date().toISOString().slice(0, 10)),
    slug,
    authorPerson:
      author === "scott-tischler" || author === "kathy-carr" ? author : undefined,
    syndicatedUrl: typeof data.syndicatedUrl === "string" ? data.syndicatedUrl : undefined,
  };
  return { meta, content };
}
