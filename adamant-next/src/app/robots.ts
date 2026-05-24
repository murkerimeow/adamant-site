import type { MetadataRoute } from "next";

import { SITE_URL } from "@/site/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/api/chat", "/api/request-with-photos", "/api/telegram"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
