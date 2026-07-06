import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

import { type MigrateUpArgs } from "@payloadcms/db-sqlite";

type Payload = MigrateUpArgs["payload"];
type Req = MigrateUpArgs["req"];
type ZoneRule = readonly [maxIndex: number, zone: string];

type PortfolioProjectSeed = {
  assetsDir: string;
  coverFile: string;
  description: string;
  location?: string;
  order: number;
  projectArea?: number;
  seoDescription: string;
  seoTitle: string;
  slug: string;
  summary: string;
  title: string;
  zoneRules: readonly ZoneRule[];
};

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);
const assetsRoot = path.resolve(
  dirname,
  "portfolio-assets/20260706_portfolio_projects",
);

const portfolioCategory = {
  description:
    "Реализованные и разработанные интерьерные проекты: квартиры, дома, кухни-гостиные, спальни, прихожие и санузлы.",
  h1: "Дизайн интерьеров",
  order: 6,
  seoDescription:
    "Портфолио дизайн-проектов интерьеров от АДАМАНТ Строй: квартиры, загородные дома, кухни-гостиные, спальни и санузлы.",
  seoTitle: "Дизайн интерьеров — портфолио проектов | АДАМАНТ Строй",
  slug: "dizayn-intererov",
  title: "Дизайн интерьеров",
};

