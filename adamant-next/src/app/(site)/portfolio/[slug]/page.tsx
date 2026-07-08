import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import { notFound } from "next/navigation";

import {
  getMediaAlt,
  getMediaUrl,
  getCatalogItems,
  getCatalogCoverMedia,
  getPortfolioItemBySlug,
  getSiteSettings,
  splitParagraphs,
} from "@/site/cms";
import {
  formatArea,
  formatFloors,
  formatProjectPrice,
  getCatalogCardMeta,
} from "@/site/catalog-meta";
import { PortfolioGallery } from "@/site/components/PortfolioGallery";
import { SiteHeader } from "@/site/components/SiteHeader";
import { getCatalogItemPath, getPortfolioItemPath } from "@/site/routes";
import { createPageMetadata, pickSeoDescription, pickSeoTitle, SITE_NAME, SITE_URL } from "@/site/seo";

export const dynamic = "force-dynamic";

type PortfolioDetailPageProps = {
  params: Promise<{ slug: string }>;
};

function getAbsoluteUrl(pathOrUrl: string) {
  return pathOrUrl.startsWith("http") ? pathOrUrl : `${SITE_URL}${pathOrUrl}`;
}

function stringifyStructuredData(data: unknown) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

export async function generateMetadata({
  params,
}: PortfolioDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const item = await getPortfolioItemBySlug(slug);

  return createPageMetadata({
    title: item
      ? pickSeoTitle(
          `Портфолио | ${SITE_NAME}`,
          item.seoTitle,
          `${item.title} | ${SITE_NAME}`,
          item.title,
        )
      : `Портфолио | ${SITE_NAME}`,
    description: item
      ? pickSeoDescription(
          item.summary || `Проект из портфолио АДАМАНТ Строй: ${item.title}.`,
          item.seoDescription,
          item.summary,
          item.description,
        )
      : undefined,
    index: Boolean(item),
    path: item ? getPortfolioItemPath(item) : "/portfolio",
  });
}

export default async function PortfolioDetailPage({ params }: PortfolioDetailPageProps) {
  const { slug } = await params;
  const [siteSettings, item, catalogItems] = await Promise.all([
    getSiteSettings(),
    getPortfolioItemBySlug(slug),
    getCatalogItems(),
  ]);

  if (!item) {
    notFound();
  }

  const imageUrl = getMediaUrl(item.previewImage, "card") || getMediaUrl(item.previewImage);
  const fullImageUrl = getMediaUrl(item.previewImage) || imageUrl;
  const catalogItem = typeof item.catalogItem === "object" ? item.catalogItem : null;
  const galleryImages = [
    {
      alt: getMediaAlt(item.previewImage, item.title),
      fullSrc: fullImageUrl,
      src: imageUrl,
    },
    ...(item.gallery?.map((entry) => ({
      alt: getMediaAlt(entry.image, item.title),
      fullSrc: getMediaUrl(entry.image),
      src: getMediaUrl(entry.image, "card") || getMediaUrl(entry.image),
    })) ?? []),
    ...(catalogItem
      ? [catalogItem.previewImage, catalogItem.detailImage, ...(catalogItem.gallery?.map((entry) => entry.image) ?? [])]
          .map((media) => ({
            alt: getMediaAlt(media, item.title),
            fullSrc: getMediaUrl(media),
            src: getMediaUrl(media, "card") || getMediaUrl(media),
          }))
      : []),
  ]
    .filter((image) => Boolean(image.src))
    .filter(
      (image, index, images) =>
        images.findIndex((candidate) => candidate.src === image.src) === index,
    );
  const galleryGridImages = galleryImages;
  const floorTag = item.tags?.find((tag) => /\d+\s*этаж/i.test(tag.label))?.label;
  const formatTag = item.tags?.find((tag) => /ключ|готов|отдел/i.test(tag.label))?.label;
  const categoryTitle =
    item.category && typeof item.category === "object"
      ? item.category.title
      : "Построенные дома";
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
      value: categoryTitle,
    },
  ];
  const paragraphs = splitParagraphs(item.description || item.summary);
  const linkedCatalogItemId =
    item.catalogItem && typeof item.catalogItem === "object"
      ? item.catalogItem.id
      : item.catalogItem;
  const similarItems = catalogItems
    .filter(
      (candidate) =>
        candidate.showInCatalog && candidate.id !== linkedCatalogItemId,
    )
    .slice(0, 4);
  const canonicalPath = getPortfolioItemPath(item);
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            item: `${SITE_URL}/`,
            name: "Главная",
            position: 1,
          },
          {
            "@type": "ListItem",
            item: `${SITE_URL}/portfolio`,
            name: "Портфолио",
            position: 2,
          },
          {
            "@type": "ListItem",
            item: getAbsoluteUrl(canonicalPath),
            name: item.title,
            position: 3,
          },
        ],
      },
      {
        "@id": `${getAbsoluteUrl(canonicalPath)}#portfolio-project`,
        "@type": "CreativeWork",
        about: categoryTitle,
        description: item.summary || paragraphs[0],
        image: galleryImages
          .map((image) => getAbsoluteUrl(image.fullSrc ?? image.src))
          .slice(0, 12),
        name: item.title,
        provider: {
          "@id": `${SITE_URL}/#organization`,
        },
        url: getAbsoluteUrl(canonicalPath),
      },
    ],
  };

  return (
    <main className="page inner-page portfolio-detail-page" aria-label={`Проект ${item.title}`}>
      <Script
        id={`portfolio-item-jsonld-${item.slug}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: stringifyStructuredData(structuredData) }}
      />
      <SiteHeader active="portfolio" phone={siteSettings.phonePrimary} />

      <div className="portfolio-detail portfolio-detail--object">
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
                const similarMeta = getCatalogCardMeta(similar);
                const similarCoverMedia = getCatalogCoverMedia(similar);
                const similarImage =
                  getMediaUrl(similarCoverMedia, "card") ||
                  getMediaUrl(similarCoverMedia);
                const similarHref = getCatalogItemPath(similar);
                const similarDescription =
                  similar.cardSummary ||
                  similar.description ||
                  "Современный проект загородного дома под ключ";

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
                          alt={getMediaAlt(similarCoverMedia, similar.title)}
                          loading="lazy"
                          decoding="async"
                        />
                      ) : null}
                      {similar.isHit ? (
                        <span className="portfolio-related-card__badge">★ Хит проект</span>
                      ) : null}
                    </div>
                    <div className="portfolio-related-card__body">
                      <h3>{similar.title}</h3>
                      <p>{similarDescription}</p>
                      <div>
                        <strong>
                          {similarMeta.price
                            ? `от ${formatProjectPrice(similarMeta.price)} ₽`
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
