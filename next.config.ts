import type { NextConfig } from "next";

const indexNowKey = process.env.INDEXNOW_KEY?.trim();

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
  },
  experimental: {
    optimizePackageImports: ["react", "react-dom"],
  },
  async rewrites() {
    if (!indexNowKey) return [];
    return [{ source: `/${indexNowKey}.txt`, destination: "/api/indexnow-key" }];
  },
  async redirects() {
    return [
      { source: "/privacy-policy", destination: "/privacy", permanent: true },
      { source: "/terms-of-service", destination: "/terms", permanent: true },
    ];
  },
};

export default nextConfig;
