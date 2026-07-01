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
          name: "iconImage",
          type: "upload",
          label: "Image",
          relationTo: "media",
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
