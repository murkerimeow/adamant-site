import type { CollectionConfig } from "payload";

import { authenticated } from "../access/authenticated.ts";
import { anyone } from "../access/public.ts";
import { slugField } from "../fields/slug.ts";

export const Catalog: CollectionConfig = {
  slug: "catalog",
  admin: {
    defaultColumns: [
      "title",
      "itemKey",
      "showInCatalog",
      "isHit",
      "catalogCategory",
      "order",
      "_status",
    ],
    group: "Контент",
    useAsTitle: "title",
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  defaultSort: "order",
  fields: [
    {
      name: "title",
      type: "text",
      label: "Название элемента",
      required: true,
    },
    slugField(),
    {
      name: "itemKey",
      type: "text",
      admin: {
        position: "sidebar",
      },
      index: true,
      label: "Ключ элемента",
      required: true,
      unique: true,
    },
    {
      name: "showInCatalog",
      type: "checkbox",
      admin: {
        position: "sidebar",
      },
      defaultValue: false,
      label: "Показывать в каталоге",
    },
    {
      name: "isHit",
      type: "checkbox",
      admin: {
        position: "sidebar",
      },
      defaultValue: false,
      label: "Плашка \"Хит\"",
    },
    {
      name: "catalogCategory",
      type: "select",
      admin: {
        position: "sidebar",
      },
      defaultValue: "other",
      label: "Категория каталога",
      options: [
        { label: "Современные", value: "modern" },
        { label: "Классические", value: "classic" },
        { label: "Вне каталога", value: "other" },
      ],
      required: true,
    },
    {
      name: "order",
      type: "number",
      admin: {
        position: "sidebar",
      },
      defaultValue: 0,
      label: "Порядок",
      required: true,
    },
    {
      name: "previewImage",
      type: "upload",
      admin: {
        position: "sidebar",
      },
      label: "Изображение карточки",
      relationTo: "media",
    },
    {
      name: "detailImage",
      type: "upload",
      admin: {
        position: "sidebar",
      },
      label: "Изображение на карточке товара",
      relationTo: "media",
    },
    {
      name: "galleryImages",
      type: "upload",
      admin: {
        description:
          "Р—Р°РіСЂСѓР·РёС‚Рµ РЅРµСЃРєРѕР»СЊРєРѕ С„РѕС‚Рѕ РїСЂРѕРµРєС‚Р° РґР»СЏ РіР°Р»РµСЂРµРё Рё СЃС‡РµС‚С‡РёРєР° РІ РєР°СЂС‚РѕС‡РєРµ.",
        isSortable: true,
      },
      hasMany: true,
      label: "Р¤РѕС‚РѕРіСЂР°С„РёРё РїСЂРѕРµРєС‚Р°",
      maxRows: 40,
      relationTo: "media",
    },
    {
      name: "gallery",
      type: "array",
      admin: {
        description:
          "РЎС‚Р°СЂРѕРµ РїРѕР»Рµ. РќРѕРІС‹Рµ С„РѕС‚Рѕ РґРѕР±Р°РІР»СЏР№С‚Рµ РІ РїРѕР»Рµ \"Р¤РѕС‚РѕРіСЂР°С„РёРё РїСЂРѕРµРєС‚Р°\" РІС‹С€Рµ.",
      },
      label: "Фотографии проекта",
      labels: {
        plural: "Фотографии",
        singular: "Фотография",
      },
      fields: [
        {
          name: "image",
          type: "upload",
          label: "Фото",
          relationTo: "media",
          required: true,
        },
      ],
    },
    {
      name: "price",
      type: "number",
      admin: {
        description: "Стоимость в рублях, например 18100000",
        step: 100000,
      },
      label: "Стоимость",
    },
    {
      name: "area",
      type: "number",
      admin: {
        description: "Площадь дома в м²",
        step: 1,
      },
      label: "Площадь, м²",
    },
    {
      name: "floors",
      type: "number",
      admin: {
        description: "Количество этажей",
        step: 1,
      },
      label: "Этажность",
    },
    {
      name: "rooms",
      type: "number",
      admin: {
        description: "Количество комнат",
        step: 1,
      },
      label: "Комнаты",
    },
    {
      name: "cardSummary",
      type: "textarea",
      label: "Текст карточки",
    },
    {
      name: "description",
      type: "textarea",
      label: "Полное описание",
      required: true,
    },
    {
      name: "tags",
      type: "array",
      label: "Теги",
      labels: {
        plural: "Теги",
        singular: "Тег",
      },
      fields: [
        {
          name: "label",
          type: "text",
          label: "Текст тега",
          required: true,
        },
      ],
    },
  ],
  labels: {
    plural: "Каталог",
    singular: "Элемент каталога",
  },
  versions: {
    drafts: true,
  },
};
