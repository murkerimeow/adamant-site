import { withPayload } from "@payloadcms/next/withPayload";
import type { NextConfig } from "next";

const cacheableAssetHeaders = [
  {
    key: "Cache-Control",
    value: "public, max-age=604800, stale-while-revalidate=86400",
  },
];

const metadataRouteHeaders = [
  {
    key: "Cache-Control",
    value: "public, max-age=3600, s-maxage=86400, stale-while-revalidate=86400",
  },
];

const securityHeaders = [
  {
    key: "Strict-Transport-Security",
    value: "max-age=31536000; includeSubDomains; preload",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "X-Frame-Options",
    value: "SAMEORIGIN",
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()",
  },
];

const noIndexHeaders = [
  {
    key: "X-Robots-Tag",
    value: "noindex, nofollow, noarchive",
  },
];

const privatePageHeaders = [
  ...noIndexHeaders,
  {
    key: "Cache-Control",
    value: "private, no-store, max-age=0",
  },
];

const uploadBodyLimit = "250mb";

const nextConfig: NextConfig = {
  experimental: {
    proxyClientMaxBodySize: uploadBodyLimit,
    serverActions: {
      bodySizeLimit: uploadBodyLimit,
    },
  },
  skipTrailingSlashRedirect: true,
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
      {
        source: "/robots.txt",
        headers: metadataRouteHeaders,
      },
      {
        source: "/sitemap.xml",
        headers: metadataRouteHeaders,
      },
      {
        source:
          "/:path*\\.(png|jpg|jpeg|gif|webp|avif|svg|ico|mp4|webm|woff|woff2)",
        headers: cacheableAssetHeaders,
      },
      {
        source: "/admin/:path*",
        headers: noIndexHeaders,
      },
      {
        source: "/client",
        headers: privatePageHeaders,
      },
      {
        source: "/client/:path*",
        headers: privatePageHeaders,
      },
    ];
  },
};

export default withPayload(nextConfig);
