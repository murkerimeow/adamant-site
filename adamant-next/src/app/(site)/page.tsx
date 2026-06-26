import {
  getAboutPage,
  getCatalogCategories,
  getCatalogCoverMedia,
  getCatalogItems,
  getCatalogLandingCategorySlug,
  getCompanyStats,
  getHomePage,
  getMediaAlt,
  getMediaUrl,
  getPortfolioCategories,
  getPortfolioCategorySlug,
  getPortfolioItems,
  getReviews,
  getServices,
  getSiteSettings,
  splitHighlight,
} from "@/site/cms";
import { SiteHeader } from "@/site/components/SiteHeader";
import { HomeProjectCategories } from "@/site/components/HomeProjectCategories";
import { HomePortfolioCategories } from "@/site/components/HomePortfolioCategories";
import { formatProjectPrice, getCatalogCardMeta } from "@/site/catalog-meta";
import { getCatalogItemPath, getPortfolioItemPath } from "@/site/routes";
import { createPageMetadata } from "@/site/seo";
import { SocialIcon, socialLinks } from "@/site/socials";
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

const homePortfolioCategories = [
  { label: "Построенные дома", value: "built-houses" },
  {
    label: "Построенные коммерческие объекты",
    value: "commercial-buildings",
  },
  { label: "Ремонт квартир", value: "apartment-renovation" },
  {
    label: "Отделка коммерческих помещений",
    value: "commercial-finishing",
  },
];

function getHomePortfolioCategory(project: {
  category?: unknown;
  description?: string | null;
  summary: string;
  tags?: { label: string }[] | null;
  title: string;
}) {
  const payloadCategory = getPortfolioCategorySlug(project);

  if (payloadCategory) {
    return payloadCategory;
  }

  const searchText = [
    project.title,
    project.summary,
    project.description,
    ...(project.tags?.map((tag) => tag.label) ?? []),
  ]
    .filter(Boolean)
    .join(" ")
    .toLocaleLowerCase("ru");

  if (/ремонт\W*квартир|квартир\W*ремонт/.test(searchText)) {
    return "apartment-renovation";
  }

  if (
    /отделк.*коммерч|коммерч.*отделк|музей|офис|торгов.*помещ/.test(
      searchText,
    )
  ) {
    return "commercial-finishing";
  }

  if (/коммерческ.*объект|склад|производственн.*здан/.test(searchText)) {
    return "commercial-buildings";
  }

  if (/дом|коттедж|каркас|газобетон|брус/.test(searchText)) {
    return "built-houses";
  }

  return "built-houses";
}

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

