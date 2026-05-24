import {
  getCatalogItems,
  getCatalogPage,
  getMediaAlt,
  getMediaUrl,
  getSiteSettings,
} from "@/site/cms";
import { SiteHeader } from "@/site/components/SiteHeader";
import { createPageMetadata } from "@/site/seo";

export const dynamic = "force-dynamic";

export const metadata = createPageMetadata({
  title: "Каталог проектов домов | Адамант Строй",
  description:
    "Каталог проектов загородных домов для строительства под ключ: современные, классические и индивидуальные решения.",
  path: "/catalog",
});

type CatalogCardMeta = {
  area: string;
  floors: string;
  price: number;
  rooms: string;
};

const catalogCardMeta: Record<string, CatalogCardMeta> = {
  classic: {
    area: "175 м²",
    floors: "2 этажа",
    price: 16500000,
    rooms: "4 комнаты",
  },
  frame: {
    area: "98 м²",
    floors: "1 этаж",
    price: 8900000,
    rooms: "2 комнаты",
  },
  gasbeton: {
    area: "150 м²",
    floors: "2 этажа",
    price: 15900000,
    rooms: "4 комнаты",
  },
  modern: {
    area: "216 м²",
    floors: "2 этажа",
    price: 18100000,
    rooms: "5 комнат",
  },
  onefloor: {
    area: "100 м²",
    floors: "1 этаж",
    price: 5400000,
    rooms: "3 комнаты",
  },
  terrace: {
    area: "150 м²",
    floors: "2 этажа",
    price: 15900000,
    rooms: "4 комнаты",
  },
  timber: {
    area: "129 м²",
    floors: "1 этаж",
    price: 11800000,
    rooms: "3 комнаты",
  },
};

const fallbackCatalogMeta: CatalogCardMeta = {
  area: "120 м²",
  floors: "1 этаж",
  price: 8900000,
  rooms: "3 комнаты",
};

function formatPrice(value: number) {
  return `от ${new Intl.NumberFormat("ru-RU").format(value)} ₽`;
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
  const [siteSettings, catalogPage, catalogItems] = await Promise.all([
    getSiteSettings(),
    getCatalogPage(),
    getCatalogItems(),
  ]);

  const items = catalogItems.filter((item) => item.showInCatalog);

  return (
    <main className="page inner-page catalog-page" aria-label="Каталог Адамант">
      <SiteHeader active="catalog" phone={siteSettings.phonePrimary} />

      <section className="section section--projects" aria-labelledby="catalog-title">
        <div className="section__intro section__intro--page section__intro--projects">
          <span className="section__kicker">{catalogPage.eyebrow}</span>
          <h1 id="catalog-title">{catalogPage.title}</h1>
          <p>{catalogPage.subtitle}</p>
        </div>

        <form
          className="listing-filters listing-filters--catalog"
          data-listing-filters="catalog"
          aria-label="Фильтры каталога"
        >
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

          <label className="listing-filters__field">
            <span>Стоимость</span>
            <select name="budget" data-listing-filter="budget" aria-label="Стоимость">
              <option value="all">Стоимость</option>
              <option value="under10">до 10 млн ₽</option>
              <option value="10-15">10-15 млн ₽</option>
              <option value="15plus">от 15 млн ₽</option>
            </select>
          </label>

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
        </form>

        <div className="listing-grid listing-grid--catalog" data-filter-scope="catalog">
          {items.map((item) => {
            const href = `/catalog-item?item=${encodeURIComponent(item.itemKey)}&source=catalog`;
            const meta = catalogCardMeta[item.itemKey] ?? fallbackCatalogMeta;
            const tagLabels = item.tags?.map((tag) => tag.label).filter(Boolean).join(" ") ?? "";
            const description = item.cardSummary || item.description;

            return (
              <article
                key={item.id}
                className="listing-card"
                data-card-link={href}
                data-area={getAreaGroup(meta.area)}
                data-budget={getBudgetGroup(meta.price)}
                data-floors={getFloorsGroup(meta.floors)}
                data-rooms={getRoomsGroup(meta.rooms)}
                data-search={getSearchText([item.title, description, tagLabels])}
                tabIndex={0}
              >
                <a className="listing-card__media" href={href} aria-label={item.title}>
                  <img
                    src={getMediaUrl(item.previewImage, "card") || getMediaUrl(item.previewImage)}
                    alt={getMediaAlt(item.previewImage, item.title)}
                  />
                </a>

                <div className="listing-card__body">
                  <h2>{item.title}</h2>
                  <p className="listing-card__description">{description}</p>
                  <ul className="listing-card__specs" aria-label="Характеристики проекта">
                    <li>
                      <span className="listing-card__spec-icon" aria-hidden="true" />
                      {meta.area}
                    </li>
                    <li>
                      <span className="listing-card__spec-icon" aria-hidden="true" />
                      {meta.floors}
                    </li>
                    <li>
                      <span className="listing-card__spec-icon" aria-hidden="true" />
                      {meta.rooms}
                    </li>
                  </ul>
                </div>

                <div className="listing-card__footer">
                  <strong>{formatPrice(meta.price)}</strong>
                  <a className="listing-card__arrow" href={href} aria-label={`Подробнее: ${item.title}`}>
                    <span aria-hidden="true">→</span>
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
