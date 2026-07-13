import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

import { type MigrateUpArgs } from "@payloadcms/db-sqlite";

type Payload = MigrateUpArgs["payload"];
type Req = MigrateUpArgs["req"];

type CatalogCategorySeed = {
  description: string;
  h1: string;
  order: number;
  seoDescription: string;
  seoTitle: string;
  showInHeader?: boolean;
  slug: string;
  title: string;
  updateExisting?: boolean;
};

type ProjectLayoutSeed = {
  file: string;
  meta?: string;
  title: string;
};

type CatalogProjectSeed = {
  advantages: readonly string[];
  area?: number;
  assetsDir: string;
  cardSummary: string;
  categorySlug: string;
  coverFile: string;
  description: string;
  floors?: number;
  imageDescriptions: readonly string[];
  itemKey: string;
  layouts?: readonly ProjectLayoutSeed[];
  order: number;
  price?: number;
  realizationSteps?: readonly {
    text?: string;
    time?: string;
    title: string;
  }[];
  rooms?: number;
  seoDescription: string;
  seoTitle: string;
  slug: string;
  title: string;
};

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);
const assetsRoot = path.resolve(dirname, "catalog-assets/20260713_pdf_projects");

const categorySeeds: CatalogCategorySeed[] = [
  {
    description:
      "Проекты каркасных домов для загородного строительства: классические дома, барнхаусы, А-фрейм и компактные дачные решения.",
    h1: "Каркасные дома",
    order: 20,
    seoDescription:
      "Каталог проектов каркасных домов от АДАМАНТ Строй: дома для постоянного проживания, дачи, барнхаусы и А-фрейм проекты.",
    seoTitle: "Каркасные дома - проекты для строительства | АДАМАНТ Строй",
    showInHeader: true,
    slug: "karkasnye-doma",
    title: "Каркасные дома",
  },
  {
    description:
      "Проекты каменных домов из блоков для постоянного проживания: одноэтажные и двухэтажные решения с продуманной планировкой.",
    h1: "Каменные дома",
    order: 25,
    seoDescription:
      "Проекты каменных домов от АДАМАНТ Строй: дома из блоков с прочным фундаментом, теплым контуром и современной архитектурой.",
    seoTitle: "Каменные дома - проекты для строительства | АДАМАНТ Строй",
    showInHeader: true,
    slug: "kamennye-doma",
    title: "Каменные дома",
    updateExisting: true,
  },
  {
    description:
      "Проекты беседок и малых архитектурных форм для загородного участка: рабочие чертежи, деревянный каркас и варианты кровли.",
    h1: "Беседки",
    order: 70,
    seoDescription:
      "Проекты беседок для загородного участка от АДАМАНТ Строй: деревянные конструкции, рабочие чертежи, кровля и узлы сборки.",
    seoTitle: "Беседки - проекты для участка | АДАМАНТ Строй",
    showInHeader: true,
    slug: "besedki",
    title: "Беседки",
    updateExisting: true,
  },
];

const defaultRealizationSteps = [
  {
    title: "Адаптация проекта",
    text: "Уточняем участок, грунты, комплектацию и привязку проекта под задачи строительства.",
    time: "от 5 дней",
  },
  {
    title: "Подготовка сметы",
    text: "Собираем состав работ и материалов, чтобы согласовать бюджет до начала стройки.",
    time: "от 3 дней",
  },
  {
    title: "Строительство",
    text: "Выполняем фундамент, коробку, кровлю и наружный контур по согласованной технологии.",
    time: "по графику",
  },
  {
    title: "Сдача объекта",
    text: "Проверяем ключевые узлы, фиксируем результат и передаем готовый этап заказчику.",
    time: "после работ",
  },
] as const;

