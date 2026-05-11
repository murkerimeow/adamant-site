import path from "path";
import { fileURLToPath } from "url";

import { getPayload } from "payload";

import config from "../payload.config.ts";

type SeedPortfolio = {
  category: "classic" | "modern";
  description: string;
  imageFile: string;
  itemKey: string;
  order: number;
  slug: string;
  summary: string;
  tags: string[];
  title: string;
};

type SeedPost = {
  category: string;
  content: string;
  coverImageFile?: string;
  excerpt: string;
  publishedAt: string;
  slug: string;
  title: string;
};

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);
const publicDir = path.resolve(dirname, "../public");

const portfolioItems: SeedPortfolio[] = [
  {
    title: "Современный дом",
    slug: "sovremennyj-dom",
    itemKey: "modern",
    category: "modern",
    order: 10,
    imageFile: "строительство.png",
    summary:
      "Проект с панорамным остеклением, четкой архитектурой и продуманной планировкой",
    description:
      "Спроектируем и построим современный загородный дом в Санкт-Петербурге и Ленинградской области под ключ и в срок. Начните с бесплатного расчета сметы за 1 день.",
    tags: ["Современный", "Под ключ"],
  },
  {
    title: "Дом с террасой",
    slug: "dom-s-terrasoj",
    itemKey: "terrace",
    category: "classic",
    order: 20,
    imageFile: "дом из бруса.png",
    summary:
      "Загородный дом с открытой зоной отдыха и теплым семейным контуром",
    description:
      "Продуманный проект для жизни за городом: просторная гостиная, панорамное остекление и удобная зона отдыха. Начните с бесплатного расчета сметы за 1 день.",
    tags: ["Терраса", "Отдых"],
  },
  {
    title: "Одноэтажный дом",
    slug: "odnoetazhnyj-dom",
    itemKey: "onefloor",
    category: "modern",
    order: 30,
    imageFile: "дом из газобетона.png",
    summary:
      "Комфортная одноуровневая планировка с инженерией и точной сметой",
    description:
      "Комфортный одноэтажный проект с понятной планировкой, инженерными решениями и точной сметой до начала работ. Подготовим расчет за 1 день.",
    tags: ["1 этаж", "Семейный"],
  },
  {
    title: "Классический дом",
    slug: "klassicheskij-dom",
    itemKey: "classic",
    category: "classic",
    order: 40,
    imageFile: "каркасный дом.png",
    summary:
      "Сдержанная архитектура для постоянного проживания за городом",
    description:
      "Сдержанная архитектура, надежные материалы и функциональная планировка для постоянного проживания круглый год. Рассчитаем стоимость под ваш участок.",
    tags: ["Классика", "Теплый контур"],
  },
];

const posts: SeedPost[] = [
  {
    title: "Как выбрать проект дома",
    slug: "kak-vybrat-proekt-doma",
    category: "Строительство",
    publishedAt: "2026-04-20T10:00:00.000Z",
    coverImageFile: "строительство.png",
    excerpt:
      "Ключевые параметры участка, планировки и бюджета перед началом строительства.",
    content:
      "Перед стартом проекта важно оценить участок, требования к площади, образ жизни семьи и будущий бюджет. На этом этапе формируется планировка, подбирается технология строительства и определяется реальный объем работ. Чем точнее входные данные, тем прозрачнее итоговая смета и сроки.",
  },
  {
    title: "Газобетон или каркас",
    slug: "gazobeton-ili-karkas",
    category: "Технологии",
    publishedAt: "2026-04-18T10:00:00.000Z",
    coverImageFile: "дом из газобетона.png",
    excerpt:
      "Короткое сравнение технологий по срокам, теплу, стоимости и эксплуатации.",
    content:
      "Газобетон и каркас решают разные задачи. Газобетон чаще выбирают за капитальность и инерционность, каркас — за скорость строительства и энергоэффективность. Выбор зависит от сценария проживания, бюджета и требований к архитектуре, поэтому технологию нужно оценивать не отдельно, а вместе с проектом дома и инженерией.",
  },
  {
    title: "Смета без сюрпризов",
    slug: "smeta-bez-syurprizov",
    category: "Смета",
    publishedAt: "2026-04-15T10:00:00.000Z",
    coverImageFile: "дом из бруса.png",
    excerpt:
      "Что должно быть в расчете, чтобы контролировать бюджет до старта работ.",
    content:
      "Хорошая смета фиксирует состав работ, ключевые материалы, инженерные решения и очередность этапов. Она помогает управлять бюджетом еще до выхода на площадку и снижает риск скрытых затрат в процессе строительства. Поэтому смета должна быть конкретной, а не выглядеть как общий диапазон цен.",
  },
];

