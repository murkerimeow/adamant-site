import type { MetadataRoute } from "next";

import { getCatalogItems, getPosts } from "@/site/cms";
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

function getLastModified(date?: string | null) {
  return date ? new Date(date) : new Date();
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const [catalogResult, postsResult] = await Promise.allSettled([
    getCatalogItems(),
    getPosts(),
  ]);

  const catalogItems =
    catalogResult.status === "fulfilled" ? catalogResult.value : [];
  const posts = postsResult.status === "fulfilled" ? postsResult.value : [];

  const staticEntries = staticPaths.map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: now,
    changeFrequency: path === "/" ? ("weekly" as const) : ("monthly" as const),
    priority: path === "/" ? 1 : 0.75,
  }));

  const catalogEntries = catalogItems.map((item) => ({
    url: `${SITE_URL}/catalog-item?item=${encodeURIComponent(item.itemKey)}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: item.showInCatalog ? 0.7 : 0.6,
  }));

  const postEntries = posts.map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: getLastModified(post.updatedAt || post.publishedAt),
    changeFrequency: "monthly" as const,
    priority: 0.65,
  }));

  return [...staticEntries, ...catalogEntries, ...postEntries];
}
