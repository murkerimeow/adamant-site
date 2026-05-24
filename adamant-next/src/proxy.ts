import { NextResponse, type NextRequest } from "next/server";

const legacyRedirects = new Map([
  ["/home", "/"],
  ["/home.html", "/"],
  ["/index.php", "/"],
]);

const legacySitemapRedirects = new Set([
  "/page-sitemap.xml",
  "/post-sitemap.xml",
  "/sitemap_index.xml",
  "/wp-sitemap.xml",
]);

const legacyGoneExact = new Set([
  "/comments",
  "/feed",
  "/hello-world",
  "/privacy-policy",
  "/sample-page",
  "/xmlrpc.php",
]);

const legacyGonePrefixes = [
  "/author/",
  "/category/",
  "/tag/",
  "/wp-admin",
  "/wp-content",
  "/wp-includes",
  "/wp-json",
];

const legacyQueryParams = ["attachment_id", "p", "page_id", "preview", "s"];

function isLegacyDateArchive(pathname: string) {
  return /^\/20\d{2}\/\d{2}(?:\/\d{2})?(?:\/|$)/.test(pathname);
}

function isLegacyGonePath(pathname: string) {
  return (
    legacyGoneExact.has(pathname) ||
    legacyGonePrefixes.some((prefix) => pathname === prefix.slice(0, -1) || pathname.startsWith(prefix)) ||
    isLegacyDateArchive(pathname)
  );
}

function goneResponse() {
  return new NextResponse(
    "<!doctype html><html lang=\"ru\"><head><meta charset=\"utf-8\"><meta name=\"robots\" content=\"noindex,nofollow\"><title>410 Gone</title></head><body>Gone</body></html>",
    {
      headers: {
        "Cache-Control": "public, max-age=3600",
        "Content-Type": "text/html; charset=utf-8",
        "X-Robots-Tag": "noindex, nofollow, noarchive",
      },
      status: 410,
    },
  );
}

export function proxy(request: NextRequest) {
  const { nextUrl } = request;
  const pathname = nextUrl.pathname.toLowerCase();

  if (pathname.startsWith("/_next") || pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  if (legacyRedirects.has(pathname)) {
    const url = nextUrl.clone();
    url.pathname = legacyRedirects.get(pathname) || "/";
    url.search = "";

    return NextResponse.redirect(url, 308);
  }

  if (legacySitemapRedirects.has(pathname)) {
    const url = nextUrl.clone();
    url.pathname = "/sitemap.xml";
    url.search = "";

    return NextResponse.redirect(url, 308);
  }

  if (
    pathname === "/" &&
    legacyQueryParams.some((param) => nextUrl.searchParams.has(param))
  ) {
    const url = nextUrl.clone();
    url.search = "";

    return NextResponse.redirect(url, 308);
  }

  if (isLegacyGonePath(pathname)) {
    return goneResponse();
  }

  return NextResponse.next();
}
