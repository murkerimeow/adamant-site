import type { GlobalConfig } from "payload";

export const HomePage: GlobalConfig = {
  slug: "home-page",
  admin: {
    group: "Настройки",
  },
  fields: [
    {
      name: "heroTitle",
      type: "textarea",
      defaultValue:
        "Строительство загородных домов под ключ в Санкт-Петербурге и Ленинградской области",
      label: "Заголовок первого экрана",
      required: true,
    },
    {
      name: "heroDescription",
      type: "textarea",
      defaultValue:
        "Проектируем и строим современные загородные дома под ключ с точным расчетом сметы и сроков.",
      label: "Описание первого экрана",
      required: true,
    },
    {
      name: "stats",
      type: "array",
      label: "Показатели",
      labels: {
        plural: "Показатели",
        singular: "Показатель",
      },
      fields: [
        {
          name: "value",
          type: "text",
          label: "Значение",
          required: true,
        },
        {
          name: "label",
          type: "text",
          label: "Подпись",
          required: true,
        },
      ],
    },
  ],
  label: "Главная страница",
  versions: {
    drafts: true,
  },
};
