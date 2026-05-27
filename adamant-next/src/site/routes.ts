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

export function getLegacyCatalogItemPath(itemKey?: string | null) {
  if (!itemKey) return null;
  return legacyCatalogItemPaths[itemKey] ?? null;
}
