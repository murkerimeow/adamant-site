import type { Metadata } from "next";
import Link from "next/link";
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
import { createPageMetadata, pickSeoDescription, pickSeoTitle } from "@/site/seo";

export const dynamic = "force-dynamic";

const DEFAULT_META_TITLE = "Портфолио строительных работ | Адамант Строй";
const DEFAULT_META_DESCRIPTION =
  "Реализованные проекты Адамант Строй: построенные дома, коммерческие объекты, ремонт и отделка.";

function getCategoryMetaDescription(category: {
  description?: string | null;
  seoDescription?: string | null;
  title?: string | null;
}) {
  const title = category.title?.trim();
  const fallback = title
    ? `Примеры работ АДАМАНТ Строй в категории ${title.toLocaleLowerCase("ru")}: реализованные объекты, фотографии проектов и описание выполненных работ.`
    : DEFAULT_META_DESCRIPTION;

  return pickSeoDescription(
    fallback,
    category.seoDescription,
    category.description,
  );
}

function textOrEmpty(value?: string | null) {
  const normalized = value?.trim();

  return normalized || "";
}

function getPopulatedPortfolioCategorySlugs(
  items: Awaited<ReturnType<typeof getPortfolioItems>>,
) {
  return new Set(items.map(getPortfolioCategorySlug).filter(Boolean));
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
    portfolioItems,
    portfolioCategories,
    portfolioPage,
    selectedCategory,
    siteSettings,
  };
}

export async function generatePortfolioMetadata(): Promise<Metadata> {
  const portfolioPage = await getPortfolioPage();

  return createPageMetadata({
    title: pickSeoTitle(DEFAULT_META_TITLE, portfolioPage.seoTitle, portfolioPage.title),
    description: pickSeoDescription(
      DEFAULT_META_DESCRIPTION,
      portfolioPage.seoDescription,
      portfolioPage.subtitle,
    ),
    path: "/portfolio",
  });
}

export async function generatePortfolioCategoryMetadata(
  categorySlug: string,
): Promise<Metadata> {
  const [category, portfolioItems] = await Promise.all([
    getPortfolioCategoryBySlug(categorySlug),
    getPortfolioItems(),
  ]);

  if (!category) {
    return createPageMetadata({
      title: DEFAULT_META_TITLE,
      description: DEFAULT_META_DESCRIPTION,
      index: false,
      path: `/portfolio/category/${categorySlug}`,
    });
  }

  const populatedCategorySlugs = getPopulatedPortfolioCategorySlugs(portfolioItems);

  return createPageMetadata({
    title: pickSeoTitle(
      DEFAULT_META_TITLE,
      category.seoTitle,
      category.h1,
      category.title,
    ),
    description: getCategoryMetaDescription(category),
    index: populatedCategorySlugs.has(category.slug),
    path: getPortfolioCategoryPath(category),
  });
}

type PortfolioListingPageProps = {
  categorySlug?: string;
};

export async function PortfolioListingPage({ categorySlug }: PortfolioListingPageProps = {}) {
  const { items, portfolioCategories, portfolioItems, portfolioPage, selectedCategory, siteSettings } =
    await resolvePortfolioContext(categorySlug);

  const pageEyebrow = selectedCategory?.title ?? portfolioPage.eyebrow;
  const pageTitle = textOrEmpty(
    selectedCategory?.h1 ?? selectedCategory?.title ?? portfolioPage.title,
  ) || "Портфолио Адамант Строй";
  const pageSubtitle = textOrEmpty(
    selectedCategory?.description ?? portfolioPage.subtitle,
  );
  const categoryImageUrl =
    getMediaUrl(selectedCategory?.heroImage, "card") ||
    getMediaUrl(selectedCategory?.heroImage);
  const categoryImageAlt = getMediaAlt(selectedCategory?.heroImage, pageTitle);
  const populatedCategorySlugs = getPopulatedPortfolioCategorySlugs(portfolioItems);
  const visiblePortfolioCategories = portfolioCategories.filter((category) =>
    populatedCategorySlugs.has(category.slug),
  );

  return (
    <main className="page inner-page portfolio-page" aria-label="Портфолио Адамант">
      <SiteHeader active="portfolio" phone={siteSettings.phonePrimary} />

      <section className="section section--projects" aria-labelledby="portfolio-title">
        <div className="section__intro section__intro--page section__intro--projects">
          {selectedCategory ? <span className="section__kicker">{pageEyebrow}</span> : null}
          <h1 id="portfolio-title">{pageTitle}</h1>
          {pageSubtitle ? <p>{pageSubtitle}</p> : null}
        </div>

        {categoryImageUrl ? (
          <figure className="catalog-category-hero">
            <img src={categoryImageUrl} alt={categoryImageAlt} loading="eager" decoding="async" />
          </figure>
        ) : null}

        <nav className="catalog-category-pills" aria-label="Категории портфолио">
          <Link
            className={`catalog-category-pill${!selectedCategory ? " is-active" : ""}`}
            href="/portfolio"
          >
            Все
          </Link>
          {visiblePortfolioCategories.map((category) => (
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
