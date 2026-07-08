import type { CollectionConfig } from "payload";

import { authenticated } from "../access/authenticated.ts";

export const ClientAccess: CollectionConfig = {
  slug: "client-access",
  admin: {
    defaultColumns: ["name", "login", "accessEnabled", "accessGeneratedAt", "lastLoginAt"],
    group: "Клиенты",
    useAsTitle: "name",
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticated,
    update: authenticated,
  },
  fields: [
    {
      name: "name",
      type: "text",
      label: "Клиент / проект",
      required: true,
    },
    {
      name: "login",
      type: "text",
      admin: {
        readOnly: true,
      },
      index: true,
      label: "Логин",
      unique: true,
    },
    {
      name: "generateAccess",
      type: "ui",
      admin: {
        components: {
          Field: "@/payload/components/ClientAccessGenerator#ClientAccessGenerator",
        },
      },
      label: "Доступ клиента",
    },
    {
      name: "accessEnabled",
      type: "checkbox",
      admin: {
        position: "sidebar",
      },
      defaultValue: true,
      label: "Доступ включен",
    },
    {
      name: "accessGeneratedAt",
      type: "date",
      admin: {
        date: {
          pickerAppearance: "dayAndTime",
        },
        position: "sidebar",
        readOnly: true,
      },
      label: "Доступ сгенерирован",
    },
    {
      name: "lastLoginAt",
      type: "date",
      admin: {
        date: {
          pickerAppearance: "dayAndTime",
        },
        position: "sidebar",
        readOnly: true,
      },
      label: "Последний вход",
    },
    {
      name: "passwordHash",
      type: "text",
      access: {
        read: () => false,
      },
      admin: {
        hidden: true,
      },
      label: "Хеш пароля",
    },
    {
      name: "notes",
      type: "textarea",
      label: "Комментарий",
    },
  ],
  labels: {
    plural: "Клиентские доступы",
    singular: "Клиентский доступ",
  },
};
