import { getSiteSettings } from "@/site/cms";
import { SiteHeader } from "@/site/components/SiteHeader";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Ипотека | Адамант Строй",
};

const mortgageSteps = [
  {
    title: "Подберем программу",
    text: "Сравним доступные варианты и подскажем, какой формат подходит под строительство дома.",
  },
  {
    title: "Подготовим пакет",
    text: "Поможем собрать базовые данные по проекту, смете и участку для заявки в банк.",
  },
  {
    title: "Синхронизируем смету",
    text: "Согласуем этапность строительства так, чтобы платежи и работы были понятны заранее.",
  },
] as const;

export default async function MortgagePage() {
  const siteSettings = await getSiteSettings();

  return (
    <main className="page inner-page mortgage-page" aria-label="Ипотека Адамант">
      <SiteHeader active="mortgage" phone={siteSettings.phonePrimary} />

      <section className="section mortgage-section" aria-labelledby="mortgage-title">
        <div className="section__intro section__intro--page mortgage-heading">
          <span className="section__kicker">Ипотека</span>
          <h1 id="mortgage-title">Поможем оформить ипотеку на строительство дома</h1>
          <p>
            Подберем подходящий вариант финансирования, подготовим понятную смету
            и поможем пройти путь от заявки до старта строительства.
          </p>
        </div>

        <div className="mortgage-panel">
          <div className="mortgage-panel__lead">
            <span>NEW</span>
            <h2>Дом под ключ с понятным бюджетом</h2>
            <p>
              Сначала фиксируем задачу, площадь, участок и технологию. Затем
              готовим расчет, который можно использовать для обсуждения условий
              с банком.
            </p>
            <button className="button js-open-estimate" type="button">
              Оставить заявку
            </button>
          </div>

          <div className="mortgage-steps" aria-label="Как это работает">
            {mortgageSteps.map((step, index) => (
              <article key={step.title} className="mortgage-step">
                <span>{String(index + 1).padStart(2, "0")}</span>
                <div>
                  <h2>{step.title}</h2>
                  <p>{step.text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
