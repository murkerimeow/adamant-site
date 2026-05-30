import type { MetadataRoute } from "next";

import { SITE_URL } from "@/site/seo";

export default function robots(): MetadataRoute.Robots {
  const host = new URL(SITE_URL).host;

  return {
    host,
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/admin",
        "/api/",
        "/catalog-item",
        "/home",
        "/wp-admin/",
        "/wp-content/",
        "/wp-includes/",
        "/wp-json/",
        "/wp-login.php",
        "/xmlrpc.php",
        "/*?attachment_id=",
        "/*?p=",
        "/*?page_id=",
        "/*?preview=",
        "/*?s=",
      ],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
