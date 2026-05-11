import type { CollectionConfig } from "payload";

import { authenticated } from "../access/authenticated.ts";

export const Users: CollectionConfig = {
  slug: "users",
  admin: {
    defaultColumns: ["email", "name", "role"],
    group: "Система",
    useAsTitle: "email",
  },
  auth: true,
  fields: [
    {
      name: "name",
      type: "text",
      label: "Имя",
      required: true,
    },
    {
      name: "role",
      type: "select",
      admin: {
        position: "sidebar",
      },
      defaultValue: "editor",
      label: "Роль",
      options: [
        { label: "Администратор", value: "admin" },
        { label: "Редактор", value: "editor" },
      ],
      required: true,
    },
  ],
  access: {
    delete: authenticated,
    read: authenticated,
    update: authenticated,
  },
};
