import {
  getMediaAlt,
  getMediaUrl,
  getPortfolioItems,
  getPortfolioPage,
  getSiteSettings,
} from "@/site/cms";
import { SiteHeader } from "@/site/components/SiteHeader";
import { getPortfolioItemPath } from "@/site/routes";
import { createPageMetadata } from "@/site/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const portfolioPage = await getPortfolioPage();

  return createPageMetadata({
    title: portfolioPage.seoTitle || "Заполните SEO Title в Payload",
    description: portfolioPage.seoDescription || "Заполните SEO Description в Payload",
    path: "/portfolio",
  });
}

export default async function PortfolioPage() {
  const [siteSettings, portfolioPage, portfolioItems] = await Promise.all([
    getSiteSettings(),
    getPortfolioPage(),
    getPortfolioItems(),
  ]);

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
            const href = getPortfolioItemPath(item);
            const visibleTags = item.tags?.slice(0, 2) || [];

            return (
              <a
                key={item.id}
                className="blog-card project-card-blog"
                href={href}
                data-category={item.category}
                aria-label={`Открыть проект: ${item.title}`}
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
                <span className="project-card-blog__more">
                  Подробнее <span aria-hidden="true">→</span>
                </span>
              </a>
            );
          })}
        </div>
      </section>
    </main>
  );
}
