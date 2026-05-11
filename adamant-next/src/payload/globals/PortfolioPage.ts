import type { GlobalConfig } from "payload";

import { buildPageIntroFields } from "./shared/pageIntroFields.ts";

export const PortfolioPage: GlobalConfig = {
  slug: "portfolio-page",
  admin: {
    group: "Настройки",
  },
  fields: buildPageIntroFields(
    {
      eyebrow: "Портфолио",
      title: "Реализованные проекты домов и строительных работ",
      subtitle:
        "Показываем готовые решения, планировки и подход к строительству загородных домов под ключ в Санкт-Петербурге и Ленинградской области.",
    },
    "Сильный заголовок страницы",
  ),
  label: "Страница Портфолио",
  versions: {
    drafts: true,
  },
};
