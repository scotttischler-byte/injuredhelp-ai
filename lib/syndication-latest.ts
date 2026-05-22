import fs from "fs";
import path from "path";

export type SyndicationPack = {
  slug: string;
  url: string;
  title: string;
  generated_at: string;
  vertical?: string;
  twitter?: string;
  linkedin?: string;
  facebook?: string;
  reddit_title?: string;
  reddit_body?: string;
  hashtags?: string[];
};

export function readLatestSyndication(): SyndicationPack | null {
  const file = path.join(process.cwd(), "content/syndication/latest.json");
  if (!fs.existsSync(file)) return null;
  try {
    return JSON.parse(fs.readFileSync(file, "utf8")) as SyndicationPack;
  } catch {
    return null;
  }
}
