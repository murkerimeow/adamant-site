import { NextRequest, NextResponse } from "next/server";
import { createPayloadRequest } from "payload";

import {
  generateClientPassword,
  hashClientPassword,
  normalizeClientLogin,
} from "@/client-access/session";
import config from "@payload-config";

export const runtime = "nodejs";

type AdminUser = {
  id?: number | string;
  role?: string | null;
};

type ClientAccessDocument = {
  id: number | string;
  login?: string | null;
};

async function getAdminPayload(request: NextRequest) {
  const payloadRequest = await createPayloadRequest({
    canSetHeaders: false,
    config,
    request,
  });
  const user = payloadRequest.user as AdminUser | null;

  if (!user?.id || !["admin", "editor"].includes(user.role ?? "")) {
    return null;
  }

  return payloadRequest.payload;
}

function generateLoginFromID(id: number | string) {
  return normalizeClientLogin(`client-${id}`);
}

async function ensureUniqueLogin(
  payload: NonNullable<Awaited<ReturnType<typeof getAdminPayload>>>,
  preferredLogin: string,
  currentID: number | string,
) {
  let login = preferredLogin;

  for (let attempt = 0; attempt < 8; attempt += 1) {
    const existing = await payload.find({
      collection: "client-access",
      depth: 0,
      limit: 1,
      overrideAccess: true,
      where: {
        login: {
          equals: login,
        },
      },
    });

    const existingDoc = existing.docs[0] as ClientAccessDocument | undefined;

    if (!existingDoc || String(existingDoc.id) === String(currentID)) {
      return login;
    }

    login = normalizeClientLogin(`${preferredLogin}-${Math.random().toString(36).slice(2, 6)}`);
  }

  throw new Error("Не удалось подобрать уникальный логин");
}

export async function POST(request: NextRequest) {
  try {
    const payload = await getAdminPayload(request);

    if (!payload) {
      return NextResponse.json({ error: "Недостаточно прав" }, { status: 403 });
    }

    const body = (await request.json().catch(() => null)) as { id?: number | string } | null;

    if (!body?.id) {
      return NextResponse.json({ error: "Не указан клиент" }, { status: 400 });
    }

    const doc = (await payload.findByID({
      collection: "client-access",
      depth: 0,
      id: body.id,
      overrideAccess: true,
    })) as ClientAccessDocument;

    const login = await ensureUniqueLogin(
      payload,
      normalizeClientLogin(doc.login || generateLoginFromID(doc.id)),
      doc.id,
    );
    const password = generateClientPassword();
    const generatedAt = new Date().toISOString();

    await payload.update({
      collection: "client-access",
      data: {
        accessEnabled: true,
        accessGeneratedAt: generatedAt,
        login,
        passwordHash: await hashClientPassword(password),
      },
      id: doc.id,
      overrideAccess: true,
    });

    return NextResponse.json(
      {
        generatedAt,
        login,
        password,
      },
      {
        headers: {
          "Cache-Control": "no-store",
        },
      },
    );
  } catch (error) {
    console.error("[client-access/generate]", error);

    return NextResponse.json(
      { error: "Не удалось сгенерировать доступ" },
      { status: 500 },
    );
  }
}
