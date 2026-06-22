import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import {
  getMediaAlt,
  getMediaUrl,
  getPortfolioItemBySlug,
  getPortfolioItems,
  getSiteSettings,
  splitParagraphs,
} from "@/site/cms";
import { formatArea, formatFloors, formatProjectPrice } from "@/site/catalog-meta";
import { PortfolioGallery } from "@/site/components/PortfolioGallery";
import { SiteHeader } from "@/site/components/SiteHeader";
import { getPortfolioItemPath } from "@/site/routes";
import { createPageMetadata, SITE_NAME } from "@/site/seo";

export const dynamic = "force-dynamic";

type PortfolioDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: PortfolioDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const item = await getPortfolioItemBySlug(slug);

  return createPageMetadata({
    title: item ? item.seoTitle || `${item.title} | ${SITE_NAME}` : `Портфолио | ${SITE_NAME}`,
    description:
      item?.seoDescription ||
      item?.summary ||
      "Заполните SEO Description в Payload",
    index: Boolean(item),
    path: item ? getPortfolioItemPath(item) : "/portfolio",
  });
}

export default async function PortfolioDetailPage({ params }: PortfolioDetailPageProps) {
  const { slug } = await params;
  const [siteSettings, item, portfolioItems] = await Promise.all([
    getSiteSettings(),
    getPortfolioItemBySlug(slug),
    getPortfolioItems(),
  ]);

  if (!item) {
    notFound();
  }

  const imageUrl = getMediaUrl(item.previewImage) || getMediaUrl(item.previewImage, "card");
  const catalogItem = typeof item.catalogItem === "object" ? item.catalogItem : null;
  const galleryImages = [
    {
      alt: getMediaAlt(item.previewImage, item.title),
      src: imageUrl,
    },
    ...(item.gallery?.map((entry) => ({
      alt: getMediaAlt(entry.image, item.title),
      src: getMediaUrl(entry.image) || getMediaUrl(entry.image, "card"),
    })) ?? []),
    ...(catalogItem
      ? [catalogItem.previewImage, catalogItem.detailImage, ...(catalogItem.gallery?.map((entry) => entry.image) ?? [])]
          .map((media) => ({
            alt: getMediaAlt(media, item.title),
            src: getMediaUrl(media) || getMediaUrl(media, "card"),
          }))
      : []),
  ]
    .filter((image): image is { alt: string; src: string } => Boolean(image.src))
    .filter(
      (image, index, images) =>
        images.findIndex((candidate) => candidate.src === image.src) === index,
    );
  const galleryGridImages = galleryImages.slice(0, 6);
  const floorTag = item.tags?.find((tag) => /\d+\s*этаж/i.test(tag.label))?.label;
  const formatTag = item.tags?.find((tag) => /ключ|готов|отдел/i.test(tag.label))?.label;
  const metrics = [
    {
      label: "Площадь",
      value: item.projectArea
        ? formatArea(item.projectArea)
        : catalogItem?.area
          ? formatArea(catalogItem.area)
          : "Уточняется",
    },
    {
      label: "Этажность",
      value: catalogItem?.floors ? formatFloors(catalogItem.floors) : floorTag || "По проекту",
    },
    {
      label: "Формат",
      value: formatTag || "Готовый объект",
    },
    {
      label: "Категория",
      value: item.category === "classic" ? "Классический дом" : "Современный дом",
    },
  ];
  const paragraphs = splitParagraphs(item.description || item.summary);
  const similarItems = portfolioItems
    .filter((candidate) => candidate.id !== item.id)
    .slice(0, 4);

  return (
    <main className="page inner-page portfolio-detail-page" aria-label={`Проект ${item.title}`}>
      <SiteHeader active="portfolio" phone={siteSettings.phonePrimary} />

      <div className="section portfolio-detail portfolio-detail--object">
        <section className="portfolio-detail__object-summary" aria-labelledby="portfolio-detail-title">
          <div className="portfolio-detail__object-copy">
            <h1 id="portfolio-detail-title">{item.title}</h1>
            {item.location ? <span className="portfolio-detail__location">● {item.location}</span> : null}
            <p>{item.summary}</p>
            <button className="js-open-estimate" type="button" data-estimate-service={item.title}>
              Хочу такой же дом
            </button>
          </div>

          <dl className="portfolio-detail__metrics">
            {metrics.map((metric) => (
              <div key={metric.label}>
                <dt>{metric.label}</dt>
                <dd>{metric.value}</dd>
              </div>
            ))}
          </dl>
        </section>

        <PortfolioGallery images={galleryGridImages} />

        <section className="portfolio-detail__content" aria-labelledby="portfolio-about-title">
          <h2 id="portfolio-about-title">Описание</h2>
          {paragraphs.map((paragraph, index) => (
            <p key={`${index}-${paragraph.slice(0, 24)}`}>{paragraph}</p>
          ))}
        </section>

        <section className="portfolio-detail__consult" aria-labelledby="portfolio-consult-title">
          <div className="portfolio-detail__consult-copy">
            <h2 id="portfolio-consult-title">Хотите такой же дом?</h2>
            <p>
              Оставьте заявку на консультацию — мы подберем лучшее решение для вашего проекта.
            </p>
          </div>

          <form
            className="portfolio-detail__consult-form contact-form"
            aria-label={`Заявка по проекту ${item.title}`}
          >
            <input name="service" type="hidden" value={item.title} />
            <input name="name" type="text" placeholder="Ваше имя" aria-label="Ваше имя" />
            <input
              name="phone"
              type="tel"
              placeholder="Телефон *"
              aria-label="Телефон"
              required
            />
            <button type="submit">Получить консультацию</button>
            <label>
              <input name="privacy" type="checkbox" required />
              <span>
                Согласен на <Link href="/privacy">обработку персональных данных</Link>
              </span>
            </label>
            <p className="contact-form__status" aria-live="polite" />
          </form>
        </section>

        {similarItems.length ? (
          <section className="portfolio-detail__similar" aria-labelledby="portfolio-similar-title">
            <h2 id="portfolio-similar-title">
              Похожие проекты, которые мы можем для вас построить
            </h2>
            <div className="portfolio-detail__related-grid">
              {similarItems.map((similar) => {
                const similarCatalogItem =
                  typeof similar.catalogItem === "object" ? similar.catalogItem : null;
                const similarImage =
                  getMediaUrl(similar.previewImage) ||
                  getMediaUrl(similar.previewImage, "card") ||
                  getMediaUrl(similar.previewImage, "thumb");
                const similarHref = getPortfolioItemPath(similar);
                const similarPrice = similarCatalogItem?.price ?? 0;

                return (
                  <article
                    key={similar.id}
                    className="portfolio-related-card"
                    data-card-link={similarHref}
                    tabIndex={0}
                  >
                    <div className="portfolio-related-card__media">
                      {similarImage ? (
                        <img
                          src={similarImage}
                          alt={getMediaAlt(similar.previewImage, similar.title)}
                          loading="lazy"
                          decoding="async"
                        />
                      ) : null}
                      {similarCatalogItem?.isHit ? (
                        <span className="portfolio-related-card__badge">★ Хит проект</span>
                      ) : null}
                    </div>
                    <div className="portfolio-related-card__body">
                      <h3>{similar.title}</h3>
                      <p>{similar.summary}</p>
                      <div>
                        <strong>
                          {similarPrice
                            ? `от ${formatProjectPrice(similarPrice)} ₽`
                            : "Цена по запросу"}
                        </strong>
                        <Link href={similarHref}>Подробнее</Link>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        ) : null}
      </div>
    </main>
  );
}
