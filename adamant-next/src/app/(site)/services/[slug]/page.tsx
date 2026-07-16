import { notFound } from "next/navigation";
import Link from "next/link";

import {
  getMediaAlt,
  getMediaUrl,
  getServiceBySlug,
  getSiteSettings,
  splitParagraphs,
  type ServiceCardDoc,
} from "@/site/cms";
import { SiteHeader } from "@/site/components/SiteHeader";
import { getServicePath } from "@/site/routes";
import { createPageMetadata, pickSeoDescription, pickSeoTitle } from "@/site/seo";
import {
  buildBreadcrumbList,
  buildServiceStructuredData,
  buildStructuredDataGraph,
  stringifyStructuredData,
} from "@/site/structured-data";

type ServiceSlugPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

type ServiceLanding = Pick<
  ServiceCardDoc,
  "description" | "id" | "previewImage" | "shortDescription" | "slug" | "tags" | "title" | "updatedAt"
>;

const landscapeFallback: ServiceLanding = {
  description:
    "Разрабатываем ландшафтный дизайн участка под образ жизни семьи: продумываем дорожки, зоны отдыха, освещение, посадки, дренаж и сценарии ухода. Работаем так, чтобы участок выглядел цельно с архитектурой дома и был удобен каждый день.",
  id: -1,
  previewImage: null,
  shortDescription:
    "Проектируем участок вокруг дома: планировка зон, дорожки, озеленение, освещение и инженерная подготовка.",
  slug: "landshaftnyy-dizayn",
  tags: [
    { label: "Генплан участка" },
    { label: "Озеленение" },
    { label: "Дорожки и освещение" },
    { label: "Дренаж" },
  ],
  title: "Ландшафтный дизайн",
  updatedAt: "2026-01-01T00:00:00.000Z",
};

const landscapeWorks = [
  "Зонирование участка: входная зона, парковка, терраса, сад, детская или хозяйственная часть.",
  "Подбор растений с учетом климата Санкт-Петербурга и Ленинградской области.",
  "План дорожек, площадок, освещения, водоотведения и удобных проходов вокруг дома.",
  "Подготовка визуальной концепции, чтобы заранее понять стиль будущего участка.",
];

const landscapeSteps = [
  ["01", "Знакомство", "Уточняем задачи, состав семьи, сценарии отдыха и особенности участка."],
  ["02", "Концепция", "Собираем планировочное решение, стилистику, референсы и основные зоны."],
  ["03", "Проект", "Готовим схему дорожек, посадок, освещения и инженерных решений."],
  ["04", "Реализация", "Помогаем перейти от проекта к работам на участке без хаоса и лишних переделок."],
];

export const dynamic = "force-dynamic";

const SERVICE_META_DESCRIPTIONS: Record<string, string> = {
  "dizajn-interjera":
    "Разрабатываем дизайн интерьера для квартир и домов: планировка, визуализации, подбор материалов, мебели и сопровождение реализации.",
  "ipoteka-na-stroitelstvo-doma":
    "Помогаем оформить ипотеку на строительство дома: подбираем программу, консультируем по документам, смете и этапам строительства.",
  "landshaftnyy-dizayn":
    "Проектируем ландшафтный дизайн участка: дорожки, зоны отдыха, освещение, посадки, дренаж и решения, удобные для ежедневного ухода.",
  "podbor-uchastka":
    "Помогаем подобрать участок под строительство дома в Санкт-Петербурге и Ленинградской области: проверяем локацию, коммуникации и ограничения.",
};

function normalizeSlug(slug: string) {
  try {
    return decodeURIComponent(slug);
  } catch {
    return slug;
  }
}

const serviceSlugLookup: Record<string, string> = {
  "stroitelstvo-zagorodnyh-domov": "dom-iz-gazobetona",
};

function getFallbackService(slug: string) {
  return slug === landscapeFallback.slug ? landscapeFallback : null;
}

function isLandscapeService(service: ServiceLanding) {
  return service.slug === landscapeFallback.slug || /ландшафт/i.test(service.title);
}

async function getServiceLanding(slug: string) {
  const normalizedSlug = normalizeSlug(slug);

  return (
    (await getServiceBySlug(normalizedSlug)) ??
    (serviceSlugLookup[normalizedSlug]
      ? await getServiceBySlug(serviceSlugLookup[normalizedSlug])
      : null) ??
    getFallbackService(normalizedSlug)
  );
}

export async function generateMetadata({ params }: ServiceSlugPageProps) {
  const { slug } = await params;
  const service = await getServiceLanding(slug);

  if (!service) {
    return createPageMetadata({
      title: "Услуга не найдена",
      description: "Страница услуги не найдена.",
      index: false,
      path: "/services",
    });
  }

  const fallbackDescription =
    SERVICE_META_DESCRIPTIONS[service.slug] ||
    `Услуга ${service.title} от АДАМАНТ Строй: консультация, подбор решений, расчет стоимости и сопровождение работ в Санкт-Петербурге и Ленинградской области.`;

  return createPageMetadata({
    title: pickSeoTitle(`${service.title} | АДАМАНТ Строй`),
    description: pickSeoDescription(
      fallbackDescription,
      service.shortDescription,
      service.description,
    ),
    path: getServicePath(service),
  });
}

