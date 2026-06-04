import type { CSSProperties } from "react";

import {
  getCatalogCategories,
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
import { createPageMetadata } from "@/site/seo";

export const dynamic = "force-dynamic";

export const metadata = createPageMetadata({
  title: "Каталог проектов домов | Адамант Строй",
  description:
    "Каталог проектов загородных домов для строительства под ключ: современные, классические и индивидуальные решения.",
  path: "/catalog",
});

const fallbackCatalogPrice = 8900000;

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
  return "under120";
}

function getBudgetGroup(price: number) {
  if (price >= 15000000) return "15plus";
  if (price >= 10000000) return "10-15";
  return "under10";
}

function formatCompactPrice(value: number) {
  const millions = value / 1000000;
  const label = Number.isInteger(millions) ? String(millions) : millions.toFixed(1).replace(".", ",");

  return `${label} млн ₽`;
}

function getFloorsGroup(floors: string) {
  const value = getNumber(floors);

  if (value >= 3) return "threeplus";
  if (value === 2) return "two";
  return "one";
}

function getRoomsGroup(rooms: string) {
  const value = getNumber(rooms);

  if (value >= 5) return "fiveplus";
  if (value === 4) return "four";
  return "upto3";
}

function getSearchText(parts: Array<string | null | undefined>) {
  return parts.filter(Boolean).join(" ").toLowerCase();
}

export default async function CatalogPage() {
  const [siteSettings, catalogPage, catalogItems, catalogCategories] = await Promise.all([
    getSiteSettings(),
    getCatalogPage(),
    getCatalogItems(),
    getCatalogCategories(),
  ]);

  const items = catalogItems.filter((item) => item.showInCatalog);
  const prices = items.map((item) => getCatalogCardMeta(item).price);
  const minCatalogPrice = prices.length ? Math.min(...prices) : fallbackCatalogPrice;
  const maxCatalogPrice = prices.length ? Math.max(...prices) : fallbackCatalogPrice;

  return (
    <main className="page inner-page catalog-page" aria-label="Каталог Адамант">
      <SiteHeader active="catalog" phone={siteSettings.phonePrimary} />

      <div className="catalog-mobile-tools" data-catalog-mobile-tools>
        <label className="catalog-mobile-tools__search">
          <span>Поиск</span>
          <input
            type="search"
            placeholder="Поиск по проектам..."
            data-mobile-listing-search="catalog"
            aria-label="Поиск по проектам"
          />
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="10.7" cy="10.7" r="5.6" />
            <path d="m15.1 15.1 4.2 4.2" />
          </svg>
        </label>
        <button
          className="catalog-mobile-tools__filter"
          type="button"
          data-mobile-filters-toggle="catalog"
          aria-label="Открыть фильтры"
          aria-expanded="false"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M4 6h16" />
            <path d="M7 12h10" />
            <path d="M10 18h4" />
          </svg>
        </button>
      </div>

      <section className="section section--projects" aria-labelledby="catalog-title">
        <div className="section__intro section__intro--page section__intro--projects">
          <span className="section__kicker">{catalogPage.eyebrow}</span>
          <h1 id="catalog-title">Проекты загородных домов</h1>
          <p>{catalogPage.subtitle}</p>
        </div>

        <div className="catalog-mobile-tools catalog-mobile-tools--inline" data-catalog-mobile-tools>
          <label className="catalog-mobile-tools__search">
            <span>Поиск</span>
            <input
              type="search"
              placeholder="Поиск по проектам..."
              data-mobile-listing-search="catalog"
              aria-label="Поиск по проектам"
            />
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="10.7" cy="10.7" r="5.6" />
              <path d="m15.1 15.1 4.2 4.2" />
            </svg>
          </label>
          <button
            className="catalog-mobile-tools__filter"
            type="button"
            data-mobile-filters-toggle="catalog"
            aria-label="Открыть фильтры"
            aria-expanded="false"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M4 6h16" />
              <path d="M7 12h10" />
              <path d="M10 18h4" />
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
                max={maxCatalogPrice}
                step={100000}
                defaultValue={minCatalogPrice}
                data-listing-range-min="price"
                aria-label="Минимальная стоимость"
              />
              <input
                type="range"
                name="priceMax"
                min={minCatalogPrice}
                max={maxCatalogPrice}
                step={100000}
                defaultValue={maxCatalogPrice}
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

        <nav className="catalog-category-pills" aria-label="Посадочные категории каталога">
          <a className="catalog-category-pill" href="/catalog" data-catalog-category-pill="all">
            Все
          </a>
          {catalogCategories.map((category) => (
            <a
              key={category.id}
              className="catalog-category-pill"
              href={getCatalogCategoryPath(category)}
              data-catalog-category-pill={category.slug}
            >
              {category.title}
            </a>
          ))}
        </nav>

        <div className="listing-grid listing-grid--catalog" data-filter-scope="catalog">
          {items.map((item) => {
            const href = getCatalogItemPath(item);
            const meta = getCatalogCardMeta(item);
            const coverMedia = getCatalogCoverMedia(item);
            const tagLabels = item.tags?.map((tag) => tag.label).filter(Boolean).join(" ") ?? "";
            const description = item.cardSummary || item.description;

            return (
              <article
                key={item.id}
                className="listing-card"
                data-card-link={href}
                data-area={getAreaGroup(meta.area)}
                data-budget={getBudgetGroup(meta.price)}
                data-price={meta.price}
                data-category={getCatalogLandingCategorySlug(item)}
                data-floors={getFloorsGroup(meta.floors)}
                data-rooms={getRoomsGroup(meta.rooms)}
                data-search={getSearchText([item.title, description, tagLabels])}
                tabIndex={0}
              >
                <div className="listing-card__media">
                  <a className="listing-card__media-link" href={href} aria-label={item.title}>
                    <img
                      src={getMediaUrl(coverMedia, "card") || getMediaUrl(coverMedia)}
                      alt={getMediaAlt(coverMedia, item.title)}
                      loading="lazy"
                      decoding="async"
                    />
                  </a>
                  {item.isHit ? (
                    <span className="listing-card__badge">
                      <svg viewBox="0 0 24 24" aria-hidden="true">
                        <path d="m12 2.8 2.8 5.8 6.4.9-4.6 4.5 1.1 6.4-5.7-3-5.7 3 1.1-6.4-4.6-4.5 6.4-.9L12 2.8Z" />
                      </svg>
                      Хит проект
                    </span>
                  ) : null}
                  <span className="listing-card__photos">
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M4 8h3l1.7-2h6.6L17 8h3v10H4V8Z" />
                      <circle cx="12" cy="13" r="3.2" />
                    </svg>
                    1/{meta.photoCount}
                  </span>
                </div>

                <div className="listing-card__body">
                  <h2>{item.title}</h2>
                  <p className="listing-card__description">{description}</p>
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
                    <span>от</span>
                    {formatPrice(meta.price)} ₽
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
