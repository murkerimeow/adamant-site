import type { MetadataRoute } from "next";

import { SITE_URL } from "@/site/seo";

const staticPaths = [
  "/",
  "/services",
  "/portfolio",
  "/catalog",
  "/blog",
  "/contacts",
  "/about",
  "/mortgage",
  "/vacancies",
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return staticPaths.map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: now,
    changeFrequency: path === "/" ? "weekly" : "monthly",
    priority: path === "/" ? 1 : 0.75,
  }));
}
