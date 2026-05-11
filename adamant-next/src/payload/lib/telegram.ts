import type { Request as RequestDoc } from "@/payload-types";

export type TelegramSendResult = {
  chatId: string;
  messageId: number;
};

type TelegramMessageOptions = {
  parseMode?: "HTML";
};

const requestTypeLabels: Record<NonNullable<RequestDoc["requestType"]>, string> = {
  callback: "Обратный звонок",
  estimate: "Оставить заявку",
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

function buildRequestMessage(doc: RequestDoc) {
  const lines = [
    "Новая заявка с сайта",
    "",
    `Тип: ${requestTypeLabels[doc.requestType] ?? doc.requestType}`,
    doc.name ? `Имя: ${doc.name}` : "",
    `Телефон: ${doc.phone}`,
    doc.service ? `Услуга: ${doc.service}` : "",
    doc.email ? `Email: ${doc.email}` : "",
    doc.message ? `Сообщение: ${doc.message}` : "",
    doc.sourcePage ? `Страница: ${doc.sourcePage}` : "",
    doc.createdAt ? `Время: ${formatCreatedAt(doc.createdAt)}` : "",
  ].filter(Boolean);

  return lines.join("\n");
}

export async function sendTelegramRequestNotification(doc: RequestDoc) {
  const message = buildRequestMessage(doc);
  await sendTelegramMessage(message);
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
