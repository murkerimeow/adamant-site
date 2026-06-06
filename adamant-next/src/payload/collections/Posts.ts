import type { CollectionConfig } from "payload";

import { authenticated } from "../access/authenticated.ts";
import { anyone } from "../access/public.ts";
import { slugField } from "../fields/slug.ts";

export const Posts: CollectionConfig = {
  slug: "posts",
  admin: {
    defaultColumns: ["title", "category", "publishedAt", "_status"],
    group: "Контент",
    useAsTitle: "title",
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  defaultSort: "-publishedAt",
  fields: [
    {
      name: "title",
      type: "text",
      label: "Заголовок",
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
      name: "category",
      type: "text",
      admin: {
        position: "sidebar",
      },
      label: "Категория",
    },
    {
      name: "publishedAt",
      type: "date",
      admin: {
        position: "sidebar",
      },
      label: "Дата публикации",
    },
    {
      name: "excerpt",
      type: "textarea",
      label: "Краткое описание",
      required: true,
    },
    {
      name: "coverImage",
      type: "upload",
      admin: {
        position: "sidebar",
      },
      label: "Обложка",
      relationTo: "media",
    },
    {
      name: "content",
      type: "textarea",
      label: "Содержимое",
      required: true,
    },
  ],
  labels: {
    plural: "Посты",
    singular: "Пост",
  },
  versions: {
    drafts: true,
  },
};
