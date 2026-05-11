import { NextResponse } from "next/server";

import { sendTelegramChatNotification } from "@/payload/lib/telegram";
import {
  appendChatMessage,
  createChatMessage,
  getChatMessages,
  rememberTelegramMessage,
} from "@/site/chat-store";

export const runtime = "nodejs";

type ChatSendPayload = {
  sessionId?: unknown;
  text?: unknown;
  page?: unknown;
};

function normalizeText(value: unknown, maxLength: number) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

export async function POST(request: Request) {
  const payload = (await request.json().catch(() => null)) as ChatSendPayload | null;
  const sessionId = normalizeText(payload?.sessionId, 120);
  const text = normalizeText(payload?.text, 1200);
  const page = normalizeText(payload?.page, 300);

  if (!sessionId || !text) {
    return NextResponse.json(
      {
        ok: false,
        error: "sessionId and text are required",
      },
      { status: 400 },
    );
  }

  await appendChatMessage(
    createChatMessage({
      sessionId,
      from: "visitor",
      text,
      page,
    }),
  );

  let deliveredToTelegram = false;

  try {
    const telegramMessages = await sendTelegramChatNotification({
      sessionId,
      text,
      page,
    });

    await Promise.all(
      telegramMessages.map((message) =>
        rememberTelegramMessage({
          chatId: message.chatId,
          messageId: message.messageId,
          sessionId,
        }),
      ),
    );

    deliveredToTelegram = telegramMessages.length > 0;
  } catch (error) {
    console.error("Failed to send site chat message to Telegram", error);
  }

  return NextResponse.json({
    ok: true,
    deliveredToTelegram,
    messages: await getChatMessages(sessionId),
  });
}
