import type { GlobalConfig } from "payload";

import { buildPageIntroFields } from "./shared/pageIntroFields.ts";

export const AboutPage: GlobalConfig = {
  slug: "about-page",
  admin: {
    group: "Настройки",
  },
  fields: [
    ...buildPageIntroFields(
      {
        eyebrow: "О компании",
        title: "Адамант Строй: строительство загородных домов под ключ",
        subtitle:
          "Проектируем и строим современные частные дома в Санкт-Петербурге и Ленинградской области с прозрачной сметой, контролем сроков и качества.",
      },
      "Сильный заголовок страницы",
    ),
    {
      name: "intro",
      type: "textarea",
      label: "Основной текст о компании",
    },
    {
      name: "principles",
      type: "array",
      label: "Принципы работы",
      fields: [
        {
          name: "title",
          type: "text",
          label: "Заголовок",
          required: true,
        },
        {
          name: "text",
          type: "textarea",
          label: "Текст",
          required: true,
        },
      ],
    },
    {
      name: "faqItems",
      type: "array",
      label: "FAQ",
      fields: [
        {
          name: "question",
          type: "text",
          label: "Вопрос",
          required: true,
        },
        {
          name: "answer",
          type: "textarea",
          label: "Ответ",
          required: true,
        },
      ],
    },
  ],
  label: "Страница О нас",
  versions: {
    drafts: true,
  },
};
