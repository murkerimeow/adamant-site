import {
  getCatalogItems,
  getMediaAlt,
  getMediaUrl,
  getServices,
  getServicesPage,
  getSiteSettings,
} from "@/site/cms";
import { SiteHeader } from "@/site/components/SiteHeader";
import { getCatalogItemPath } from "@/site/routes";
import { createPageMetadata } from "@/site/seo";

export const dynamic = "force-dynamic";

export const metadata = createPageMetadata({
  title: "Услуги Адамант Строй | Строительство домов, ремонт и отделка",
  description:
    "Строительство домов из бруса, газобетона и каркаса, отделка коммерческих помещений и ремонт квартир под ключ.",
  path: "/services",
});

type ServiceCardMeta = {
  budget: "10-15" | "15plus" | "under10";
  format: "apartment" | "commercial" | "house";
  kind: "build" | "finish" | "repair";
  price: number;
  specs: [string, string, string];
};

const serviceCardMeta: Record<string, ServiceCardMeta> = {
  "Дом из бруса": {
    budget: "under10",
    format: "house",
    kind: "build",
    price: 5000000,
    specs: ["от 90 м²", "1-2 этажа", "под ключ"],
  },
  "Дом из газобетона": {
    budget: "under10",
    format: "house",
    kind: "build",
    price: 6500000,
    specs: ["от 120 м²", "1-2 этажа", "инженерия"],
  },
  "Каркасный дом": {
    budget: "under10",
    format: "house",
    kind: "build",
    price: 4500000,
    specs: ["от 80 м²", "1-2 этажа", "быстрый монтаж"],
  },
  "Отделка коммерческого помещения": {
    budget: "under10",
    format: "commercial",
    kind: "finish",
    price: 2000000,
    specs: ["офисы", "торговые залы", "контроль сроков"],
  },
  "Ремонт квартир": {
    budget: "under10",
    format: "apartment",
    kind: "repair",
    price: 1500000,
    specs: ["квартиры", "материалы", "смета"],
  },
};

const fallbackServiceMeta: ServiceCardMeta = {
  budget: "under10",
  format: "house",
  kind: "build",
  price: 0,
  specs: ["под ключ", "смета", "контроль"],
};

function formatPrice(value: number) {
  if (!value) return "Цена по запросу";

  return `от ${new Intl.NumberFormat("ru-RU").format(value)} ₽`;
}

function getSearchText(parts: Array<string | null | undefined>) {
  return parts.filter(Boolean).join(" ").toLowerCase();
}

export default async function ServicesPage() {
  const [siteSettings, servicesPage, services, catalogItems] = await Promise.all([
    getSiteSettings(),
    getServicesPage(),
    getServices(),
    getCatalogItems(),
  ]);

  const catalogByTitle = new Map(catalogItems.map((item) => [item.title, item]));

  return (
    <main className="page inner-page services-page" aria-label="Услуги Адамант">
      <SiteHeader active="services" phone={siteSettings.phonePrimary} />

      <section className="section section--services" aria-labelledby="services-title">
        <div className="section__intro section__intro--page">
          <span className="section__kicker">{servicesPage.eyebrow}</span>
          <h1 id="services-title">{servicesPage.title}</h1>
          <p>{servicesPage.subtitle}</p>
        </div>

        <form
          className="listing-filters listing-filters--services"
          data-listing-filters="services"
          aria-label="Фильтры услуг"
        >
          <label className="listing-filters__field">
            <span>Тип работ</span>
            <select name="kind" data-listing-filter="kind" aria-label="Тип работ">
              <option value="all">Тип работ</option>
              <option value="build">Строительство</option>
              <option value="finish">Отделка</option>
              <option value="repair">Ремонт</option>
            </select>
          </label>

          <label className="listing-filters__field">
            <span>Формат</span>
            <select name="format" data-listing-filter="format" aria-label="Формат">
              <option value="all">Формат</option>
              <option value="house">Дом</option>
              <option value="commercial">Коммерция</option>
              <option value="apartment">Квартира</option>
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
              placeholder="Поиск по услугам..."
              data-listing-search="true"
              aria-label="Поиск по услугам"
            />
          </label>
        </form>

        <div className="listing-grid listing-grid--services" data-filter-scope="services">
          {services.map((service) => {
            const catalogItem = catalogByTitle.get(service.title);
            const href = catalogItem ? getCatalogItemPath(catalogItem) : "/catalog";
            const meta = serviceCardMeta[service.title] ?? fallbackServiceMeta;
            const tagLabels = service.tags?.map((tag) => tag.label).filter(Boolean).join(" ") ?? "";

            return (
              <article
                key={service.id}
                className="listing-card"
                data-card-link={href}
                data-budget={meta.budget}
                data-format={meta.format}
                data-kind={meta.kind}
                data-search={getSearchText([service.title, service.shortDescription, tagLabels])}
                tabIndex={0}
              >
                <a className="listing-card__media" href={href} aria-label={service.title}>
                  <img
                    src={getMediaUrl(service.previewImage, "card") || getMediaUrl(service.previewImage)}
                    alt={getMediaAlt(service.previewImage, service.title)}
                  />
                </a>

                <div className="listing-card__body">
                  <h2>{service.title}</h2>
                  <p className="listing-card__description">{service.shortDescription}</p>
                  <ul className="listing-card__specs" aria-label="Особенности услуги">
                    {meta.specs.map((spec) => (
                      <li key={spec}>
                        <span className="listing-card__spec-icon" aria-hidden="true" />
                        {spec}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="listing-card__footer">
                  <strong>{formatPrice(meta.price)}</strong>
                  <a className="listing-card__arrow" href={href} aria-label={`Подробнее: ${service.title}`}>
                    <span aria-hidden="true">→</span>
                  </a>
                </div>
              </article>
            );
          })}
        </div>

        <p className="listing-empty" data-listing-empty="services" hidden>
          По этим фильтрам ничего не найдено.
        </p>
      </section>
    </main>
  );
}
