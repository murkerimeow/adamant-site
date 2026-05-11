/* eslint-disable @typescript-eslint/no-explicit-any */

import path from "path";
import { fileURLToPath } from "url";

import { getPayload } from "payload";

import config from "../payload.config.ts";

type SeedCatalogItem = {
  cardSummary?: string;
  catalogCategory: "classic" | "modern" | "other";
  description: string;
  itemKey: string;
  order: number;
  previewImageFile: string;
  showInCatalog: boolean;
  slug: string;
  tags: string[];
  title: string;
};

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);
const publicDir = path.resolve(dirname, "../public");
const catalogCollection = "catalog" as never;

const detailImageFile = "Picture.PNG";

const items: SeedCatalogItem[] = [
  {
    title: "Современный дом",
    slug: "sovremennyj-dom",
    itemKey: "modern",
    showInCatalog: true,
    catalogCategory: "modern",
    order: 10,
    previewImageFile: "строительство.png",
    cardSummary:
      "Проект с панорамным остеклением, четкой архитектурой и продуманной планировкой",
    description:
      "Спроектируем и построим современный загородный дом в Санкт-Петербурге и Ленинградской области под ключ и в срок. Начните с бесплатного расчета сметы за 1 день.",
    tags: ["Современный", "Загородный дом", "Под ключ", "Скидки"],
  },
  {
    title: "Дом с террасой",
    slug: "dom-s-terrasoj",
    itemKey: "terrace",
    showInCatalog: true,
    catalogCategory: "classic",
    order: 20,
    previewImageFile: "дом из бруса.png",
    cardSummary:
      "Загородный дом с открытой зоной отдыха и теплым семейным контуром",
    description:
      "Продуманный проект для жизни за городом: просторная гостиная, панорамное остекление и удобная зона отдыха. Начните с бесплатного расчета сметы за 1 день.",
    tags: ["Терраса", "Панорамные окна", "Под ключ", "Смета за 1 день"],
  },
  {
    title: "Одноэтажный дом",
    slug: "odnoetazhnyj-dom",
    itemKey: "onefloor",
    showInCatalog: true,
    catalogCategory: "modern",
    order: 30,
    previewImageFile: "дом из газобетона.png",
    cardSummary:
      "Комфортная одноуровневая планировка с инженерией и точной сметой",
    description:
      "Комфортный одноэтажный проект с понятной планировкой, инженерными решениями и точной сметой до начала работ. Подготовим расчет за 1 день.",
    tags: ["Одноэтажный", "Семейный дом", "Инженерия", "Под ключ"],
  },
  {
    title: "Классический дом",
    slug: "klassicheskij-dom",
    itemKey: "classic",
    showInCatalog: true,
    catalogCategory: "classic",
    order: 40,
    previewImageFile: "каркасный дом.png",
    cardSummary:
      "Сдержанная архитектура для постоянного проживания за городом",
    description:
      "Сдержанная архитектура, надежные материалы и функциональная планировка для постоянного проживания круглый год. Рассчитаем стоимость под ваш участок.",
    tags: ["Классический", "Для семьи", "Теплый контур", "Сроки"],
  },
  {
    title: "Дом из бруса",
    slug: "dom-iz-brusa-card",
    itemKey: "timber",
    showInCatalog: false,
    catalogCategory: "other",
    order: 50,
    previewImageFile: "дом из бруса.png",
    cardSummary:
      "Строительство теплых деревянных домов для постоянного проживания и отдыха",
    description:
      "Построим теплый деревянный дом для постоянного проживания и отдыха с точным расчетом материалов, сроков и бюджета. Начните с бесплатной сметы за 1 день.",
    tags: ["Деревянный дом", "Брус", "Под ключ", "Теплый контур"],
  },
  {
    title: "Дом из газобетона",
    slug: "dom-iz-gazobetona-card",
    itemKey: "gasbeton",
    showInCatalog: false,
    catalogCategory: "other",
    order: 60,
    previewImageFile: "дом из газобетона.png",
    cardSummary:
      "Надежные каменные дома с продуманной планировкой, инженерией и отделкой",
    description:
      "Построим надежный каменный дом с продуманной планировкой, инженерией и отделкой. Подготовим расчет под ваш участок.",
    tags: ["Газобетон", "Каменный дом", "Инженерия", "Под ключ"],
  },
  {
    title: "Каркасный дом",
    slug: "karkasnyj-dom-card",
    itemKey: "frame",
    showInCatalog: false,
    catalogCategory: "other",
    order: 70,
    previewImageFile: "каркасный дом.png",
    cardSummary:
      "Энергоэффективные каркасные дома с быстрыми сроками строительства",
    description:
      "Возведем энергоэффективный каркасный дом с быстрыми сроками строительства и контролем качества узлов. Смета будет готова за 1 день.",
    tags: ["Каркасный дом", "Быстрый монтаж", "Энергоэффективность", "Скидки"],
  },
  {
    title: "Отделка коммерческого помещения",
    slug: "otdelka-kommercheskogo-pomeshcheniya-card",
    itemKey: "commercial",
    showInCatalog: false,
    catalogCategory: "other",
    order: 80,
    previewImageFile: "отделка коммерческих помещений.png",
    cardSummary:
      "Комплексная отделка офисов, торговых и рабочих пространств под требования бизнеса",
    description:
      "Выполним комплексную отделку офисов, торговых и рабочих пространств под требования бизнеса и эксплуатации. Рассчитаем работы и материалы.",
    tags: ["Коммерция", "Отделка", "Сроки", "Контроль работ"],
  },
  {
    title: "Ремонт квартир",
    slug: "remont-kvartir-card",
    itemKey: "renovation",
    showInCatalog: false,
    catalogCategory: "other",
    order: 90,
    previewImageFile: "ремонт квартир.png",
    cardSummary:
      "Ремонт квартир с контролем сроков, материалов и качества выполнения работ",
    description:
      "Сделаем ремонт квартиры с прозрачной сметой, подбором материалов и ежедневным контролем выполнения работ. Начните с расчета стоимости.",
    tags: ["Ремонт", "Материалы", "Смета", "Под ключ"],
  },
];

