import { getPayload } from "payload";

import config from "../payload.config.ts";

const pageIntroDefaults = {
  "blog-page": {
    eyebrow: "Блог",
    subtitle:
      "Публикуем материалы о технологиях строительства, сметах, проектировании и практических решениях для загородного дома.",
    title: "Статьи о строительстве, проектировании и выборе дома",
  },
  "catalog-page": {
    eyebrow: "Каталог проектов",
    subtitle:
      "Собрали проекты домов с разной архитектурой и планировками, чтобы вы могли выбрать подходящее решение под участок, бюджет и сценарий проживания.",
    title: "Проекты загородных домов для строительства под ключ",
  },
  "portfolio-page": {
    eyebrow: "Портфолио",
    subtitle:
      "Показываем готовые решения, планировки и подход к строительству загородных домов под ключ в Санкт-Петербурге и Ленинградской области.",
    title: "Реализованные проекты домов и строительных работ",
  },
  "services-page": {
    eyebrow: "Услуги",
    subtitle:
      "Выполняем полный цикл работ: от строительства загородных домов до ремонта квартир и отделки коммерческих помещений.",
    title: "Строительство домов, ремонт и отделка под ключ",
  },
} as const;

async function main() {
  const payload = await getPayload({ config });

  try {
    const currentAbout = await payload.findGlobal({
      slug: "about-page",
      depth: 1,
      draft: false,
      overrideAccess: true,
    });

    await payload.updateGlobal({
      slug: "about-page",
      data: {
        ...currentAbout,
        _status: "published",
        eyebrow: "О компании",
        subtitle:
          "Проектируем и строим современные частные дома в Санкт-Петербурге и Ленинградской области с прозрачной сметой, контролем сроков и качества.",
        title: "Адамант Строй: строительство загородных домов под ключ",
      },
      overrideAccess: true,
    });

    const currentContacts = await payload.findGlobal({
      slug: "contacts-page",
      depth: 1,
      draft: false,
      overrideAccess: true,
    });

    await payload.updateGlobal({
      slug: "contacts-page",
      data: {
        ...currentContacts,
        _status: "published",
        eyebrow: "Контакты",
        subtitle:
          "Свяжитесь с нами по телефону, приезжайте в офис или отправьте реквизиты для быстрого расчета и консультации по проекту.",
        title: "Контакты Адамант Строй в Санкт-Петербурге",
      },
      overrideAccess: true,
    });

    for (const [slug, defaults] of Object.entries(pageIntroDefaults)) {
      await payload.updateGlobal({
        slug: slug as
          | "blog-page"
          | "catalog-page"
          | "portfolio-page"
          | "services-page",
        data: {
          _status: "published",
          ...defaults,
        },
        overrideAccess: true,
      });
    }

    payload.logger.info("Page intros seed finished.");
  } finally {
    await payload.destroy();
  }
}

main()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
