import type { CollectionConfig } from "payload";

import { authenticated } from "../access/authenticated.ts";
import { sendTelegramRequestNotification } from "../lib/telegram.ts";

export const Requests: CollectionConfig = {
  slug: "requests",
  admin: {
    defaultColumns: ["requestType", "name", "phone", "status", "createdAt"],
    group: "Лиды",
    useAsTitle: "phone",
  },
  access: {
    create: () => true,
    delete: authenticated,
    read: authenticated,
    update: authenticated,
  },
  defaultSort: "-createdAt",
  hooks: {
    afterChange: [
      async ({ doc, operation, req }) => {
        if (operation !== "create") {
          return doc;
        }

        try {
          await sendTelegramRequestNotification(doc);
        } catch (error) {
          req.payload.logger.error(
            {
              collection: "requests",
              err: error,
              requestId: doc.id,
            },
            "Telegram notification failed",
          );
        }

        return doc;
      },
    ],
  },
  fields: [
    {
      name: "requestType",
      type: "select",
      label: "Тип заявки",
      options: [
        { label: "Оставить заявку", value: "estimate" },
        { label: "Обратный звонок", value: "callback" },
      ],
      required: true,
    },
    {
      name: "name",
      type: "text",
      label: "Имя",
    },
    {
      name: "phone",
      type: "text",
      label: "Телефон",
      required: true,
    },
    {
      name: "email",
      type: "email",
      label: "Email",
    },
    {
      name: "service",
      type: "text",
      label: "Интересующая услуга",
    },
    {
      name: "message",
      type: "textarea",
      label: "Сообщение",
    },
    {
      name: "sourcePage",
      type: "text",
      label: "Источник заявки",
    },
    {
      name: "status",
      type: "select",
      admin: {
        position: "sidebar",
      },
      defaultValue: "new",
      label: "Статус",
      options: [
        { label: "Новая", value: "new" },
        { label: "В работе", value: "processing" },
        { label: "Закрыта", value: "done" },
      ],
      required: true,
    },
    {
      name: "notes",
      type: "textarea",
      label: "Комментарий менеджера",
    },
  ],
  labels: {
    plural: "Заявки",
    singular: "Заявка",
  },
};
