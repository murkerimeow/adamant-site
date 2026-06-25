import type { MetadataRoute } from "next";

import {
  getCatalogItems,
  getCatalogSitemapCategories,
  getPortfolioSitemapCategories,
  getPortfolioItems,
  getPosts,
} from "@/site/cms";
import {
  getCatalogCategoryPath,
  getCatalogItemPath,
  getPortfolioCategoryPath,
  getPortfolioItemPath,
} from "@/site/routes";
import { isIndexableLongFormText, SITE_URL } from "@/site/seo";

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
  "/privacy",
] as const;

function getLastModified(date?: string | null) {
  return date ? new Date(date) : new Date();
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const [catalogResult, categoryResult, postsResult, portfolioResult, portfolioCategoryResult] =
    await Promise.allSettled([
      getCatalogItems(),
      getCatalogSitemapCategories(),
      getPosts(),
      getPortfolioItems(),
      getPortfolioSitemapCategories(),
    ]);

  const catalogItems =
    catalogResult.status === "fulfilled" ? catalogResult.value : [];
  const catalogCategories =
    categoryResult.status === "fulfilled" ? categoryResult.value : [];
  const posts = postsResult.status === "fulfilled" ? postsResult.value : [];
  const portfolioItems =
    portfolioResult.status === "fulfilled" ? portfolioResult.value : [];
  const portfolioCategories =
    portfolioCategoryResult.status === "fulfilled" ? portfolioCategoryResult.value : [];

  const staticEntries = staticPaths.map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: now,
    changeFrequency: path === "/" ? ("weekly" as const) : ("monthly" as const),
    priority: path === "/" ? 1 : 0.75,
  }));

  const catalogEntries = catalogItems.map((item) => ({
    url: `${SITE_URL}${getCatalogItemPath(item)}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: item.showInCatalog ? 0.7 : 0.6,
  }));

  const catalogCategoryEntries = catalogCategories.map((category) => ({
    url: `${SITE_URL}${getCatalogCategoryPath(category)}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.72,
  }));

  const postEntries = posts
    .filter((post) => isIndexableLongFormText(post.content))
    .map((post) => ({
      url: `${SITE_URL}/blog/${post.slug}`,
      lastModified: getLastModified(post.updatedAt || post.publishedAt),
      changeFrequency: "monthly" as const,
      priority: 0.65,
    }));

  const portfolioEntries = portfolioItems.map((item) => ({
    url: `${SITE_URL}${getPortfolioItemPath(item)}`,
    lastModified: getLastModified(item.updatedAt),
    changeFrequency: "monthly" as const,
    priority: 0.65,
  }));

  const portfolioCategoryEntries = portfolioCategories.map((category) => ({
    url: `${SITE_URL}${getPortfolioCategoryPath(category)}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [
    ...staticEntries,
    ...catalogCategoryEntries,
    ...catalogEntries,
    ...portfolioCategoryEntries,
    ...portfolioEntries,
    ...postEntries,
  ];
}
