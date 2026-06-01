import {
  getAboutPage,
  getCatalogCoverMedia,
  getCatalogItems,
  getHomePage,
  getMediaAlt,
  getMediaUrl,
  getPortfolioItems,
  getReviews,
  getServices,
  getSiteSettings,
  splitHighlight,
} from "@/site/cms";
import { SiteHeader } from "@/site/components/SiteHeader";
import { getCatalogCardMeta } from "@/site/catalog-meta";
import { getCatalogItemPath, getPortfolioItemPath } from "@/site/routes";
import { createPageMetadata } from "@/site/seo";
import Link from "next/link";

export const dynamic = "force-dynamic";

export const metadata = createPageMetadata({
  title: "Адамант Строй | Строительство домов под ключ в Санкт-Петербурге",
  description: "Проектируем и строим загородные дома под ключ в Санкт-Петербурге и Ленинградской области с прозрачной сметой и контролем сроков.",
  path: "/",
});

const statIconTypes = ["house", "clock", "clients", "award"] as const;
const statIconPaths = [
  "/new-icons/homes.png",
  "/new-icons/estimate-day.png",
  "/new-icons/happy-clients.png",
  "/new-icons/experience.png",
] as const;

const servicePrices: Record<string, string> = {
  "Дом из бруса": "от 5 000 000 ₽",
  "Дом из газобетона": "от 6 500 000 ₽",
  "Каркасный дом": "от 4 500 000 ₽",
  "Отделка коммерческого помещения": "от 2 000 000 ₽",
  "Ремонт квартир": "от 1 500 000 ₽",
};

const processSteps = [
  {
    title: "Консультация и расчет",
    text: "Обсуждаем вводные и рассчитываем предварительную стоимость проекта.",
  },
  {
    title: "Проектирование",
    text: "Разрабатываем индивидуальный проект и согласовываем все детали.",
  },
  {
    title: "Строительство",
    text: "Выполняем строительные работы под контролем качества на каждом этапе.",
  },
  {
    title: "Сдача и гарантия",
    text: "Сдаем готовый дом в срок и предоставляем гарантию на все работы.",
  },
];

type HomeProjectCardMeta = {
  area: string;
  floors: string;
  price: number;
  rooms: string;
};

const projectCardMeta: Record<string, HomeProjectCardMeta> = {
  classic: {
    area: "175 м²",
    floors: "2 этажа",
    price: 16500000,
    rooms: "4 комнаты",
  },
  frame: {
    area: "98 м²",
    floors: "1 этаж",
    price: 8900000,
    rooms: "2 комнаты",
  },
  gasbeton: {
    area: "150 м²",
    floors: "2 этажа",
    price: 15900000,
    rooms: "4 комнаты",
  },
  modern: {
    area: "216 м²",
    floors: "2 этажа",
    price: 18100000,
    rooms: "5 комнат",
  },
  onefloor: {
    area: "100 м²",
    floors: "1 этаж",
    price: 5400000,
    rooms: "3 комнаты",
  },
  terrace: {
    area: "150 м²",
    floors: "2 этажа",
    price: 15900000,
    rooms: "4 комнаты",
  },
  timber: {
    area: "129 м²",
    floors: "1 этаж",
    price: 11800000,
    rooms: "3 комнаты",
  },
};

const fallbackProjectCardMeta: HomeProjectCardMeta = {
  area: "120 м²",
  floors: "1 этаж",
  price: 8900000,
  rooms: "3 комнаты",
};

function formatProjectPrice(value: number) {
  return new Intl.NumberFormat("ru-RU").format(value);
}

type HomeStat = {
  id: string;
  label: string;
  value: string;
};

const defaultHomeStats: HomeStat[] = [
  { id: "built-homes", value: "500+", label: "Построенных домов" },
  { id: "estimate-day", value: "1 день", label: "На расчет сметы" },
  { id: "happy-families", value: "450+", label: "Довольных семей" },
  { id: "market-years", value: "12+ лет", label: "На рынке" },
];

const trustItems = [
  "Фиксированная смета без скрытых платежей",
  "Поэтапный контроль качества работ",
  "Гарантия на все виды работ",
  "Соблюдение сроков по договору",
] as const;