async function getMediaId(
  payload: Awaited<ReturnType<typeof getPayload>>,
  fileName: string,
  alt: string,
  caption?: string,
) {
  const existing = await payload.find({
    collection: "media",
    limit: 1,
    where: {
      filename: {
        equals: fileName,
      },
    },
  });

  if (existing.docs[0]) {
    return existing.docs[0].id;
  }

  const created = await payload.create({
    collection: "media",
    data: {
      alt,
      caption,
    },
    filePath: path.join(publicDir, fileName),
    overrideAccess: true,
  });

  return created.id;
}

async function main() {
  const payload = await getPayload({ config });
  const payloadClient = payload as any;
  const detailImage = await getMediaId(
    payload,
    detailImageFile,
    "Изображение карточки товара",
    "Изображение для страницы catalog-item",
  );

  for (const item of items) {
    const previewImage = await getMediaId(
      payload,
      item.previewImageFile,
      item.title,
      item.cardSummary ?? item.description,
    );

    const existing = (await payloadClient.find({
      collection: catalogCollection,
      limit: 1,
      where: {
        itemKey: {
          equals: item.itemKey,
        },
      },
    })) as { docs: Array<{ id: number | string }> };

    const data = {
      _status: "published" as const,
      cardSummary: item.cardSummary,
      catalogCategory: item.catalogCategory,
      description: item.description,
      detailImage,
      order: item.order,
      previewImage,
      showInCatalog: item.showInCatalog,
      tags: item.tags.map((label) => ({ label })),
      title: item.title,
    };

    if (existing.docs[0]) {
      await payloadClient.update({
        collection: catalogCollection,
        id: existing.docs[0].id,
        data,
        overrideAccess: true,
      });
      continue;
    }

    await payloadClient.create({
      collection: catalogCollection,
      data: {
        ...data,
        itemKey: item.itemKey,
        slug: item.slug,
      },
      overrideAccess: true,
    });
  }

  payload.logger.info("Catalog seed finished.");
}

main()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
