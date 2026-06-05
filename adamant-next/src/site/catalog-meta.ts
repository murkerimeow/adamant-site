import type { CatalogItemDoc } from "@/site/cms";

export type CatalogCardMeta = {
  area: string;
  floors: string;
  photoCount: number;
  price: number;
  rooms: string;
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
    ...(item.gallery?.map((entry) => entry.image).filter(Boolean) ?? []),
    item.previewImage,
    item.detailImage,
  ]
    .map(getMediaIdentity)
    .filter(Boolean);

  return Math.max(new Set(identities).size, 1);
}

export function getCatalogCardMeta(item: CatalogItemDoc): CatalogCardMeta {
  return {
    area: item.area ? formatArea(item.area) : "—",
    floors: item.floors ? formatFloors(item.floors) : "—",
    photoCount: getCatalogPhotoCount(item),
    price: item.price ?? 0,
    rooms: item.rooms ? formatRooms(item.rooms) : "—",
  };
}
