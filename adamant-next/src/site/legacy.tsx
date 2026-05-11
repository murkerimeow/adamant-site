import { readFile } from "fs/promises";
import path from "path";

import type { Metadata } from "next";

import { BodyClassName } from "./BodyClassName";

export type LegacyTemplate =
  | "about.html"
  | "blog.html"
  | "catalog-item.html"
  | "catalog.html"
  | "contacts.html"
  | "index.html"
  | "portfolio.html"
  | "services.html";

type LegacyPageData = {
  bodyClass?: string;
  html: string;
  title: string;
};

const templateDir = path.join(process.cwd(), "src", "site", "templates");

const routeReplacements = [
  ['href="index.html"', 'href="/"'],
  ['href="services.html"', 'href="/services"'],
  ['href="portfolio.html"', 'href="/portfolio"'],
  ['href="catalog.html"', 'href="/catalog"'],
  ['href="blog.html"', 'href="/blog"'],
  ['href="contacts.html"', 'href="/contacts"'],
  ['href="about.html"', 'href="/about"'],
  ['href="catalog-item.html?', 'href="/catalog-item?'],
  ['data-card-link="catalog-item.html?', 'data-card-link="/catalog-item?'],
];

function extractBodyHtml(documentHtml: string) {
  const bodyMatch = documentHtml.match(/<body([^>]*)>([\s\S]*?)<\/body>/i);
  if (!bodyMatch) {
    throw new Error("Legacy template body not found.");
  }

  const [, bodyAttributes, bodyHtml] = bodyMatch;
  const bodyClass = bodyAttributes.match(/class="([^"]+)"/i)?.[1];

  return {
    bodyClass,
    bodyHtml,
  };
}

function normalizeLegacyHtml(bodyHtml: string) {
  let normalizedHtml = bodyHtml.replace(/<script[\s\S]*?<\/script>/gi, "");

  for (const [source, target] of routeReplacements) {
    normalizedHtml = normalizedHtml.split(source).join(target);
  }

  normalizedHtml = normalizedHtml.replace(
    /\s(src|poster)=["'](?!https?:|data:|\/)([^"']+)["']/gi,
    (_match, attribute, value) => ` ${attribute}="/${value}"`,
  );

  normalizedHtml = normalizedHtml.replace(
    /\shref=["'](?!https?:|tel:|mailto:|#|\/)([^"']+\.(?:png|jpg|jpeg|gif|svg|webp|PNG|JPG|JPEG))["']/gi,
    (_match, value) => ` href="/${value}"`,
  );

  return normalizedHtml.trim();
}

export async function loadLegacyPage(template: LegacyTemplate): Promise<LegacyPageData> {
  const templatePath = path.join(templateDir, template);
  const documentHtml = await readFile(templatePath, "utf8");
  const title =
    documentHtml.match(/<title>([^<]+)<\/title>/i)?.[1]?.trim() ?? "Адамант";
  const { bodyClass, bodyHtml } = extractBodyHtml(documentHtml);

  return {
    bodyClass,
    html: normalizeLegacyHtml(bodyHtml),
    title,
  };
}

export async function getLegacyMetadata(template: LegacyTemplate): Promise<Metadata> {
  const { title } = await loadLegacyPage(template);

  return {
    title,
  };
}

type LegacyTemplatePageProps = {
  template: LegacyTemplate;
};

export async function LegacyTemplatePage({ template }: LegacyTemplatePageProps) {
  const page = await loadLegacyPage(template);

  return (
    <>
      <BodyClassName className={page.bodyClass} />
      <div dangerouslySetInnerHTML={{ __html: page.html }} />
    </>
  );
}
