import { NextResponse } from "next/server";

import {
  appendChatMessage,
  createChatMessage,
  findSessionByTelegramReply,
} from "@/site/chat-store";

export const runtime = "nodejs";

type TelegramWebhookUpdate = {
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

export async function GET() {
  return NextResponse.json({ ok: true });
}

export async function POST(request: Request) {
  const update = (await request.json().catch(() => null)) as TelegramWebhookUpdate | null;
  const message = update?.message;
  const chatId = message?.chat?.id;
  const replyToMessageId = message?.reply_to_message?.message_id;
  const text = typeof message?.text === "string" ? message.text.trim() : "";

  if (!chatId || !replyToMessageId || !text) {
    return NextResponse.json({ ok: true, ignored: true });
  }

  const sessionId = await findSessionByTelegramReply({
    chatId,
    replyToMessageId,
  });

  if (!sessionId) {
    return NextResponse.json({ ok: true, ignored: true });
  }

  await appendChatMessage(
    createChatMessage({
      sessionId,
      from: "manager",
      text,
    }),
  );

  return NextResponse.json({ ok: true });
}
