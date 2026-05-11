import {
  getCatalogItems,
  getCatalogPage,
  getMediaAlt,
  getMediaUrl,
  getSiteSettings,
} from "@/site/cms";
import { SiteHeader } from "@/site/components/SiteHeader";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Каталог проектов домов | Адамант Строй",
};

export default async function CatalogPage() {
  const [siteSettings, catalogPage, catalogItems] = await Promise.all([
    getSiteSettings(),
    getCatalogPage(),
    getCatalogItems(),
  ]);

  const items = catalogItems.filter((item) => item.showInCatalog);

  return (
    <main className="page inner-page" aria-label="Каталог Адамант">
      <SiteHeader active="catalog" phone={siteSettings.phonePrimary} />

      <section className="section section--projects" aria-labelledby="catalog-title">
        <div className="section__intro section__intro--page section__intro--projects">
          <span className="section__kicker">{catalogPage.eyebrow}</span>
          <h1 id="catalog-title">{catalogPage.title}</h1>
          <p>{catalogPage.subtitle}</p>
        </div>

        <div className="project-tabs" aria-label="Фильтр проектов">
          <button
            className="project-tabs__button project-tabs__button--active"
            type="button"
            data-filter="all"
            aria-pressed="true"
          >
            Все
          </button>
          <button
            className="project-tabs__button"
            type="button"
            data-filter="modern"
            aria-pressed="false"
          >
            Современные
          </button>
          <button
            className="project-tabs__button"
            type="button"
            data-filter="classic"
            aria-pressed="false"
          >
            Классические
          </button>
        </div>

        <div className="projects-grid">
          {items.map((item) => {
            const href = `/catalog-item?item=${encodeURIComponent(item.itemKey)}&source=catalog`;
            const visibleTags = item.tags?.slice(0, 2) || [];

            return (
              <article
                key={item.id}
                className="blog-card project-card-blog"
                data-card-link={href}
                tabIndex={0}
                data-category={item.catalogCategory}
              >
                <div className="blog-card__media">
                  <img
                    src={getMediaUrl(item.previewImage, "card") || getMediaUrl(item.previewImage)}
                    alt={getMediaAlt(item.previewImage, item.title)}
                  />
                </div>
                <div className="blog-card__body">
                  <h2>{item.title}</h2>
                  <p>{item.cardSummary || item.description}</p>
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
    </main>
  );
}
