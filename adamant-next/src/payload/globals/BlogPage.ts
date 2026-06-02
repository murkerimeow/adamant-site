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
          "Добавьте несколько роликов для верхнего блока блога. Можно указать прямую ссылку на видеофайл или ссылку на Instagram, TikTok, YouTube Shorts.",
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
            placeholder: "https://www.instagram.com/reel/... или https://youtube.com/shorts/...",
          },
          label: "Ссылка на соцсеть",
        },
        {
          name: "videoUrl",
          type: "text",
          admin: {
            placeholder: "https://example.com/video.mp4",
          },
          label: "Прямая ссылка на видеофайл",
        },
        {
          name: "posterImage",
          type: "upload",
          label: "Обложка видео",
          relationTo: "media",
        },
      ],
      label: "Видео в верхнем блоке",
      maxRows: 12,
    },
  ],
  label: "Страница Блог",
  versions: {
    drafts: true,
  },
};
