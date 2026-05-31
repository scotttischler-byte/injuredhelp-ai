import type { NextConfig } from "next";

const indexNowKey = process.env.INDEXNOW_KEY?.trim();

const nextConfig: NextConfig = {
  compress: true,
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 30,
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "picsum.photos" },
      { protocol: "https", hostname: "fastly.picsum.photos" },
    ],
  },
  experimental: {
    optimizePackageImports: ["react", "react-dom", "react-markdown", "remark-gfm"],
  },
  outputFileTracingIncludes: {
    "/blog": ["./content/blog/**/*", "./sites/semitruckmatch/content/blog/**/*"],
    "/blog/[slug]": ["./content/blog/**/*", "./sites/semitruckmatch/content/blog/**/*"],
    "/es/blog": ["./content/blog/es/**/*", "./sites/semitruckmatch/content/blog/es/**/*"],
    "/es/blog/[slug]": ["./content/blog/es/**/*", "./sites/semitruckmatch/content/blog/es/**/*"],
    "/sitemap.xml": ["./content/blog/**/*", "./sites/semitruckmatch/content/blog/**/*"],
  },
  outputFileTracingExcludes: {
    "/api/automation/blog": ["./content/**", "./sites/**", "./public/blog/**"],
    "/api/automation/health": ["./content/**", "./sites/**", "./public/blog/**"],
    "/api/exposure/cron": ["./content/**", "./sites/**", "./public/blog/**"],
    "/api/indexing/cron": ["./content/**", "./sites/**", "./public/blog/**"],
    "/api/indexnow-key": ["./content/**", "./sites/**", "./public/blog/**"],
  },
  async headers() {
    return [
      {
        source: "/blog/presentations/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400, stale-while-revalidate=604800",
          },
          {
            key: "Content-Type",
            value: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
          },
        ],
      },
      {
        source: "/blog/covers/generated/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/blog/covers/generated-v2/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/blog/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, s-maxage=3600, stale-while-revalidate=86400",
          },
        ],
      },
      {
        source: "/((?!api/).*)",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
        ],
      },
    ];
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
