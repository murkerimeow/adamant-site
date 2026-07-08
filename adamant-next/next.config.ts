import { withPayload } from "@payloadcms/next/withPayload";
import type { NextConfig } from "next";

const cacheableAssetHeaders = [
  {
    key: "Cache-Control",
    value: "public, max-age=604800, stale-while-revalidate=86400",
  },
];

const cacheablePageHeaders = [
  {
    key: "Cache-Control",
    value: "public, max-age=0, s-maxage=600, stale-while-revalidate=3600",
  },
];

const noIndexHeaders = [
  {
    key: "X-Robots-Tag",
    value: "noindex, nofollow, noarchive",
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
  poweredByHeader: false,
  skipTrailingSlashRedirect: true,
  async headers() {
    return [
      {
        source: "/((?!admin|api|_next|.*\\..*).*)",
        headers: cacheablePageHeaders,
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
        source: "/api/:path*",
        headers: noIndexHeaders,
      },
    ];
  },
};

export default withPayload(nextConfig);
