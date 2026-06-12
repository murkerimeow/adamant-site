import type { CollectionConfig } from "payload";

import { authenticated } from "../access/authenticated.ts";
import { anyone } from "../access/public.ts";

export const Reviews: CollectionConfig = {
  slug: "reviews",
  admin: {
    defaultColumns: ["name", "video", "rating", "published", "order"],
    group: "Контент",
    useAsTitle: "name",
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
      name: "name",
      type: "text",
      label: "Имя клиента",
      required: true,
    },
    {
      name: "caption",
      type: "text",
      label: "Подпись под именем",
    },
    {
      name: "avatar",
      type: "upload",
      label: "Аватарка",
      relationTo: "media",
    },
    {
      name: "video",
      type: "upload",
      label: "Видеоотзыв",
      relationTo: "media",
      filterOptions: {
        mimeType: {
          contains: "video/",
        },
      },
    },
    {
      name: "poster",
      type: "upload",
      label: "Обложка видео",
      relationTo: "media",
      filterOptions: {
        mimeType: {
          contains: "image/",
        },
      },
    },
    {
      name: "rating",
      type: "number",
      admin: {
        position: "sidebar",
      },
      defaultValue: 5,
      label: "Оценка",
      max: 5,
      min: 1,
      required: true,
    },
    {
      name: "text",
      type: "textarea",
      label: "Текст отзыва",
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
      name: "published",
      type: "checkbox",
      admin: {
        position: "sidebar",
      },
      defaultValue: true,
      label: "Показывать на сайте",
    },
  ],
  labels: {
    plural: "Отзывы",
    singular: "Отзыв",
  },
};
