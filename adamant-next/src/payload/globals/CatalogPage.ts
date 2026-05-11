import type { GlobalConfig } from "payload";

import { buildPageIntroFields } from "./shared/pageIntroFields.ts";

export const CatalogPage: GlobalConfig = {
  slug: "catalog-page",
  admin: {
    group: "Настройки",
  },
  fields: buildPageIntroFields(
    {
      eyebrow: "Каталог проектов",
      title: "Проекты загородных домов для строительства под ключ",
      subtitle:
        "Собрали проекты домов с разной архитектурой и планировками, чтобы вы могли выбрать подходящее решение под участок, бюджет и сценарий проживания.",
    },
    "Сильный заголовок страницы",
  ),
  label: "Страница Каталог",
  versions: {
    drafts: true,
  },
};
