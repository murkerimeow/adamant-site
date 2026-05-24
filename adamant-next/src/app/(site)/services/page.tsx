import {
  getCatalogItems,
  getMediaAlt,
  getMediaUrl,
  getServices,
  getServicesPage,
  getSiteSettings,
} from "@/site/cms";
import { SiteHeader } from "@/site/components/SiteHeader";
import { createPageMetadata } from "@/site/seo";

export const dynamic = "force-dynamic";

export const metadata = createPageMetadata({
  title: "Услуги Адамант Строй | Строительство домов, ремонт и отделка",
  description: "Строительство домов из бруса, газобетона и каркаса, отделка коммерческих помещений и ремонт квартир под ключ.",
  path: "/services",
});

const servicePrices: Record<string, string> = {
  "Дом из бруса": "от 5 000 000 ₽",
  "Дом из газобетона": "от 6 500 000 ₽",
  "Каркасный дом": "от 4 500 000 ₽",
  "Отделка коммерческого помещения": "от 2 000 000 ₽",
  "Ремонт квартир": "от 1 500 000 ₽",
};

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

        <div className="services-grid">
          {services.map((service) => {
            const catalogItem = catalogByTitle.get(service.title);
            const href = catalogItem
              ? `/catalog-item?item=${encodeURIComponent(catalogItem.itemKey)}&source=services`
              : "/catalog";

            return (
              <article
                key={service.id}
                className="blog-card service-card-blog"
                data-card-link={href}
                tabIndex={0}
              >
                <div className="blog-card__media">
                  <img
                    src={getMediaUrl(service.previewImage, "card") || getMediaUrl(service.previewImage)}
                    alt={getMediaAlt(service.previewImage, service.title)}
                  />
                </div>
                <div className="blog-card__body">
                  <h2>{service.title}</h2>
                  <p>{service.shortDescription}</p>
                  <div className="service-card-blog__price">
                    <span>{servicePrices[service.title] || "Цена по запросу"}</span>
                  </div>
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
