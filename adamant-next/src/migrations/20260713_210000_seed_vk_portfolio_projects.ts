import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

import { type MigrateUpArgs } from "@payloadcms/db-sqlite";

type Payload = MigrateUpArgs["payload"];
type Req = MigrateUpArgs["req"];

type PortfolioCategorySeed = {
  description: string;
  h1: string;
  order: number;
  seoDescription: string;
  seoTitle: string;
  slug: string;
  title: string;
};

type PortfolioProjectSeed = {
  assetsDir: string;
  categorySlug: string;
  coverFile: string;
  description: string;
  imageDescription: string;
  location?: string;
  order: number;
  projectArea?: number;
  seoDescription: string;
  seoTitle: string;
  slug: string;
  summary: string;
  title: string;
};

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);
const assetsRoot = path.resolve(dirname, "portfolio-assets/20260713_vk_posts");

const categorySeeds: PortfolioCategorySeed[] = [
  {
    description:
      "Примеры ремонта квартир с продуманной отделкой, аккуратной реализацией и контролем качества работ.",
    h1: "Ремонт квартир",
    order: 30,
    seoDescription:
      "Портфолио ремонта квартир от АДАМАНТ Строй: выполненная отделка жилых помещений, санузлов, кухонь и коттеджей.",
    seoTitle: "Ремонт квартир - портфолио выполненных работ | АДАМАНТ Строй",
    slug: "apartment-renovation",
    title: "Ремонт квартир",
  },
  {
    description:
      "Отделка коммерческих помещений, офисов, салонов и общественных пространств.",
    h1: "Отделка коммерческих помещений",
    order: 40,
    seoDescription:
      "Портфолио отделки коммерческих помещений от АДАМАНТ Строй: салоны, студии, офисы и рабочие пространства.",
    seoTitle:
      "Отделка коммерческих помещений - портфолио работ | АДАМАНТ Строй",
    slug: "commercial-finishing",
    title: "Отделка коммерческих помещений",
  },
];

