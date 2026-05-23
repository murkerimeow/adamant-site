import type { Request as RequestDoc } from "@/payload-types";

export type TelegramSendResult = {
  chatId: string;
  messageId: number;
};

export type TelegramPhotoAttachment = {
  bytes: Uint8Array;
  filename: string;
  mimeType: string;
};

type TelegramMessageOptions = {
  parseMode?: "HTML";
};

const requestTypeLabels: Record<NonNullable<RequestDoc["requestType"]>, string> = {
  callback: "Обратный звонок",
  estimate: "Оставить заявку",
  message: "Написать нам",
};

function formatCreatedAt(value?: string | null) {
  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("ru-RU", {
    dateStyle: "short",
    timeStyle: "short",
    timeZone: "Europe/Moscow",
  }).format(date);
}

function getTelegramConfig() {
  const token = process.env.TELEGRAM_BOT_TOKEN?.trim();
  const rawChatIds =
    process.env.TELEGRAM_CHAT_IDS?.trim() ||
    process.env.TELEGRAM_CHAT_ID?.trim() ||
    "";
  const chatIds = rawChatIds
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);

  return { token, chatIds };
}

function escapeTelegramHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function buildTelegramField(label: string, value?: string | null) {
  const normalizedValue = typeof value === "string" ? value.trim() : "";

  if (!normalizedValue) {
    return "";
  }

  return `<b>${label}:</b> ${escapeTelegramHtml(normalizedValue)}`;
}

async function sendTelegramMessage(
  text: string,
  options: TelegramMessageOptions = {},
): Promise<TelegramSendResult[]> {
  const { token, chatIds } = getTelegramConfig();

  if (!token || !chatIds.length) {
    return [];
  }

  const results = await Promise.all(
    chatIds.map(async (chatId) => {
      const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chat_id: chatId,
          disable_web_page_preview: true,
          parse_mode: options.parseMode,
          text,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`chat ${chatId}: ${response.status} ${errorText}`);
      }

      const payload = (await response.json()) as {
        ok?: boolean;
        result?: {
          message_id?: number;
        };
      };

      if (!payload.ok || typeof payload.result?.message_id !== "number") {
        throw new Error(`chat ${chatId}: Telegram returned an invalid response`);
      }

      return {
        chatId,
        messageId: payload.result.message_id,
      };
    }),
  );

  if (!results.length) {
    throw new Error("Telegram sendMessage failed: no valid chat ids");
  }

  return results;
}

async function sendTelegramPhotos(
  doc: RequestDoc,
  attachments: TelegramPhotoAttachment[],
): Promise<TelegramSendResult[]> {
  const { token, chatIds } = getTelegramConfig();

  if (!token || !chatIds.length || !attachments.length) {
    return [];
  }

  const captionLines = [
    "<b>📎 Фото к заявке с сайта</b>",
    buildTelegramField("Имя", doc.name),
    buildTelegramField("Телефон", doc.phone),
    buildTelegramField("Услуга", doc.service),
  ].filter(Boolean);

  const caption = captionLines.join("\n");

  const results = await Promise.all(
    chatIds.map(async (chatId) => {
      const body = new FormData();
      const media = attachments.map((attachment, index) => {
        const fieldName = `photo_${index}`;
        const copy = attachment.bytes.slice();
        body.append(
          fieldName,
          new Blob([copy.buffer as ArrayBuffer], { type: attachment.mimeType }),
          attachment.filename,
        );

        return {
          type: "photo",
          media: `attach://${fieldName}`,
          ...(index === 0 && caption
            ? {
                caption,
                parse_mode: "HTML",
              }
            : {}),
        };
      });

      body.append("chat_id", chatId);
      body.append("media", JSON.stringify(media));

      const response = await fetch(`https://api.telegram.org/bot${token}/sendMediaGroup`, {
        method: "POST",
        body,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`chat ${chatId}: ${response.status} ${errorText}`);
      }

      const payload = (await response.json()) as {
        ok?: boolean;
        result?: {
          message_id?: number;
        }[];
      };

      if (!payload.ok || !Array.isArray(payload.result)) {
        throw new Error(`chat ${chatId}: Telegram returned an invalid media response`);
      }

      return payload.result
        .filter((message) => typeof message.message_id === "number")
        .map((message) => ({
          chatId,
          messageId: message.message_id as number,
        }));
    }),
  );

  return results.flat();
}

function buildRequestMessage(doc: RequestDoc) {
  const meta = [
    requestTypeLabels[doc.requestType] ?? doc.requestType,
    doc.sourcePage ? `страница: ${doc.sourcePage}` : "",
    doc.createdAt ? formatCreatedAt(doc.createdAt) : "",
  ].filter(Boolean);

  const contactLines = [
    buildTelegramField("Имя", doc.name),
    buildTelegramField("Телефон", doc.phone),
    buildTelegramField("Email", doc.email),
  ].filter(Boolean);

  const serviceLines = [
    buildTelegramField("Услуга", doc.service),
    doc.message ? "<b>Сообщение:</b>" : "",
    doc.message ? `<blockquote>${escapeTelegramHtml(doc.message.trim())}</blockquote>` : "",
  ].filter(Boolean);

  const sections = [
    ["<b>💻 Новая заявка с сайта</b>"],
    contactLines,
    serviceLines,
    meta.length ? [`<i>${escapeTelegramHtml(meta.join(" · "))}</i>`] : [],
  ].filter((section) => section.length);

  return sections.map((section) => section.join("\n")).join("\n\n");
}

export async function sendTelegramRequestNotification(doc: RequestDoc) {
  const message = buildRequestMessage(doc);
  await sendTelegramMessage(message, { parseMode: "HTML" });
}

export async function sendTelegramRequestPhotos(
  doc: RequestDoc,
  attachments: TelegramPhotoAttachment[],
) {
  await sendTelegramPhotos(doc, attachments);
}

export async function sendTelegramChatNotification(input: {
  sessionId: string;
  text: string;
  page?: string;
}) {
  const chatLabel = `#${input.sessionId.slice(0, 8).toUpperCase()}`;
  const message = [
    "<b>💬 Новое сообщение в чате сайта</b>",
    "",
    `<b>Чат:</b> ${escapeTelegramHtml(chatLabel)}`,
    "",
    `<blockquote>${escapeTelegramHtml(input.text)}</blockquote>`,
    "",
    "<i>Чтобы ответ попал в чат на сайте, ответьте в Telegram именно на это сообщение.</i>",
  ].join("\n");

  return sendTelegramMessage(message, { parseMode: "HTML" });
}

export function buildTelegramChatPreview(input: { sessionId: string; text: string }) {
  const chatLabel = `#${input.sessionId.slice(0, 8).toUpperCase()}`;
  const lines = [
    "💬 Новое сообщение в чате сайта",
    "",
    `Чат: ${chatLabel}`,
    "",
    input.text,
    "",
    "Чтобы ответ попал в чат на сайте, ответьте в Telegram именно на это сообщение.",
  ];

  return lines.join("\n");
}
