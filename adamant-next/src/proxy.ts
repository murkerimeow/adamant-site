import { NextResponse, type NextRequest } from "next/server";

import { getLegacyCatalogItemPath } from "@/site/routes";

const legacyRedirects = new Map([
  ["/index.php", "/"],
  ["/privacy-policy", "/privacy"],
  ["/politika-konfidencialnosti", "/privacy"],
]);

const legacySitemapRedirects = new Set([
  "/page-sitemap.xml",
  "/post-sitemap.xml",
  "/sitemap_index.xml",
  "/wp-sitemap.xml",
]);

const legacyGoneExact = new Set([
  "/comments",
  "/comments/feed",
  "/feed",
  "/hello-world",
  "/home",
  "/home.html",
  "/license.txt",
  "/nothing-found",
  "/readme.html",
  "/sample-page",
  "/wp-comments-post.php",
  "/wp-login.php",
  "/xmlrpc.php",
]);

const legacyGonePrefixes = [
  "/author/",
  "/category/",
  "/home/",
  "/portfolio-category/",
  "/project-category/",
  "/service-category/",
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

function permanentRedirect(request: NextRequest, pathname: string) {
  const url = request.nextUrl.clone();
  url.hostname = "adamant-stroy.com";
  url.port = "";
  url.pathname = pathname;
  url.protocol = "https:";
  url.search = "";

  return NextResponse.redirect(url, 301);
}

export function proxy(request: NextRequest) {
  const { nextUrl } = request;
  const pathname = nextUrl.pathname.toLowerCase();
  const normalizedPathname =
    pathname.length > 1 && pathname.endsWith("/") ? pathname.slice(0, -1) : pathname;
  const hostname =
    request.headers.get("host")?.split(":")[0].toLowerCase() ||
    nextUrl.hostname.toLowerCase();

  if (pathname.startsWith("/_next") || pathname.startsWith("/api")) {
    if (hostname === "www.adamant-stroy.com") {
      const url = nextUrl.clone();
      url.hostname = "adamant-stroy.com";
      url.port = "";
      url.protocol = "https:";

      return NextResponse.redirect(url, 301);
    }

    return NextResponse.next();
  }

  if (legacyRedirects.has(normalizedPathname)) {
    return permanentRedirect(
      request,
      legacyRedirects.get(normalizedPathname) || "/",
    );
  }

  if (normalizedPathname === "/catalog-item") {
    const slug = nextUrl.searchParams.get("slug");
    const itemPath = getLegacyCatalogItemPath(nextUrl.searchParams.get("item"));

    return permanentRedirect(
      request,
      slug ? `/catalog/${encodeURIComponent(slug)}` : itemPath || "/catalog",
    );
  }

  if (legacySitemapRedirects.has(normalizedPathname)) {
    return permanentRedirect(request, "/sitemap.xml");
  }

  if (isLegacyGonePath(normalizedPathname)) {
    return goneResponse();
  }

  if (pathname !== normalizedPathname) {
    return permanentRedirect(request, normalizedPathname);
  }

  if (
    normalizedPathname === "/" &&
    legacyQueryParams.some((param) => nextUrl.searchParams.has(param))
  ) {
    return permanentRedirect(request, "/");
  }

  if (hostname === "www.adamant-stroy.com") {
    const url = nextUrl.clone();
    url.hostname = "adamant-stroy.com";
    url.port = "";
    url.protocol = "https:";

    return NextResponse.redirect(url, 301);
  }

  return NextResponse.next();
}