async function getMediaId(
  payload: Awaited<ReturnType<typeof getPayload>>,
  fileName: string,
  alt: string,
  caption?: string,
) {
  const byFilename = await payload.find({
    collection: "media",
    limit: 1,
    where: {
      filename: {
        equals: fileName,
      },
    },
  });

  if (byFilename.docs[0]) {
    return byFilename.docs[0].id;
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

async function upsertPortfolio(payload: Awaited<ReturnType<typeof getPayload>>) {
  for (const item of portfolioItems) {
    const previewImage = await getMediaId(
      payload,
      item.imageFile,
      item.title,
      item.summary,
    );

    const existing = await payload.find({
      collection: "portfolio",
      limit: 1,
      where: {
        slug: {
          equals: item.slug,
        },
      },
    });

    const data = {
      _status: "published" as const,
      category: item.category,
      description: item.description,
      order: item.order,
      previewImage,
      summary: item.summary,
      tags: item.tags.map((label) => ({ label })),
      title: item.title,
    };

    if (existing.docs[0]) {
      await payload.update({
        collection: "portfolio",
        id: existing.docs[0].id,
        data,
        overrideAccess: true,
      });
      continue;
    }

    await payload.create({
      collection: "portfolio",
      data: {
        ...data,
        slug: item.slug,
      },
      overrideAccess: true,
    });
  }
}

async function upsertPosts(payload: Awaited<ReturnType<typeof getPayload>>) {
  for (const post of posts) {
    const coverImage = post.coverImageFile
      ? await getMediaId(payload, post.coverImageFile, post.title, post.excerpt)
      : undefined;

    const existing = await payload.find({
      collection: "posts",
      limit: 1,
      where: {
        slug: {
          equals: post.slug,
        },
      },
    });

    const data = {
      _status: "published" as const,
      category: post.category,
      content: post.content,
      coverImage,
      excerpt: post.excerpt,
      publishedAt: post.publishedAt,
      title: post.title,
    };

    if (existing.docs[0]) {
      await payload.update({
        collection: "posts",
        id: existing.docs[0].id,
        data,
        overrideAccess: true,
      });
      continue;
    }

    await payload.create({
      collection: "posts",
      data: {
        ...data,
        slug: post.slug,
      },
      overrideAccess: true,
    });
  }
}

async function updateGlobals(payload: Awaited<ReturnType<typeof getPayload>>) {
  await payload.updateGlobal({
    slug: "site-settings",
    data: {
      _status: "published",
      address: "195197, г. Санкт-Петербург, пр-кт Полюстровский, д. 28 стр. 7, помещ. 2-Н26",
      companyName: "АДАМАНТ",
      phonePrimary: "+7 (911) 197-04-57",
      phoneSecondary: "+7 981 810-62-82",
      workingHours: "ПН-ПТ, 10:00-16:00",
    },
    overrideAccess: true,
  });

  await payload.updateGlobal({
    slug: "home-page",
    data: {
      _status: "published",
      heroTitle:
        "Строительство загородных домов под ключ в Санкт-Петербурге и Ленинградской области",
      heroDescription:
        "Проектируем и строим современные загородные дома в Санкт-Петербурге и Ленинградской области под ключ и в срок. Начните с бесплатного расчета сметы за 1 день.",
      stats: [
        { value: "500+", label: "Построенных домов" },
        { value: "1 день", label: "На расчет сметы" },
        { value: "2000+", label: "Довольных клиентов" },
        { value: "15 лет", label: "Опыта в строительстве" },
      ],
    },
    overrideAccess: true,
  });

  await payload.updateGlobal({
    slug: "about-page",
    data: {
      _status: "published",
      title:
        "Строим загородные дома с контролем сроков, бюджета и качества",
      intro:
        "«Адамант Строй» проектирует и строит современные частные дома под ключ в Санкт-Петербурге и Ленинградской области.\n\nМы ведем клиента от первой консультации и расчета сметы до сдачи готового дома: фиксируем состав работ, подбираем материалы и контролируем ключевые этапы строительства.",
      principles: [
        {
          title: "Прозрачная смета",
          text: "Фиксируем состав работ и материалов до старта, чтобы бюджет был понятен заранее.",
        },
        {
          title: "Единая команда",
          text: "Проектировщики, инженеры и строители работают в общей логике проекта.",
        },
        {
          title: "Контроль качества",
          text: "Проверяем ключевые этапы строительства и документируем ход работ.",
        },
      ],
      faqItems: [
        {
          question: "Сколько времени занимает расчет сметы?",
          answer:
            "Предварительный расчет готовим за 1 день после уточнения задачи, участка, площади и выбранной технологии строительства.",
        },
        {
          question: "Вы строите только дома под ключ?",
          answer:
            "Нет. Помимо строительства домов под ключ, мы выполняем ремонт квартир и отделку коммерческих помещений.",
        },
        {
          question: "Можно ли прийти со своим проектом?",
          answer:
            "Да. Мы можем оценить готовый проект, проверить решения и подготовить смету по вашим чертежам.",
        },
        {
          question: "В каких районах вы работаете?",
          answer:
            "Работаем в Санкт-Петербурге и Ленинградской области. Конкретные условия выезда обсуждаем на консультации.",
        },
      ],
    },
    overrideAccess: true,
  });

  await payload.updateGlobal({
    slug: "contacts-page",
    data: {
      _status: "published",
      title: "Контакты",
      officeAddress:
        "195197, г. Санкт-Петербург, пр-кт Полюстровский, д. 28 стр. 7, помещ. 2-Н26",
      mapEmbedUrl:
        "https://yandex.ru/map-widget/v1/?text=195197%2C%20%D0%B3.%20%D0%A1%D0%B0%D0%BD%D0%BA%D1%82-%D0%9F%D0%B5%D1%82%D0%B5%D1%80%D0%B1%D1%83%D1%80%D0%B3%2C%20%D0%BF%D1%80-%D0%BA%D1%82%20%D0%9F%D0%BE%D0%BB%D1%8E%D1%81%D1%82%D1%80%D0%BE%D0%B2%D1%81%D0%BA%D0%B8%D0%B9%2C%20%D0%B4.%2028%20%D1%81%D1%82%D1%80.%207&z=16",
      companyDetails: {
        legalName: "ООО «АДАМАНТ СТРОЙ»",
        inn: "7804719510",
        ogrn: "1267800006835",
        kpp: "780401001",
      },
    },
    overrideAccess: true,
  });
}

async function main() {
  const payload = await getPayload({ config });

  try {
    await upsertPortfolio(payload);
    await upsertPosts(payload);
    await updateGlobals(payload);
    payload.logger.info("Content seed finished.");
  } finally {
    await payload.destroy();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
