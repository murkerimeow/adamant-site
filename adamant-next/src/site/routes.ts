const legacyCatalogItemPaths: Record<string, string> = {
  classic: "/catalog/category/kamennye-doma",
  commercial: "/services/otdelka-kommercheskogo-pomeshcheniya",
  frame: "/catalog/category/karkasnye-doma",
  gasbeton: "/services/dom-iz-gazobetona",
  modern: "/catalog",
  onefloor: "/catalog/category/dachnye-doma",
  renovation: "/services/remont-kvartir",
  terrace: "/catalog",
  timber: "/catalog/category/doma-iz-brusa",
};

const legacyServiceSlugs: Record<string, string> = {
  "landshaftnij-dizayn": "landshaftnyy-dizayn",
};

export function getCatalogItemPath(item: {
  itemKey?: string | null;
  slug?: string | null;
}) {
  if (item.slug) {
    return `/catalog/${encodeURIComponent(item.slug)}`;
  }

  if (item.itemKey && legacyCatalogItemPaths[item.itemKey]) {
    return legacyCatalogItemPaths[item.itemKey];
  }

  return "/catalog";
}

export function getCatalogCategoryPath(category: { slug?: string | null }) {
  return category.slug ? `/catalog/category/${encodeURIComponent(category.slug)}` : "/catalog";
}

export function getPortfolioCategoryPath(category: { slug?: string | null }) {
  return category.slug
    ? `/portfolio/category/${encodeURIComponent(category.slug)}`
    : "/portfolio";
}

export function getLegacyCatalogItemPath(itemKey?: string | null) {
  if (!itemKey) return null;
  return legacyCatalogItemPaths[itemKey] ?? null;
}

export function getPortfolioItemPath(item: { slug?: string | null }) {
  return item.slug ? `/portfolio/${encodeURIComponent(item.slug)}` : "/portfolio";
}

export function getServicePath(service: { slug?: string | null }) {
  if (!service.slug) return "/services";
  return `/services/${encodeURIComponent(legacyServiceSlugs[service.slug] ?? service.slug)}`;
}
