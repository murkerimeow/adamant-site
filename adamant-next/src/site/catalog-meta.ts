import type { CatalogItemDoc } from "@/site/cms";

export type CatalogCardMeta = {
  area: string;
  floors: string;
  photoCount: number;
  price: number;
  rooms: string;
};

const fallbackByKey: Record<string, Omit<CatalogCardMeta, "photoCount">> = {
  classic: {
    area: "175 м²",
    floors: "2 этажа",
    price: 16500000,
    rooms: "4 комнаты",
  },
  frame: {
    area: "98 м²",
    floors: "1 этаж",
    price: 8900000,
    rooms: "2 комнаты",
  },
  gasbeton: {
    area: "150 м²",
    floors: "2 этажа",
    price: 15900000,
    rooms: "4 комнаты",
  },
  modern: {
    area: "216 м²",
    floors: "2 этажа",
    price: 18100000,
    rooms: "5 комнат",
  },
  onefloor: {
    area: "100 м²",
    floors: "1 этаж",
    price: 5400000,
    rooms: "3 комнаты",
  },
  terrace: {
    area: "150 м²",
    floors: "2 этажа",
    price: 15900000,
    rooms: "4 комнаты",
  },
  timber: {
    area: "129 м²",
    floors: "1 этаж",
    price: 11800000,
    rooms: "3 комнаты",
  },
};

const fallbackMeta: Omit<CatalogCardMeta, "photoCount"> = {
  area: "120 м²",
  floors: "1 этаж",
  price: 8900000,
  rooms: "3 комнаты",
};

function formatCount(value: number, forms: [string, string, string]) {
  const normalized = Math.abs(value) % 100;
  const lastDigit = normalized % 10;

  if (normalized > 10 && normalized < 20) return forms[2];
  if (lastDigit > 1 && lastDigit < 5) return forms[1];
  if (lastDigit === 1) return forms[0];
  return forms[2];
}

export function formatProjectPrice(value: number) {
  return new Intl.NumberFormat("ru-RU").format(value);
}

export function formatCompactPrice(value: number) {
  const millions = value / 1000000;
  const label = Number.isInteger(millions)
    ? String(millions)
    : millions.toFixed(1).replace(".", ",");

  return `${label} млн ₽`;
}

export function formatArea(value: number) {
  return `${value} м²`;
}

export function formatFloors(value: number) {
  return `${value} ${formatCount(value, ["этаж", "этажа", "этажей"])}`;
}

export function formatRooms(value: number) {
  return `${value} ${formatCount(value, ["комната", "комнаты", "комнат"])}`;
}

function getMediaIdentity(media: CatalogItemDoc["previewImage"]) {
  if (!media) return "";
  if (typeof media === "number") return `id:${media}`;

  return media.id ? `id:${media.id}` : media.url || media.filename || "";
}

export function getCatalogPhotoCount(item: CatalogItemDoc) {
  const identities = [
    ...(item.galleryImages ?? []),
    ...(item.gallery?.map((entry) => entry.image).filter(Boolean) ?? []),
    item.previewImage,
    item.detailImage,
  ]
    .map(getMediaIdentity)
    .filter(Boolean);

  return Math.max(new Set(identities).size, 1);
}

export function getCatalogCardMeta(item: CatalogItemDoc): CatalogCardMeta {
  const fallback = fallbackByKey[item.itemKey] ?? fallbackMeta;
  return {
    area: item.area ? formatArea(item.area) : fallback.area,
    floors: item.floors ? formatFloors(item.floors) : fallback.floors,
    photoCount: getCatalogPhotoCount(item),
    price: item.price ?? fallback.price,
    rooms: item.rooms ? formatRooms(item.rooms) : fallback.rooms,
  };
}
