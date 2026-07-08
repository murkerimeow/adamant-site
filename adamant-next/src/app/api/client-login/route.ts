import { NextRequest, NextResponse } from "next/server";
import { getPayload } from "payload";

import {
  CLIENT_ACCESS_COOKIE,
  CLIENT_ACCESS_SESSION_MAX_AGE_SECONDS,
  createClientSessionValue,
  normalizeClientLogin,
  verifyClientPassword,
} from "@/client-access/session";
import config from "@payload-config";

export const runtime = "nodejs";

type ClientAccessDocument = {
  accessEnabled?: boolean | null;
  id: number | string;
  login?: string | null;
  passwordHash?: string | null;
};

function redirectWithError(request: NextRequest) {
  const url = new URL("/client/login", request.url);
  url.searchParams.set("error", "1");

  return NextResponse.redirect(url, { status: 303 });
}

function shouldUseSecureCookie(request: NextRequest) {
  return (
    process.env.NODE_ENV === "production" &&
    (request.nextUrl.protocol === "https:" || request.headers.get("x-forwarded-proto") === "https")
  );
}

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const login = normalizeClientLogin(formData.get("login"));
  const password = String(formData.get("password") ?? "");

  if (!login || !password) {
    return redirectWithError(request);
  }

  const payload = await getPayload({ config });
  const result = await payload.find({
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
  const client = result.docs[0] as ClientAccessDocument | undefined;
  const clientLogin = client?.login;

  if (
    !client?.accessEnabled ||
    !clientLogin ||
    !(await verifyClientPassword(password, client.passwordHash))
  ) {
    return redirectWithError(request);
  }

  await payload.update({
    collection: "client-access",
    data: {
      lastLoginAt: new Date().toISOString(),
    },
    id: client.id,
    overrideAccess: true,
  });

  const response = NextResponse.redirect(new URL("/client", request.url), { status: 303 });
  response.cookies.set(
    CLIENT_ACCESS_COOKIE,
    createClientSessionValue({ id: client.id, login: clientLogin }),
    {
      httpOnly: true,
      maxAge: CLIENT_ACCESS_SESSION_MAX_AGE_SECONDS,
      path: "/",
      sameSite: "lax",
      secure: shouldUseSecureCookie(request),
    },
  );

  return response;
}
