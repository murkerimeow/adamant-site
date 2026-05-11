import type { GlobalConfig } from "payload";

import { buildPageIntroFields } from "./shared/pageIntroFields.ts";

export const BlogPage: GlobalConfig = {
  slug: "blog-page",
  admin: {
    group: "Настройки",
  },
  fields: buildPageIntroFields(
    {
      eyebrow: "Блог",
      title: "Статьи о строительстве, проектировании и выборе дома",
      subtitle:
        "Публикуем материалы о технологиях строительства, сметах, проектировании и практических решениях для загородного дома.",
    },
    "Сильный заголовок страницы",
  ),
  label: "Страница Блог",
  versions: {
    drafts: true,
  },
};
