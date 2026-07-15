import { getSiteSettings } from "@/site/cms";
import { SiteHeader } from "@/site/components/SiteHeader";
import { createPageMetadata } from "@/site/seo";

export const dynamic = "force-dynamic";

export const metadata = createPageMetadata({
  title: "Ипотека на строительство дома | Адамант Строй",
  description:
    "Помогаем подобрать ипотечную программу, подготовить документы и пройти согласование для строительства загородного дома под ключ.",
  path: "/mortgage",
});

type MortgageIconType =
  | "bank"
  | "clock"
  | "doc"
  | "hardhat"
  | "home"
  | "people"
  | "pin"
  | "question"
  | "search"
  | "send"
  | "shield";

function BankLogo({ bank }: { bank: "sber" | "tbank" | "vtb" }) {
  const logos = {
    sber: {
      alt: "Сбербанк",
      src: "/bank-sber.svg",
    },
    tbank: {
      alt: "Т-Банк",
      src: "/bank-tbank.svg",
    },
    vtb: {
      alt: "ВТБ",
      src: "/bank-vtb.svg",
    },
  } as const;
  const logo = logos[bank];

  return (
    <img
      className={`mortgage-bank-logo mortgage-bank-logo--${bank}`}
      src={logo.src}
      alt={logo.alt}
      loading="lazy"
      decoding="async"
    />
  );
}

const serviceCards: Array<[MortgageIconType, string, string]> = [
  ["search", "Подбираем ипотечную программу", "Анализируем вашу ситуацию и подбираем оптимальный вариант из программ банков-партнеров."],
  ["doc", "Готовим документы по строительству", "Собираем и проверяем все необходимые документы для подачи в банк."],
  ["home", "Согласовываем подрядчика и смету", "Помогаем подготовить смету и договор, соответствующие требованиям банка."],
  ["people", "Ведем до решения банка", "Сопровождаем на всех этапах: от подачи заявки до получения одобрения."],
];

export default async function MortgagePage() {
  const siteSettings = await getSiteSettings();

  return (
    <main className="page inner-page mortgage-page mortgage-page--fresh" aria-label="Ипотека Адамант">
      <SiteHeader active="mortgage" phone={siteSettings.phonePrimary} />

      <section className="section mortgage-redesign mortgage-redesign--compact" aria-labelledby="mortgage-title">
        <section className="mortgage-redesign__hero">
          <img
            src="/mortgage-banner-new.webp"
            alt="Загородный дом для строительства в ипотеку"
            loading="eager"
            decoding="async"
            fetchPriority="high"
          />
          <div className="mortgage-redesign__hero-content">
            <h1 id="mortgage-title">Постройте дом в ипотеку</h1>
            <p>
              Поможем подобрать банк, подготовить документы и пройти согласование для строительства дома под ключ.
            </p>
            <div>
              <button className="js-open-estimate" type="button">
                Получить консультацию
              </button>
            </div>
          </div>
        </section>

        <section className="mortgage-redesign__section mortgage-redesign__banks" aria-labelledby="mortgage-banks-title">
          <h2 id="mortgage-banks-title">Банки-партнеры</h2>
          <div>
            <article className="mortgage-redesign__bank mortgage-redesign__bank--sber">
              <BankLogo bank="sber" />
              <a href="/contacts">Смотреть сертификат <span aria-hidden="true">→</span></a>
            </article>
            <article className="mortgage-redesign__bank mortgage-redesign__bank--tbank">
              <BankLogo bank="tbank" />
              <a href="/contacts">Смотреть сертификат <span aria-hidden="true">→</span></a>
            </article>
            <article className="mortgage-redesign__bank mortgage-redesign__bank--vtb">
              <BankLogo bank="vtb" />
              <a href="/contacts">Смотреть сертификат <span aria-hidden="true">→</span></a>
            </article>
          </div>
        </section>

        <section className="mortgage-redesign__section mortgage-redesign__process" aria-labelledby="mortgage-process-title">
          <h2 id="mortgage-process-title">Как мы помогаем с ипотекой</h2>
          <div>
            {serviceCards.map(([, title, text], index) => (
              <article key={title}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </section>

        <section
          className="mortgage-redesign__section mortgage-calculator"
          id="mortgage-calculator"
          aria-labelledby="mortgage-calculator-title"
          data-mortgage-calculator
        >
          <div className="mortgage-calculator__form-card">
            <div className="mortgage-calculator__intro">
              <h2 id="mortgage-calculator-title">Ипотечный калькулятор</h2>
              <p>
                Проектируем и строим современные загородные дома в Санкт-Петербурге и Ленинградской области. Берем на себя весь процесс — от идеи и расчета сметы до строительства под ключ.
              </p>
            </div>

            <div className="mortgage-calculator__fields">
              <label>
                <span>Стоимость дома</span>
                <input type="number" min={1000000} step={100000} defaultValue={12000000} data-mortgage-price />
              </label>
              <label>
                <span>Первоначальный взнос</span>
                <input type="number" min={0} step={100000} defaultValue={2400000} data-mortgage-down />
              </label>
              <label>
                <span>Срок в годах</span>
                <input type="number" min={1} max={30} step={1} defaultValue={20} data-mortgage-years />
              </label>
              <label>
                <span>Процентная ставка</span>
                <input type="number" min={0.1} step={0.1} defaultValue={6} data-mortgage-rate />
              </label>
            </div>

          </div>

          <div className="mortgage-calculator__middle" aria-live="polite">
            <aside className="mortgage-calculator__monthly">
              <strong data-mortgage-monthly>0 ₽</strong>
              <span>Ежемесячный платеж</span>
            </aside>

            <aside className="mortgage-calculator__tax">
              <p>
                Также согласно законодательству Российской Федерации у Вас может быть возможность получить имущественный налоговый вычет.
              </p>
              <strong data-mortgage-tax>0 ₽</strong>
            </aside>
          </div>

          <div className="mortgage-calculator__totals" aria-live="polite">
            <article>
              <strong data-mortgage-loan>0 ₽</strong>
              <span>Сумма кредита</span>
            </article>
            <article>
              <strong data-mortgage-total>0 ₽</strong>
              <span>Общая выплата</span>
            </article>
            <article>
              <strong data-mortgage-overpayment>0 ₽</strong>
              <span>Переплата по кредиту</span>
            </article>
          </div>
        </section>

        <section className="product-consult mortgage-product-consult" aria-labelledby="mortgage-consult-title">
          <div>
            <h2 id="mortgage-consult-title">Хотите построить дом в ипотеку?</h2>
            <p>Оставьте заявку на консультацию — наш менеджер подберет лучшее решение для вашего проекта.</p>
          </div>
          <form className="product-consult-form contact-form" aria-label="Заявка на ипотеку">
            <input name="service" type="hidden" value="Ипотека на строительство" />
            <input name="name" type="text" placeholder="Ваше имя" aria-label="Ваше имя" />
            <input name="phone" type="tel" placeholder="Телефон *" aria-label="Телефон" required />
            <button type="submit">Получить консультацию</button>
            <label>
              <input name="privacy" type="checkbox" required />
              <span>Я согласен на обработку персональных данных</span>
            </label>
          </form>
          <img
            src="/request-house.webp"
            alt="Современный загородный дом для ипотечной консультации"
            loading="lazy"
            decoding="async"
          />
        </section>
      </section>
    </main>
  );
}
