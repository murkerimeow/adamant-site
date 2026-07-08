import { NextRequest, NextResponse } from "next/server";
import { getPayload } from "payload";

import {
  generateClientPassword,
  hashClientPassword,
  normalizeClientLogin,
} from "@/client-access/session";
import config from "@payload-config";

export const runtime = "nodejs";

type ClientAccessDocument = {
  id: number | string;
  login?: string | null;
};

async function isAdminRequest(request: NextRequest) {
  const cookie = request.headers.get("cookie") ?? "";
  const origin = new URL(request.url).origin;
  const response = await fetch(`${origin}/api/users/me`, {
    cache: "no-store",
    headers: {
      cookie,
    },
  });

  if (!response.ok) {
    return false;
  }

  const data = (await response.json()) as {
    user?: {
      id?: number | string;
      role?: string;
    } | null;
  };

  return Boolean(data.user?.id && ["admin", "editor"].includes(data.user.role ?? ""));
}

function generateLoginFromID(id: number | string) {
  return normalizeClientLogin(`client-${id}`);
}

async function ensureUniqueLogin(
  payload: Awaited<ReturnType<typeof getPayload>>,
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
  if (!(await isAdminRequest(request))) {
    return NextResponse.json({ error: "Недостаточно прав" }, { status: 403 });
  }

  const body = (await request.json().catch(() => null)) as { id?: number | string } | null;

  if (!body?.id) {
    return NextResponse.json({ error: "Не указан клиент" }, { status: 400 });
  }

  const payload = await getPayload({ config });
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
}