const projects: PortfolioProjectSeed[] = [
  {
    assetsDir: "eco-parnas-58",
    coverFile: "eco-parnas-58-29.jpg",
    description:
      "Дизайн-проект квартиры 58 м² в эко-стиле у метро Парнас построен на спокойной природной палитре, зелёных акцентах, древесных фактурах и мягкой вечерней подсветке. В проекте проработаны спальня, кухня-гостиная, прихожая и санузел, чтобы компактная площадь воспринималась цельно и уютно.\n\nИнтерьер сочетает функциональное хранение, лёгкие перегородки, встроенную мебель и декоративные сценарии света. Такой подход помогает сохранить ощущение воздуха, добавить глубину пространству и сделать квартиру комфортной для повседневной жизни.",
    location: "Санкт-Петербург, м. Парнас",
    order: 6,
    projectArea: 58,
    seoDescription:
      "Дизайн-проект квартиры 58 м² в эко-стиле у метро Парнас: зелёные акценты, тёплое дерево, кухня-гостиная, спальня и санузел.",
    seoTitle:
      "Дизайн-проект квартиры 58 м² в эко-стиле у метро Парнас | АДАМАНТ Строй",
    slug: "dizayn-proekt-kvartiry-58-m2-eko-stil-parnas",
    summary:
      "Дизайн-проект квартиры 58 м² в эко-стиле с зелёными акцентами, тёплой подсветкой, кухней-гостиной и спокойной спальней.",
    title: "Дизайн-проект квартиры 58 м² в эко-стиле у метро Парнас",
    zoneRules: [
      [6, "спальня в эко-стиле"],
      [7, "прихожая с зеркалом"],
      [8, "кухня-гостиная"],
      [9, "ванная зона с круглым зеркалом"],
      [10, "спальня с зелёными акцентами"],
      [11, "прихожая"],
      [21, "кухня-гостиная с зелёными акцентами"],
      [27, "спальня с тёплой подсветкой"],
      [29, "кухня-гостиная"],
      [30, "спальня и стеклянная перегородка"],
    ],
  },
  {
    assetsDir: "magnifika-residence",
    coverFile: "magnifika-residence-06.jpg",
    description:
      "Проект интерьера квартиры в ЖК Magnifika Residence выполнен в современной спокойной стилистике с зелёными акцентами, светлыми поверхностями, древесными текстурами и продуманным хранением. Визуальные решения объединяют спальню, кухню, прихожую и санузел в единый аккуратный образ.\n\nОсобое внимание уделено мягкому свету, встроенной мебели, компактной кухонной зоне и деталям санузла. Интерьер выглядит сдержанно, но не холодно: натуральные оттенки и фактуры делают пространство более живым и уютным.",
    location: "Санкт-Петербург, ЖК Magnifika Residence",
    order: 7,
    seoDescription:
      "Дизайн интерьера квартиры в ЖК Magnifika Residence: спальня, кухня, прихожая и санузел с зелёными акцентами, деревом и мягкой подсветкой.",
    seoTitle:
      "Дизайн интерьера квартиры в ЖК Magnifika Residence | АДАМАНТ Строй",
    slug: "dizayn-interera-zhk-magnifika-residence",
    summary:
      "Современный дизайн интерьера квартиры в ЖК Magnifika Residence с зелёными акцентами, деревом, мягким светом и продуманным хранением.",
    title: "Дизайн интерьера квартиры в ЖК Magnifika Residence",
    zoneRules: [
      [1, "коллаж ракурсов квартиры"],
      [4, "спальня с зелёными акцентами"],
      [5, "коллаж спальни и кухни"],
      [8, "спальня и кухня"],
      [9, "прихожая с рейками"],
      [11, "детали интерьера"],
      [14, "кухня и системы хранения"],
      [21, "санузел"],
      [22, "кухня"],
      [23, "прихожая"],
    ],
  },
  {
    assetsDir: "zhk-nauka",
    coverFile: "zhk-nauka-36.jpg",
    description:
      "Дизайн интерьера квартиры в ЖК Наука — это большой комплексный проект с проработкой кухни-гостиной, спальни, прихожей, зоны хранения и санузла. В основе решения — спокойная цветовая палитра, тёплое дерево, графитовые акценты, прозрачные перегородки и мягкая подсветка.\n\nПроект показывает несколько сценариев восприятия пространства: общие ракурсы, крупные планы мебели, декоративные детали и функциональные зоны. Благодаря этому интерьер выглядит цельно и продуманно как в дневном, так и в вечернем освещении.",
    location: "Санкт-Петербург, ЖК Наука",
    order: 8,
    seoDescription:
      "Дизайн интерьера квартиры в ЖК Наука: современная кухня-гостиная, спальня, прихожая и санузел в спокойной палитре с деревом и графитовыми акцентами.",
    seoTitle: "Дизайн интерьера квартиры в ЖК Наука | АДАМАНТ Строй",
    slug: "dizayn-interera-zhk-nauka",
    summary:
      "Комплексный дизайн интерьера квартиры в ЖК Наука с кухней-гостиной, спальней, прихожей, санузлом и продуманными сценариями света.",
    title: "Дизайн интерьера квартиры в ЖК Наука",
    zoneRules: [
      [1, "санузел с круглым зеркалом"],
      [4, "спальня"],
      [13, "кухня-гостиная"],
      [14, "санузел с душевой"],
      [17, "спальня и прихожая"],
      [18, "санузел"],
      [26, "спальня"],
      [37, "кухня-гостиная"],
      [45, "спальня и детали интерьера"],
      [48, "кухня"],
      [57, "гостиная и прихожая"],
      [62, "кухня-гостиная"],
      [65, "спальня"],
      [67, "санузел"],
    ],
  },
  {
    assetsDir: "japandi-country-house",
    coverFile: "japandi-country-house-11.jpg",
    description:
      "Интерьер загородного дома в стиле джапанди сочетает минимализм, тёплые натуральные фактуры, мягкие линии мебели и светлую спокойную палитру. В проекте проработаны кухня-гостиная, столовая зона, прихожая, коридоры и санузлы.\n\nДжапанди здесь раскрывается через лаконичные формы, дерево, ровный свет, аккуратные встроенные решения и ощущение визуальной тишины. В галерее представлены как визуализации, так и рабочие кадры реализации, чтобы показать развитие проекта от идеи до готового пространства.",
    location: "Загородный дом",
    order: 9,
    seoDescription:
      "Дизайн интерьера загородного дома в стиле джапанди: светлая кухня-гостиная, натуральные фактуры, лаконичная мебель и мягкая подсветка.",
    seoTitle:
      "Дизайн интерьера загородного дома в стиле джапанди | АДАМАНТ Строй",
    slug: "dizayn-interera-zagorodnogo-doma-dzhapandi",
    summary:
      "Дизайн интерьера загородного дома в стиле джапанди со светлой кухней-гостиной, натуральными фактурами и лаконичной мебелью.",
    title: "Дизайн интерьера загородного дома в стиле джапанди",
    zoneRules: [
      [16, "визуализация кухни-гостиной"],
      [23, "визуализация гостиной и столовой"],
      [32, "визуализация кухни и ТВ-зоны"],
      [35, "визуализация кухни-гостиной"],
      [40, "реализация прихожей"],
      [43, "реализация санузла"],
      [57, "реализация кухни-гостиной"],
      [58, "реализация санузла"],
      [64, "реализация гостиной и столовой"],
      [65, "деталь двери"],
    ],
  },
];

function getZone(project: PortfolioProjectSeed, index: number) {
  return (
    project.zoneRules.find(([maxIndex]) => index <= maxIndex)?.[1] ??
    "интерьер проекта"
  );
}

function getImageAlt(project: PortfolioProjectSeed, index: number) {
  return `${project.title} — ${getZone(project, index)}, фото ${index}`;
}

function getImageCaption(project: PortfolioProjectSeed, index: number) {
  return `${project.title}: ${getZone(project, index)}, кадр ${index}.`;
}

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

async function uploadProjectImages(project: PortfolioProjectSeed, payload: Payload, req: Req) {
  const projectAssetsDir = path.join(assetsRoot, project.assetsDir);
  const filenames = (await fs.readdir(projectAssetsDir))
    .filter((name) => /\.(jpe?g|png|webp|avif)$/i.test(name))
    .sort((a, b) => a.localeCompare(b, "ru", { numeric: true, sensitivity: "base" }));

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
    projectArea: project.projectArea,
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

  payload.logger.info(`Seeded ${projects.length} portfolio design projects.`);
}

export async function down(): Promise<void> {}
