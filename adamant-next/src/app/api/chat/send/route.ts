import { NextResponse } from "next/server";

import {
  sendTelegramChatNotification,
  sendTelegramChatPhotos,
  type TelegramPhotoAttachment,
  type TelegramSendResult,
} from "@/payload/lib/telegram";
import {
  appendChatMessage,
  createChatMessage,
  getChatMessages,
  rememberTelegramMessage,
  type SiteChatAttachment,
} from "@/site/chat-store";

export const runtime = "nodejs";

const MAX_PHOTOS = 5;
const MAX_PHOTO_SIZE = 8 * 1024 * 1024;

type ChatSendPayload = {
  sessionId?: unknown;
  text?: unknown;
  page?: unknown;
  photos?: File[];
};

function normalizeText(value: unknown, maxLength: number) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

function isUploadFile(value: FormDataEntryValue): value is File {
  return value instanceof File && value.size > 0;
}

function sanitizeFilename(value: string) {
  return value.replace(/[^\p{L}\p{N}.\- _]+/gu, "_").slice(0, 120) || "photo.jpg";
}

function validatePhotos(files: File[]) {
  if (files.length > MAX_PHOTOS) {
    return `Можно прикрепить не больше ${MAX_PHOTOS} фото`;
  }

  const oversizedFile = files.find((file) => file.size > MAX_PHOTO_SIZE);
  if (oversizedFile) {
    return `Фото ${oversizedFile.name} больше 8 МБ`;
  }

  const wrongTypeFile = files.find((file) => !file.type.startsWith("image/"));
  if (wrongTypeFile) {
    return `Файл ${wrongTypeFile.name} не похож на изображение`;
  }

  return "";
}

async function readChatRequest(request: Request): Promise<ChatSendPayload | null> {
  const contentType = request.headers.get("content-type")?.toLowerCase() ?? "";

  if (contentType.includes("multipart/form-data")) {
    const formData = await request.formData();

    return {
      sessionId: formData.get("sessionId"),
      text: formData.get("text"),
      page: formData.get("page"),
      photos: formData.getAll("photos").filter(isUploadFile),
    };
  }

  return (await request.json().catch(() => null)) as ChatSendPayload | null;
}

async function buildTelegramPhotoAttachments(files: File[]): Promise<TelegramPhotoAttachment[]> {
  return Promise.all(
    files.map(async (file) => ({
      bytes: new Uint8Array(await file.arrayBuffer()),
      filename: sanitizeFilename(file.name),
      mimeType: file.type || "image/jpeg",
    })),
  );
}

export async function POST(request: Request) {
  const payload = await readChatRequest(request);
  const sessionId = normalizeText(payload?.sessionId, 120);
  const text = normalizeText(payload?.text, 1200);
  const page = normalizeText(payload?.page, 300);
  const photoFiles = Array.isArray(payload?.photos) ? payload.photos : [];
  const photoError = validatePhotos(photoFiles);

  if (!sessionId || (!text && !photoFiles.length)) {
    return NextResponse.json(
      {
        ok: false,
        error: "sessionId and text or photos are required",
      },
      { status: 400 },
    );
  }

  if (photoError) {
    return NextResponse.json(
      {
        ok: false,
        error: photoError,
      },
      { status: 400 },
    );
  }

  const attachments: SiteChatAttachment[] = photoFiles.map((file) => ({
    type: "photo",
    name: sanitizeFilename(file.name),
    size: file.size,
  }));
  const displayText = text || (attachments.length ? `Прикреплено фото: ${attachments.length}` : "");

  await appendChatMessage(
    createChatMessage({
      sessionId,
      from: "visitor",
      text: displayText,
      page,
      attachments,
    }),
  );

  let deliveredToTelegram = false;

  try {
    const telegramMessages: TelegramSendResult[] = [];

    if (text) {
      telegramMessages.push(
        ...(await sendTelegramChatNotification({
          sessionId,
          text: attachments.length ? `${text}\n\nПрикреплено фото: ${attachments.length}` : text,
          page,
        })),
      );
    }

    if (photoFiles.length) {
      telegramMessages.push(
        ...(await sendTelegramChatPhotos({
          sessionId,
          text,
          page,
          attachments: await buildTelegramPhotoAttachments(photoFiles),
        })),
      );
    }

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
