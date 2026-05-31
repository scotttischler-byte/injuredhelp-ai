import { getAllPosts } from "@/lib/posts";
import { headers } from "next/headers";
import { siteOriginFromHeaders } from "@/lib/site";

/** RSS feed — helps crawlers discover new blog posts quickly. */
export async function GET() {
  const h = await headers();
  const origin = siteOriginFromHeaders(h);
  const posts = (await getAllPosts()).slice(0, 100);

  const items = posts
    .map(
      (p) => `
    <item>
      <title><![CDATA[${escapeXml(p.title)}]]></title>
      <link>${origin}/blog/${p.slug}</link>
      <guid isPermaLink="true">${origin}/blog/${p.slug}</guid>
      <pubDate>${new Date(p.date).toUTCString()}</pubDate>
      <description><![CDATA[${escapeXml(p.excerpt ?? p.description ?? "")}]]></description>
    </item>`,
    )
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>WreckMatch Car &amp; Truck Accident Blog</title>
    <link>${origin}/blog</link>
    <description>Educational guides for accident victims — not legal advice.</description>
    <language>en-us</language>
    <atom:link href="${origin}/blog/rss.xml" rel="self" type="application/rss+xml"/>
    ${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}

function escapeXml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
