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
      "landingCategory",
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
      name: "landingCategory",
      type: "relationship",
      admin: {
        description:
          "Категория посадочной страницы. Используется для выпадающего меню каталога и фильтрации карточек.",
        position: "sidebar",
      },
      label: "Посадочная категория",
      relationTo: "catalog-categories",
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
      name: "gallery",
      type: "array",
      admin: {
        description:
          "Добавляйте сюда все фотографии проекта. Количество фото в карточке каталога считается по этому списку.",
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
      name: "advantages",
      type: "array",
      admin: {
        description: "Пункты, которые выводятся в карточке проекта в блоке преимуществ.",
        isSortable: true,
      },
      label: "Преимущества проекта",
      labels: {
        plural: "Преимущества",
        singular: "Преимущество",
      },
      fields: [
        {
          name: "text",
          type: "text",
          label: "Текст преимущества",
          required: true,
        },
      ],
      maxRows: 12,
    },
    {
      name: "layouts",
      type: "array",
      admin: {
        description: "Планировки и генпланы, которые выводятся внутри карточки проекта.",
        isSortable: true,
      },
      label: "Планировки проекта",
      labels: {
        plural: "Планировки",
        singular: "Планировка",
      },
      fields: [
        {
          name: "title",
          type: "text",
          label: "Название",
          required: true,
        },
        {
          name: "meta",
          type: "text",
          label: "Подпись",
        },
        {
          name: "image",
          type: "upload",
          label: "Изображение планировки",
          relationTo: "media",
        },
      ],
      maxRows: 12,
    },
    {
      name: "model3d",
      type: "upload",
      admin: {
        description: "Загрузите GLB/GLTF модель дома для интерактивного 3D-просмотра в карточке проекта.",
      },
      label: "3D модель дома (GLB/GLTF)",
      relationTo: "media",
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
