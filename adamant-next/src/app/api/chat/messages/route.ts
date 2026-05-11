import { NextResponse } from "next/server";

import { getChatMessages } from "@/site/chat-store";
import { syncTelegramRepliesFromUpdates } from "@/site/telegram-updates";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const sessionId = url.searchParams.get("sessionId")?.trim() ?? "";

  if (!sessionId) {
    return NextResponse.json(
      {
        ok: false,
        error: "sessionId is required",
      },
      { status: 400 },
    );
  }

  await syncTelegramRepliesFromUpdates().catch((error) => {
    console.error("Failed to sync Telegram replies", error);
  });

  return NextResponse.json({
    ok: true,
    messages: await getChatMessages(sessionId),
  });
}
