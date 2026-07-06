import type { Metadata } from "next";
import { notFound } from "next/navigation";

import {
  getMediaAlt,
  getMediaUrl,
  getPortfolioCategories,
  getPortfolioCategoryBySlug,
  getPortfolioCategorySlug,
  getPortfolioItems,
  getPortfolioPage,
  getSiteSettings,
} from "@/site/cms";
import { SiteHeader } from "@/site/components/SiteHeader";
import { getPortfolioCategoryPath, getPortfolioItemPath } from "@/site/routes";
import { createPageMetadata } from "@/site/seo";

export const dynamic = "force-dynamic";

const DEFAULT_META_TITLE = "Заполните SEO Title в Payload";
const DEFAULT_META_DESCRIPTION = "Заполните SEO Description в Payload";
const PAGE_PLACEHOLDER = "Заполните этот блок в Payload";

function textOrPlaceholder(value?: string | null, placeholder = PAGE_PLACEHOLDER) {
  const normalized = value?.trim();

  return normalized || placeholder;
}

async function resolvePortfolioContext(categorySlug?: string) {
  const [siteSettings, portfolioPage, portfolioItems, portfolioCategories, selectedCategory] =
    await Promise.all([
      getSiteSettings(),
      getPortfolioPage(),
      getPortfolioItems(),
      getPortfolioCategories(),
      categorySlug ? getPortfolioCategoryBySlug(categorySlug) : Promise.resolve(null),
    ]);

  if (categorySlug && !selectedCategory) {
    notFound();
  }

  const items = portfolioItems.filter((item) =>
    selectedCategory ? getPortfolioCategorySlug(item) === selectedCategory.slug : true,
  );

  return {
    items,
    portfolioCategories,
    portfolioPage,
    selectedCategory,
    siteSettings,
  };
}

export async function generatePortfolioMetadata(): Promise<Metadata> {
  const portfolioPage = await getPortfolioPage();

  return createPageMetadata({
    title: portfolioPage.seoTitle || portfolioPage.title || DEFAULT_META_TITLE,
    description: portfolioPage.seoDescription || portfolioPage.subtitle || DEFAULT_META_DESCRIPTION,
    path: "/portfolio",
  });
}

export async function generatePortfolioCategoryMetadata(
  categorySlug: string,
): Promise<Metadata> {
  const category = await getPortfolioCategoryBySlug(categorySlug);

  if (!category) {
    return createPageMetadata({
      title: DEFAULT_META_TITLE,
      description: DEFAULT_META_DESCRIPTION,
      index: false,
      path: `/portfolio/category/${categorySlug}`,
    });
  }

  return createPageMetadata({
    title: category.seoTitle || category.h1 || category.title || DEFAULT_META_TITLE,
    description: category.seoDescription || category.description || DEFAULT_META_DESCRIPTION,
    path: getPortfolioCategoryPath(category),
  });
}

type PortfolioListingPageProps = {
  categorySlug?: string;
};

export async function PortfolioListingPage({ categorySlug }: PortfolioListingPageProps = {}) {
  const { items, portfolioCategories, portfolioPage, selectedCategory, siteSettings } =
    await resolvePortfolioContext(categorySlug);

  const pageEyebrow = selectedCategory?.title ?? portfolioPage.eyebrow;
  const pageTitle = textOrPlaceholder(
    selectedCategory?.h1 ?? selectedCategory?.title ?? portfolioPage.title,
  );
  const pageSubtitle = textOrPlaceholder(
    selectedCategory?.description ?? portfolioPage.subtitle,
  );
  const categoryImageUrl =
    getMediaUrl(selectedCategory?.heroImage, "card") ||
    getMediaUrl(selectedCategory?.heroImage);
  const categoryImageAlt = getMediaAlt(selectedCategory?.heroImage, pageTitle);

  return (
    <main className="page inner-page portfolio-page" aria-label="Портфолио Адамант">
      <SiteHeader active="portfolio" phone={siteSettings.phonePrimary} />

      <section className="section section--projects" aria-labelledby="portfolio-title">
        <div className="section__intro section__intro--page section__intro--projects">
          {selectedCategory ? <span className="section__kicker">{pageEyebrow}</span> : null}
          <h1 id="portfolio-title">{pageTitle}</h1>
          <p>{pageSubtitle}</p>
        </div>

        {categoryImageUrl ? (
          <figure className="catalog-category-hero">
            <img src={categoryImageUrl} alt={categoryImageAlt} loading="eager" decoding="async" />
          </figure>
        ) : selectedCategory ? (
          <div className="catalog-category-hero catalog-category-hero--placeholder">
            Добавьте картинку посадочной страницы в Payload
          </div>
        ) : null}

        <nav className="catalog-category-pills" aria-label="Категории портфолио">
          <a
            className={`catalog-category-pill${!selectedCategory ? " is-active" : ""}`}
            href="/portfolio"
          >
            Все
          </a>
          {portfolioCategories.map((category) => (
            <a
              key={category.id}
              className={`catalog-category-pill${
                selectedCategory?.slug === category.slug ? " is-active" : ""
              }`}
              href={getPortfolioCategoryPath(category)}
            >
              {category.title}
            </a>
          ))}
        </nav>

        <div className="projects-grid">
          {items.map((item) => {
            const href = getPortfolioItemPath(item);
            const imageUrl =
              getMediaUrl(item.previewImage, "card") || getMediaUrl(item.previewImage);

            return (
              <a
                key={item.id}
                className="blog-card project-card-blog"
                href={href}
                data-category={getPortfolioCategorySlug(item)}
                aria-label={`Открыть проект: ${item.title}`}
              >
                {imageUrl ? (
                  <div className="blog-card__media">
                    <img
                      src={imageUrl}
                      alt={getMediaAlt(item.previewImage, item.title)}
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                ) : null}
                <div className="blog-card__body">
                  <h2>{item.title}</h2>
                  <p>{item.summary}</p>
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