const projects: CatalogProjectSeed[] = [
  {
    advantages: [
      "Одноэтажная планировка без лестниц.",
      "Керамзитобетонные наружные и внутренние стены.",
      "Свайно-ленточный фундамент с глубиной свай 2500 мм.",
      "Четырехскатная кровля с покрытием металлочерепицей.",
      "Фасад под штукатурку и аккуратный современный силуэт.",
    ],
    area: 139.1,
    assetsDir: "s227",
    cardSummary:
      "Одноэтажный каменный дом 139,1 м² с четырехскатной кровлей, террасой и продуманной планировкой.",
    categorySlug: "kamennye-doma",
    coverFile: "s227-01.jpg",
    description:
      "Каменный дом S-227 - одноэтажный проект общей внутренней площадью 139,1 м² и габаритами 14,2 x 13,7 м. Проект выполнен для строительства загородного дома с понятной планировкой, выразительной четырехскатной кровлей и спокойной современной архитектурой.\n\nВ проектной документации предусмотрены стены из керамзитобетонного блока, свайно-ленточный фундамент, деревянная стропильная система и кровля из металлочерепицы. Наружную отделку фасадов можно выполнить фасадной штукатуркой, а комплектацию адаптировать под участок, инженерные решения и требования заказчика.\n\nКарточка содержит общий вид, фасады, план первого этажа, кровлю и конструктивные листы проекта. Итоговая стоимость зависит от комплектации, фундамента, инженерии, отделки и региона строительства.",
    floors: 1,
    imageDescriptions: [
      "общая перспектива одноэтажного каменного дома",
      "общий вид дома со стороны участка",
      "перспектива фасада и входной группы",
      "перспектива дома с четырехскатной кровлей",
      "маркировочный план первого этажа",
      "общестроительный план первого этажа",
      "фасад 1-2 каменного дома",
      "фасад А-В каменного дома",
      "фасад 2-1 каменного дома",
      "фасад В-А каменного дома",
      "план кровли каменного дома",
      "план стропильной системы",
    ],
    itemKey: "s227",
    layouts: [
      {
        file: "s227-05.jpg",
        meta: "1 этаж",
        title: "Маркировочный план",
      },
      {
        file: "s227-06.jpg",
        meta: "139,1 м²",
        title: "План первого этажа",
      },
      {
        file: "s227-11.jpg",
        meta: "Четырехскатная кровля",
        title: "План кровли",
      },
      {
        file: "s227-12.jpg",
        meta: "Деревянная стропильная система",
        title: "План стропильной системы",
      },
    ],
    order: 25,
    price: 9800000,
    realizationSteps: defaultRealizationSteps,
    rooms: 4,
    seoDescription:
      "Проект каменного дома S-227 от АДАМАНТ Строй: одноэтажный дом 139,1 м² из керамзитобетонных блоков с четырехскатной кровлей.",
    seoTitle: "Каменный дом S-227 139 м² - проект одноэтажного дома | АДАМАНТ Строй",
    slug: "s227",
    title: 'Каменный дом "S-227"',
  },
  {
    advantages: [
      "Выразительная архитектура А-фрейм.",
      "Каркасная технология и деревянный силовой каркас.",
      "Два этажа, терраса и балкон.",
      "Большое остекление и высокий внутренний объем.",
      "Свайный фундамент и адаптация под участок.",
    ],
    area: 239.5,
    assetsDir: "akb08",
    cardSummary:
      "Каркасный дом А-фрейм 239,5 м² с высоким треугольным силуэтом, террасой, балконом и вторым этажом.",
    categorySlug: "karkasnye-doma",
    coverFile: "akb08-01.jpg",
    description:
      "Каркасный дом АКБ08 А-фрейм - проект индивидуального жилого дома с выразительной треугольной архитектурой, деревянным каркасом и расчетным метражом 239,5 м². По документации здание рассчитано на два этажа, регион строительства - Московская область.\n\nНа первом этаже предусмотрены котельная, санузел, холл, спальня, большая кухня-гостиная и терраса. Второй этаж включает холл, две спальни и балкон. Такая структура подходит для загородного дома, гостевого дома или эффектного объекта для отдыха на природе.\n\nПроект предусматривает деревянный каркас, габариты каркаса 14 x 16,5 м и фундамент на железобетонных сваях. Итоговая стоимость зависит от комплектации, фундамента, утепления, инженерии, отделки и региона строительства.",
    floors: 2,
    imageDescriptions: [
      "общие виды каркасного дома А-фрейм",
      "дополнительные общие виды дома А-фрейм",
      "план первого этажа с кухней-гостиной и террасой",
      "план второго этажа со спальнями и балконом",
      "план кровли дома А-фрейм",
      "фасады каркасного дома А-фрейм",
      "модель силового каркаса",
      "план свайного фундамента",
    ],
    itemKey: "akb08-afrejm",
    layouts: [
      {
        file: "akb08-03.jpg",
        meta: "1 этаж",
        title: "План первого этажа",
      },
      {
        file: "akb08-04.jpg",
        meta: "2 этаж",
        title: "План второго этажа",
      },
      {
        file: "akb08-05.jpg",
        meta: "Кровля А-фрейм",
        title: "План кровли",
      },
      {
        file: "akb08-08.jpg",
        meta: "Ж/б сваи",
        title: "План фундамента",
      },
    ],
    order: 26,
    price: 14370000,
    realizationSteps: defaultRealizationSteps,
    rooms: 4,
    seoDescription:
      "Проект каркасного дома АКБ08 А-фрейм от АДАМАНТ Строй: дом 239,5 м² с двумя этажами, террасой, балконом и свайным фундаментом.",
    seoTitle: "Каркасный дом АКБ08 А-фрейм 239,5 м² | АДАМАНТ Строй",
    slug: "akb08-afrejm",
    title: 'Каркасный дом "АКБ08 А-фрейм"',
  },
  {
    advantages: [
      "Каркасная технология для быстрого строительства.",
      "Мансардный этаж с тремя комнатами.",
      "Терраса, крыльцо и удобная входная зона.",
      "Свайный фундамент и кровля из металлочерепицы.",
      "Наружная и внутренняя отделка имитацией бруса.",
    ],
    area: 135.34,
    assetsDir: "ors-10",
    cardSummary:
      "Каркасный дом 135,34 м² с мансардным этажом, террасой, крыльцом и классической двускатной кровлей.",
    categorySlug: "karkasnye-doma",
    coverFile: "ors-10-01.jpg",
    description:
      "Каркасный дом 10-ORS - проект одноквартирного загородного дома общей площадью 135,34 м² и жилой площадью 93,69 м². Дом выполнен в спокойной классической архитектуре с мансардным этажом, террасой и крыльцом.\n\nНа первом этаже предусмотрены хозяйственный блок, санузел, кухня, гостиная, комната, тамбур, крыльцо и терраса. На мансардном этаже расположены три комнаты, санузел и холл. Такое решение подходит для семьи, сезонного проживания или постоянного загородного формата.\n\nВ проекте указаны свайный фундамент, наружная и внутренняя отделка имитацией бруса, а также кровля из металлочерепицы. Итоговая стоимость зависит от комплектации, утепления, инженерии, отделки и региона строительства.",
    floors: 2,
    imageDescriptions: [
      "общий вид каркасного дома 10-ORS",
      "виды силового каркаса дома",
      "вид обвязки, перекрытия и стен первого этажа",
      "стены первого этажа и межэтажное перекрытие",
      "стены мансардного этажа и стропильная система",
      "виды стропильной системы",
      "фасады каркасного дома",
      "план свайного фундамента",
      "сборочный лист стен первого этажа",
      "сборочный лист стен второго этажа",
    ],
    itemKey: "ors-10",
    layouts: [
      {
        file: "ors-10-08.jpg",
        meta: "Свайный фундамент",
        title: "План фундамента",
      },
      {
        file: "ors-10-09.jpg",
        meta: "1 этаж",
        title: "Стены первого этажа",
      },
      {
        file: "ors-10-10.jpg",
        meta: "Мансардный этаж",
        title: "Стены второго этажа",
      },
    ],
    order: 27,
    price: 8120000,
    realizationSteps: defaultRealizationSteps,
    rooms: 4,
    seoDescription:
      "Проект каркасного дома 10-ORS от АДАМАНТ Строй: дом 135,34 м² с мансардным этажом, террасой, свайным фундаментом и отделкой имитацией бруса.",
    seoTitle: "Каркасный дом 10-ORS 135,34 м² | АДАМАНТ Строй",
    slug: "ors-10",
    title: 'Каркасный дом "10-ORS"',
  },
  {
    advantages: [
      "Компактный формат 6 x 4 м для загородного участка.",
      "Деревянный каркас из бруса и доски.",
      "Кровля площадью 45 м² с вариантами покрытия.",
      "Два варианта ограждений и перил.",
      "В комплекте рабочие листы по фундаменту, обвязке, балкам и стропилам.",
    ],
    area: 24,
    assetsDir: "besedka-6x4",
    cardSummary:
      "Деревянная беседка 6 x 4 м с открытым периметром, кровлей 45 м² и комплектом рабочих чертежей.",
    categorySlug: "besedki",
    coverFile: "besedka-6x4-01.jpg",
    description:
      "Беседка 6 x 4 - проект деревянной малой архитектурной формы для загородного участка. В комплекте представлены общий вид, фасады, разрезы, план фундамента, нижняя и верхняя обвязка, балки перекрытия, стропила, узлы и варианты перил.\n\nОсновная конструкция предусматривает брус 150 x 150 мм, доску для каркаса, настила и подшива крыши. Площадь кровли составляет 45 м², возможны варианты настила под гибкую черепицу или металлочерепицу.\n\nПроект подходит для зоны отдыха рядом с домом, баней, садом или летней кухней. Итоговая стоимость зависит от фундамента, выбранной кровли, обработки древесины, отделки и региона строительства.",
    floors: 1,
    imageDescriptions: [
      "общий вид и ведомость чертежей беседки",
      "фасады беседки и варианты перил",
      "разрезы и варианты настила кровли",
      "план фундамента и схема анкеров",
      "нижняя и верхняя обвязка",
      "балки перекрытия и узлы крепления",
      "стропила и карнизные узлы",
      "узлы соединений и перил",
    ],
    itemKey: "besedka-6x4",
    layouts: [
      {
        file: "besedka-6x4-04.jpg",
        meta: "Ленточный фундамент",
        title: "План фундамента",
      },
      {
        file: "besedka-6x4-05.jpg",
        meta: "Брус 150 x 150 мм",
        title: "Обвязка",
      },
      {
        file: "besedka-6x4-07.jpg",
        meta: "Стропильная система",
        title: "Стропила",
      },
      {
        file: "besedka-6x4-08.jpg",
        meta: "Узлы и перила",
        title: "Узлы",
      },
    ],
    order: 28,
    price: 1200000,
    realizationSteps: [
      {
        title: "Привязка к участку",
        text: "Определяем место установки, отметки и подходящий тип основания.",
        time: "от 2 дней",
      },
      {
        title: "Подготовка основания",
        text: "Готовим площадку, фундамент и крепления для деревянного каркаса.",
        time: "по условиям участка",
      },
      {
        title: "Сборка каркаса",
        text: "Монтируем стойки, обвязку, балки, стропильную систему и кровлю.",
        time: "по графику",
      },
      {
        title: "Финишная обработка",
        text: "Дорабатываем перила, настил, защитные покрытия и декоративные элементы.",
        time: "после сборки",
      },
    ],
    rooms: 1,
    seoDescription:
      "Проект беседки 6 x 4 м от АДАМАНТ Строй: деревянный каркас, кровля 45 м², рабочие чертежи фундамента, обвязки, стропил и узлов.",
    seoTitle: "Беседка 6 x 4 - проект деревянной беседки | АДАМАНТ Строй",
    slug: "besedka-6x4",
    title: 'Беседка "6 x 4"',
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
  collection: "catalog" | "catalog-categories";
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

async function findCatalogProject(project: CatalogProjectSeed, payload: Payload, req: Req) {
  const bySlug = await findBySlug({
    collection: "catalog",
    payload,
    req,
    slug: project.slug,
  });

  if (bySlug) return bySlug;

  const byKey = await payload.find({
    collection: "catalog",
    depth: 0,
    draft: true,
    limit: 1,
    overrideAccess: true,
    req,
    where: {
      itemKey: {
        equals: project.itemKey,
      },
    },
  });

  return byKey.docs[0];
}

async function ensureCatalogCategory(
  seed: CatalogCategorySeed,
  payload: Payload,
  req: Req,
) {
  const existing = await findBySlug({
    collection: "catalog-categories",
    payload,
    req,
    slug: seed.slug,
  });

  const data = {
    description: seed.description,
    h1: seed.h1,
    order: seed.order,
    seoDescription: seed.seoDescription,
    seoTitle: seed.seoTitle,
    showInHeader: seed.showInHeader ?? true,
    title: seed.title,
  };

  if (existing) {
    if (seed.updateExisting) {
      await payload.update({
        collection: "catalog-categories",
        id: existing.id,
        data,
        overrideAccess: true,
        req,
      });
    }

    return toNumberId(existing.id, seed.slug);
  }

  const created = await payload.create({
    collection: "catalog-categories",
    data: {
      ...data,
      slug: seed.slug,
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

function getImageDescription(project: CatalogProjectSeed, index: number) {
  return project.imageDescriptions[index - 1] ?? `лист проекта ${index}`;
}

function getImageAlt(project: CatalogProjectSeed, index: number) {
  return `${project.title} - ${getImageDescription(project, index)}`;
}

function getImageCaption(project: CatalogProjectSeed, index: number) {
  return `${project.title}: ${getImageDescription(project, index)}.`;
}

async function uploadProjectImages(project: CatalogProjectSeed, payload: Payload, req: Req) {
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

  const layouts = project.layouts?.map((layout) => {
    const image = mediaByFilename.get(layout.file);

    if (!image) {
      throw new Error(`Missing layout image ${layout.file} for ${project.slug}.`);
    }

    return {
      image,
      meta: layout.meta,
      title: layout.title,
    };
  });

  return {
    gallery: filenames.map((fileName) => ({
      image: mediaByFilename.get(fileName)!,
    })),
    layouts,
    previewImage,
  };
}

async function upsertCatalogProject({
  categoryId,
  payload,
  project,
  req,
}: {
  categoryId: number;
  payload: Payload;
  project: CatalogProjectSeed;
  req: Req;
}) {
  const { gallery, layouts, previewImage } = await uploadProjectImages(project, payload, req);
  const existing = await findCatalogProject(project, payload, req);
  const data = {
    _status: "published" as const,
    advantages: project.advantages.map((text) => ({ text })),
    area: project.area,
    cardSummary: project.cardSummary,
    description: project.description,
    detailImage: previewImage,
    floors: project.floors,
    gallery,
    isHit: false,
    itemKey: project.itemKey,
    landingCategory: categoryId,
    layouts,
    order: project.order,
    previewImage,
    price: project.price,
    realizationSteps: project.realizationSteps ?? defaultRealizationSteps,
    rooms: project.rooms,
    seoDescription: project.seoDescription,
    seoTitle: project.seoTitle,
    showInCatalog: true,
    slug: project.slug,
    title: project.title,
  };

  if (existing) {
    await payload.update({
      collection: "catalog",
      id: existing.id,
      data,
      draft: false,
      overrideAccess: true,
      req,
    });

    return;
  }

  await payload.create({
    collection: "catalog",
    data,
    draft: false,
    overrideAccess: true,
    req,
  });
}

export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  const categoryIds = new Map<string, number>();

  for (const seed of categorySeeds) {
    categoryIds.set(seed.slug, await ensureCatalogCategory(seed, payload, req));
  }

  for (const project of projects) {
    const categoryId = categoryIds.get(project.categorySlug);

    if (!categoryId) {
      throw new Error(`Missing category ${project.categorySlug} for ${project.slug}.`);
    }

    await upsertCatalogProject({
      categoryId,
      payload,
      project,
      req,
    });
  }

  payload.logger.info(`Seeded ${projects.length} PDF catalog projects.`);
}

export async function down(): Promise<void> {}
