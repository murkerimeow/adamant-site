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
    {
      name: "sectionEyebrows",
      type: "group",
      label: "Плашки над заголовками",
      fields: [
        {
          name: "about",
          type: "text",
          label: "О компании",
          defaultValue: "О компании",
        },
        {
          name: "projects",
          type: "text",
          label: "Наши проекты",
          defaultValue: "Наши проекты",
        },
        {
          name: "trust",
          type: "text",
          label: "Почему выбирают нас",
          defaultValue: "Почему выбирают нас",
        },
        {
          name: "process",
          type: "text",
          label: "Этапы работ",
          defaultValue: "Этапы работ",
        },
        {
          name: "services",
          type: "text",
          label: "Наши услуги",
          defaultValue: "Наши услуги",
        },
        {
          name: "portfolio",
          type: "text",
          label: "Портфолио",
          defaultValue: "Портфолио",
        },
        {
          name: "reviews",
          type: "text",
          label: "Отзывы",
          defaultValue: "Отзывы клиентов",
        },
        {
          name: "faq",
          type: "text",
          label: "FAQ",
          defaultValue: "Ответы на частые вопросы",
        },
      ],
    },
  ],
  label: "Главная страница",
  versions: {
    drafts: true,
  },
};
