import type { CollectionConfig } from "payload";

import { authenticated } from "../access/authenticated.ts";
import { anyone } from "../access/public.ts";
import { slugField } from "../fields/slug.ts";

export const Services: CollectionConfig = {
  slug: "services",
  admin: {
    defaultColumns: ["title", "order", "featured", "_status"],
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
      label: "Название услуги",
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
      name: "featured",
      type: "checkbox",
      admin: {
        position: "sidebar",
      },
      defaultValue: false,
      label: "Показывать в приоритете",
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
      name: "shortDescription",
      type: "textarea",
      label: "Краткое описание",
      required: true,
    },
    {
      name: "description",
      type: "textarea",
      label: "Полное описание",
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
    plural: "Услуги",
    singular: "Услуга",
  },
  versions: {
    drafts: true,
  },
};