const proofColumns = [
  {
    title: "Преимущества",
    items: ["Собственное управление специалистами", "Современные технологии и материалы", "Строгое соблюдение сроков", "Прозрачное ценообразование"],
  },
  {
    title: "Гарантии",
    items: ["Гарантия до 5 лет на все работы", "Официальный договор", "Фиксированная стоимость", "Сервисное обслуживание"],
  },
  {
    title: "Контроль качества",
    items: ["Технический надзор на всех этапах", "Используем только сертифицированные материалы", "Многоступенчатый контроль качества"],
  },
] as const;

const reviewCards = [
  {
    name: "Алексей и Мария",
    place: "Всеволожск",
    text: "Спасибо команде Адамант Строй за наш новый дом. Все сделали в срок, качество на высоте. Рекомендуем!",
  },
  {
    name: "Дмитрий Сергеев",
    place: "Сестрорецк",
    text: "Профессиональный подход, прозрачная смета и отличная работа. Дом получился именно таким, как мы мечтали.",
  },
  {
    name: "Екатерина Л.",
    place: "Пушкин",
    text: "Очень довольны сотрудничеством. Всегда на связи, все вопросы решались быстро. Отличная команда!",
  },
] as const;

function getInitials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function normalizeRating(value?: number | null) {
  const rating = Number(value) || 5;
  return Math.min(5, Math.max(1, Math.round(rating)));
}

type StatIconType = (typeof statIconTypes)[number];

function StatIcon({ type }: { type: StatIconType }) {
  const commonProps = {
    fill: "none",
    stroke: "currentColor",
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    strokeWidth: 1.65,
  };

  if (type === "clock") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="7" {...commonProps} />
        <path d="M12 8.4v4.05l2.85 1.72" {...commonProps} />
      </svg>
    );
  }

  if (type === "clients") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="9.2" cy="8.8" r="2.75" {...commonProps} />
        <path d="M4.65 18.65c.48-3.08 2.08-4.78 4.55-4.78s4.08 1.7 4.55 4.78" {...commonProps} />
        <path d="M15.25 9.95a2.35 2.35 0 1 0 0-4.7" {...commonProps} />
        <path d="M15.6 13.75c2.2.34 3.56 1.98 3.96 4.82" {...commonProps} />
      </svg>
    );
  }

  if (type === "award") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 4.15 14.05 5.4l2.38-.15.98 2.18 1.82 1.55-.54 2.36.54 2.34-1.82 1.56-.98 2.18-2.38-.15L12 18.5l-2.05-1.23-2.38.15-.98-2.18-1.82-1.56.54-2.34-.54-2.36 1.82-1.55.98-2.18 2.38.15L12 4.15Z" {...commonProps} />
        <path d="m9.65 11.18 1.55 1.55 3.15-3.28" {...commonProps} />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4.7 11.25 12 5.1l7.3 6.15" {...commonProps} />
      <path d="M6.75 10.25v8.25h10.5v-8.25" {...commonProps} />
      <path d="M10.15 18.5v-4.85h3.7v4.85" {...commonProps} />
      <path d="M15.8 7.28V5.35h2.08v3.7" {...commonProps} />
    </svg>
  );
}

