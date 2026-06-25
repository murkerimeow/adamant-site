import type { CollectionConfig } from "payload";

import { authenticated } from "../access/authenticated.ts";
import { anyone } from "../access/public.ts";
import { slugField } from "../fields/slug.ts";

export const PortfolioCategories: CollectionConfig = {
  slug: "portfolio-categories",
  admin: {
    defaultColumns: ["title", "slug", "showInNavigation", "order"],
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
      name: "h1",
      type: "textarea",
      label: "H1 посадочной страницы",
    },
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
      name: "heroImage",
      type: "upload",
      label: "Картинка посадочной страницы",
      relationTo: "media",
    },
    {
      name: "showInNavigation",
      type: "checkbox",
      admin: {
        position: "sidebar",
      },
      defaultValue: true,
      label: "Показывать во вкладках портфолио",
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
    plural: "Посадочные портфолио",
    singular: "Посадочная портфолио",
  },
};
