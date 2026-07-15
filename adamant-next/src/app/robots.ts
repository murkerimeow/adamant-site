import type { MetadataRoute } from "next";

import { SITE_URL } from "@/site/seo";

export default function robots(): MetadataRoute.Robots {
  const host = new URL(SITE_URL).host;

  return {
    host,
    rules: {
      userAgent: "*",
      allow: ["/", "/api/media/file/"],
      disallow: [
        "/admin",
        "/api/",
        "/catalog-item",
        "/catalog-item/",
        "/home",
        "/home/",
      ],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
