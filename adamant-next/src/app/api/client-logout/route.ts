import { NextRequest, NextResponse } from "next/server";

import { CLIENT_ACCESS_COOKIE } from "@/client-access/session";
import { SITE_URL } from "@/site/seo";

export const runtime = "nodejs";

function shouldUseSecureCookie(request: NextRequest) {
  return (
    process.env.NODE_ENV === "production" &&
    (request.nextUrl.protocol === "https:" || request.headers.get("x-forwarded-proto") === "https")
  );
}

function getRedirectUrl(path: string, request: NextRequest) {
  return new URL(path, process.env.NODE_ENV === "production" ? SITE_URL : request.url);
}

function logout(request: NextRequest) {
  const response = NextResponse.redirect(getRedirectUrl("/client/login", request), { status: 303 });

  response.cookies.set(CLIENT_ACCESS_COOKIE, "", {
    httpOnly: true,
    maxAge: 0,
    path: "/",
    sameSite: "lax",
    secure: shouldUseSecureCookie(request),
  });

  return response;
}

export function GET(request: NextRequest) {
  return logout(request);
}

export function POST(request: NextRequest) {
  return logout(request);
}
