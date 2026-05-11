import path from "path";
import { fileURLToPath } from "url";

import { getPayload } from "payload";

import config from "../payload.config.ts";

type SeedService = {
  description: string;
  featured?: boolean;
  imageFile: string;
  order: number;
  shortDescription: string;
  slug: string;
  tags: string[];
  title: string;
};

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);
const publicDir = path.resolve(dirname, "../public");

const services: SeedService[] = [
  {
    title: "Дом из бруса",
    slug: "dom-iz-brusa",
    order: 10,
    featured: true,
    imageFile: "дом из бруса.png",
    shortDescription:
      "Строительство теплых деревянных домов для постоянного проживания и отдыха",
    description:
      "Построим теплый деревянный дом для постоянного проживания и отдыха с точным расчетом материалов, сроков и бюджета. Начните с бесплатной сметы за 1 день.",
    tags: ["Деревянный дом", "Брус", "Под ключ", "Теплый контур"],
  },
  {
    title: "Дом из газобетона",
    slug: "dom-iz-gazobetona",
    order: 20,
    featured: true,
    imageFile: "дом из газобетона.png",
    shortDescription:
      "Надежные каменные дома с продуманной планировкой, инженерией и отделкой",
    description:
      "Построим надежный каменный дом с продуманной планировкой, инженерией и отделкой. Подготовим расчет под ваш участок.",
    tags: ["Газобетон", "Каменный дом", "Инженерия", "Под ключ"],
  },
  {
    title: "Каркасный дом",
    slug: "karkasnyj-dom",
    order: 30,
    imageFile: "каркасный дом.png",
    shortDescription:
      "Энергоэффективные каркасные дома с быстрыми сроками строительства",
    description:
      "Возведем энергоэффективный каркасный дом с быстрыми сроками строительства и контролем качества узлов. Смета будет готова за 1 день.",
    tags: ["Каркасный дом", "Быстрый монтаж", "Энергоэффективность", "Скидки"],
  },
  {
    title: "Отделка коммерческого помещения",
    slug: "otdelka-kommercheskogo-pomeshcheniya",
    order: 40,
    imageFile: "отделка коммерческих помещений.png",
    shortDescription:
      "Комплексная отделка офисов, торговых и рабочих пространств под задачу бизнеса",
    description:
      "Выполним комплексную отделку офисов, торговых и рабочих пространств под требования бизнеса и эксплуатации. Рассчитаем работы и материалы.",
    tags: ["Коммерция", "Отделка", "Сроки", "Контроль работ"],
  },
  {
    title: "Ремонт квартир",
    slug: "remont-kvartir",
    order: 50,
    imageFile: "ремонт квартир.png",
    shortDescription:
      "Ремонт квартир с контролем сроков, материалов и качества выполнения работ",
    description:
      "Сделаем ремонт квартиры с прозрачной сметой, подбором материалов и ежедневным контролем выполнения работ. Начните с расчета стоимости.",
    tags: ["Ремонт", "Материалы", "Смета", "Под ключ"],
  },
];

async function upsertMedia(payload: Awaited<ReturnType<typeof getPayload>>, service: SeedService) {
  const existing = await payload.find({
    collection: "media",
    limit: 1,
    where: {
      alt: {
        equals: service.title,
      },
    },
  });

  if (existing.docs[0]) {
    return existing.docs[0].id;
  }

  const media = await payload.create({
    collection: "media",
    data: {
      alt: service.title,
      caption: service.shortDescription,
    },
    filePath: path.join(publicDir, service.imageFile),
    overrideAccess: true,
  });

  return media.id;
}

async function upsertService(
  payload: Awaited<ReturnType<typeof getPayload>>,
  service: SeedService,
  mediaId: number | string,
) {
  const existing = await payload.find({
    collection: "services",
    limit: 1,
    where: {
      slug: {
        equals: service.slug,
      },
    },
  });

  const data = {
    _status: "published" as const,
    description: service.description,
    featured: service.featured ?? false,
    order: service.order,
    previewImage: mediaId,
    shortDescription: service.shortDescription,
    slug: service.slug,
    tags: service.tags.map((label) => ({ label })),
    title: service.title,
  };

  if (existing.docs[0]) {
    await payload.update({
      collection: "services",
      id: existing.docs[0].id,
      data,
      overrideAccess: true,
    });

    return "updated";
  }

  await payload.create({
    collection: "services",
    data,
    overrideAccess: true,
  });

  return "created";
}

async function main() {
  const payload = await getPayload({ config });

  try {
    for (const service of services) {
      const mediaId = await upsertMedia(payload, service);
      const result = await upsertService(payload, service, mediaId);
      payload.logger.info(`${result}: ${service.title}`);
    }
  } finally {
    await payload.destroy();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
