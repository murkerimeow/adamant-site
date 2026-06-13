import {
  appendChatMessage,
  createChatMessage,
  findSessionByTelegramReply,
  getTelegramUpdateOffset,
  setTelegramUpdateOffset,
} from "@/site/chat-store";
import { telegramFetch } from "@/payload/lib/telegram-fetch";

type TelegramUpdate = {
  update_id: number;
  message?: {
    text?: string;
    chat?: {
      id?: string | number;
    };
    reply_to_message?: {
      message_id?: string | number;
    };
  };
};

type TelegramUpdatesResponse = {
  ok?: boolean;
  result?: TelegramUpdate[];
  description?: string;
};

let syncPromise: Promise<void> | null = null;

async function syncTelegramRepliesFromUpdatesInner() {
  const token = process.env.TELEGRAM_BOT_TOKEN?.trim();

  if (!token) {
    return;
  }

  const offset = await getTelegramUpdateOffset();
  const url = new URL(`https://api.telegram.org/bot${token}/getUpdates`);
  url.searchParams.set("timeout", "0");
  url.searchParams.set("allowed_updates", JSON.stringify(["message"]));

  if (typeof offset === "number") {
    url.searchParams.set("offset", String(offset));
  }

  const response = await telegramFetch(url);

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`Telegram getUpdates failed: ${response.status} ${errorText}`);
    return;
  }

  const payload = (await response.json()) as TelegramUpdatesResponse;
  const updates = Array.isArray(payload.result) ? payload.result : [];

  if (!payload.ok || !updates.length) {
    return;
  }

  let nextOffset = offset ?? 0;

  for (const update of updates) {
    if (typeof update.update_id === "number") {
      nextOffset = Math.max(nextOffset, update.update_id + 1);
    }

    const message = update.message;
    const chatId = message?.chat?.id;
    const replyToMessageId = message?.reply_to_message?.message_id;
    const text = typeof message?.text === "string" ? message.text.trim() : "";

    if (!chatId || !replyToMessageId || !text) {
      continue;
    }

    const sessionId = await findSessionByTelegramReply({
      chatId,
      replyToMessageId,
    });

    if (!sessionId) {
      continue;
    }

    await appendChatMessage(
      createChatMessage({
        sessionId,
        from: "manager",
        text,
      }),
    );
  }

  await setTelegramUpdateOffset(nextOffset);
}

export async function syncTelegramRepliesFromUpdates() {
  if (!syncPromise) {
    syncPromise = syncTelegramRepliesFromUpdatesInner().finally(() => {
      syncPromise = null;
    });
  }

  return syncPromise;
}
