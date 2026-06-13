import {
  getAboutPage,
  getCatalogCategories,
  getCatalogCoverMedia,
  getCatalogItems,
  getCompanyStats,
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
import { formatProjectPrice, getCatalogCardMeta } from "@/site/catalog-meta";
import { getCatalogCategoryPath, getCatalogItemPath, getPortfolioItemPath } from "@/site/routes";
import { createPageMetadata } from "@/site/seo";
import Link from "next/link";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const homePage = await getHomePage();

  return createPageMetadata({
    title: homePage.seoTitle || "Заполните SEO Title в Payload",
    description: homePage.seoDescription || "Заполните SEO Description в Payload",
    path: "/",
  });
}

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

type HomeStat = {
  id: string;
  key?: string;
  label: string;
  value: string;
};

type HomeStatInput = {
  id?: string | null;
  label?: string | null;
  value?: string | null;
};

function getHomeStats(
  homePage: { stats?: HomeStatInput[] | null },
  fallbackStats: HomeStat[],
): HomeStat[] {
  const settingsStats = fallbackStats.filter(
    (stat) => stat.value !== "—" && stat.label.trim(),
  );

  if (settingsStats.length) {
    return settingsStats.slice(0, 4);
  }

  const payloadStats = (homePage.stats ?? [])
    .filter((stat) => stat?.value?.trim() && stat?.label?.trim())
    .map((stat, index) => ({
      id: stat.id ?? `home-stat-${index}`,
      label: stat.label?.trim() ?? "",
      value: stat.value?.trim() ?? "",
    }));

  return (payloadStats.length ? payloadStats : fallbackStats).slice(0, 4);
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
  const [siteSettings, homePage, services, portfolioItems, catalogItems, catalogCategories, aboutPage, payloadReviews] = await Promise.all([
    getSiteSettings(),
    getHomePage(),
    getServices(),
    getPortfolioItems(),
    getCatalogItems(),
    getCatalogCategories(),
    getAboutPage(),
    getReviews(),
  ]);

  const stats: HomeStat[] = getHomeStats(homePage, getCompanyStats(siteSettings, "home"));
  const description = splitHighlight(homePage.heroDescription);
  const catalogByTitle = new Map(catalogItems.map((item) => [item.title, item]));
  const cycleServices = services.filter((service) => service.showOnServicesPage !== false);
  const featuredProjects = catalogItems.filter((item) => item.showInCatalog).slice(0, 8);
  const portfolioStripItems = portfolioItems.slice(0, 6);
  const plotLeadProject =
    featuredProjects.find((project) =>
      /модуль|дач|брус|террас/i.test(project.title),
    ) ?? featuredProjects[0];
  const plotLeadMedia = plotLeadProject
    ? getCatalogCoverMedia(plotLeadProject)
    : null;
  const trustImageUrl =
    getMediaUrl(portfolioStripItems[0]?.previewImage, "card") ||
    getMediaUrl(portfolioStripItems[0]?.previewImage) ||
    "/фон.jpg";
  const plotLeadImageUrl =
    getMediaUrl(plotLeadMedia, "card") ||
    getMediaUrl(plotLeadMedia) ||
    trustImageUrl;
  const faqItems = aboutPage.faqItems?.slice(0, 4) ?? [];
  const reviews = payloadReviews.length ? payloadReviews : [];
  const videoReviews = reviews
    .map((review) => ({
      caption: review.caption?.trim() || review.text?.trim() || "",
      name: review.name,
      posterUrl:
        getMediaUrl(review.poster, "card") ||
        getMediaUrl(review.poster) ||
        getMediaUrl(review.avatar, "card") ||
        getMediaUrl(review.avatar),
      videoUrl: getMediaUrl(review.video),
    }))
    .filter((review) => review.videoUrl);
  const sectionEyebrows = homePage.sectionEyebrows ?? {};
  const sectionHeadings = homePage.sectionHeadings ?? {};

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
              <span className="home-about-stats__eyebrow">{sectionEyebrows.about || "О компании"}</span>
              <h2 id="home-about-stats-title">{sectionHeadings.about || "О нас"}</h2>
              <span className="home-about-stats__line" aria-hidden="true" />
              <p>
                Проектируем и строим современные загородные дома в Санкт-Петербурге
                и Ленинградской области. Берем на себя весь процесс — от идеи и расчета
                сметы до строительства под ключ.
              </p>
              <div className="home-about-stats__cta">
                <Link href="/about">Подробнее о нас</Link>
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
            className="home-section home-project-preview home-project-preview--catalog-style"
            aria-labelledby="home-project-preview-title"
            data-home-services-carousel
          >
            <div className="home-section__head home-section__head--compact">
              <div>
                <span className="section__kicker">{sectionEyebrows.projects || "Проекты"}</span>
                <h2 id="home-project-preview-title">{sectionHeadings.projects || "Проекты компании «АДАМАНТ Строй»"}</h2>
              </div>
              <div className="home-project-preview__actions" aria-label="Навигация по проектам">
                <Link className="home-section__link" href="/catalog">
                  Перейти в проекты <span aria-hidden="true">→</span>
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

            <nav className="home-project-preview__categories" aria-label="Категории проектов">
              <Link className="is-active" href="/catalog">
                Все
              </Link>
              {catalogCategories.slice(0, 6).map((category) => (
                <Link key={category.id} href={getCatalogCategoryPath(category)}>
                  {category.title}
                </Link>
              ))}
            </nav>

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
                      <a className="listing-card__media-link" href={href} aria-label={project.title}>
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

          <section className="home-section home-process" aria-labelledby="home-process-title" data-stagger-reveal>
            <div className="home-section__head home-section__head--compact">
              <div>
                <span className="section__kicker">{sectionEyebrows.process || "Этапы работ"}</span>
                <h2 id="home-process-title">{sectionHeadings.process || "Прозрачный процесс от идеи до вашего дома"}</h2>
                <p className="home-process__lead">
                  {sectionHeadings.processLead || "Четкий план и постоянная коммуникация на каждом этапе работы."}
                </p>
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

          <section className="home-section home-cycle" aria-labelledby="home-cycle-title" data-home-services-carousel>
            <div className="home-section__head home-section__head--compact">
              <div>
                <span className="section__kicker">{sectionEyebrows.services || "Услуги"}</span>
                <h2 id="home-cycle-title">
                  {sectionHeadings.services || "Услуги компании «АДАМАНТ Строй»"}
                </h2>
              </div>
              <div className="home-project-preview__actions home-cycle__actions" aria-label="Навигация по услугам">
                <Link className="home-section__link" href="/services">
                  Перейти в услуги <span aria-hidden="true">→</span>
                </Link>
                <button
                  className="home-project-preview__arrow"
                  type="button"
                  aria-label="Предыдущие услуги"
                  data-slider-prev
                >
                  ‹
                </button>
                <button
                  className="home-project-preview__arrow home-project-preview__arrow--active"
                  type="button"
                  aria-label="Следующие услуги"
                  data-slider-next
                >
                  ›
                </button>
              </div>
            </div>

            <div className="home-cycle__grid js-wheel-slider">
              {cycleServices.map((service, index) => {
                const catalogItem = catalogByTitle.get(service.title);
                const href = service.href || (catalogItem ? getCatalogItemPath(catalogItem) : "/services");
                const imageUrl =
                  getMediaUrl(service.previewImage, "card") ||
                  getMediaUrl(service.previewImage);

                return (
                  <article
                    key={service.id}
                    className={`home-cycle-card home-cycle-card--tone-${(index % 4) + 1}`}
                    data-card-link={href}
                    tabIndex={0}
                  >
                    <a
                      className="home-cycle-card__media"
                      href={href}
                      aria-label={`Подробнее об услуге ${service.title}`}
                    >
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={getMediaAlt(service.previewImage, service.title)}
                          loading="lazy"
                          decoding="async"
                        />
                      ) : (
                        <span className="home-cycle-card__media-placeholder">
                          Изображение услуги не загружено
                        </span>
                      )}
                    </a>
                    <div className="home-cycle-card__body">
                      <h3>{service.title}</h3>
                      <p>{service.shortDescription}</p>
                      <a
                        className="home-cycle-card__arrow-link"
                        href={href}
                        aria-label={`Подробнее об услуге ${service.title}`}
                      >
                        <span aria-hidden="true">→</span>
                      </a>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>

          <section className="home-section home-portfolio-showcase" aria-labelledby="home-portfolio-title">
            <div className="home-section__head home-section__head--compact">
              <div>
                <span className="section__kicker">{sectionEyebrows.portfolio || "Портфолио"}</span>
                <h2 id="home-portfolio-title">{sectionHeadings.portfolio || "Реализованные проекты"}</h2>
              </div>
              <a className="home-section__link" href="/portfolio">
                Смотреть все проекты <span aria-hidden="true">→</span>
              </a>
            </div>

            <div className="projects-grid home-portfolio-strip">
              {portfolioStripItems.map((project) => {
                const href = getPortfolioItemPath(project);
                const imageUrl =
                  getMediaUrl(project.previewImage, "card") ||
                  getMediaUrl(project.previewImage);
                const visibleTags = project.tags?.slice(0, 2) || [];

                return (
                  <article
                    key={project.id}
                    className="blog-card project-card-blog home-portfolio-card"
                    data-card-link={href}
                    tabIndex={0}
                    data-category={project.category}
                  >
                    <div className="blog-card__media">
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={getMediaAlt(project.previewImage, project.title)}
                          loading="lazy"
                          decoding="async"
                        />
                      ) : null}
                    </div>
                    <div className="blog-card__body">
                      <h2>{project.title}</h2>
                      <p>{project.summary}</p>
                      {visibleTags.length ? (
                        <div className="project-card-blog__tags">
                          {visibleTags.map((tag) => (
                            <span key={tag.id ?? tag.label}>{tag.label}</span>
                          ))}
                        </div>
                      ) : null}
                    </div>
                    <a href={href}>
                      Подробнее <span aria-hidden="true">→</span>
                    </a>
                  </article>
                );
              })}
            </div>
          </section>

          <section className="home-plot-lead" aria-labelledby="home-plot-lead-title">
            <div className="home-plot-lead__content">
              <span className="home-plot-lead__eyebrow">Подбор участка</span>
              <h2 id="home-plot-lead-title">Поможем подобрать участок</h2>
              <p>
                Расскажите, каким вы видите будущий участок — подберём подходящие
                варианты под ваш дом и бюджет.
              </p>

              <form
                className="contact-form home-plot-lead__form"
                aria-label="Заявка на подбор участка"
              >
                <input name="name" type="text" placeholder="Имя" aria-label="Имя" />
                <input
                  name="phone"
                  type="tel"
                  placeholder="Телефон *"
                  aria-label="Телефон"
                  required
                />
                <input
                  name="email"
                  type="email"
                  placeholder="E-mail"
                  aria-label="E-mail"
                />
                <textarea
                  name="message"
                  rows={4}
                  placeholder="Ваши пожелания по участку"
                  aria-label="Ваши пожелания по участку"
                />
                <input type="hidden" name="service" value="Подбор участка" />

                <label className="home-plot-lead__consent">
                  <input type="checkbox" name="privacy" required />
                  <span>
                    Согласен на{" "}
                    <Link href="/privacy">обработку персональных данных</Link>
                  </span>
                </label>

                <button type="submit" disabled>
                  Отправить заявку
                </button>
                <p className="contact-form__status" aria-live="polite" />
              </form>
            </div>

            <div className="home-plot-lead__media">
              <img
                src={plotLeadImageUrl}
                alt={getMediaAlt(
                  plotLeadMedia,
                  plotLeadProject?.title || "Загородный дом на участке",
                )}
                loading="lazy"
                decoding="async"
              />
            </div>
          </section>

          <section
            id="reviews"
            className="home-section home-reviews home-video-reviews"
            aria-labelledby="home-reviews-title"
            data-home-services-carousel
          >
            <div className="home-video-reviews__head">
              <div>
                <span className="section__kicker">{sectionEyebrows.reviews || "Отзывы"}</span>
                <h2 id="home-reviews-title">
                  {sectionHeadings.reviews ||
                    "Отзывы клиентов о строительстве домов и ремонте помещений"}
                </h2>
              </div>
              <div className="home-video-reviews__actions" aria-label="Навигация по отзывам">
                <button
                  className="home-video-reviews__all"
                  type="button"
                  data-video-stories-open
                  disabled={!videoReviews.length}
                >
                  Перейти в отзывы <span aria-hidden="true">→</span>
                </button>
                <button
                  className="home-video-reviews__arrow"
                  type="button"
                  aria-label="Предыдущие отзывы"
                  data-slider-prev
                >
                  ‹
                </button>
                <button
                  className="home-video-reviews__arrow"
                  type="button"
                  aria-label="Следующие отзывы"
                  data-slider-next
                >
                  ›
                </button>
              </div>
            </div>

            <div className="home-video-reviews__track js-wheel-slider">
              {videoReviews.length
                ? videoReviews.map((review, index) => (
                    <article
                      className="home-review-video-card"
                      key={`${review.name}-${index}`}
                    >
                      <button
                        className="home-review-video-card__open"
                        type="button"
                        data-video-story-open={index}
                        aria-label={`Смотреть видеоотзыв: ${review.name}`}
                      >
                        {review.posterUrl ? (
                          <img
                            src={review.posterUrl}
                            alt={`Видеоотзыв: ${review.name}`}
                            loading="lazy"
                            decoding="async"
                          />
                        ) : (
                          <video
                            src={review.videoUrl}
                            preload="metadata"
                            playsInline
                            muted
                          />
                        )}
                        <span className="home-review-video-card__play" aria-hidden="true">
                          <span />
                        </span>
                      </button>
                    </article>
                  ))
                : Array.from({ length: 4 }, (_, index) => (
                    <article
                      className="home-review-video-card home-review-video-card--placeholder"
                      key={`review-placeholder-${index}`}
                    >
                      <div>
                        <span className="home-review-video-card__play" aria-hidden="true">
                          <span />
                        </span>
                        <small>Добавьте видеоотзыв в Payload</small>
                      </div>
                    </article>
                  ))}
            </div>
          </section>

          {videoReviews.length ? (
            <div className="video-stories" data-video-stories hidden>
              <button
                className="video-stories__backdrop"
                type="button"
                aria-label="Закрыть просмотр"
                data-video-stories-close
              />
              <div
                className="video-stories__panel"
                role="dialog"
                aria-modal="true"
                aria-label="Видеоотзывы клиентов"
              >
                <button
                  className="video-stories__close"
                  type="button"
                  aria-label="Закрыть"
                  data-video-stories-close
                >
                  ×
                </button>
                <div className="video-stories__track" data-video-stories-track>
                  {videoReviews.map((review, index) => (
                    <section
                      className="video-stories__slide"
                      data-video-story-slide={index}
                      key={`${review.name}-story`}
                    >
                      <div className="video-stories__frame">
                        <video
                          src={review.videoUrl}
                          poster={review.posterUrl || undefined}
                          controls
                          playsInline
                          preload="metadata"
                        />
                      </div>
                      <div className="video-stories__caption">
                        <strong>{review.name}</strong>
                        {review.caption ? <span>{review.caption}</span> : null}
                      </div>
                    </section>
                  ))}
                </div>
              </div>
            </div>
          ) : null}

          {faqItems.length ? (
            <section className="home-section home-faq" aria-labelledby="home-faq-title">
              <div className="home-section__head home-section__head--compact">
                <div>
                  <span className="section__kicker">{sectionEyebrows.faq || "Ответы на частые вопросы"}</span>
                  <h2 id="home-faq-title">{sectionHeadings.faq || "FAQ"}</h2>
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
