import type { GlobalConfig } from "payload";

export const SiteSettings: GlobalConfig = {
  slug: "site-settings",
  admin: {
    group: "Настройки",
  },
  fields: [
    {
      name: "companyName",
      type: "text",
      defaultValue: "АДАМАНТ СТРОЙ",
      label: "Название компании",
      required: true,
    },
    {
      name: "phonePrimary",
      type: "text",
      defaultValue: "+7 (911) 197-04-57",
      label: "Основной телефон",
      required: true,
    },
    {
      name: "phoneSecondary",
      type: "text",
      defaultValue: "+7 981 810-62-82",
      label: "Дополнительный телефон",
    },
    {
      name: "email",
      type: "email",
      label: "Email",
    },
    {
      name: "address",
      type: "textarea",
      label: "Адрес",
    },
    {
      name: "workingHours",
      type: "text",
      defaultValue: "ПН-ПТ, 10:00-16:00",
      label: "Режим работы",
    },
    {
      name: "companyStats",
      type: "array",
      label: "Показатели компании",
      labels: {
        plural: "Показатели компании",
        singular: "Показатель",
      },
      defaultValue: [
        {
          statKey: "builtHomes",
          value: "500+",
          label: "построенных домов",
          showOnHome: true,
          showOnAbout: true,
        },
        {
          statKey: "estimateDay",
          value: "1 день",
          label: "на расчет сметы",
          showOnHome: true,
          showOnAbout: false,
        },
        {
          statKey: "happyFamilies",
          value: "450+",
          label: "довольных семей",
          showOnHome: true,
          showOnAbout: true,
        },
        {
          statKey: "marketYears",
          value: "12+ лет",
          label: "на рынке",
          showOnHome: true,
          showOnAbout: true,
        },
        {
          statKey: "warranty",
          value: "5 лет",
          label: "гарантии на работы",
          showOnHome: false,
          showOnAbout: true,
        },
        {
          statKey: "region",
          value: "Работаем",
          label: "по всему СЗФО",
          showOnHome: false,
          showOnAbout: true,
        },
      ],
      fields: [
        {
          name: "statKey",
          type: "select",
          defaultValue: "custom",
          label: "Тип показателя",
          options: [
            { label: "Построенные дома", value: "builtHomes" },
            { label: "Расчет сметы", value: "estimateDay" },
            { label: "Довольные семьи", value: "happyFamilies" },
            { label: "Лет на рынке", value: "marketYears" },
            { label: "Гарантия", value: "warranty" },
            { label: "География работы", value: "region" },
            { label: "Другое", value: "custom" },
          ],
        },
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
        {
          name: "showOnHome",
          type: "checkbox",
          defaultValue: true,
          label: "Показывать на главной",
        },
        {
          name: "showOnAbout",
          type: "checkbox",
          defaultValue: true,
          label: "Показывать в разделе О нас",
        },
      ],
    },
  ],
  label: "Настройки сайта",
  versions: {
    drafts: true,
  },
};
