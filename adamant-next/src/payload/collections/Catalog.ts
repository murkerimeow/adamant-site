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
