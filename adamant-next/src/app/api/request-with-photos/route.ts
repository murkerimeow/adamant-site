import config from "@payload-config";
import { sendTelegramRequestPhotos } from "@/payload/lib/telegram";
import { getPayload } from "payload";
import { NextResponse } from "next/server";

const MAX_PHOTOS = 5;
const MAX_PHOTO_SIZE = 8 * 1024 * 1024;

export const runtime = "nodejs";

function readString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function isUploadFile(value: FormDataEntryValue): value is File {
  return value instanceof File && value.size > 0;
}

function sanitizeFilename(value: string) {
  return value.replace(/[^\wа-яёА-ЯЁ.\- ]+/g, "_").slice(0, 120) || "photo.jpg";
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const phone = readString(formData, "phone");

    if (!phone) {
      return NextResponse.json({ error: "Телефон обязателен" }, { status: 400 });
    }

    const photoFiles = formData.getAll("photos").filter(isUploadFile);

    if (photoFiles.length > MAX_PHOTOS) {
      return NextResponse.json(
        { error: `Можно прикрепить не больше ${MAX_PHOTOS} фото` },
        { status: 400 },
      );
    }

    for (const file of photoFiles) {
      if (!file.type.startsWith("image/")) {
        return NextResponse.json(
          { error: "Можно прикреплять только изображения" },
          { status: 400 },
        );
      }

      if (file.size > MAX_PHOTO_SIZE) {
        return NextResponse.json(
          { error: "Размер одного фото не должен превышать 8 МБ" },
          { status: 400 },
        );
      }
    }

    const payload = await getPayload({ config });
    const message = readString(formData, "message");
    const photoNote = photoFiles.length ? `Прикреплено фото: ${photoFiles.length}` : "";
    const doc = await payload.create({
      collection: "requests",
      data: {
        requestType: "estimate",
        name: readString(formData, "name"),
        phone,
        email: readString(formData, "email"),
        service: readString(formData, "service"),
        message: [message, photoNote].filter(Boolean).join("\n"),
        sourcePage: readString(formData, "sourcePage"),
        status: "new",
      },
    });

    if (photoFiles.length) {
      try {
        await sendTelegramRequestPhotos(
          doc,
          await Promise.all(
            photoFiles.map(async (file) => ({
              bytes: new Uint8Array(await file.arrayBuffer()),
              filename: sanitizeFilename(file.name),
              mimeType: file.type || "image/jpeg",
            })),
          ),
        );
      } catch (error) {
        payload.logger.error(
          {
            err: error,
            requestId: doc.id,
          },
          "Telegram request photo notification failed",
        );
      }
    }

    return NextResponse.json({ doc }, { status: 201 });
  } catch (error) {
    console.error("Request with photos failed", error);
    return NextResponse.json(
      { error: "Не удалось отправить заявку" },
      { status: 500 },
    );
  }
}
