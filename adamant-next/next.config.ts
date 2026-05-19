import { withPayload } from "@payloadcms/next/withPayload";
import type { NextConfig } from "next";

const cacheableAssetHeaders = [
  {
    key: "Cache-Control",
    value: "public, max-age=604800, stale-while-revalidate=86400",
  },
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source:
          "/:path*\\.(png|jpg|jpeg|gif|webp|avif|svg|ico|mp4|webm|woff|woff2)",
        headers: cacheableAssetHeaders,
      },
    ];
  },
};

export default withPayload(nextConfig);
