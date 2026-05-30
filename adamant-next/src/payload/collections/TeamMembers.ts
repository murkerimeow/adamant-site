import type { CollectionConfig } from "payload";

import { authenticated } from "../access/authenticated.ts";
import { anyone } from "../access/public.ts";

export const TeamMembers: CollectionConfig = {
  slug: "team-members",
  admin: {
    defaultColumns: ["name", "role", "published", "order"],
    group: "Контент",
    useAsTitle: "name",
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  defaultSort: "order",
  fields: [
    {
      name: "name",
      type: "text",
      label: "Имя и фамилия",
      required: true,
    },
    {
      name: "role",
      type: "text",
      label: "Должность",
      required: true,
    },
    {
      name: "description",
      type: "textarea",
      label: "Описание",
    },
    {
      name: "avatar",
      type: "upload",
      label: "Фото или аватар",
      relationTo: "media",
    },
    {
      name: "order",
      type: "number",
      admin: {
        position: "sidebar",
      },
      defaultValue: 0,
      label: "Порядок",
      required: true,
    },
    {
      name: "published",
      type: "checkbox",
      admin: {
        position: "sidebar",
      },
      defaultValue: true,
      label: "Показывать на сайте",
    },
  ],
  labels: {
    plural: "Команда",
    singular: "Сотрудник команды",
  },
};
