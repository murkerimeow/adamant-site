import { DEFAULT_OG_IMAGE, SITE_NAME, SITE_URL } from "@/site/seo";

type StructuredDataNode = Record<string, unknown>;

type BreadcrumbItem = {
  name: string;
  path: string;
};

export function absoluteUrl(path: string) {
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

function cleanText(value?: string | null) {
  return value?.replace(/\s+/g, " ").trim() || undefined;
}

export function buildStructuredDataGraph(
  ...nodes: Array<StructuredDataNode | null | undefined>
) {
  return {
    "@context": "https://schema.org",
    "@graph": nodes.filter(Boolean),
  };
}

export function buildBreadcrumbList(items: BreadcrumbItem[]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      item: absoluteUrl(item.path),
      name: item.name,
      position: index + 1,
    })),
  };
}

export function buildWebPageStructuredData({
  description,
  path,
  title,
}: {
  description?: string | null;
  path: string;
  title: string;
}) {
  return {
    "@id": `${absoluteUrl(path)}#webpage`,
    "@type": "WebPage",
    description: cleanText(description),
    inLanguage: "ru-RU",
    isPartOf: {
      "@id": `${SITE_URL}/#website`,
    },
    name: title,
    url: absoluteUrl(path),
  };
}

export function buildItemListStructuredData(
  items: Array<{
    name: string;
    path: string;
  }>,
) {
  return {
    "@type": "ItemList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      item: absoluteUrl(item.path),
      name: item.name,
      position: index + 1,
    })),
  };
}

export function buildBlogPostingStructuredData({
  dateModified,
  datePublished,
  description,
  imageUrl,
  path,
  title,
}: {
  dateModified?: string | null;
  datePublished?: string | null;
  description?: string | null;
  imageUrl?: string | null;
  path: string;
  title: string;
}) {
  return {
    "@id": `${absoluteUrl(path)}#blog-posting`,
    "@type": "BlogPosting",
    author: {
      "@id": `${SITE_URL}/#organization`,
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
    dateModified: dateModified || datePublished || undefined,
    datePublished: datePublished || dateModified || undefined,
    description: cleanText(description),
    headline: title,
    image: absoluteUrl(imageUrl || DEFAULT_OG_IMAGE),
    inLanguage: "ru-RU",
    mainEntityOfPage: absoluteUrl(path),
    publisher: {
      "@id": `${SITE_URL}/#organization`,
      "@type": "Organization",
      logo: {
        "@type": "ImageObject",
        url: absoluteUrl("/logo-new.PNG"),
      },
      name: SITE_NAME,
      url: SITE_URL,
    },
  };
}

export function buildPortfolioWorkStructuredData({
  description,
  path,
  title,
}: {
  description?: string | null;
  path: string;
  title: string;
}) {
  return {
    "@id": `${absoluteUrl(path)}#work`,
    "@type": "CreativeWork",
    about: cleanText(description),
    creator: {
      "@id": `${SITE_URL}/#organization`,
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
    inLanguage: "ru-RU",
    name: title,
    url: absoluteUrl(path),
  };
}

export function buildCatalogProjectStructuredData({
  description,
  path,
  price,
  title,
}: {
  description?: string | null;
  path: string;
  price?: number | null;
  title: string;
}) {
  return {
    "@id": `${absoluteUrl(path)}#project`,
    "@type": "Product",
    brand: {
      "@id": `${SITE_URL}/#organization`,
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
    category: "Проект загородного дома",
    description: cleanText(description),
    name: title,
    offers:
      typeof price === "number" && price > 0
        ? {
            "@type": "Offer",
            availability: "https://schema.org/InStock",
            price,
            priceCurrency: "RUB",
            url: absoluteUrl(path),
          }
        : undefined,
    url: absoluteUrl(path),
  };
}

export function buildServiceStructuredData({
  description,
  path,
  title,
}: {
  description?: string | null;
  path: string;
  title: string;
}) {
  return {
    "@id": `${absoluteUrl(path)}#service`,
    "@type": "Service",
    areaServed: [
      {
        "@type": "AdministrativeArea",
        name: "Санкт-Петербург",
      },
      {
        "@type": "AdministrativeArea",
        name: "Ленинградская область",
      },
    ],
    description: cleanText(description),
    name: title,
    provider: {
      "@id": `${SITE_URL}/#organization`,
      "@type": "HomeAndConstructionBusiness",
      name: SITE_NAME,
      url: SITE_URL,
    },
    serviceType: title,
    url: absoluteUrl(path),
  };
}

export function stringifyStructuredData(data: unknown) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
