import { getSiteSettings } from "@/site/cms";
import { SiteHeader } from "@/site/components/SiteHeader";
import { createPageMetadata } from "@/site/seo";
import Link from "next/link";

export const dynamic = "force-dynamic";

export const metadata = createPageMetadata({
  title: "Услуги Адамант Строй | Строительство домов под ключ",
  description:
    "Строим, проектируем и сопровождаем загородные дома под ключ в Санкт-Петербурге и Ленинградской области: проект, смета, ипотека, ремонт и инженерные системы.",
  path: "/services",
});

type ServicesIconType =
  | "box"
  | "calendar"
  | "chat"
  | "doc"
  | "hardhat"
  | "home"
  | "light"
  | "plan"
  | "shield"
  | "team"
  | "wrench";

function ServicesIcon({ type }: { type: ServicesIconType }) {
  const commonProps = {
    fill: "none",
    stroke: "currentColor",
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    strokeWidth: 1.9,
  };

  if (type === "box") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="m12 3.8 7 4v8.4l-7 4-7-4V7.8l7-4Z" {...commonProps} />
        <path d="m5.4 8 6.6 3.8L18.6 8" {...commonProps} />
        <path d="M12 11.8v8.1" {...commonProps} />
      </svg>
    );
  }

  if (type === "plan") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M6 4.5h12v15H6z" {...commonProps} />
        <path d="M9 8h6" {...commonProps} />
        <path d="M9 11.5h6" {...commonProps} />
        <path d="M9 15h3.5" {...commonProps} />
      </svg>
    );
  }

  if (type === "shield") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 3.8 18.5 6v5.3c0 4.1-2.6 7.6-6.5 8.9-3.9-1.3-6.5-4.8-6.5-8.9V6L12 3.8Z" {...commonProps} />
        <path d="m9.2 12 1.9 1.9 4-4.2" {...commonProps} />
      </svg>
    );
  }

  if (type === "calendar") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M6 6.5h12v12H6z" {...commonProps} />
        <path d="M8.5 4.5v4" {...commonProps} />
        <path d="M15.5 4.5v4" {...commonProps} />
        <path d="M6 10h12" {...commonProps} />
      </svg>
    );
  }

  if (type === "doc") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M7 4.5h7l3 3v12H7z" {...commonProps} />
        <path d="M14 4.5v3h3" {...commonProps} />
        <path d="M9.5 11h5" {...commonProps} />
        <path d="M9.5 14h5" {...commonProps} />
      </svg>
    );
  }

  if (type === "light") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M9 17h6" {...commonProps} />
        <path d="M10 20h4" {...commonProps} />
        <path d="M8 10a4 4 0 1 1 8 0c0 1.8-.9 2.8-1.8 3.8-.6.7-1.2 1.4-1.2 2.2h-2c0-.8-.6-1.5-1.2-2.2C8.9 12.8 8 11.8 8 10Z" {...commonProps} />
      </svg>
    );
  }

  if (type === "team") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="9" cy="8.5" r="2.6" {...commonProps} />
        <circle cx="16" cy="9.5" r="2.1" {...commonProps} />
        <path d="M4.5 19a4.7 4.7 0 0 1 9 0" {...commonProps} />
        <path d="M13.5 18.8a3.7 3.7 0 0 1 6 0" {...commonProps} />
      </svg>
    );
  }

  if (type === "chat") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M5 6.5h14v9H9l-4 3v-12Z" {...commonProps} />
        <path d="M8.5 10h7" {...commonProps} />
        <path d="M8.5 13h4.5" {...commonProps} />
      </svg>
    );
  }

  if (type === "hardhat") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4.5 15.5h15" {...commonProps} />
        <path d="M6.5 15.5v-2a5.5 5.5 0 0 1 11 0v2" {...commonProps} />
        <path d="M10 8.2v7.3" {...commonProps} />
        <path d="M14 8.2v7.3" {...commonProps} />
      </svg>
    );
  }

  if (type === "wrench") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M15.6 4.7a4.4 4.4 0 0 0 3.7 6.9l-8 8a2.2 2.2 0 0 1-3.1-3.1l8-8a4.4 4.4 0 0 1-.6-3.8Z" {...commonProps} />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4.5 11.2 12 5l7.5 6.2" {...commonProps} />
      <path d="M6.6 10.2v8.3h10.8v-8.3" {...commonProps} />
      <path d="M10 18.5v-4.8h4v4.8" {...commonProps} />
    </svg>
  );
}

const heroBadges = [
  ["box", "Строительство под ключ", "Берём на себя всё — от фундамента до отделки"],
  ["plan", "Проектирование", "Разрабатываем проекты под ваши задачи и бюджет"],
  ["shield", "Ипотека и сопровождение", "Помогаем с ипотекой и ведём сделку до конца"],
] as const;

const serviceCards = [
  {
    icon: "home",
    title: "Строительство домов",
    description: "Строим загородные дома под ключ из надёжных материалов и в срок.",
    href: "/catalog",
    image: "/request-house.jpg",
  },
  {
    icon: "plan",
    title: "Проектирование",
    description: "Индивидуальные и типовые проекты домов с учётом ваших пожеланий.",
    href: "/contacts",
    image: "/Picture.PNG",
  },
  {
    icon: "shield",
    title: "Ипотека на строительство",
    description: "Подберём выгодные условия и поможем оформить ипотеку.",
    href: "/mortgage",
    image: "/home-main-new.webp",
  },
  {
    icon: "wrench",
    title: "Ремонт и отделка",
    description: "Выполняем внутреннюю и наружную отделку любой сложности.",
    href: "/catalog/remont-kvartir-card",
    image: "/ремонт квартир.png",
  },
  {
    icon: "box",
    title: "Инженерные системы",
    description: "Проектируем и монтируем все необходимые инженерные сети.",
    href: "/contacts",
    image: "/строительство.png",
  },
  {
    icon: "doc",
    title: "Каталог проектов",
    description: "Готовые проекты домов на любой вкус и бюджет.",
    href: "/catalog",
    image: "/main2.jpg",
  },
] as const;

