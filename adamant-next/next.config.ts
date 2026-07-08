import { withPayload } from "@payloadcms/next/withPayload";
import type { NextConfig } from "next";

const cacheableAssetHeaders = [
  {
    key: "Cache-Control",
    value: "public, max-age=604800, stale-while-revalidate=86400",
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
  async headers() {
    return [
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
