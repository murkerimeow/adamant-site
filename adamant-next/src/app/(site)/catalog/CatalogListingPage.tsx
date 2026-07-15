import type { CSSProperties } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import {
  getCatalogCategories,
  getCatalogCategoryBySlug,
  getCatalogItems,
  getCatalogPage,
  getCatalogCoverMedia,
  getCatalogLandingCategorySlug,
  getMediaAlt,
  getMediaUrl,
  getSiteSettings,
} from "@/site/cms";
import { SiteHeader } from "@/site/components/SiteHeader";
import { getCatalogCardMeta } from "@/site/catalog-meta";
import { getCatalogCategoryPath, getCatalogItemPath } from "@/site/routes";
import { createPageMetadata, pickSeoDescription, pickSeoTitle } from "@/site/seo";
import {
  buildBreadcrumbList,
  buildItemListStructuredData,
  buildStructuredDataGraph,
  buildWebPageStructuredData,
  stringifyStructuredData,
} from "@/site/structured-data";

export const dynamic = "force-dynamic";

const DEFAULT_META_TITLE = "Проекты загородных домов | Адамант Строй";
const DEFAULT_META_DESCRIPTION =
  "Каталог проектов загородных домов для строительства под ключ в Санкт-Петербурге и Ленинградской области.";

const PROJECT_CATEGORY_LINKS = [
  { title: "Каркасные дома", slug: "karkasnye-doma" },
  { title: "Дома из газобетона", slug: "dom-iz-gazobetona" },
  { title: "Дома из бруса", slug: "doma-iz-brusa" },
  { title: "Модульные дома", slug: "modulnye-doma" },
  { title: "Дачные дома", slug: "dachnye-doma" },
  { title: "Бани и сауны", slug: "bani" },
] as const;

function textOrEmpty(value?: string | null) {
  const normalized = value?.trim();
  return normalized || "";
}

function formatPrice(value: number) {
  return new Intl.NumberFormat("ru-RU").format(value);
}

function getNumber(value: string) {
  return Number(value.match(/\d+/)?.[0] ?? 0);
}

function getAreaGroup(area: string) {
  const value = getNumber(area);

  if (value >= 160) return "160plus";
  if (value >= 120) return "120-160";
  return value ? "under120" : "unknown";
}

function getBudgetGroup(price: number) {
  if (price >= 15000000) return "15plus";
  if (price >= 10000000) return "10-15";
  return price ? "under10" : "unknown";
}

function formatCompactPrice(value: number) {
  if (!value) return "0 ₽";
  const millions = value / 1000000;
  const label = Number.isInteger(millions)
    ? String(millions)
    : millions.toFixed(1).replace(".", ",");

  return `${label} млн ₽`;
}

function getFloorsGroup(floors: string) {
  const value = getNumber(floors);

  if (value >= 3) return "threeplus";
  if (value === 2) return "two";
  return value ? "one" : "unknown";
}

function getRoomsGroup(rooms: string) {
  const value = getNumber(rooms);

  if (value >= 5) return "fiveplus";
  if (value === 4) return "four";
  return value ? "upto3" : "unknown";
}

function getSearchText(parts: Array<string | null | undefined>) {
  return parts.filter(Boolean).join(" ").toLowerCase();
}

function shouldShowCatalogItem(item: { showInCatalog?: boolean | null }) {
  return item.showInCatalog === true;
}

function getPopulatedCatalogCategorySlugs(
  items: Awaited<ReturnType<typeof getCatalogItems>>,
) {
  return new Set(
    items
      .filter(shouldShowCatalogItem)
      .map(getCatalogLandingCategorySlug)
      .filter(Boolean),
  );
}

async function resolveCatalogContext(categorySlug?: string) {
  const [siteSettings, catalogPage, catalogItems, catalogCategories, selectedCategory] =
    await Promise.all([
      getSiteSettings(),
      getCatalogPage(),
      getCatalogItems(),
      getCatalogCategories(),
      categorySlug ? getCatalogCategoryBySlug(categorySlug) : Promise.resolve(null),
    ]);

  if (categorySlug && !selectedCategory) {
    notFound();
  }

  const items = catalogItems
    .filter(shouldShowCatalogItem)
    .filter((item) =>
      selectedCategory ? getCatalogLandingCategorySlug(item) === selectedCategory.slug : true,
    );

  return {
    catalogCategories,
    catalogItems,
    catalogPage,
    items,
    selectedCategory,
    siteSettings,
  };
}

export async function generateCatalogMetadata(): Promise<Metadata> {
  const catalogPage = await getCatalogPage();

  return createPageMetadata({
    title: pickSeoTitle(DEFAULT_META_TITLE, catalogPage.seoTitle, catalogPage.title),
    description: pickSeoDescription(
      DEFAULT_META_DESCRIPTION,
      catalogPage.seoDescription,
      catalogPage.subtitle,
    ),
    path: "/catalog",
  });
}

