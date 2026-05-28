import type { CollectionConfig } from "payload";

import { authenticated } from "../access/authenticated.ts";
import { anyone } from "../access/public.ts";
import { slugField } from "../fields/slug.ts";

export const Services: CollectionConfig = {
  slug: "services",
  admin: {
    defaultColumns: ["title", "order", "showOnServicesPage", "featured", "_status"],
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
      name: "showOnServicesPage",
      type: "checkbox",
      admin: {
        position: "sidebar",
      },
      defaultValue: true,
      label: "Показывать на странице услуг",
    },
    {
      name: "icon",
      type: "select",
      admin: {
        position: "sidebar",
      },
      defaultValue: "home",
      label: "Иконка карточки",
      options: [
        { label: "Дом", value: "home" },
        { label: "Куб", value: "box" },
        { label: "Календарь", value: "calendar" },
        { label: "Чат", value: "chat" },
        { label: "Документ", value: "doc" },
        { label: "Каска", value: "hardhat" },
        { label: "Идея", value: "light" },
        { label: "План", value: "plan" },
        { label: "Щит", value: "shield" },
        { label: "Команда", value: "team" },
        { label: "Инструмент", value: "wrench" },
      ],
      required: true,
    },
    {
      name: "href",
      type: "text",
      admin: {
        position: "sidebar",
      },
      defaultValue: "/contacts",
      label: "Ссылка карточки",
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
