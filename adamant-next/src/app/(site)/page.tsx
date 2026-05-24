import {
  getAboutPage,
  getCatalogItems,
  getHomePage,
  getMediaAlt,
  getMediaUrl,
  getPortfolioItems,
  getServices,
  getSiteSettings,
  splitHighlight,
} from "@/site/cms";
import { SiteHeader } from "@/site/components/SiteHeader";
import { createPageMetadata } from "@/site/seo";

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

const projectCardMeta = [
  {
    specs: ["120 м²", "4 комнаты"],
    price: "от 6 200 000 ₽",
  },
  {
    specs: ["150 м²", "5 комнат"],
    price: "от 7 800 000 ₽",
  },
  {
    specs: ["100 м²", "3 комнаты"],
    price: "от 5 400 000 ₽",
  },
] as const;

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

function getCountStartValue(value: string) {
  const match = value.trim().match(/^(\D*?)(\d[\d\s]*)(.*)$/);

  if (!match) {
    return value;
  }

  const suffix = match[3].trimStart();
  const spacer = suffix && !suffix.startsWith("+") ? " " : "";

  return `${match[1]}0${spacer}${suffix}`;
}

export default async function HomePage() {
  const [siteSettings, homePage, services, portfolioItems, catalogItems, aboutPage] = await Promise.all([
    getSiteSettings(),
    getHomePage(),
    getServices(),
    getPortfolioItems(),
    getCatalogItems(),
    getAboutPage(),
  ]);

  const stats = homePage.stats ?? [];
  const description = splitHighlight(homePage.heroDescription);
  const catalogByTitle = new Map(catalogItems.map((item) => [item.title, item]));
  const featuredServices = services.slice(0, 3);
  const cycleServices = services.slice(0, 4);
  const featuredShowreelProjects = portfolioItems.slice(0, 3);
  const featuredProjects = catalogItems.filter((item) => item.showInCatalog).slice(0, 8);
  const portfolioStripItems = portfolioItems.slice(0, 6);
  const trustImageUrl =
    getMediaUrl(portfolioStripItems[0]?.previewImage, "card") ||
    getMediaUrl(portfolioStripItems[0]?.previewImage) ||
    "/фон.jpg";
  const faqItems = aboutPage.faqItems?.slice(0, 4) ?? [];

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
                <a className="projects-link" href="/catalog">
                  Смотреть проекты <span aria-hidden="true">→</span>
                </a>
              </div>
            </div>

            <div className="visual-panel hero-visual" aria-hidden="true">
              <img className="visual-panel__image visual-panel__image--base" src="/home-main-new.webp" alt="" />
              <img className="visual-panel__image visual-panel__image--lit" src="/home-main-new.webp" alt="" />
            </div>
          </section>

          <section className="home-about-stats" aria-labelledby="home-about-stats-title">
            <div className="home-about-stats__copy">
              <h2 id="home-about-stats-title">О нас</h2>
              <p>
                Проектируем и строим современные загородные дома в Санкт-Петербурге
                и Ленинградской области. Берем на себя путь от идеи и сметы до
                строительства под ключ, чтобы заказчик заранее видел сроки, бюджет
                и понятный результат.
              </p>
            </div>

            <div className="home-about-stats__grid" aria-label="Показатели компании">
              {stats.slice(0, 4).map((stat) => (
                <div className="home-about-stat" key={stat.id ?? `${stat.value}-${stat.label}`}>
                  <strong data-count-up data-count-up-target={stat.value}>
                    {getCountStartValue(stat.value)}
                  </strong>
                  <span>{stat.label}</span>
                </div>
              ))}
            </div>
          </section>

          {false ? (
            <>
          <section className="home-redesign home-studio" aria-labelledby="home-studio-title">
            <div className="home-studio__grid">
              <div className="home-studio__intro">
                <span className="section__kicker">Формат работы</span>
                <h2 id="home-studio-title">Не каталог домов, а проектная сборка под задачу</h2>
                <p>
                  Сначала фиксируем сценарий жизни, бюджет и ограничения участка. Затем собираем
                  подходящую технологию, состав работ и понятный маршрут до готового дома.
                </p>

                <div className="home-studio__facts" aria-label="Показатели">
                  {stats.slice(0, 4).map((stat) => (
                    <div key={stat.id ?? `${stat.value}-${stat.label}`}>
                      <strong>{stat.value}</strong>
                      <span>{stat.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="home-studio__services">
                {featuredServices.map((service, index) => {
                  const catalogItem = catalogByTitle.get(service.title);
                  const href = catalogItem
                    ? `/catalog-item?item=${encodeURIComponent(catalogItem.itemKey)}&source=services`
                    : "/services";
                  const imageUrl =
                    getMediaUrl(service.previewImage, "card") || getMediaUrl(service.previewImage);

                  return (
                    <article
                      key={service.id}
                      className="home-studio-card"
                      data-card-link={href}
                      tabIndex={0}
                    >
                      <span className="home-studio-card__index">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <div className="home-studio-card__media">
                        {imageUrl ? (
                          <img src={imageUrl} alt={getMediaAlt(service.previewImage, service.title)} />
                        ) : null}
                      </div>
                      <div className="home-studio-card__body">
                        <h3>{service.title}</h3>
                        <p>{service.shortDescription}</p>
                        <strong>{servicePrices[service.title] || "Цена по запросу"}</strong>
                      </div>
                      <a href={href}>
                        Подробнее <span aria-hidden="true">→</span>
                      </a>
                    </article>
                  );
                })}
              </div>
            </div>
          </section>

          <section className="home-redesign home-showreel" aria-labelledby="home-showreel-title">
            <div className="home-showreel__top">
              <div>
                <span className="section__kicker">Объекты</span>
                <h2 id="home-showreel-title">Дома, которые выглядят по-разному, но считаются одинаково прозрачно</h2>
              </div>
              <a className="home-section__link" href="/portfolio">
                Смотреть портфолио <span aria-hidden="true">→</span>
              </a>
            </div>

            <div className="home-showreel__grid">
              {featuredShowreelProjects.map((project, index) => {
                const catalogItem = catalogByTitle.get(project.title);
                const href = catalogItem
                  ? `/catalog-item?item=${encodeURIComponent(catalogItem.itemKey)}&source=portfolio`
                  : "/portfolio";
                const imageUrl =
                  getMediaUrl(project.previewImage, "card") || getMediaUrl(project.previewImage);

                return (
                  <article
                    key={project.id}
                    className={`home-showreel-card home-showreel-card--${index + 1}`}
                    data-card-link={href}
                    tabIndex={0}
                  >
                    {imageUrl ? (
                      <img src={imageUrl} alt={getMediaAlt(project.previewImage, project.title)} />
                    ) : null}
                    <div className="home-showreel-card__content">
                      <span>{project.category === "classic" ? "Классический" : "Современный"}</span>
                      <h3>{project.title}</h3>
                      <p>{project.summary}</p>
                    </div>
                    <a href={href} aria-label={`Смотреть проект ${project.title}`}>
                      →
                    </a>
                  </article>
                );
              })}
            </div>
          </section>

          <section className="home-redesign home-route" aria-labelledby="home-route-title">
            <div className="home-route__board">
              <div className="home-route__lead">
                <span className="section__kicker">Маршрут проекта</span>
                <h2 id="home-route-title">От идеи до дома без хаоса в решениях</h2>
                <p>
                  Каждый этап привязан к результату: понятная смета, согласованный проект,
                  контролируемое строительство и спокойная приемка.
                </p>
                <button className="home-section__link home-section__link--button js-open-estimate" type="button">
                  Оставить заявку <span aria-hidden="true">→</span>
                </button>
              </div>

              <div className="home-route__steps">
                {processSteps.map((step, index) => (
                  <article key={step.title}>
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <div>
                      <h3>{step.title}</h3>
                      <p>{step.text}</p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>

          {faqItems.length ? (
            <section className="home-redesign home-questions" aria-labelledby="home-questions-title">
              <div className="home-questions__head">
                <span className="section__kicker">Вопросы</span>
                <h2 id="home-questions-title">Что обычно уточняют до первой встречи</h2>
              </div>

              <div className="home-questions__list">
                {faqItems.map((item, index) => (
                  <details
                    className="faq-item home-questions__item"
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

            </>
          ) : null}

          {true ? (
            <>
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
                <a className="home-section__link" href="/catalog">
                  Смотреть все проекты <span aria-hidden="true">→</span>
                </a>
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
              {featuredProjects.map((project, index) => {
                const href = `/catalog-item?item=${encodeURIComponent(project.itemKey)}&source=catalog`;
                const imageUrl =
                  getMediaUrl(project.previewImage, "card") || getMediaUrl(project.previewImage);
                const meta = projectCardMeta[index] ?? projectCardMeta[0];

                return (
                  <article
                    key={project.id}
                    className="home-project-card"
                    data-card-link={href}
                    tabIndex={0}
                  >
                    <a className="home-project-card__media" href={href} aria-label={`Смотреть проект ${project.title}`}>
                      {imageUrl ? (
                        <img src={imageUrl} alt={getMediaAlt(project.previewImage, project.title)} />
                      ) : null}
                      <span className="home-project-card__badges">
                        {meta.specs.map((spec) => (
                          <span key={spec}>{spec}</span>
                        ))}
                      </span>
                    </a>
                    <div className="home-project-card__body">
                      <h3>{project.title}</h3>
                      <p>{project.cardSummary || project.description}</p>
                      <strong>{meta.price}</strong>
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
              <img src={trustImageUrl} alt="" />
              <div className="home-trust__badge">
                <strong>Гарантия до 5 лет</strong>
                <span>На все виды работ и конструктив</span>
              </div>
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
                const href = catalogItem
                  ? `/catalog-item?item=${encodeURIComponent(catalogItem.itemKey)}&source=services`
                  : "/services";
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
                        <img src={imageUrl} alt={getMediaAlt(service.previewImage, service.title)} />
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
                const catalogItem = catalogByTitle.get(project.title);
                const href = catalogItem
                  ? `/catalog-item?item=${encodeURIComponent(catalogItem.itemKey)}&source=portfolio`
                  : "/portfolio";
                const imageUrl =
                  getMediaUrl(project.previewImage, "thumb") ||
                  getMediaUrl(project.previewImage, "card") ||
                  getMediaUrl(project.previewImage);

                return (
                  <a key={project.id} className="home-portfolio-thumb" href={href}>
                    {imageUrl ? (
                      <img src={imageUrl} alt={getMediaAlt(project.previewImage, project.title)} />
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
              {reviewCards.map((review) => (
                <article className="home-review-card" key={review.name}>
                  <div className="home-review-card__person">
                    <span aria-hidden="true">{review.name.slice(0, 1)}</span>
                    <div>
                      <strong>{review.name}</strong>
                      <small>{review.place}</small>
                    </div>
                  </div>
                  <p>{review.text}</p>
                  <div className="home-review-card__stars" aria-label="Оценка 5 из 5">★★★★★</div>
                </article>
              ))}
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
            </>
          ) : null}

        </main>
      </div>
    </div>
  );
}
