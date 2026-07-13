import type { MetadataRoute } from "next";

import {
  getAboutPage,
  getBlogPage,
  getCatalogLandingCategorySlug,
  getCatalogItems,
  getCatalogPage,
  getCatalogSitemapCategories,
  getContactsPage,
  getHomePage,
  getPortfolioCategorySlug,
  getPortfolioItems,
  getPortfolioPage,
  getPortfolioSitemapCategories,
  getPosts,
  getServices,
  getServicesPage,
  getVacancies,
} from "@/site/cms";
import {
  getCatalogCategoryPath,
  getCatalogItemPath,
  getPortfolioCategoryPath,
  getPortfolioItemPath,
  getServicePath,
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
] as const;

const fallbackLastModified = new Date("2026-07-13T00:00:00.000Z");

export const revalidate = 86400;

function getLastModified(date?: string | null, fallback = fallbackLastModified) {
  if (!date) return fallback;

  const parsed = new Date(date);

  return Number.isNaN(parsed.getTime()) ? fallback : parsed;
}

function getMaxLastModified(...dates: Array<string | null | undefined>) {
  return dates
    .map((date) => getLastModified(date))
    .reduce(
      (latest, current) => (current > latest ? current : latest),
      fallbackLastModified,
    );
}

function getSettledValue<T>(result: PromiseSettledResult<T>) {
  return result.status === "fulfilled" ? result.value : null;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [
    aboutPageResult,
    blogPageResult,
    catalogPageResult,
    catalogResult,
    categoryResult,
    contactsPageResult,
    homePageResult,
    postsResult,
    portfolioPageResult,
    portfolioResult,
    portfolioCategoryResult,
    servicesPageResult,
    serviceResult,
    vacanciesResult,
  ] = await Promise.allSettled([
    getAboutPage(),
    getBlogPage(),
    getCatalogPage(),
    getCatalogItems(),
    getCatalogSitemapCategories(),
    getContactsPage(),
    getHomePage(),
    getPosts(),
    getPortfolioPage(),
    getPortfolioItems(),
    getPortfolioSitemapCategories(),
    getServicesPage(),
    getServices(),
    getVacancies(),
  ]);

  const aboutPage = getSettledValue(aboutPageResult);
  const blogPage = getSettledValue(blogPageResult);
  const catalogPage = getSettledValue(catalogPageResult);
  const catalogItems =
    catalogResult.status === "fulfilled" ? catalogResult.value : [];
  const catalogCategories =
    categoryResult.status === "fulfilled" ? categoryResult.value : [];
  const contactsPage = getSettledValue(contactsPageResult);
  const homePage = getSettledValue(homePageResult);
  const posts = postsResult.status === "fulfilled" ? postsResult.value : [];
  const portfolioPage = getSettledValue(portfolioPageResult);
  const portfolioItems =
    portfolioResult.status === "fulfilled" ? portfolioResult.value : [];
  const portfolioCategories =
    portfolioCategoryResult.status === "fulfilled"
      ? portfolioCategoryResult.value
      : [];
  const servicesPage = getSettledValue(servicesPageResult);
  const services = serviceResult.status === "fulfilled" ? serviceResult.value : [];
  const vacancies =
    vacanciesResult.status === "fulfilled" ? vacanciesResult.value : [];
  const visibleCatalogCategorySlugs = new Set(
    catalogItems
      .filter((item) => item.showInCatalog === true)
      .map(getCatalogLandingCategorySlug)
      .filter(Boolean),
  );
  const visiblePortfolioCategorySlugs = new Set(
    portfolioItems.map(getPortfolioCategorySlug).filter(Boolean),
  );
  const staticLastModifiedByPath = new Map<string, Date>([
    ["/", getLastModified(homePage?.updatedAt)],
    ["/services", getLastModified(servicesPage?.updatedAt)],
    ["/portfolio", getLastModified(portfolioPage?.updatedAt)],
    ["/catalog", getLastModified(catalogPage?.updatedAt)],
    ["/blog", getLastModified(blogPage?.updatedAt)],
    ["/contacts", getLastModified(contactsPage?.updatedAt)],
    ["/about", getLastModified(aboutPage?.updatedAt)],
    ["/mortgage", fallbackLastModified],
    [
      "/vacancies",
      vacancies.length
        ? getMaxLastModified(...vacancies.map((vacancy) => vacancy.updatedAt))
        : fallbackLastModified,
    ],
  ]);

  const staticEntries = staticPaths.map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: staticLastModifiedByPath.get(path) ?? fallbackLastModified,
    changeFrequency: path === "/" ? ("weekly" as const) : ("monthly" as const),
    priority: path === "/" ? 1 : 0.75,
  }));

  const catalogEntries = catalogItems.map((item) => ({
    url: `${SITE_URL}${getCatalogItemPath(item)}`,
    lastModified: getLastModified(item.updatedAt),
    changeFrequency: "monthly" as const,
    priority: item.showInCatalog ? 0.7 : 0.6,
  }));

  const catalogCategoryEntries = catalogCategories
    .filter((category) => visibleCatalogCategorySlugs.has(category.slug))
    .map((category) => ({
      url: `${SITE_URL}${getCatalogCategoryPath(category)}`,
      lastModified: getMaxLastModified(
        category.updatedAt,
        ...catalogItems
          .filter((item) => getCatalogLandingCategorySlug(item) === category.slug)
          .map((item) => item.updatedAt),
      ),
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

  const portfolioCategoryEntries = portfolioCategories
    .filter((category) => visiblePortfolioCategorySlugs.has(category.slug))
    .map((category) => ({
      url: `${SITE_URL}${getPortfolioCategoryPath(category)}`,
      lastModified: getMaxLastModified(
        category.updatedAt,
        ...portfolioItems
          .filter((item) => getPortfolioCategorySlug(item) === category.slug)
          .map((item) => item.updatedAt),
      ),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));

  const serviceEntries = [
    ...services
      .filter((service) => service.slug !== "landshaftnij-dizayn")
      .map((service) => ({
        url: `${SITE_URL}${getServicePath(service)}`,
        lastModified: getLastModified(service.updatedAt),
        changeFrequency: "monthly" as const,
        priority: 0.7,
      })),
    ...(services.some((service) => service.slug === "landshaftnyy-dizayn")
      ? []
      : [
          {
            url: `${SITE_URL}/services/landshaftnyy-dizayn`,
            lastModified: fallbackLastModified,
            changeFrequency: "monthly" as const,
            priority: 0.68,
          },
        ]),
  ];

  return [
    ...staticEntries,
    ...serviceEntries,
    ...catalogCategoryEntries,
    ...catalogEntries,
    ...portfolioCategoryEntries,
    ...portfolioEntries,
    ...postEntries,
  ];
}