const reasons = [
  ["calendar", "Фиксированные этапы", "Чёткий план работ и контроль на каждом этапе строительства."],
  ["doc", "Прозрачная смета", "Подробная смета без скрытых платежей и переплат."],
  ["light", "Современные решения", "Используем проверенные материалы и технологии."],
  ["team", "Поддержка на каждом этапе", "Всегда на связи и сопровождаем вас до сдачи объекта."],
] as const;

const steps = [
  ["doc", "Заявка", "Оставляете заявку удобным способом"],
  ["chat", "Консультация", "Обсуждаем ваши задачи и подбираем решение"],
  ["plan", "Проект и смета", "Готовим проект и прозрачную смету"],
  ["hardhat", "Строительство", "Выполняем работы в срок и по стандартам"],
  ["home", "Сдача объекта", "Передаём готовый дом и документы"],
] as const;

export default async function ServicesPage() {
  const siteSettings = await getSiteSettings();

  return (
    <main className="page inner-page services-page services-page--redesign" aria-label="Услуги Адамант">
      <SiteHeader active="services" phone={siteSettings.phonePrimary} />

      <section className="services-redesign" aria-labelledby="services-title">
        <section className="services-redesign__hero">
          <img
            className="services-redesign__hero-image"
            src="/request-house.jpg"
            alt=""
            loading="eager"
            decoding="async"
            fetchPriority="high"
          />
          <div className="services-redesign__hero-content">
            <h1 id="services-title">Услуги</h1>
            <p>
              Строим, проектируем и сопровождаем загородные дома под ключ — от идеи до готового результата.
            </p>
            <div className="services-redesign__hero-actions">
              <button className="services-redesign__primary js-open-estimate" type="button">
                Оставить заявку <span aria-hidden="true">→</span>
              </button>
              <button className="services-redesign__secondary js-open-callback" type="button">
                Получить консультацию
                <ServicesIcon type="chat" />
              </button>
            </div>
          </div>

          <div className="services-redesign__hero-badges" aria-label="Ключевые услуги">
            {heroBadges.map(([icon, title, text]) => (
              <article key={title}>
                <span>
                  <ServicesIcon type={icon} />
                </span>
                <div>
                  <h2>{title}</h2>
                  <p>{text}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="services-redesign__section services-redesign__section--cards" aria-labelledby="services-main-title">
          <div className="services-redesign__section-head">
            <span>Наши возможности</span>
            <h2 id="services-main-title">Основные услуги</h2>
            <p>Комплексные решения для строительства и обустройства загородных домов под ключ.</p>
          </div>
          <div className="services-redesign__cards">
            {serviceCards.map((card) => (
              <article className="services-redesign__service-card" key={card.title} data-card-link={card.href} tabIndex={0}>
                <Link className="services-redesign__service-media" href={card.href} aria-label={card.title}>
                  <img src={card.image} alt="" loading="lazy" decoding="async" />
                </Link>
                <div>
                  <span className="services-redesign__service-icon">
                    <ServicesIcon type={card.icon} />
                  </span>
                  <h3>{card.title}</h3>
                  <p>{card.description}</p>
                  <Link className="services-redesign__link" href={card.href}>
                    Подробнее <span aria-hidden="true">→</span>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="services-redesign__section" aria-labelledby="services-reasons-title">
          <h2 id="services-reasons-title">Почему выбирают нас</h2>
          <div className="services-redesign__reasons">
            {reasons.map(([icon, title, text]) => (
              <article key={title}>
                <span>
                  <ServicesIcon type={icon} />
                </span>
                <div>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="services-redesign__consult" aria-labelledby="services-consult-title">
          <img src="/home-main-new.webp" alt="" loading="lazy" decoding="async" />
          <form className="contact-form services-redesign__form" aria-label="Обсудить проект">
            <h2 id="services-consult-title">Обсудим ваш проект</h2>
            <p>Оставьте заявку — мы свяжемся с вами и ответим на все вопросы.</p>
            <div className="services-redesign__form-row">
              <input name="name" type="text" placeholder="Ваше имя" aria-label="Ваше имя" />
              <input name="phone" type="tel" placeholder="Телефон *" aria-label="Телефон" required />
            </div>
            <textarea name="message" rows={3} placeholder="Комментарий" aria-label="Комментарий" />
            <input type="hidden" name="service" value="Услуги" />
            <label className="services-redesign__consent">
              <input type="checkbox" name="privacy" required />
              <span>Я согласен на обработку персональных данных</span>
            </label>
            <button type="submit" disabled>
              Отправить заявку <span aria-hidden="true">→</span>
            </button>
            <p className="contact-form__status" aria-live="polite" />
          </form>
        </section>

        <section className="services-redesign__section" aria-labelledby="services-process-title">
          <h2 id="services-process-title">Как мы работаем</h2>
          <div className="services-redesign__process">
            {steps.map(([icon, title, text], index) => (
              <article key={title}>
                <span className="services-redesign__process-icon">
                  <ServicesIcon type={icon} />
                </span>
                <strong>{index + 1}</strong>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
