import { BodyClassName } from "@/site/BodyClassName";
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

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Адамант",
};

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
    title: "Заявка и консультация",
    text: "Фиксируем задачу, пожелания по дому, участку, срокам и бюджету.",
  },
  {
    title: "Проект и смета",
    text: "Подбираем технологию, материалы и готовим прозрачный расчет работ.",
  },
  {
    title: "Строительство",
    text: "Ведем объект по этапам, контролируем качество и показываем ход работ.",
  },
  {
    title: "Сдача дома",
    text: "Передаем готовый объект, документы и рекомендации по эксплуатации.",
  },
];

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
  const featuredProjects = portfolioItems.slice(0, 4);
  const faqItems = aboutPage.faqItems?.slice(0, 4) ?? [];

  return (
    <>
      <BodyClassName className="home-page" />
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
              <img className="visual-panel__image visual-panel__image--base" src="/main1.jpg" alt="" />
              <img className="visual-panel__image visual-panel__image--lit" src="/main2.jpg" alt="" />
            </div>
          </section>

          <div className="stats" aria-label="Показатели компании">
            {stats.map((stat, index) => (
              <div className="stat" key={stat.id ?? `${stat.value}-${stat.label}`}>
                <span className="stat__icon" aria-hidden="true">
                  <img src={statIconPaths[index] ?? statIconPaths[0]} alt="" />
                </span>
                <div>
                  <strong data-count-up data-count-up-target={stat.value}>
                    {getCountStartValue(stat.value)}
                  </strong>
                  <span>{stat.label}</span>
                </div>
              </div>
            ))}
          </div>

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
              {featuredProjects.map((project, index) => {
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
          <section className="home-section home-services" aria-labelledby="home-services-title">
            <div className="home-section__head">
              <div>
                <span className="section__kicker">Наши проекты</span>
                <h2 id="home-services-title">Современные дома для комфортной жизни</h2>
              </div>
              <div className="home-section__aside">
                <p>
                Подбираем технологию, проект и состав работ под участок, бюджет
                и реальный сценарий жизни за городом.
                </p>
                <a className="home-section__link" href="/services">
                  Смотреть все проекты <span aria-hidden="true">→</span>
                </a>
              </div>
            </div>

            <div className="home-services-carousel" data-home-services-carousel>
              <button
                className="home-services-carousel__arrow home-services-carousel__arrow--prev"
                type="button"
                aria-label="Предыдущие услуги"
                data-slider-prev
              >
                <span aria-hidden="true">‹</span>
              </button>
              <div
                className="home-card-grid home-card-grid--services home-services-slider js-wheel-slider"
                aria-label="Слайдер услуг"
                tabIndex={0}
              >
                {services.map((service) => {
                  const catalogItem = catalogByTitle.get(service.title);
                  const href = catalogItem
                    ? `/catalog-item?item=${encodeURIComponent(catalogItem.itemKey)}&source=services`
                    : "/services";
                  const imageUrl =
                    getMediaUrl(service.previewImage, "card") || getMediaUrl(service.previewImage);

                  return (
                    <article
                      key={service.id}
                      className="home-card"
                      data-card-link={href}
                      tabIndex={0}
                    >
                      {imageUrl ? (
                        <img src={imageUrl} alt={getMediaAlt(service.previewImage, service.title)} />
                      ) : null}
                      <div className="home-card__shade" />
                      <div className="home-card__content">
                        <h3>{service.title}</h3>
                        <p>{service.shortDescription}</p>
                        <span>{servicePrices[service.title] || "Цена по запросу"}</span>
                      </div>
                      <a href={href}>
                        Подробнее <span aria-hidden="true">→</span>
                      </a>
                    </article>
                  );
                })}
              </div>
              <button
                className="home-services-carousel__arrow home-services-carousel__arrow--next"
                type="button"
                aria-label="Следующие услуги"
                data-slider-next
              >
                <span aria-hidden="true">›</span>
              </button>
            </div>

          </section>

          <section className="home-section home-selector" aria-labelledby="home-selector-title">
            <div className="home-selector__layout">
              <div className="home-selector__copy">
                <span className="section__kicker">Почему выбирают нас</span>
                <h2 id="home-selector-title">Надежность, качество и прозрачность на каждом этапе</h2>
                <p>
                  Фиксируем смету без скрытых платежей, показываем ход работ,
                  соблюдаем сроки по договору и даем гарантию на конструктив.
                </p>
                <button className="home-section__link home-section__link--button js-open-estimate" type="button">
                  Узнать больше о нас <span aria-hidden="true">→</span>
                </button>
              </div>

              <div className="home-selector__panel" aria-label="Сценарии проекта">
                <article>
                  <span>01</span>
                  <h3>Фиксированная смета</h3>
                  <p>Согласовываем объем работ и стоимость до старта строительства.</p>
                </article>
                <article>
                  <span>02</span>
                  <h3>Поэтапный контроль</h3>
                  <p>Показываем прогресс и качество работ на каждом важном этапе.</p>
                </article>
                <article>
                  <span>03</span>
                  <h3>Гарантия на работы</h3>
                  <p>Остаемся на связи после сдачи дома и закрываем гарантийные вопросы.</p>
                </article>
              </div>

              <div className="home-selector__image" aria-hidden="true">
                <img src="/фон.jpg" alt="" />
              </div>
            </div>
          </section>

          <section className="home-section home-projects" aria-labelledby="home-projects-title">
            <div className="home-section__head">
              <div>
                <span className="section__kicker">Проекты</span>
                <h2 id="home-projects-title">Готовые решения и реализованные дома</h2>
              </div>
              <div className="home-section__aside">
                <p>
                Показываем примеры домов, планировок и направлений, чтобы посетитель быстрее
                понимал формат работ и переходил к заявке.
                </p>
                <a className="home-section__link" href="/portfolio">
                  Портфолио <span aria-hidden="true">→</span>
                </a>
              </div>
            </div>

            <div className="home-card-grid home-card-grid--projects">
              {featuredProjects.map((project) => {
                const catalogItem = catalogByTitle.get(project.title);
                const href = catalogItem
                  ? `/catalog-item?item=${encodeURIComponent(catalogItem.itemKey)}&source=portfolio`
                  : "/portfolio";
                const imageUrl =
                  getMediaUrl(project.previewImage, "card") || getMediaUrl(project.previewImage);

                return (
                  <article
                    key={project.id}
                    className="home-card home-card--project"
                    data-card-link={href}
                    tabIndex={0}
                  >
                    {imageUrl ? (
                      <img src={imageUrl} alt={getMediaAlt(project.previewImage, project.title)} />
                    ) : null}
                    <div className="home-card__shade" />
                    <div className="home-card__content">
                      <h3>{project.title}</h3>
                      <p>{project.summary}</p>
                    </div>
                    <a href={href}>
                      Смотреть проект <span aria-hidden="true">→</span>
                    </a>
                  </article>
                );
              })}
            </div>
          </section>

          <section className="home-section home-process" aria-labelledby="home-process-title" data-stagger-reveal>
            <div className="home-section__head home-section__head--narrow">
              <div>
                <span className="section__kicker">Этапы работ</span>
                <h2 id="home-process-title">Прозрачный процесс от идеи до вашего дома</h2>
              </div>
              <div className="home-section__aside">
                <p>
                Короткий сценарий сотрудничества помогает закрыть базовые вопросы еще до звонка.
                </p>
                <button className="home-section__link home-section__link--button js-open-estimate" type="button">
                  Обсудить проект <span aria-hidden="true">→</span>
                </button>
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

          {faqItems.length ? (
            <section className="home-section home-faq" aria-labelledby="home-faq-title">
              <div className="home-section__head">
                <div>
                  <span className="section__kicker">FAQ</span>
                  <h2 id="home-faq-title">Частые вопросы перед строительством</h2>
                </div>
                <div className="home-section__aside">
                  <p>
                  Ответы берутся из раздела «О нас», поэтому их можно менять через админку
                  без правки кода.
                  </p>
                  <a className="home-section__link" href="/about">
                    О компании <span aria-hidden="true">→</span>
                  </a>
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
    </>
  );
}