const projects: PortfolioProjectSeed[] = [
  {
    assetsDir: "petrovskiy-prospekt-2s2",
    categorySlug: "apartment-renovation",
    coverFile: "petrovskiy-prospekt-2s2-01.jpg",
    description:
      "Проект на Петровском проспекте 2с2 показывает выполненную отделку квартиры с аккуратными стеновыми панелями, светлыми поверхностями, чистыми линиями мебели и продуманными узлами примыкания. В галерее собраны фотографии объекта на этапе готовой отделки и установки интерьерных элементов.\n\nРаботы демонстрируют спокойную современную отделку жилого пространства, где важны ровные поверхности, точная геометрия, светлые материалы и аккуратная интеграция инженерии.",
    imageDescription: "ремонт квартиры на Петровском проспекте 2с2",
    location: "Санкт-Петербург, Петровский проспект 2с2",
    order: 70,
    seoDescription:
      "Ремонт квартиры на Петровском проспекте 2с2: фото выполненной отделки, стеновых панелей, мебели и интерьерных деталей.",
    seoTitle:
      "Ремонт квартиры на Петровском проспекте 2с2 | АДАМАНТ Строй",
    slug: "remont-kvartiry-petrovskiy-prospekt-2s2",
    summary:
      "Ремонт квартиры на Петровском проспекте 2с2 с аккуратной отделкой, стеновыми панелями и современными интерьерными решениями.",
    title: "Ремонт квартиры на Петровском проспекте 2с2",
  },
  {
    assetsDir: "magnitogorskaya-3",
    categorySlug: "apartment-renovation",
    coverFile: "magnitogorskaya-3-01.jpg",
    description:
      "Ремонт квартиры на Магнитогорской 3 объединяет два фотоотчета по одному объекту. В проекте показаны работы по отделке жилых зон, санузла, потолков, стен, напольных покрытий и встроенных элементов.\n\nГалерея помогает оценить последовательность и качество выполненной отделки: от подготовки поверхностей и монтажа до финального вида отдельных помещений и деталей.",
    imageDescription: "ремонт квартиры на Магнитогорской 3",
    location: "Санкт-Петербург, Магнитогорская 3",
    order: 71,
    seoDescription:
      "Ремонт квартиры на Магнитогорской 3: фото отделки жилых помещений, санузла, потолков, стен и интерьерных деталей.",
    seoTitle: "Ремонт квартиры на Магнитогорской 3 | АДАМАНТ Строй",
    slug: "remont-kvartiry-magnitogorskaya-3",
    summary:
      "Ремонт квартиры на Магнитогорской 3 с отделкой жилых помещений, санузла, потолков и интерьерных деталей.",
    title: "Ремонт квартиры на Магнитогорской 3",
  },
  {
    assetsDir: "studiya-pilki",
    categorySlug: "commercial-finishing",
    coverFile: "studiya-pilki-01.jpg",
    description:
      "Отделка студии «Пилки» показывает реализацию коммерческого пространства с рабочими зонами, декоративными покрытиями, зеркалами, освещением и аккуратной чистовой отделкой. Формат объекта требует не только эстетики, но и практичности для ежедневной эксплуатации.\n\nВ галерее представлены фото готового интерьера студии: рабочие места, зоны обслуживания, отделка стен, напольные покрытия и элементы света.",
    imageDescription: "отделка студии Пилки",
    location: "Санкт-Петербург",
    order: 72,
    seoDescription:
      "Отделка студии «Пилки»: фото коммерческого интерьера, рабочих зон, декоративных покрытий, зеркал и освещения.",
    seoTitle: "Отделка студии «Пилки» | АДАМАНТ Строй",
    slug: "otdelka-studii-pilki",
    summary:
      "Отделка коммерческого пространства студии «Пилки» с рабочими зонами, декоративными покрытиями, зеркалами и освещением.",
    title: "Отделка студии «Пилки»",
  },
  {
    assetsDir: "kottedzh-aninskie-vysoty-136",
    categorySlug: "apartment-renovation",
    coverFile: "kottedzh-aninskie-vysoty-136-01.jpg",
    description:
      "Ремонт коттеджа 136 м² в Анинских высотах показывает отделку загородного дома с высокими потолками, панорамным остеклением, светлыми стенами, напольными покрытиями под дерево и аккуратной чистовой отделкой.\n\nПроект демонстрирует, как отделочные работы раскрывают архитектуру коттеджа: большие окна, скатные потолки, деревянные акценты и спокойные материалы создают светлое жилое пространство для загородной жизни.",
    imageDescription: "ремонт коттеджа 136 м² в Анинских высотах",
    location: "Анинские высоты",
    order: 73,
    projectArea: 136,
    seoDescription:
      "Ремонт коттеджа 136 м² в Анинских высотах: фото отделки загородного дома, панорамных окон, потолков и напольных покрытий.",
    seoTitle:
      "Ремонт коттеджа 136 м² в Анинских высотах | АДАМАНТ Строй",
    slug: "remont-kottedzha-136-m2-aninskie-vysoty",
    summary:
      "Ремонт коттеджа 136 м² в Анинских высотах с панорамным остеклением, светлой отделкой и напольными покрытиями под дерево.",
    title: "Ремонт коттеджа 136 м² в Анинских высотах",
  },
  {
    assetsDir: "remont-kvartir-i-kottedzhey",
    categorySlug: "apartment-renovation",
    coverFile: "remont-kvartir-i-kottedzhey-01.jpg",
    description:
      "Проект «Ремонт квартир и коттеджей» объединяет фото выполненных отделочных работ с акцентом на качество реализации, аккуратность узлов, чистовую отделку и ответственный подход к объекту.\n\nВ галерее собраны кадры жилых помещений и деталей отделки, которые показывают работу с поверхностями, материалами, освещением и интерьерными элементами.",
    imageDescription: "ремонт квартир и коттеджей",
    order: 74,
    seoDescription:
      "Ремонт квартир и коттеджей: фото выполненных отделочных работ, жилых помещений, деталей отделки и интерьерных элементов.",
    seoTitle: "Ремонт квартир и коттеджей | АДАМАНТ Строй",
    slug: "remont-kvartir-i-kottedzhey",
    summary:
      "Фото выполненных работ по ремонту квартир и коттеджей с аккуратной отделкой, интерьерными деталями и контролем качества.",
    title: "Ремонт квартир и коттеджей",
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

async function ensurePortfolioCategory(
  seed: PortfolioCategorySeed,
  payload: Payload,
  req: Req,
) {
  const existing = await findBySlug({
    collection: "portfolio-categories",
    payload,
    req,
    slug: seed.slug,
  });

  if (existing) {
    return toNumberId(existing.id, seed.slug);
  }

  const created = await payload.create({
    collection: "portfolio-categories",
    data: {
      ...seed,
      showInNavigation: true,
    },
    overrideAccess: true,
    req,
  });

  return toNumberId(created.id, seed.slug);
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

function getImageAlt(project: PortfolioProjectSeed, index: number) {
  return `${project.title} - ${project.imageDescription}, фото ${index}`;
}

function getImageCaption(project: PortfolioProjectSeed, index: number) {
  return `${project.title}: ${project.imageDescription}, кадр ${index}.`;
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
  const categoryIds = new Map<string, number>();

  for (const seed of categorySeeds) {
    categoryIds.set(seed.slug, await ensurePortfolioCategory(seed, payload, req));
  }

  for (const project of projects) {
    const categoryId = categoryIds.get(project.categorySlug);

    if (!categoryId) {
      throw new Error(`Missing category ${project.categorySlug} for ${project.slug}.`);
    }

    await upsertPortfolioProject({
      categoryId,
      payload,
      project,
      req,
    });
  }

  payload.logger.info(`Seeded ${projects.length} VK portfolio projects.`);
}

export async function down(): Promise<void> {}
