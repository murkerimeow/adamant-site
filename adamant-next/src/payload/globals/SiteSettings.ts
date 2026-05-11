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
  ],
  label: "Настройки сайта",
  versions: {
    drafts: true,
  },
};
