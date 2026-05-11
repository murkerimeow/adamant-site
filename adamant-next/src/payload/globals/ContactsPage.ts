import type { GlobalConfig } from "payload";

import { buildPageIntroFields } from "./shared/pageIntroFields.ts";

export const ContactsPage: GlobalConfig = {
  slug: "contacts-page",
  admin: {
    group: "Настройки",
  },
  fields: [
    ...buildPageIntroFields(
      {
        eyebrow: "Контакты",
        title: "Контакты Адамант Строй в Санкт-Петербурге",
        subtitle:
          "Свяжитесь с нами по телефону, приезжайте в офис или отправьте реквизиты для быстрого расчета и консультации по проекту.",
      },
      "Сильный заголовок страницы",
    ),
    {
      name: "officeAddress",
      type: "textarea",
      defaultValue:
        "195197, г. Санкт-Петербург, пр-кт Полюстровский, д. 28 стр. 7, помещ. 2-Н26",
      label: "Адрес офиса",
      required: true,
    },
    {
      name: "mapEmbedUrl",
      type: "text",
      label: "Ссылка на карту",
    },
    {
      name: "companyDetails",
      type: "group",
      label: "Реквизиты",
      fields: [
        {
          name: "legalName",
          type: "text",
          defaultValue: "ООО «АДАМАНТ СТРОЙ»",
          label: "Название",
        },
        {
          name: "inn",
          type: "text",
          defaultValue: "7804719510",
          label: "ИНН",
        },
        {
          name: "ogrn",
          type: "text",
          defaultValue: "1267800006835",
          label: "ОГРН",
        },
        {
          name: "kpp",
          type: "text",
          defaultValue: "780401001",
          label: "КПП",
        },
      ],
    },
  ],
  label: "Страница Контакты",
  versions: {
    drafts: true,
  },
};
