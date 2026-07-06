import type { CollectionConfig } from "payload";

import { authenticated } from "../access/authenticated.ts";
import { anyone } from "../access/public.ts";
import { slugField } from "../fields/slug.ts";

export const Portfolio: CollectionConfig = {
  slug: "portfolio",
  admin: {
    defaultColumns: ["title", "catalogItem", "category", "order", "_status"],
    group: "Контент",
    pagination: {
      defaultLimit: 100,
      limits: [10, 25, 50, 100],
    },
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
      label: "Название проекта",
      required: true,
    },
    slugField(),
    {
      name: "seoTitle",
      type: "text",
      label: "SEO Title / title вкладки браузера",
    },
    {
      name: "seoDescription",
      type: "textarea",
      label: "SEO Description",
    },
    {
      name: "catalogItem",
      type: "relationship",
      admin: {
        description:
          "Свяжите карточку портфолио с проектом каталога, чтобы кнопка вела на правильную страницу.",
        position: "sidebar",
      },
      label: "Связанная карточка каталога",
      relationTo: "catalog",
    },
    {
      name: "category",
      type: "relationship",
      admin: {
        description:
          "Посадочная категория портфолио. Используется для вкладок на главной и страниц /portfolio/category/...",
        position: "sidebar",
      },
      label: "Категория",
      relationTo: "portfolio-categories",
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
      name: "location",
      type: "text",
      admin: {
        position: "sidebar",
      },
      label: "Локация",
    },
    {
      name: "projectArea",
      type: "number",
      admin: {
        position: "sidebar",
      },
      label: "Площадь, м²",
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
      name: "gallery",
      type: "array",
      admin: {
        description: "Дополнительные фотографии выполненной работы.",
        isSortable: true,
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
      maxRows: 40,
    },
    {
      name: "summary",
      type: "textarea",
      label: "Краткое описание",
      required: true,
    },
    {
      name: "description",
      type: "textarea",
      label: "Описание проекта",
    },
    {
      name: "tags",
      type: "array",
      label: "Теги",
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
    plural: "Портфолио",
    singular: "Проект",
  },
  versions: {
    drafts: true,
  },
};