export default async function ServiceSlugPage({ params }: ServiceSlugPageProps) {
  const { slug } = await params;
  const [siteSettings, service] = await Promise.all([
    getSiteSettings(),
    getServiceLanding(slug),
  ]);

  if (!service) {
    notFound();
  }

  const isLandscape = isLandscapeService(service);
  const heroImageUrl =
    getMediaUrl(service.previewImage) ||
    getMediaUrl(service.previewImage, "card") ||
    (isLandscape ? "/plot-selection.webp" : "/request-house.webp");
  const heroImageAlt = getMediaAlt(service.previewImage, service.title);
  const paragraphs = splitParagraphs(service.description).length
    ? splitParagraphs(service.description)
    : [service.shortDescription];
  const tags = service.tags?.map((tag) => tag.label).filter(Boolean) ?? [];
  const servicePath = getServicePath(service);
  const structuredData = buildStructuredDataGraph(
    buildBreadcrumbList([
      { name: "Главная", path: "/" },
      { name: "Услуги", path: "/services" },
      { name: service.title, path: servicePath },
    ]),
    buildServiceStructuredData({
      description: service.shortDescription || paragraphs[0] || service.description,
      path: servicePath,
      title: service.title,
    }),
  );

  return (
    <main className="page inner-page service-detail-page" aria-label={service.title}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: stringifyStructuredData(structuredData) }}
      />
      <SiteHeader active="services" phone={siteSettings.phonePrimary} />

      <div className="service-detail">
        <section className="service-detail__hero" aria-labelledby="service-detail-title">
          <div className="service-detail__copy">
            <Link className="service-detail__back" href="/services">
              ← Все услуги
            </Link>
            <h1 id="service-detail-title">{service.title}</h1>
            <p>{service.shortDescription}</p>
            {tags.length ? (
              <div className="service-detail__tags" aria-label="Направления услуги">
                {tags.slice(0, 5).map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
            ) : null}
            <button className="service-detail__button js-open-estimate" type="button" data-estimate-service={service.title}>
              Обсудить проект
            </button>
          </div>
          <div className="service-detail__media">
            <img src={heroImageUrl} alt={heroImageAlt} loading="eager" decoding="async" />
          </div>
        </section>

        <section className="service-detail__section service-detail__about" aria-labelledby="service-about-title">
          <div>
            <h2 id="service-about-title">Что делаем</h2>
            {paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          <div className="service-detail__aside">
            <h3>{isLandscape ? "Ландшафт без случайных решений" : "Подберем решение под задачу"}</h3>
            <p>
              {isLandscape
                ? "Связываем архитектуру дома, рельеф, посадки и маршруты в один понятный план участка."
                : "Разберем вводные, подскажем оптимальный формат работ и подготовим понятный следующий шаг."}
            </p>
          </div>
        </section>

        {isLandscape ? (
          <>
            <section className="service-detail__section" aria-labelledby="landscape-works-title">
              <h2 id="landscape-works-title">Что входит в ландшафтный дизайн</h2>
              <div className="service-detail__cards">
                {landscapeWorks.map((item) => (
                  <article key={item}>
                    <span aria-hidden="true">✓</span>
                    <p>{item}</p>
                  </article>
                ))}
              </div>
            </section>

            <section className="service-detail__section" aria-labelledby="landscape-steps-title">
              <h2 id="landscape-steps-title">Как проходит работа</h2>
              <div className="service-detail__steps">
                {landscapeSteps.map(([number, title, text]) => (
                  <article key={number}>
                    <strong>{number}</strong>
                    <h3>{title}</h3>
                    <p>{text}</p>
                  </article>
                ))}
              </div>
            </section>
          </>
        ) : (
          <section className="service-detail__section" aria-labelledby="service-steps-title">
            <h2 id="service-steps-title">Как начнем работу</h2>
            <div className="service-detail__steps">
              {["Заявка", "Консультация", "Смета", "Старт работ"].map((title, index) => (
                <article key={title}>
                  <strong>{String(index + 1).padStart(2, "0")}</strong>
                  <h3>{title}</h3>
                  <p>Согласуем детали и двигаемся к следующему этапу без лишней бюрократии.</p>
                </article>
              ))}
            </div>
          </section>
        )}

        <section className="service-detail__cta" aria-labelledby="service-cta-title">
          <div>
            <h2 id="service-cta-title">Хотите обсудить {service.title.toLocaleLowerCase("ru")}?</h2>
            <p>Оставьте контакты, и мы подскажем, с чего лучше начать.</p>
          </div>
          <form className="contact-form service-detail__form" aria-label="Заявка на услугу">
            <input name="name" type="text" placeholder="Ваше имя" aria-label="Ваше имя" />
            <input name="phone" type="tel" placeholder="Телефон *" aria-label="Телефон" required />
            <input type="hidden" name="service" value={service.title} />
            <label>
              <input name="privacy" type="checkbox" required />
              <span>
                Согласен на{" "}
                <Link href="/consent">обработку персональных данных</Link>
              </span>
            </label>
            <button type="submit">Получить консультацию</button>
            <p className="contact-form__status" aria-live="polite" />
          </form>
        </section>
      </div>
    </main>
  );
}
