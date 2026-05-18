import type { GlobalConfig } from "payload";

import { buildPageIntroFields } from "./shared/pageIntroFields.ts";

export const BlogPage: GlobalConfig = {
  slug: "blog-page",
  admin: {
    group: "Настройки",
  },
  fields: [
    ...buildPageIntroFields(
      {
        eyebrow: "Блог",
        title: "Статьи о строительстве, проектировании и выборе дома",
        subtitle:
          "Публикуем материалы о технологиях строительства, сметах, проектировании и практических решениях для загородного дома.",
      },
      "Сильный заголовок страницы",
    ),
    {
      name: "instagramVideos",
      type: "array",
      admin: {
        description:
          "До 3 ссылок на публичные Instagram Reels/Post. Если ссылка не заполнена, на сайте останется обычная карточка.",
      },
      defaultValue: [
        {
          label: "Обзор проекта",
          title: "Обзор реализованного проекта",
        },
        {
          label: "Готовый объект",
          title: "Видео с готового объекта",
        },
        {
          label: "Дом после сдачи",
          title: "Дом после завершения работ",
        },
      ],
      fields: [
        {
          name: "label",
          type: "text",
          label: "Подпись",
          required: true,
        },
        {
          name: "title",
          type: "text",
          label: "Описание",
          required: true,
        },
        {
          name: "instagramUrl",
          type: "text",
          admin: {
            placeholder: "https://www.instagram.com/reel/...",
          },
          label: "Ссылка на Instagram Reel/Post",
        },
      ],
      label: "Instagram-видео в верхнем блоке",
      maxRows: 3,
    },
  ],
  label: "Страница Блог",
  versions: {
    drafts: true,
  },
};
