import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

import { type MigrateUpArgs } from "@payloadcms/db-sqlite";

type Payload = MigrateUpArgs["payload"];
type Req = MigrateUpArgs["req"];

type PortfolioProjectSeed = {
  assetsDir: string;
  coverFile: string;
  description: string;
  imageDescriptions: readonly string[];
  location?: string;
  order: number;
  seoDescription: string;
  seoTitle: string;
  slug: string;
  summary: string;
  title: string;
};

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);
const assetsRoot = path.resolve(
  dirname,
  "portfolio-assets/20260711_landscape_portfolio",
);

const portfolioCategory = {
  description:
    "Проекты ландшафтного дизайна и благоустройства участков: планировочные решения, озеленение, зоны отдыха, дорожки и визуализации.",
  h1: "Ландшафтный дизайн",
  order: 7,
  seoDescription:
    "Портфолио ландшафтного дизайна от АДАМАНТ Строй: благоустройство частных участков, скверов, озеленение, дорожки, зоны отдыха и визуализации.",
  seoTitle: "Ландшафтный дизайн - портфолио проектов | АДАМАНТ Строй",
  showInNavigation: true,
  slug: "landshaftnyy-dizayn",
  title: "Ландшафтный дизайн",
};

const projects: PortfolioProjectSeed[] = [
  {
    assetsDir: "aleksandrovskaya-landscape",
    coverFile: "aleksandrovskaya-landscape-03.jpg",
    description:
      "Проект благоустройства индивидуального участка в поселке Александровская включает рабочие листы с дендропланом, подбором растений, планировочными решениями, зонами отдыха, дорожками, газоном и декоративными посадками.\n\nВ галерее собраны листы проекта целиком: схемы озеленения, ведомости растений, планы мощения и композиционные решения для участка. Такой формат помогает оценить не только внешний вид будущего сада, но и техническую проработку благоустройства.",
    imageDescriptions: [
      "лист 1: дендроплан участка и ведомость озеленения",
      "лист 2: схема озеленения и посадочные группы",
      "лист 3: план благоустройства с зонами отдыха и озеленением",
      "лист 4: фрагмент участка с посадками и планировкой",
      "лист 5: вытянутый участок с газоном, дорожками и озеленением",
      "лист 6: план участка с ведомостью материалов и растений",
      "лист 7: комплексная схема благоустройства территории",
      "лист 8: генеральный план благоустройства участка",
    ],
    location: "Санкт-Петербург, пос. Александровская",
    order: 50,
    seoDescription:
      "Проект благоустройства участка в поселке Александровская: дендроплан, озеленение, дорожки, газон, зоны отдыха и рабочие листы ландшафтного дизайна.",
    seoTitle:
      "Проект благоустройства участка в Александровской | АДАМАНТ Строй",
    slug: "blagoustroystvo-uchastka-aleksandrovskaya",
    summary:
      "Ландшафтный проект индивидуального участка с дендропланом, озеленением, дорожками, газоном и зонами отдыха.",
    title: "Проект благоустройства участка в Александровской",
  },
  {
    assetsDir: "skver-turginovo",
    coverFile: "skver-turginovo-06.jpg",
    description:
      "Концепция сквера в Тургиново показывает благоустройство общественного пространства с прогулочными маршрутами, озеленением, детскими и спортивными зонами, местами отдыха и малыми архитектурными формами.\n\nВ проекте представлены общий вид территории, планировочная схема и визуализации ключевых зон: входной группы, детской площадки, спортивной зоны, мест отдыха, зоны кафе и прогулочных дорожек.",
    imageDescriptions: [
      "лист 1: титульный лист концепции благоустройства сквера",
      "лист 2: вид сверху и общая планировочная схема сквера",
      "лист 3: входная зона с павильоном и парковкой",
      "лист 4: прогулочная дорожка в зеленой зоне",
      "лист 5: детская площадка с игровыми элементами",
      "лист 6: детская площадка и зона отдыха",
      "лист 7: спортивная площадка с зоной отдыха",
      "лист 8: спортивная площадка в зеленом массиве",
      "лист 9: площадь для отдыха и входная зона",
      "лист 10: зона кафе и пешеходная часть сквера",
      "лист 11: зона отдыха со скамейками разного типа",
      "лист 12: уголок для настольных игр и отдыха",
    ],
    location: "Тургиново",
    order: 51,
    seoDescription:
      "Концепция благоустройства сквера в Тургиново: планировка, озеленение, прогулочные маршруты, детские и спортивные зоны, места отдыха.",
    seoTitle: "Концепция сквера в Тургиново | АДАМАНТ Строй",
    slug: "kontseptsiya-skvera-turginovo",
    summary:
      "Концепция благоустройства сквера с озеленением, прогулочными маршрутами, детскими и спортивными зонами.",
    title: "Концепция сквера в Тургиново",
  },
];

function toNumberId(id: number | string | undefined, label: string) {
  const numericId = typeof id === "number" ? id : Number(id);

  if (!Number.isFinite(numericId)) {
    throw new Error(`Expected numeric Payload ID for ${label}.`);
  }

  return numericId;
}