export async function generateCatalogCategoryMetadata(
  categorySlug: string,
): Promise<Metadata> {
  const [category, catalogItems] = await Promise.all([
    getCatalogCategoryBySlug(categorySlug),
    getCatalogItems(),
  ]);

  if (!category) {
    return createPageMetadata({
      title: DEFAULT_META_TITLE,
      description: DEFAULT_META_DESCRIPTION,
      index: false,
      path: `/catalog/category/${categorySlug}`,
    });
  }

  const populatedCategorySlugs = getPopulatedCatalogCategorySlugs(catalogItems);

  return createPageMetadata({
    title: pickSeoTitle(
      DEFAULT_META_TITLE,
      category.seoTitle,
      category.h1,
      category.title,
    ),
    description: pickSeoDescription(
      DEFAULT_META_DESCRIPTION,
      category.seoDescription,
      category.description,
    ),
    index: populatedCategorySlugs.has(category.slug),
    path: getCatalogCategoryPath(category),
  });
}

type CatalogListingPageProps = {
  categorySlug?: string;
};

export async function CatalogListingPage({ categorySlug }: CatalogListingPageProps = {}) {
  const { catalogCategories, catalogItems, catalogPage, items, selectedCategory, siteSettings } =
    await resolveCatalogContext(categorySlug);

  const prices = items
    .map((item) => getCatalogCardMeta(item).price)
    .filter((price) => price > 0);
  const minCatalogPrice = prices.length ? Math.min(...prices) : 0;
  const maxCatalogPrice = prices.length ? Math.max(...prices) : 0;
  const rangeMax = maxCatalogPrice > minCatalogPrice ? maxCatalogPrice : minCatalogPrice + 1;
  const pageEyebrow = textOrEmpty(selectedCategory?.title ?? catalogPage.eyebrow);
  const pageTitle = textOrEmpty(
    selectedCategory?.h1 ?? selectedCategory?.title ?? catalogPage.title,
  ) || "Проекты компании “АДАМАНТ Строй”";
  const pageSubtitle = textOrEmpty(
    selectedCategory?.description ?? catalogPage.subtitle,
  );
  const categoryImageUrl =
    getMediaUrl(selectedCategory?.heroImage, "card") ||
    getMediaUrl(selectedCategory?.heroImage);
  const categoryImageAlt = getMediaAlt(selectedCategory?.heroImage, pageTitle);
  const populatedCategorySlugs = getPopulatedCatalogCategorySlugs(catalogItems);
  const projectCategoryLinks = catalogCategories.length
    ? catalogCategories
        .filter((category) => populatedCategorySlugs.has(category.slug))
        .map((category) => ({
          href: getCatalogCategoryPath(category),
          slug: category.slug,
          title: category.title,
        }))
    : PROJECT_CATEGORY_LINKS.map((category) => ({
        ...category,
        href: `/catalog/category/${encodeURIComponent(category.slug)}`,
      }));
  const pagePath = selectedCategory ? getCatalogCategoryPath(selectedCategory) : "/catalog";
  const structuredData = buildStructuredDataGraph(
    buildBreadcrumbList(
      selectedCategory
        ? [
            { name: "Главная", path: "/" },
            { name: "Проекты", path: "/catalog" },
            { name: selectedCategory.title, path: pagePath },
          ]
        : [
            { name: "Главная", path: "/" },
            { name: "Проекты", path: "/catalog" },
          ],
    ),
    buildWebPageStructuredData({
      description: selectedCategory ? pageSubtitle : catalogPage.subtitle,
      path: pagePath,
      title: pageTitle,
    }),
    buildItemListStructuredData(
      items.map((item) => ({
        name: item.title,
        path: getCatalogItemPath(item),
      })),
    ),
  );

  return (
    <main className="page inner-page catalog-page" aria-label="Каталог Адамант">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: stringifyStructuredData(structuredData) }}
      />
      <SiteHeader active="catalog" phone={siteSettings.phonePrimary} />

      <section className="section section--projects" aria-labelledby="catalog-title">
        <div
          className={`section__intro section__intro--page section__intro--projects${
            selectedCategory ? "" : " catalog-projects-intro"
          }`}
        >
          {selectedCategory ? <span className="section__kicker">{pageEyebrow}</span> : null}
          <h1 id="catalog-title">
            {selectedCategory ? pageTitle : "Проекты компании “АДАМАНТ Строй”"}
          </h1>
          {selectedCategory && pageSubtitle ? <p>{pageSubtitle}</p> : null}
        </div>

        {categoryImageUrl ? (
          <figure className="catalog-category-hero">
            <img src={categoryImageUrl} alt={categoryImageAlt} loading="eager" decoding="async" />
          </figure>
        ) : null}

        <nav className="catalog-category-pills" aria-label="Категории проектов">
          <Link
            className={`catalog-category-pill${!selectedCategory ? " is-active" : ""}`}
            href="/catalog"
            data-catalog-category-pill="all"
          >
            Все
          </Link>
          {projectCategoryLinks.map((category) => (
            <a
              key={category.slug}
              className={`catalog-category-pill${
                selectedCategory?.slug === category.slug ? " is-active" : ""
              }`}
              href={category.href}
              data-catalog-category-pill={category.slug}
            >
              {category.title}
            </a>
          ))}
        </nav>

        <div
          className="catalog-projects-toolbar catalog-mobile-tools--inline"
          data-catalog-mobile-tools
        >
          <label className="catalog-mobile-tools__search">
            <span>Поиск</span>
            <input
              type="search"
              placeholder="Поиск"
              data-mobile-listing-search="catalog"
              aria-label="Поиск по проектам"
            />
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="10.7" cy="10.7" r="5.6" />
              <path d="m15.1 15.1 4.2 4.2" />
            </svg>
          </label>
          <label className="catalog-projects-toolbar__sort">
            <span>Сортировка</span>
            <select data-listing-sort="catalog" aria-label="Сортировка проектов">
              <option value="popular">По популярности</option>
              <option value="price-asc">Сначала дешевле</option>
              <option value="price-desc">Сначала дороже</option>
              <option value="area-desc">Сначала просторнее</option>
            </select>
          </label>
          <button
            className="catalog-projects-toolbar__filter"
            type="button"
            data-mobile-filters-toggle="catalog"
            aria-label="Открыть фильтры"
            aria-expanded="false"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M4 7h8" />
              <path d="M16 7h4" />
              <circle cx="14" cy="7" r="2" />
              <path d="M4 12h3" />
              <path d="M11 12h9" />
              <circle cx="9" cy="12" r="2" />
              <path d="M4 17h11" />
              <path d="M19 17h1" />
              <circle cx="17" cy="17" r="2" />
            </svg>
            <span>Фильтры</span>
            <svg
              className="catalog-projects-toolbar__chevron"
              viewBox="0 0 16 16"
              aria-hidden="true"
            >
              <path d="m4 6 4 4 4-4" />
            </svg>
          </button>
        </div>

        <form
          className="listing-filters listing-filters--catalog"
          data-listing-filters="catalog"
          aria-label="Фильтры каталога"
        >
          <label className="listing-filters__field listing-filters__field--search">
            <span>Поиск</span>
            <input
              type="search"
              name="search"
              placeholder="Поиск по проектам..."
              data-listing-search="true"
              aria-label="Поиск по проектам"
            />
          </label>

          <div className="listing-filters__field listing-filters__field--price">
            <span>Стоимость</span>
            <div
              className="listing-range"
              data-listing-range="price"
              style={
                {
                  "--range-from": "0%",
                  "--range-to": "100%",
                } as CSSProperties
              }
            >
              <div className="listing-range__head">
                <strong>Стоимость</strong>
                <em data-range-output>
                  {formatCompactPrice(minCatalogPrice)} - {formatCompactPrice(maxCatalogPrice)}
                </em>
              </div>
              <div className="listing-range__track" aria-hidden="true" />
              <input
                type="range"
                name="priceMin"
                min={minCatalogPrice}
                max={rangeMax}
                step={100000}
                defaultValue={minCatalogPrice}
                data-listing-range-min="price"
                aria-label="Минимальная стоимость"
              />
              <input
                type="range"
                name="priceMax"
                min={minCatalogPrice}
                max={rangeMax}
                step={100000}
                defaultValue={maxCatalogPrice || rangeMax}
                data-listing-range-max="price"
                aria-label="Максимальная стоимость"
              />
            </div>
          </div>

          <label className="listing-filters__field">
            <span>Площадь</span>
            <select name="area" data-listing-filter="area" aria-label="Площадь">
              <option value="all">Площадь</option>
              <option value="under120">до 120 м²</option>
              <option value="120-160">120-160 м²</option>
              <option value="160plus">от 160 м²</option>
            </select>
          </label>

          <label className="listing-filters__field">
            <span>Этажность</span>
            <select name="floors" data-listing-filter="floors" aria-label="Этажность">
              <option value="all">Этажность</option>
              <option value="one">1 этаж</option>
              <option value="two">2 этажа</option>
              <option value="threeplus">3+ этажа</option>
            </select>
          </label>

          <label className="listing-filters__field">
            <span>Комнат</span>
            <select name="rooms" data-listing-filter="rooms" aria-label="Комнат">
              <option value="all">Комнат</option>
              <option value="upto3">до 3 комнат</option>
              <option value="four">4 комнаты</option>
              <option value="fiveplus">5+ комнат</option>
            </select>
          </label>
        </form>

        <div className="listing-grid listing-grid--catalog" data-filter-scope="catalog">
          {items.map((item) => {
            const href = getCatalogItemPath(item);
            const meta = getCatalogCardMeta(item);
            const coverMedia = getCatalogCoverMedia(item);
            const coverSrc = getMediaUrl(coverMedia) || getMediaUrl(coverMedia, "card");
            const nightSrc =
              getMediaUrl(item.nightImage) || getMediaUrl(item.nightImage, "card");
            const tagLabels = item.tags?.map((tag) => tag.label).filter(Boolean).join(" ") ?? "";
            const description = item.cardSummary || item.description || "";

            return (
              <article
                key={item.id}
                className="listing-card catalog-project-card"
                data-card-link={href}
                data-area={getAreaGroup(meta.area)}
                data-budget={getBudgetGroup(meta.price)}
                data-price={meta.price}
                data-area-value={meta.area}
                data-category={getCatalogLandingCategorySlug(item)}
                data-floors={getFloorsGroup(meta.floors)}
                data-rooms={getRoomsGroup(meta.rooms)}
                data-search={getSearchText([item.title, description, tagLabels])}
                data-has-night-image={nightSrc ? "true" : "false"}
                tabIndex={0}
              >
                {coverSrc ? (
                  <img
                    className="catalog-project-card__background catalog-project-card__background--day"
                    src={coverSrc}
                    alt={getMediaAlt(coverMedia, item.title)}
                    loading="lazy"
                    decoding="async"
                  />
                ) : null}
                {nightSrc ? (
                  <img
                    className="catalog-project-card__background catalog-project-card__background--night"
                    src={nightSrc}
                    alt={getMediaAlt(item.nightImage, `Ночная визуализация проекта ${item.title}`)}
                    aria-hidden="true"
                    loading="lazy"
                    decoding="async"
                  />
                ) : null}

                <div className="listing-card__body catalog-project-card__content-overlay">
                  <h2>{item.title}</h2>
                  {description ? <p className="listing-card__description">{description}</p> : null}
                  <ul className="listing-card__specs" aria-label="Характеристики проекта">
                    <li className="listing-card__spec listing-card__spec--area">
                      <span className="listing-card__spec-icon" aria-hidden="true">
                        <svg viewBox="0 0 24 24">
                          <path d="M5 5h14v14H5V5Z" />
                          <path d="M5 10h4M15 5v4M19 14h-4M9 19v-4" />
                        </svg>
                      </span>
                      <span>
                        <strong>{meta.area}</strong>
                        <small>Площадь</small>
                      </span>
                    </li>
                    <li className="listing-card__spec listing-card__spec--floors">
                      <span className="listing-card__spec-icon" aria-hidden="true">
                        <svg viewBox="0 0 24 24">
                          <path d="m12 3 8 4-8 4-8-4 8-4Z" />
                          <path d="m20 12-8 4-8-4" />
                          <path d="m20 17-8 4-8-4" />
                        </svg>
                      </span>
                      <span>
                        <strong>{meta.floors}</strong>
                        <small>Этажность</small>
                      </span>
                    </li>
                    <li className="listing-card__spec listing-card__spec--rooms">
                      <span className="listing-card__spec-icon" aria-hidden="true">
                        <svg viewBox="0 0 24 24">
                          <path d="M4 11V6h5a3 3 0 0 1 3 3v2" />
                          <path d="M12 11V7h5a3 3 0 0 1 3 3v1" />
                          <path d="M4 11h16v7" />
                          <path d="M4 18v-7" />
                          <path d="M4 16h16" />
                        </svg>
                      </span>
                      <span>
                        <strong>{meta.rooms}</strong>
                        <small>Комнаты</small>
                      </span>
                    </li>
                  </ul>
                </div>

                <div className="listing-card__footer">
                  <strong>
                    {meta.price ? (
                      <>
                        <span>от</span>
                        {formatPrice(meta.price)} ₽
                      </>
                    ) : (
                      "Цена по запросу"
                    )}
                  </strong>
                  <a className="listing-card__button" href={href} aria-label={`Подробнее: ${item.title}`}>
                    Подробнее
                  </a>
                </div>
              </article>
            );
          })}
        </div>

        <p className="listing-empty" data-listing-empty="catalog" hidden>
          По этим фильтрам ничего не найдено.
        </p>
      </section>
    </main>
  );
}
