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
    {
      name: "sectionHeadings",
      type: "group",
      label: "Заголовки блоков",
      fields: [
        {
          name: "about",
          type: "text",
          label: "О компании",
          defaultValue: "О нас",
        },
        {
          name: "projects",
          type: "text",
          label: "Наши проекты",
          defaultValue: "Современные дома для комфортной жизни",
        },
        {
          name: "trust",
          type: "text",
          label: "Почему выбирают нас",
          defaultValue: "Надежность, качество и прозрачность на каждом этапе",
        },
        {
          name: "process",
          type: "text",
          label: "Этапы работ",
          defaultValue: "Прозрачный процесс от идеи до вашего дома",
        },
        {
          name: "processLead",
          type: "textarea",
          label: "Подзаголовок этапов работ",
          defaultValue: "Четкий план и постоянная коммуникация на каждом этапе работы.",
        },
        {
          name: "services",
          type: "text",
          label: "Наши услуги",
          defaultValue: "Полный цикл строительства",
        },
        {
          name: "portfolio",
          type: "text",
          label: "Портфолио",
          defaultValue: "Реализованные проекты",
        },
        {
          name: "reviews",
          type: "text",
          label: "Отзывы",
          defaultValue: "Нам доверяют",
        },
        {
          name: "faq",
          type: "text",
          label: "FAQ",
          defaultValue: "FAQ",
        },
      ],
    },
  ],
  label: "Главная страница",
  versions: {
    drafts: true,
  },
};
