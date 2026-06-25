import path from "path";
import { fileURLToPath } from "url";

import { sqliteAdapter } from "@payloadcms/db-sqlite";
import { buildConfig } from "payload";
import { ru } from "payload/i18n/ru";
import sharp from "sharp";

import { Catalog } from "./src/payload/collections/Catalog.ts";
import { CatalogCategories } from "./src/payload/collections/CatalogCategories.ts";
import { Media } from "./src/payload/collections/Media.ts";
import { Portfolio } from "./src/payload/collections/Portfolio.ts";
import { PortfolioCategories } from "./src/payload/collections/PortfolioCategories.ts";
import { Posts } from "./src/payload/collections/Posts.ts";
import { Requests } from "./src/payload/collections/Requests.ts";
import { Reviews } from "./src/payload/collections/Reviews.ts";
import { Services } from "./src/payload/collections/Services.ts";
import { TeamMembers } from "./src/payload/collections/TeamMembers.ts";
import { Users } from "./src/payload/collections/Users.ts";
import { Vacancies } from "./src/payload/collections/Vacancies.ts";
import { AboutPage } from "./src/payload/globals/AboutPage.ts";
import { BlogPage } from "./src/payload/globals/BlogPage.ts";
import { CatalogPage } from "./src/payload/globals/CatalogPage.ts";
import { ContactsPage } from "./src/payload/globals/ContactsPage.ts";
import { HomePage } from "./src/payload/globals/HomePage.ts";
import { PortfolioPage } from "./src/payload/globals/PortfolioPage.ts";
import { ServicesPage } from "./src/payload/globals/ServicesPage.ts";
import { SiteSettings } from "./src/payload/globals/SiteSettings.ts";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);
const uploadLimitBytes = 250 * 1024 * 1024;

export default buildConfig({
  admin: {
    importMap: {
      importMapFile: path.resolve(
        dirname,
        "src/app/(payload)/admin/importMap.js",
      ),
    },
    user: Users.slug,
  },
  collections: [
    Users,
    Media,
    Posts,
    Services,
    PortfolioCategories,
    Portfolio,
    CatalogCategories,
    Catalog,
    Reviews,
    TeamMembers,
    Vacancies,
    Requests,
  ],
  db: sqliteAdapter({
    client: {
      url:
        process.env.DATABASE_URI ??
        `file:${path.resolve(dirname, "adamant.db")}`,
    },
    push: process.env.NODE_ENV !== "production",
  }),
  globals: [
    SiteSettings,
    HomePage,
    AboutPage,
    ContactsPage,
    ServicesPage,
    PortfolioPage,
    CatalogPage,
    BlogPage,
  ],
  routes: {
    admin: "/admin",
    api: "/api",
  },
  upload: {
    abortOnLimit: true,
    createParentPath: true,
    limits: {
      fileSize: uploadLimitBytes,
    },
    responseOnLimit: "Файл слишком большой. Максимальный размер: 250 МБ.",
    tempFileDir: path.resolve(dirname, ".payload-tmp"),
    uploadTimeout: 0,
    useTempFiles: true,
  },
  i18n: {
    fallbackLanguage: "ru",
    supportedLanguages: {
      ru,
    },
  },
  secret: process.env.PAYLOAD_SECRET ?? "adamant-dev-secret-change-me",
  sharp,
  typescript: {
    outputFile: path.resolve(dirname, "src/payload-types.ts"),
  },
});