export default async function HomePage() {
  const [siteSettings, homePage, services, portfolioItems, portfolioCategories, catalogItems, catalogCategories, aboutPage, payloadReviews] = await Promise.all([
    getSiteSettings(),
    getHomePage(),
    getServices(),
    getPortfolioItems(),
    getPortfolioCategories(),
    getCatalogItems(),
    getCatalogCategories(),
    getAboutPage(),
    getReviews(),
  ]);

  const stats: HomeStat[] = getHomeStats(homePage, getCompanyStats(siteSettings, "home"));
  const description = splitHighlight(homePage.heroDescription);
  const catalogByTitle = new Map(catalogItems.map((item) => [item.title, item]));
  const cycleServices = services.filter((service) => service.showOnServicesPage !== false);
  const featuredProjects = catalogItems.filter((item) => item.showInCatalog);
  const projectsByCategorySlug = new Map<string, typeof featuredProjects>();

  featuredProjects.forEach((project) => {
    const categorySlug = getCatalogLandingCategorySlug(project);

    if (!categorySlug) return;

    const projects = projectsByCategorySlug.get(categorySlug);

    if (projects) {
      projects.push(project);
    } else {
      projectsByCategorySlug.set(categorySlug, [project]);
    }
  });

  const homeProjectsByCategory: typeof featuredProjects = [];

  catalogCategories.forEach((category) => {
    const project = projectsByCategorySlug.get(category.slug)?.[0];

    if (project) {
      homeProjectsByCategory.push(project);
    }
  });

  const balancedHomeProjects = [
    ...homeProjectsByCategory,
    ...featuredProjects.filter(
      (project) => !homeProjectsByCategory.some((homeProject) => homeProject.id === project.id),
    ),
  ].slice(0, 6);

  const defaultHomeProjectIds = new Set(balancedHomeProjects.map((project) => project.id));
  const homeProjects = featuredProjects.filter((project) =>
    Boolean(getCatalogLandingCategorySlug(project)),
  );
  const featuredProjectCategorySlugs = new Set(
    homeProjects.map((project) => getCatalogLandingCategorySlug(project)).filter(Boolean),
  );
  const featuredProjectCategories = catalogCategories
    .filter((category) => featuredProjectCategorySlugs.has(category.slug))
    .slice(0, 6);
  const portfolioStripItems = portfolioItems;
  const portfolioTabs = portfolioCategories.length
    ? portfolioCategories.map((category) => ({
        label: category.title,
        value: category.slug,
      }))
    : homePortfolioCategories;
  const faqItems = aboutPage.faqItems?.slice(0, 4) ?? [];
  const reviews = payloadReviews.length ? payloadReviews : [];
  const homeHeroImageUrl =
    getMediaUrl(homePage.heroImage) ||
    getMediaUrl(homePage.heroImage, "card") ||
    "/home-main-2.png";
  const videoReviews = reviews
    .map((review) => ({
      caption: review.caption?.trim() || review.text?.trim() || "",
      name: review.name,
      posterUrl:
        getMediaUrl(review.poster) ||
        getMediaUrl(review.poster, "card") ||
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
                src={homeHeroImageUrl}
                alt=""
                loading="eager"
                decoding="async"
                fetchPriority="high"
              />
              <img
                className="visual-panel__image visual-panel__image--lit"
                src={homeHeroImageUrl}
                alt=""
                loading="eager"
                decoding="async"
              />
            </div>
          </section>

          <section className="home-about-stats" aria-labelledby="home-about-stats-title">
            <div className="home-about-stats__visual">
              <img src="/main1.jpg" alt="Современный загородный дом компании АДАМАНТ Строй" />
              <div className="home-about-stats__socials">
                <strong>Наши соцсети</strong>
                <div aria-label="Социальные сети">
                  {socialLinks.map((social) => (
                    <a
                      key={social.key}
                      href={social.href}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={social.label}
                      title={social.label}
                    >
                      <SocialIcon name={social.key} />
                    </a>
                  ))}
                </div>
              </div>
            </div>

            <div className="home-about-stats__content">
              <div className="home-about-stats__copy">
                <span className="home-about-stats__eyebrow">{sectionEyebrows.about || "О нас"}</span>
                <h2 id="home-about-stats-title">
                  {sectionHeadings.about || "О компании «АДАМАНТ Строй»"}
                </h2>
                <p>
                  Проектируем и строим современные загородные дома в Санкт-Петербурге
                  и Ленинградской области. Берем на себя весь процесс — от идеи и расчета
                  сметы до строительства под ключ.
                </p>
                <div className="home-about-stats__mobile-socials">
                  <strong>Наши соцсети</strong>
                  <div aria-label="Социальные сети">
                    {socialLinks.map((social) => (
                      <a
                        key={`mobile-${social.key}`}
                        href={social.href}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={social.label}
                        title={social.label}
                      >
                        <SocialIcon name={social.key} tone="white" />
                      </a>
                    ))}
                  </div>
                </div>
                <div className="home-about-stats__cta">
                  <Link href="/about">Подробнее о нас</Link>
                </div>
              </div>

              <div className="home-about-stats__grid" aria-label="Показатели компании">
                {stats.slice(0, 4).map((stat, index) => (
                  <div className="home-about-stat" key={stat.id ?? `${stat.value}-${stat.label}`}>
                    <strong>{stat.value}</strong>
                    <span>{stat.label}</span>
                    <img
                      src={["/500+.png", "/1 день.png", "/2000+.png", "/15 лет.png"][index]}
                      alt=""
                      aria-hidden="true"
                    />
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section
            className="home-section home-project-preview home-project-preview--catalog-style"
            aria-labelledby="home-project-preview-title"
            data-home-services-carousel
            data-home-projects
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

            <HomeProjectCategories categories={featuredProjectCategories} />

            <div className="home-project-preview__grid js-wheel-slider">
              {homeProjects.map((project) => {
                const href = getCatalogItemPath(project);
                const coverMedia = getCatalogCoverMedia(project);
                const imageUrl =
                  getMediaUrl(coverMedia) || getMediaUrl(coverMedia, "card");
                const nightImageUrl =
                  getMediaUrl(project.nightImage) ||
                  getMediaUrl(project.nightImage, "card");
                const meta = getCatalogCardMeta(project);
                const description = project.cardSummary || project.description;

                return (
                  <article
                    key={project.id}
                    className="home-project-card listing-card"
                    data-card-link={href}
                    data-home-project-default={defaultHomeProjectIds.has(project.id) ? "true" : "false"}
                    data-home-project-category={getCatalogLandingCategorySlug(project)}
                    hidden={!defaultHomeProjectIds.has(project.id)}
                    tabIndex={0}
                  >
                    {imageUrl ? (
                      <img
                        className="home-project-card__background home-project-card__background--day"
                        src={imageUrl}
                        alt={getMediaAlt(coverMedia, project.title)}
                        loading="lazy"
                        decoding="async"
                      />
                    ) : null}
                    {nightImageUrl ? (
                      <img
                        className="home-project-card__background home-project-card__background--night"
                        src={nightImageUrl}
                        alt=""
                        aria-hidden="true"
                        loading="lazy"
                        decoding="async"
                      />
                    ) : null}

                    <div className="listing-card__body home-project-card__content-overlay">
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
                        {meta.price > 0 ? (
                          <>
                            <span>от</span>
                            {formatProjectPrice(meta.price)} ₽
                          </>
                        ) : (
                          "Цена по запросу"
                        )}
                      </strong>
                      <a className="listing-card__button" href={href} aria-label={`Подробнее: ${project.title}`}>
                        Подробнее
                      </a>
                    </div>
                  </article>
                );
              })}
            </div>
            <Link className="home-project-preview__more" href="/catalog">
              Показать больше
            </Link>
            <Link className="home-mobile-section-link" href="/catalog">
              Перейти в проекты
            </Link>
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
                const serviceHref = `${href}${href.includes("?") ? "&" : "?"}service=${encodeURIComponent(service.title)}`;
                const imageUrl = getMediaUrl(service.previewImage);

                return (
                  <article
                    key={service.id}
                    className={`home-cycle-card home-cycle-card--tone-${(index % 4) + 1}`}
                    data-card-link={serviceHref}
                    data-estimate-service={service.title}
                    tabIndex={0}
                  >
                    <a
                      className="home-cycle-card__media"
                      href={serviceHref}
                      data-estimate-service-link
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
                        href={serviceHref}
                        data-estimate-service-link
                        aria-label={`Подробнее об услуге ${service.title}`}
                      >
                        <span aria-hidden="true">→</span>
                      </a>
                    </div>
                  </article>
                );
              })}
            </div>
            <Link className="home-mobile-section-link" href="/services">
              Перейти в услуги
            </Link>
          </section>

          <aside
            className="home-social-banner home-mortgage-banner"
            aria-labelledby="home-mortgage-banner-title"
          >
            <div className="home-social-banner__content home-mortgage-banner__content">
              <span className="home-social-banner__eyebrow">Будьте в курсе</span>
              <h2 id="home-mortgage-banner-title">Постройте дом в ипотеку</h2>
              <p>
                Поможем подобрать банк, подготовить документы и пройти согласование
                для строительства дома под ключ
              </p>
              <div className="home-mortgage-banner__actions">
                <Link className="home-mortgage-banner__primary" href="/mortgage">
                  Перейти в раздел
                </Link>
                <Link
                  className="home-mortgage-banner__secondary"
                  href="/mortgage#mortgage-calculator"
                >
                  Ипотечный калькулятор
                </Link>
              </div>
              <div className="home-mortgage-banner__banks" aria-label="Банки-партнеры">
                <span className="home-mortgage-banner__bank home-mortgage-banner__bank--sber">
                  СБЕР
                </span>
                <span className="home-mortgage-banner__bank home-mortgage-banner__bank--vtb">
                  ВТБ
                </span>
                <span className="home-mortgage-banner__bank home-mortgage-banner__bank--tbank">
                  Т-БАНК
                </span>
              </div>
            </div>
          </aside>

          <section
            className="home-section home-portfolio-showcase"
            aria-labelledby="home-portfolio-title"
            data-home-services-carousel
            data-home-portfolio
          >
            <div className="home-section__head home-section__head--compact">
              <div>
                <span className="section__kicker">{sectionEyebrows.portfolio || "Портфолио"}</span>
                <h2 id="home-portfolio-title">
                  {sectionHeadings.portfolio &&
                  sectionHeadings.portfolio !== "Реализованные проекты"
                    ? sectionHeadings.portfolio
                    : "Выполненные работы компании «АДАМАНТ Строй»"}
                </h2>
              </div>
              <div className="home-portfolio-showcase__actions" aria-label="Навигация по портфолио">
                <Link className="home-section__link" href="/portfolio">
                  Перейти в проекты <span aria-hidden="true">→</span>
                </Link>
                <button
                  className="home-project-preview__arrow"
                  type="button"
                  aria-label="Предыдущие работы"
                  data-slider-prev
                >
                  ‹
                </button>
                <button
                  className="home-project-preview__arrow"
                  type="button"
                  aria-label="Следующие работы"
                  data-slider-next
                >
                  ›
                </button>
              </div>
            </div>

            <HomePortfolioCategories categories={portfolioTabs} />

            <div className="home-portfolio-strip js-wheel-slider">
              {portfolioStripItems.map((project) => {
                const href = getPortfolioItemPath(project);
                const imageUrl =
                  getMediaUrl(project.previewImage, "card") ||
                  getMediaUrl(project.previewImage);
                const category = getHomePortfolioCategory(project);

                return (
                  <article
                    key={project.id}
                    className="home-portfolio-card"
                    data-card-link={href}
                    data-portfolio-category={category}
                    tabIndex={0}
                  >
                    <a
                      className="home-portfolio-card__media"
                      href={href}
                      aria-label={project.title}
                    >
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={getMediaAlt(project.previewImage, project.title)}
                          loading="lazy"
                          decoding="async"
                        />
                      ) : null}
                      {project.location ? (
                        <span className="home-portfolio-card__location">
                          <svg viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M12 21s6-5.1 6-11a6 6 0 1 0-12 0c0 5.9 6 11 6 11Z" />
                            <circle cx="12" cy="10" r="2" />
                          </svg>
                          {project.location}
                        </span>
                      ) : null}
                    </a>
                    <h3>
                      <a href={href}>{project.title}</a>
                    </h3>
                  </article>
                );
              })}
            </div>
            <p className="home-portfolio-empty" data-portfolio-empty hidden>
              В этой категории пока нет опубликованных работ.
            </p>
            <Link className="home-mobile-section-link" href="/portfolio">
              Перейти в проекты
            </Link>
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
                src="/plot-selection.png"
                alt="Загородный участок для строительства дома"
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
                <Link
                  className="home-video-reviews__all"
                  href="/blog"
                >
                  Перейти в отзывы <span aria-hidden="true">→</span>
                </Link>
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
                ? videoReviews.map((review) => (
                    <article
                      className="home-review-video-card"
                      key={`${review.name}-${review.videoUrl}`}
                    >
                      <video
                        className="home-review-video-card__media"
                        src={review.videoUrl}
                        poster={review.posterUrl || undefined}
                        controls
                        playsInline
                        preload="metadata"
                        aria-label={`Видеоотзыв: ${review.name}`}
                      />
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
            <Link
              className="home-mobile-section-link"
              href="/blog"
            >
              Перейти в отзывы
            </Link>
          </section>

          {faqItems.length ? (
            <section className="home-section home-faq" aria-labelledby="home-faq-title">
              <div className="home-section__head home-section__head--compact">
                <div>
                  <span className="section__kicker">{sectionEyebrows.faq || "Ответы на частые вопросы"}</span>
                  <h2 id="home-faq-title">{sectionHeadings.faq || "FAQ"}</h2>
                </div>
                <Link className="home-faq__head-link" href="/about">
                  Перейти в FAQ <span aria-hidden="true">→</span>
                </Link>
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
              <Link className="home-mobile-section-link" href="/about">
                Перейти в FAQ
              </Link>
            </section>
          ) : null}

          <aside className="home-social-banner" aria-labelledby="home-social-banner-title">
            <div className="home-social-banner__content">
              <span className="home-social-banner__eyebrow">Будьте в курсе</span>
              <h2 id="home-social-banner-title">
                Подписывайтесь на
                <br />
                наши социальные сети
              </h2>
              <p>Мы есть практически во всех популярных социальных сетях</p>
              <div className="home-social-banner__links" aria-label="Социальные сети">
                {socialLinks.map((social) => (
                  <a
                    key={social.key}
                    href={social.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={social.label}
                    title={social.label}
                  >
                    <SocialIcon name={social.key} />
                  </a>
                ))}
              </div>
            </div>
          </aside>
        </main>
      </div>
    </div>
  );
}