export default async function HomePage() {
  const [siteSettings, homePage, services, portfolioItems, catalogItems, aboutPage, payloadReviews] = await Promise.all([
    getSiteSettings(),
    getHomePage(),
    getServices(),
    getPortfolioItems(),
    getCatalogItems(),
    getAboutPage(),
    getReviews(),
  ]);

  const stats = defaultHomeStats;
  const description = splitHighlight(homePage.heroDescription);
  const catalogByTitle = new Map(catalogItems.map((item) => [item.title, item]));
  const cycleServices = services.filter((service) => service.showOnServicesPage !== false);
  const featuredProjects = catalogItems.filter((item) => item.showInCatalog).slice(0, 8);
  const portfolioStripItems = portfolioItems.slice(0, 6);
  const trustImageUrl =
    getMediaUrl(portfolioStripItems[0]?.previewImage, "card") ||
    getMediaUrl(portfolioStripItems[0]?.previewImage) ||
    "/фон.jpg";
  const faqItems = aboutPage.faqItems?.slice(0, 4) ?? [];
  const reviews = payloadReviews.length ? payloadReviews.slice(0, 3) : reviewCards;

  return (
    <div className="home-page">
      <div className="viewport">
        <main className="page" aria-label="Главная страница Адамант">
          <SiteHeader active="home" phone={siteSettings.phonePrimary} />

          <section className="hero" id="home" aria-labelledby="hero-title">
            <div className="hero__content">
              <span className="hero__kicker">Строим с заботой о вашем будущем</span>
              <h1 id="hero-title">{homePage.heroTitle}</h1>
              <p>
                {description.lead}
                {description.lead && description.highlight ? " " : ""}
                {description.highlight ? <span>{description.highlight}</span> : null}
              </p>

              <div className="hero__actions">
                <a className="button js-open-estimate" href="/contacts">
                  Оставить заявку
                </a>
                <Link className="projects-link" href="/catalog">
                  Смотреть проекты <span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>

            <div className="visual-panel hero-visual" aria-hidden="true">
              <img
                className="visual-panel__image visual-panel__image--base"
                src="/home-main-new.webp"
                alt=""
                loading="eager"
                decoding="async"
                fetchPriority="high"
              />
              <img
                className="visual-panel__image visual-panel__image--lit"
                src="/home-main-new.webp"
                alt=""
                loading="eager"
                decoding="async"
              />
            </div>
          </section>

          <section className="home-about-stats" aria-labelledby="home-about-stats-title">
            <div className="home-about-stats__copy">
              <span className="home-about-stats__eyebrow">
                <StatIcon type="house" />
                О компании
              </span>
              <h2 id="home-about-stats-title">О нас</h2>
              <span className="home-about-stats__line" aria-hidden="true" />
              <p>
                Проектируем и строим современные загородные дома в Санкт-Петербурге
                и Ленинградской области. Берем на себя весь процесс — от идеи и расчета
                сметы до строительства под ключ.
              </p>
              <p>
                Вы заранее знаете сроки, бюджет и каким будет ваш дом. Никаких сюрпризов —
                только понятный результат.
              </p>
              <div className="home-about-stats__cta">
                <Link href="/about">
                  Подробнее о нас <span aria-hidden="true">→</span>
                </Link>
                <div>
                  <span aria-hidden="true">
                    <StatIcon type="award" />
                  </span>
                  <p>
                    <strong>Работаем по договору</strong>
                    <br />с фиксированными сроками и ценой
                  </p>
                </div>
              </div>
            </div>

            <div className="home-about-stats__grid" aria-label="Показатели компании">
              {stats.slice(0, 4).map((stat, index) => (
                <div className="home-about-stat" key={stat.id ?? `${stat.value}-${stat.label}`}>
                  <span className="home-about-stat__icon" aria-hidden="true">
                    <StatIcon type={statIconTypes[index] ?? "house"} />
                  </span>
                  <strong>{stat.value}</strong>
                  <span>{stat.label}</span>
                  <i aria-hidden="true" />
                </div>
              ))}
            </div>
          </section>

          <section
            className="home-section home-project-preview"
            aria-labelledby="home-project-preview-title"
            data-home-services-carousel
          >
            <div className="home-section__head home-section__head--compact">
              <div>
                <span className="section__kicker">Наши проекты</span>
                <h2 id="home-project-preview-title">Современные дома для комфортной жизни</h2>
              </div>
              <div className="home-project-preview__actions" aria-label="Навигация по проектам">
                <Link className="home-section__link" href="/catalog">
                  Смотреть все проекты <span aria-hidden="true">→</span>
                </Link>
                <button
                  className="home-project-preview__arrow"
                  type="button"
                  aria-label="Предыдущие проекты"
                  data-slider-prev
                >
                  ‹
                </button>
                <button
                  className="home-project-preview__arrow home-project-preview__arrow--active"
                  type="button"
                  aria-label="Следующие проекты"
                  data-slider-next
                >
                  ›
                </button>
              </div>
            </div>

            <div className="home-project-preview__grid js-wheel-slider">
              {featuredProjects.map((project) => {
                const href = getCatalogItemPath(project);
                const coverMedia = getCatalogCoverMedia(project);
                const imageUrl =
                  getMediaUrl(coverMedia, "card") || getMediaUrl(coverMedia);
                const meta = getCatalogCardMeta(project);
                const description = project.cardSummary || project.description;

                return (
                  <article
                    key={project.id}
                    className="home-project-card listing-card"
                    data-card-link={href}
                    tabIndex={0}
                  >
                    <div className="listing-card__media">
                      <a className="listing-card__media-link" href={href} aria-label={`Смотреть проект ${project.title}`}>
                        {imageUrl ? (
                          <img
                            src={imageUrl}
                            alt={getMediaAlt(coverMedia, project.title)}
                            loading="lazy"
                            decoding="async"
                          />
                        ) : null}
                      </a>
                      {project.isHit ? (
                        <span className="listing-card__badge">
                          <svg viewBox="0 0 24 24" aria-hidden="true">
                            <path d="m12 2.8 2.8 5.8 6.4.9-4.6 4.5 1.1 6.4-5.7-3-5.7 3 1.1-6.4-4.6-4.5 6.4-.9L12 2.8Z" />
                          </svg>
                          Хит проект
                        </span>
                      ) : null}
                      <span className="listing-card__photos">
                        <svg viewBox="0 0 24 24" aria-hidden="true">
                          <path d="M4 8h3l1.7-2h6.6L17 8h3v10H4V8Z" />
                          <circle cx="12" cy="13" r="3.2" />
                        </svg>
                        1/{meta.photoCount}
                      </span>
                    </div>
                    <div className="listing-card__body">
                      <h2>{project.title}</h2>
                      <p className="listing-card__description">{description}</p>
                      <ul className="listing-card__specs" aria-label="Характеристики проекта">
                        <li className="listing-card__spec listing-card__spec--area">
                          <span className="listing-card__spec-icon" aria-hidden="true">
                            <svg viewBox="0 0 24 24">
                              <path d="M5 5h14v14H5V5Z" />
                              <path d="M5 10h4M15 5v4M19 14h-4M9 19v-4" />
                            </svg>
                          </span>
                          <span>
                            <strong>{meta.area}</strong>
                            <small>Площадь</small>
                          </span>
                        </li>
                        <li className="listing-card__spec listing-card__spec--floors">
                          <span className="listing-card__spec-icon" aria-hidden="true">
                            <svg viewBox="0 0 24 24">
                              <path d="m12 3 8 4-8 4-8-4 8-4Z" />
                              <path d="m20 12-8 4-8-4" />
                              <path d="m20 17-8 4-8-4" />
                            </svg>
                          </span>
                          <span>
                            <strong>{meta.floors}</strong>
                            <small>Этажность</small>
                          </span>
                        </li>
                        <li className="listing-card__spec listing-card__spec--rooms">
                          <span className="listing-card__spec-icon" aria-hidden="true">
                            <svg viewBox="0 0 24 24">
                              <path d="M4 11V6h5a3 3 0 0 1 3 3v2" />
                              <path d="M12 11V7h5a3 3 0 0 1 3 3v1" />
                              <path d="M4 11h16v7" />
                              <path d="M4 18v-7" />
                              <path d="M4 16h16" />
                            </svg>
                          </span>
                          <span>
                            <strong>{meta.rooms}</strong>
                            <small>Комнаты</small>
                          </span>
                        </li>
                      </ul>
                    </div>
                    <div className="listing-card__footer">
                      <strong>
                        <span>от</span>
                        {formatProjectPrice(meta.price)} ₽
                      </strong>
                      <a className="listing-card__button" href={href} aria-label={`Подробнее: ${project.title}`}>
                        Подробнее
                      </a>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>

          <section className="home-section home-trust" aria-labelledby="home-trust-title">
            <div className="home-trust__copy">
              <span className="section__kicker">Почему выбирают нас</span>
              <h2 id="home-trust-title">Надежность, качество и прозрачность на каждом этапе</h2>
              <ul className="home-trust__list">
                {trustItems.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <button className="home-section__link home-section__link--button js-open-estimate" type="button">
                Узнать больше о нас
              </button>
            </div>

            <div className="home-trust__media" aria-hidden="true">
              <img src={trustImageUrl} alt="" loading="lazy" decoding="async" />
            </div>
          </section>

          <section className="home-section home-process" aria-labelledby="home-process-title" data-stagger-reveal>
            <div className="home-section__head home-section__head--compact">
              <div>
                <span className="section__kicker">Этапы работ</span>
                <h2 id="home-process-title">Прозрачный процесс от идеи до вашего дома</h2>
              </div>
            </div>

            <div className="home-process__grid">
              {processSteps.map((step, index) => (
                <article key={step.title} className="home-process__item" data-stagger-item>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <h3>{step.title}</h3>
                  <p>{step.text}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="home-section home-cycle" aria-labelledby="home-cycle-title">
            <div className="home-section__head home-section__head--compact">
              <div>
                <span className="section__kicker">Наши услуги</span>
                <h2 id="home-cycle-title">Полный цикл строительства</h2>
              </div>
            </div>

            <div className="home-cycle__grid">
              {cycleServices.map((service, index) => {
                const catalogItem = catalogByTitle.get(service.title);
                const href = service.href || (catalogItem ? getCatalogItemPath(catalogItem) : "/services");
                const imageUrl =
                  getMediaUrl(service.previewImage, "card") || getMediaUrl(service.previewImage);

                return (
                  <article
                    key={service.id}
                    className="home-cycle-card"
                    data-card-link={href}
                    tabIndex={0}
                  >
                    <a className="home-cycle-card__media" href={href} aria-label={`Подробнее об услуге ${service.title}`}>
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={getMediaAlt(service.previewImage, service.title)}
                          loading="lazy"
                          decoding="async"
                        />
                      ) : null}
                    </a>
                    <div className="home-cycle-card__body">
                      <span className="home-cycle-card__icon" aria-hidden="true">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <h3>{service.title}</h3>
                      <p>{service.shortDescription}</p>
                      <a href={href}>Подробнее <span aria-hidden="true">→</span></a>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>

          <section className="home-section home-proof-section" aria-label="Преимущества, гарантии и контроль качества">
            <div className="home-proof-strip">
              {proofColumns.map((column) => (
                <article key={column.title} className="home-proof-strip__item">
                  <span className="home-proof-strip__icon" aria-hidden="true" />
                  <div>
                    <h3>{column.title}</h3>
                    <ul>
                      {column.items.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="home-section home-portfolio-showcase" aria-labelledby="home-portfolio-title">
            <div className="home-section__head home-section__head--compact">
              <div>
                <span className="section__kicker">Портфолио</span>
                <h2 id="home-portfolio-title">Реализованные проекты</h2>
              </div>
              <a className="home-section__link" href="/portfolio">
                Смотреть все проекты <span aria-hidden="true">→</span>
              </a>
            </div>

            <div className="home-portfolio-strip">
              {portfolioStripItems.map((project) => {
                const href = getPortfolioItemPath(project);
                const imageUrl =
                  getMediaUrl(project.previewImage, "thumb") ||
                  getMediaUrl(project.previewImage, "card") ||
                  getMediaUrl(project.previewImage);

                return (
                  <a key={project.id} className="home-portfolio-thumb" href={href}>
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={getMediaAlt(project.previewImage, project.title)}
                        loading="lazy"
                        decoding="async"
                      />
                    ) : null}
                    <span>{project.title}</span>
                  </a>
                );
              })}
            </div>
          </section>

          <section className="home-section home-reviews" aria-labelledby="home-reviews-title">
            <div className="home-section__head home-section__head--compact">
              <div>
                <span className="section__kicker">Отзывы клиентов</span>
                <h2 id="home-reviews-title">Нам доверяют</h2>
              </div>
            </div>

            <div className="home-reviews__grid">
              {reviews.map((review) => {
                const avatarUrl =
                  "avatar" in review
                    ? getMediaUrl(review.avatar, "thumb") || getMediaUrl(review.avatar)
                    : "";
                const caption =
                  "caption" in review
                    ? review.caption
                    : "place" in review
                      ? review.place
                      : "";
                const rating = normalizeRating("rating" in review ? review.rating : 5);

                return (
                  <article className="home-review-card" key={review.name}>
                    <div className="home-review-card__person">
                      <span aria-hidden="true">
                        {avatarUrl ? (
                          <img src={avatarUrl} alt="" loading="lazy" decoding="async" />
                        ) : (
                          getInitials(review.name)
                        )}
                      </span>
                      <div>
                        <strong>{review.name}</strong>
                        {caption ? <small>{caption}</small> : null}
                      </div>
                    </div>
                    <p>{review.text}</p>
                    <div className="home-review-card__stars" aria-label={`Оценка ${rating} из 5`}>
                      {"★★★★★".slice(0, rating)}
                    </div>
                  </article>
                );
              })}
            </div>
          </section>

          {faqItems.length ? (
            <section className="home-section home-faq" aria-labelledby="home-faq-title">
              <div className="home-section__head home-section__head--compact">
                <div>
                  <span className="section__kicker">Ответы на частые вопросы</span>
                  <h2 id="home-faq-title">FAQ</h2>
                </div>
              </div>

              <div className="home-faq__list">
                {faqItems.map((item, index) => (
                  <details
                    className="faq-item home-faq__item"
                    key={item.id ?? `${item.question}-${index}`}
                    open={index === 0}
                  >
                    <summary>{item.question}</summary>
                    <p>{item.answer}</p>
                  </details>
                ))}
              </div>
            </section>
          ) : null}
        </main>
      </div>
    </div>
  );
}
