import type { CollectionConfig } from "payload";

import { authenticated } from "../access/authenticated.ts";
import { anyone } from "../access/public.ts";
import { slugField } from "../fields/slug.ts";

export const CatalogCategories: CollectionConfig = {
  slug: "catalog-categories",
  admin: {
    defaultColumns: ["title", "slug", "showInHeader", "order"],
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
      label: "Название категории",
      required: true,
    },
    slugField(),
    {
      name: "description",
      type: "textarea",
      label: "Описание посадочной",
    },
    {
      name: "showInHeader",
      type: "checkbox",
      admin: {
        position: "sidebar",
      },
      defaultValue: true,
      label: "Показывать в выпадающем меню каталога",
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
  ],
  labels: {
    plural: "Категории каталога",
    singular: "Категория каталога",
  },
};
