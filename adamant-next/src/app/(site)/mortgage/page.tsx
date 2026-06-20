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

function MortgageIcon({ type }: { type: MortgageIconType }) {
  const commonProps = {
    fill: "none",
    stroke: "currentColor",
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    strokeWidth: 1.9,
  };

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

  if (type === "pin") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 21s6-5.2 6-11a6 6 0 0 0-12 0c0 5.8 6 11 6 11Z" {...commonProps} />
        <circle cx="12" cy="10" r="2.2" {...commonProps} />
      </svg>
    );
  }

  if (type === "question") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="8" {...commonProps} />
        <path d="M9.7 9.4a2.5 2.5 0 0 1 4.7 1.2c0 1.9-2.4 2.2-2.4 4" {...commonProps} />
        <path d="M12 17.5h.01" {...commonProps} />
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

  if (type === "send") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 12 20 4l-5 16-3-7-8-1Z" {...commonProps} />
        <path d="m12 13 8-9" {...commonProps} />
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

const heroBadges: Array<[MortgageIconType, string, string]> = [
  ["bank", "1 заявка", "несколько банков"],
  ["shield", "Подбор программы", "под вашу ситуацию"],
  ["people", "Сопровождение", "до одобрения"],
];

const serviceCards: Array<[MortgageIconType, string, string]> = [
  ["search", "Подбираем ипотечную программу", "Анализируем вашу ситуацию и подбираем оптимальный вариант из программ банков-партнеров."],
  ["doc", "Готовим документы по строительству", "Собираем и проверяем все необходимые документы для подачи в банк."],
  ["home", "Согласовываем подрядчика и смету", "Помогаем подготовить смету и договор, соответствующие требованиям банка."],
  ["people", "Ведем до решения банка", "Сопровождаем на всех этапах: от подачи заявки до получения одобрения."],
];

const fitCards: Array<[MortgageIconType, string]> = [
  ["home", "Хотите построить дом с нуля"],
  ["pin", "У вас есть участок или планируете его купить"],
  ["people", "Подходите под условия семейной ипотеки"],
  ["hardhat", "Планируете строиться через надежного подрядчика"],
  ["question", "Не знаете, какой банк выбрать и с чего начать"],
];

const processSteps: Array<[MortgageIconType, string, string]> = [
  ["doc", "Вы оставляете заявку", "Заполняете короткую форму на сайте или связываетесь с нами удобным способом."],
  ["people", "Мы уточняем вашу ситуацию", "Проводим консультацию и собираем исходные данные."],
  ["bank", "Подбираем банки и программы", "Сравниваем условия и предлагаем лучшие варианты."],
  ["doc", "Готовим и проверяем документы", "Собираем пакет документов по требованиям банка и проверяем их."],
  ["send", "Отправляем заявку в банк", "Подаем документы и сопровождаем рассмотрение заявки."],
  ["home", "Получаем одобрение и начинаем строительство", "После одобрения запускаем строительство вашего дома."],
];

export default async function MortgagePage() {
  const siteSettings = await getSiteSettings();

  return (
    <main className="page inner-page mortgage-page mortgage-page--fresh" aria-label="Ипотека Адамант">
      <SiteHeader active="mortgage" phone={siteSettings.phonePrimary} />

      <section className="section mortgage-redesign mortgage-redesign--compact" aria-labelledby="mortgage-title">
        <section className="mortgage-redesign__hero">
          <img
            src="/mortgage-banner-new.png"
            alt=""
            loading="eager"
            decoding="async"
            fetchPriority="high"
          />
          <div className="mortgage-redesign__hero-content">
            <span>Поддержка надежных банков</span>
            <h1 id="mortgage-title">
              Постройте дом <strong>в ипотеку</strong>
            </h1>
            <p>
              Поможем подобрать банк, подготовить документы и пройти согласование для строительства дома под ключ.
            </p>
            <div>
              <button className="js-open-estimate" type="button">
                Получить консультацию
              </button>
              <a className="mortgage-redesign__hero-secondary" href="#mortgage-calculator">
                Ипотечный калькулятор
              </a>
            </div>
          </div>
        </section>

        <section className="mortgage-redesign__section mortgage-redesign__services" aria-labelledby="mortgage-services-title">
          <h2 id="mortgage-services-title">Что мы делаем для вас</h2>
          <div>
            {serviceCards.map(([icon, title, text]) => (
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

        <section className="mortgage-redesign__section mortgage-redesign__banks" aria-labelledby="mortgage-banks-title">
          <h2 id="mortgage-banks-title">Работаем с ипотечными программами крупных банков</h2>
          <div>
            <article className="mortgage-redesign__bank mortgage-redesign__bank--sber">
              <BankLogo bank="sber" />
            </article>
            <article className="mortgage-redesign__bank mortgage-redesign__bank--tbank">
              <BankLogo bank="tbank" />
            </article>
            <article className="mortgage-redesign__bank mortgage-redesign__bank--vtb">
              <BankLogo bank="vtb" />
            </article>
          </div>
          <p>Сотрудничаем и с другими банками. Подберем лучший вариант именно для вас.</p>
        </section>

        <section className="mortgage-redesign__section mortgage-redesign__fit" aria-labelledby="mortgage-fit-title">
          <h2 id="mortgage-fit-title">Ипотека подходит, если вы:</h2>
          <div>
            {fitCards.map(([icon, title]) => (
              <article key={title}>
                <span>
                  <MortgageIcon type={icon} />
                </span>
                <h3>{title}</h3>
              </article>
            ))}
          </div>
        </section>

        <section className="mortgage-redesign__section mortgage-redesign__process" aria-labelledby="mortgage-process-title">
          <h2 id="mortgage-process-title">Как проходит оформление ипотеки</h2>
          <div>
            {processSteps.map(([, title, text], index) => (
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

            <button className="mortgage-calculator__consult js-open-estimate" type="button">
              Получить консультацию
            </button>
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
            src="/request-house.jpg"
            alt=""
            aria-hidden="true"
            loading="lazy"
            decoding="async"
          />
        </section>
      </section>
    </main>
  );
}
