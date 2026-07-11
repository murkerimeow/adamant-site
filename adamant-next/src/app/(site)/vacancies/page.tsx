import { getSiteSettings, getVacancies, type VacancyDoc } from "@/site/cms";
import { SiteHeader } from "@/site/components/SiteHeader";
import { createPageMetadata } from "@/site/seo";

export const dynamic = "force-dynamic";

export const metadata = createPageMetadata({
  title: "Вакансии Адамант Строй | Работа в строительной компании",
  description: "Актуальные вакансии строительной компании Адамант Строй в Санкт-Петербурге и Ленинградской области.",
  path: "/vacancies",
});

function VacancyList({
  items,
  title,
}: {
  items?: VacancyDoc["responsibilities"];
  title: string;
}) {
  if (!items?.length) return null;

  return (
    <div className="vacancy-card__list">
      <h3>{title}</h3>
      <ul>
        {items.map((item) => (
          <li key={item.id ?? item.item}>{item.item}</li>
        ))}
      </ul>
    </div>
  );
}

export default async function VacanciesPage() {
  const [siteSettings, vacancies] = await Promise.all([
    getSiteSettings(),
    getVacancies(),
  ]);

  return (
    <main className="page inner-page vacancies-page" aria-label="Вакансии Адамант Строй">
      <SiteHeader active="vacancies" phone={siteSettings.phonePrimary} />

      <section className="section vacancies-section" aria-labelledby="vacancies-title">
        <div className="section__intro section__intro--page vacancies-heading">
          <span className="section__kicker">Карьера</span>
          <h1 id="vacancies-title">Вакансии в Адамант Строй</h1>
          <p>
            Открытые позиции компании. Расскажем о задачах, условиях и формате
            работы в команде.
          </p>
        </div>

        {vacancies.length ? (
          <div className="vacancies-grid">
            {vacancies.map((vacancy) => (
              <article className="vacancy-card" key={vacancy.id}>
                <div className="vacancy-card__head">
                  <div>
                    <span>{vacancy.location || "Санкт-Петербург"}</span>
                    <h2>{vacancy.title}</h2>
                  </div>
                  {vacancy.salary ? (
                    <strong className="vacancy-card__salary">{vacancy.salary}</strong>
                  ) : null}
                </div>

                <p>{vacancy.summary}</p>

                <div className="vacancy-card__meta">
                  {vacancy.employment ? <span>{vacancy.employment}</span> : null}
                  <span>Отклик через заявку</span>
                </div>

                <div className="vacancy-card__details">
                  <VacancyList items={vacancy.responsibilities} title="Задачи" />
                  <VacancyList items={vacancy.requirements} title="Требования" />
                  <VacancyList items={vacancy.conditions} title="Условия" />
                </div>

                <button
                  className="vacancy-card__button js-open-estimate"
                  type="button"
                  data-estimate-service={`Вакансия: ${vacancy.title}`}
                >
                  Откликнуться
                </button>
              </article>
            ))}
          </div>
        ) : (
          <div className="vacancies-empty">
            <h2>Сейчас открытых вакансий нет</h2>
            <p>
              Когда появятся новые позиции, мы обновим страницу и расскажем о
              задачах, условиях и формате работы.
            </p>
            <button className="vacancy-card__button js-open-estimate" type="button">
              Написать компании
            </button>
          </div>
        )}
      </section>
    </main>
  );
}