async function findBySlug({
  collection,
  payload,
  req,
  slug,
}: {
  collection: "portfolio" | "portfolio-categories";
  payload: Payload;
  req: Req;
  slug: string;
}) {
  const result = await payload.find({
    collection,
    depth: 0,
    draft: true,
    limit: 1,
    overrideAccess: true,
    req,
    where: {
      slug: {
        equals: slug,
      },
    },
  });

  return result.docs[0];
}

async function ensurePortfolioCategory(payload: Payload, req: Req) {
  const existing = await findBySlug({
    collection: "portfolio-categories",
    payload,
    req,
    slug: portfolioCategory.slug,
  });

  if (existing) {
    await payload.update({
      collection: "portfolio-categories",
      id: existing.id,
      data: portfolioCategory,
      overrideAccess: true,
      req,
    });

    return toNumberId(existing.id, portfolioCategory.slug);
  }

  const created = await payload.create({
    collection: "portfolio-categories",
    data: portfolioCategory,
    overrideAccess: true,
    req,
  });

  return toNumberId(created.id, portfolioCategory.slug);
}

async function upsertMedia({
  alt,
  caption,
  filePath,
  payload,
  req,
}: {
  alt: string;
  caption: string;
  filePath: string;
  payload: Payload;
  req: Req;
}) {
  const existing = await payload.find({
    collection: "media",
    depth: 0,
    limit: 1,
    overrideAccess: true,
    req,
    where: {
      alt: {
        equals: alt,
      },
    },
  });

  if (existing.docs[0]) {
    await payload.update({
      collection: "media",
      id: existing.docs[0].id,
      data: {
        alt,
        caption,
      },
      overrideAccess: true,
      req,
    });

    return toNumberId(existing.docs[0].id, alt);
  }

  const created = await payload.create({
    collection: "media",
    data: {
      alt,
      caption,
    },
    filePath,
    overrideAccess: true,
    req,
  });

  return toNumberId(created.id, alt);
}

function getImageDescription(project: PortfolioProjectSeed, index: number) {
  return (
    project.imageDescriptions[index - 1] ??
    `лист ${index}: материалы ландшафтного проекта`
  );
}

function getImageAlt(project: PortfolioProjectSeed, index: number) {
  return `${project.title} - ${getImageDescription(project, index)}`;
}

function getImageCaption(project: PortfolioProjectSeed, index: number) {
  return `${project.title}: ${getImageDescription(project, index)}.`;
}

async function uploadProjectImages(project: PortfolioProjectSeed, payload: Payload, req: Req) {
  const projectAssetsDir = path.join(assetsRoot, project.assetsDir);
  const filenames = (await fs.readdir(projectAssetsDir))
    .filter((name) => /\.(jpe?g|png|webp|avif)$/i.test(name))
    .sort((a, b) => a.localeCompare(b, "ru", { numeric: true, sensitivity: "base" }));

  if (!filenames.length) {
    throw new Error(`No images found for ${project.slug}.`);
  }

  const mediaByFilename = new Map<string, number>();

  for (const [index, fileName] of filenames.entries()) {
    const imageIndex = index + 1;
    const mediaId = await upsertMedia({
      alt: getImageAlt(project, imageIndex),
      caption: getImageCaption(project, imageIndex),
      filePath: path.join(projectAssetsDir, fileName),
      payload,
      req,
    });

    mediaByFilename.set(fileName, mediaId);
  }

  const previewImage = mediaByFilename.get(project.coverFile) ?? mediaByFilename.get(filenames[0]);

  if (!previewImage) {
    throw new Error(`No preview image found for ${project.slug}.`);
  }

  return {
    gallery: filenames.map((fileName) => ({
      image: mediaByFilename.get(fileName)!,
    })),
    previewImage,
  };
}

async function upsertPortfolioProject({
  categoryId,
  payload,
  project,
  req,
}: {
  categoryId: number;
  payload: Payload;
  project: PortfolioProjectSeed;
  req: Req;
}) {
  const { gallery, previewImage } = await uploadProjectImages(project, payload, req);
  const existing = await findBySlug({
    collection: "portfolio",
    payload,
    req,
    slug: project.slug,
  });
  const data = {
    _status: "published" as const,
    category: categoryId,
    description: project.description,
    gallery,
    location: project.location,
    order: project.order,
    previewImage,
    seoDescription: project.seoDescription,
    seoTitle: project.seoTitle,
    summary: project.summary,
    title: project.title,
  };

  if (existing) {
    await payload.update({
      collection: "portfolio",
      id: existing.id,
      data,
      draft: false,
      overrideAccess: true,
      req,
    });

    return;
  }

  await payload.create({
    collection: "portfolio",
    data: {
      ...data,
      slug: project.slug,
    },
    draft: false,
    overrideAccess: true,
    req,
  });
}

export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  const categoryId = await ensurePortfolioCategory(payload, req);

  for (const project of projects) {
    await upsertPortfolioProject({
      categoryId,
      payload,
      project,
      req,
    });
  }

  payload.logger.info(`Seeded ${projects.length} landscape portfolio projects.`);
}

export async function down(): Promise<void> {}
