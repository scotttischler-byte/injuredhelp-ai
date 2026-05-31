import path from "path";

/** Site URL from autopilot env (WRECKMATCH_SITE is set per site in apply_site_env). */
export function autopilotSiteUrl(): string {
  return (process.env.WRECKMATCH_SITE || "https://www.wreckmatch.com").replace(/\/$/, "");
}

/** EN/ES blog dirs — respects AUTOPILOT_BLOG_DIR for multi-site (e.g. sites/semitruckmatch/content/blog). */
export function autopilotBlogDirs(): { en: string; es: string } {
  const root = process.cwd();
  const enRaw = process.env.AUTOPILOT_BLOG_DIR;
  const en = enRaw
    ? path.isAbsolute(enRaw)
      ? enRaw
      : path.join(root, enRaw)
    : path.join(root, "content/blog");
  const esRaw = process.env.AUTOPILOT_BLOG_ES_DIR;
  const es = esRaw
    ? path.isAbsolute(esRaw)
      ? esRaw
      : path.join(root, esRaw)
    : path.join(en, "es");
  return { en, es };
}
