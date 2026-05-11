import type { CollectionConfig } from "payload";

import { authenticated } from "../access/authenticated.ts";
import { anyone } from "../access/public.ts";
import { slugField } from "../fields/slug.ts";

const listField = (name: string, label: string): NonNullable<CollectionConfig["fields"]>[number] => ({
  name,
  type: "array",
  label,
  fields: [
    {
      name: "item",
      type: "text",
      label: "Пункт",
      required: true,
    },
  ],
});

export const Vacancies: CollectionConfig = {
  slug: "vacancies",
  admin: {
    defaultColumns: ["title", "salary", "employment", "published", "order"],
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
      label: "Название вакансии",
      required: true,
    },
    slugField(),
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
      name: "published",
      type: "checkbox",
      admin: {
        position: "sidebar",
      },
      defaultValue: true,
      index: true,
      label: "Опубликовано",
    },
    {
      name: "salary",
      type: "text",
      admin: {
        position: "sidebar",
      },
      label: "Зарплата",
    },
    {
      name: "employment",
      type: "text",
      admin: {
        position: "sidebar",
      },
      label: "Занятость",
    },
    {
      name: "location",
      type: "text",
      admin: {
        position: "sidebar",
      },
      label: "Город / формат работы",
    },
    {
      name: "summary",
      type: "textarea",
      label: "Краткое описание",
      required: true,
    },
    listField("responsibilities", "Обязанности"),
    listField("requirements", "Требования"),
    listField("conditions", "Условия"),
  ],
  labels: {
    plural: "Вакансии",
    singular: "Вакансия",
  },
};
