import {
  getCatalogItems,
  getMediaAlt,
  getMediaUrl,
  getPortfolioItems,
  getPortfolioPage,
  getSiteSettings,
} from "@/site/cms";
import { SiteHeader } from "@/site/components/SiteHeader";
import { getCatalogItemPath } from "@/site/routes";
import { createPageMetadata } from "@/site/seo";

export const dynamic = "force-dynamic";

export const metadata = createPageMetadata({
  title: "Портфолио Адамант Строй | Реализованные проекты домов",
  description: "Реализованные проекты домов и строительных работ Адамант Строй в Санкт-Петербурге и Ленинградской области.",
  path: "/portfolio",
});

export default async function PortfolioPage() {
  const [siteSettings, portfolioPage, portfolioItems, catalogItems] = await Promise.all([
    getSiteSettings(),
    getPortfolioPage(),
    getPortfolioItems(),
    getCatalogItems(),
  ]);

  const catalogById = new Map(catalogItems.map((item) => [item.id, item]));
  const catalogByTitle = new Map(catalogItems.map((item) => [item.title, item]));

  return (
    <main className="page inner-page portfolio-page" aria-label="Портфолио Адамант">
      <SiteHeader active="portfolio" phone={siteSettings.phonePrimary} />

      <section className="section section--projects" aria-labelledby="portfolio-title">
        <div className="section__intro section__intro--page section__intro--projects">
          <span className="section__kicker">{portfolioPage.eyebrow}</span>
          <h1 id="portfolio-title">{portfolioPage.title}</h1>
          <p>{portfolioPage.subtitle}</p>
        </div>

        <div className="projects-grid">
          {portfolioItems.map((item) => {
            const relatedCatalog =
              item.catalogItem && typeof item.catalogItem === "object"
                ? item.catalogItem
                : typeof item.catalogItem === "number"
                  ? catalogById.get(item.catalogItem)
                  : null;
            const catalogItem = relatedCatalog ?? catalogByTitle.get(item.title);
            const href = catalogItem ? getCatalogItemPath(catalogItem) : "/catalog";
            const visibleTags = item.tags?.slice(0, 2) || [];

            return (
              <article
                key={item.id}
                className="blog-card project-card-blog"
                data-card-link={href}
                tabIndex={0}
                data-category={item.category}
              >
                <div className="blog-card__media">
                  <img
                    src={getMediaUrl(item.previewImage, "card") || getMediaUrl(item.previewImage)}
                    alt={getMediaAlt(item.previewImage, item.title)}
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <div className="blog-card__body">
                  <h2>{item.title}</h2>
                  <p>{item.summary}</p>
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
