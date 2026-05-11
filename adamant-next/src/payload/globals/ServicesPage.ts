import type { GlobalConfig } from "payload";

import { buildPageIntroFields } from "./shared/pageIntroFields.ts";

export const ServicesPage: GlobalConfig = {
  slug: "services-page",
  admin: {
    group: "Настройки",
  },
  fields: buildPageIntroFields(
    {
      eyebrow: "Услуги",
      title: "Строительство домов, ремонт и отделка под ключ",
      subtitle:
        "Выполняем полный цикл работ: от строительства загородных домов до ремонта квартир и отделки коммерческих помещений.",
    },
    "Сильный заголовок страницы",
  ),
  label: "Страница Услуги",
  versions: {
    drafts: true,
  },
};
