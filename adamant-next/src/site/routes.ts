const legacyCatalogItemPaths: Record<string, string> = {
  classic: "/catalog/klassicheskij-dom",
  commercial: "/catalog/otdelka-kommercheskogo-pomeshcheniya-card",
  frame: "/catalog/karkasnyj-dom-card",
  gasbeton: "/catalog/dom-iz-gazobetona-card",
  modern: "/catalog/sovremennyj-dom",
  onefloor: "/catalog/odnoetazhnyj-dom",
  renovation: "/catalog/remont-kvartir-card",
  terrace: "/catalog/dom-s-terrasoj",
  timber: "/catalog/dom-iz-brusa-card",
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
