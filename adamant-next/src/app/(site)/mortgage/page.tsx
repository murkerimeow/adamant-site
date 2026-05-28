import { getSiteSettings } from "@/site/cms";
import { SiteHeader } from "@/site/components/SiteHeader";
import { createPageMetadata } from "@/site/seo";

export const dynamic = "force-dynamic";

export const metadata = createPageMetadata({
  title: "Ипотека на строительство дома | Адамант Строй",
  description:
    "Помогаем подобрать ипотечную программу и подготовить смету для строительства загородного дома под ключ.",
  path: "/mortgage",
});

function MortgageIcon({ type }: { type: "bank" | "clock" | "doc" | "hardhat" | "home" | "people" | "search" | "shield" }) {
  const commonProps = {
    fill: "none",
    stroke: "currentColor",
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    strokeWidth: 1.9,
  };

  if (type === "people") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="9" cy="8.5" r="2.6" {...commonProps} />
        <circle cx="16" cy="9.5" r="2.1" {...commonProps} />
        <path d="M4.5 19a4.7 4.7 0 0 1 9 0" {...commonProps} />
        <path d="M13.5 18.8a3.7 3.7 0 0 1 6 0" {...commonProps} />
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

  if (type === "search") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="10.5" cy="10.5" r="5.5" {...commonProps} />
        <path d="m15 15 4.5 4.5" {...commonProps} />
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

  if (type === "bank") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="m4 10 8-5 8 5" {...commonProps} />
        <path d="M5.5 10h13" {...commonProps} />
        <path d="M7 10v7" {...commonProps} />
        <path d="M12 10v7" {...commonProps} />
        <path d="M17 10v7" {...commonProps} />
        <path d="M5 19h14" {...commonProps} />
      </svg>
    );
  }

  if (type === "clock") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="7.5" {...commonProps} />
        <path d="M12 7.8v4.6l3 1.8" {...commonProps} />
      </svg>
    );
  }

  if (type === "shield") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 3.8 18.5 6v5.3c0 4.1-2.6 7.6-6.5 8.9-3.9-1.3-6.5-4.8-6.5-8.9V6L12 3.8Z" {...commonProps} />
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
  ["shield", "Банки-партнеры", "Только надежные банки"],
  ["doc", "Сопровождение", "Поддержка на всех этапах"],
  ["clock", "Быстрое оформление", "Минимум времени и документов"],
] as const;

const formats = [
  ["home", "Ипотека на строительство", "Финансирование строительства вашего дома с нуля"],
  ["people", "Семейная ипотека", "Специальные условия для семей с детьми"],
  ["hardhat", "Ипотека с подрядчиком", "Удобное оформление с аккредитованным подрядчиком"],
  ["search", "Подбор программы", "Поможем подобрать оптимальную программу под ваши цели"],
] as const;

const steps = [
  ["doc", "Оставляете заявку", "Заполните форму на сайте или свяжитесь с нами"],
  ["people", "Консультация", "Специалист подберет оптимальную программу"],
  ["doc", "Сбор документов", "Поможем подготовить необходимые документы"],
  ["bank", "Одобрение банком", "Банк рассматривает заявку и принимает решение"],
  ["home", "Строите дом мечты", "Получаете финансирование и начинаете строительство"],
] as const;

export default async function MortgagePage() {
  const siteSettings = await getSiteSettings();

  return (
    <main className="page inner-page mortgage-page mortgage-page--fresh" aria-label="Ипотека Адамант">
      <SiteHeader active="mortgage" phone={siteSettings.phonePrimary} />

      <section className="section mortgage-redesign" aria-labelledby="mortgage-title">
        <section className="mortgage-redesign__hero">
          <img
            src="/home-main-new.webp"
            alt=""
            loading="eager"
            decoding="async"
            fetchPriority="high"
          />
          <div className="mortgage-redesign__hero-content">
            <span>Строим дома вашей мечты — с поддержкой надежных банков</span>
            <h1 id="mortgage-title">
              Ипотека на <strong>строительство дома</strong>
            </h1>
            <p>
              Помогаем получить ипотеку на строительство загородного дома быстро,
              просто и без лишних хлопот.
            </p>
            <div>
              <button className="js-open-estimate" type="button">
                Оставить заявку <span aria-hidden="true">→</span>
              </button>
              <button className="mortgage-redesign__secondary js-open-callback" type="button">
                Получить консультацию
              </button>
            </div>
          </div>
          <div className="mortgage-redesign__badges">
            {heroBadges.map(([icon, title, text]) => (
              <article key={title}>
                <span>
                  <MortgageIcon type={icon} />
                </span>
                <div>
                  <h2>{title}</h2>
                  <p>{text}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="mortgage-redesign__banks" aria-labelledby="mortgage-banks-title">
          <h2 id="mortgage-banks-title">Банки-партнеры</h2>
          <div>
            <article className="mortgage-redesign__bank mortgage-redesign__bank--sber">СБЕРБАНК</article>
            <article className="mortgage-redesign__bank mortgage-redesign__bank--tbank">Т-БАНК</article>
            <article className="mortgage-redesign__bank mortgage-redesign__bank--vtb">ВТБ</article>
          </div>
        </section>

        <section className="mortgage-redesign__formats" aria-labelledby="mortgage-formats-title">
          <h2 id="mortgage-formats-title">Доступные форматы ипотеки</h2>
          <div>
            {formats.map(([icon, title, text]) => (
              <article key={title}>
                <span>
                  <MortgageIcon type={icon} />
                </span>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mortgage-redesign__process" aria-labelledby="mortgage-process-title">
          <h2 id="mortgage-process-title">Как проходит оформление ипотеки</h2>
          <div>
            {steps.map(([icon, title, text], index) => (
              <article key={title}>
                <span>
                  <MortgageIcon type={icon} />
                </span>
                <strong>{index + 1}</strong>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mortgage-redesign__consult" aria-labelledby="mortgage-consult-title">
          <img src="/request-house.jpg" alt="" loading="lazy" decoding="async" />
          <form className="contact-form mortgage-redesign__form" aria-label="Заявка на ипотеку">
            <h2 id="mortgage-consult-title">Получите бесплатную консультацию</h2>
            <p>Подберем оптимальную программу ипотеки и ответим на все ваши вопросы.</p>
            <div>
              <input name="name" type="text" placeholder="Ваше имя" aria-label="Ваше имя" />
              <input name="phone" type="tel" placeholder="Телефон *" aria-label="Телефон" required />
            </div>
            <textarea name="message" rows={3} placeholder="Комментарий" aria-label="Комментарий" />
            <input type="hidden" name="service" value="Ипотека на строительство" />
            <label>
              <input type="checkbox" name="privacy" required />
              <span>Я соглашаюсь на обработку персональных данных</span>
            </label>
            <button type="submit">
              Оставить заявку <span aria-hidden="true">→</span>
            </button>
          </form>
        </section>
      </section>
    </main>
  );
}
