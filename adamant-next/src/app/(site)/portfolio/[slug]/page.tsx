import type { Metadata } from "next";
import { notFound } from "next/navigation";

import {
  getMediaAlt,
  getMediaUrl,
  getPortfolioItemBySlug,
  getPortfolioItems,
  getSiteSettings,
  splitParagraphs,
} from "@/site/cms";
import { formatArea, formatFloors } from "@/site/catalog-meta";
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
    .filter((image) => image.src)
    .filter(
      (image, index, images) =>
        images.findIndex((candidate) => candidate.src === image.src) === index,
    );
  const galleryGridImages = galleryImages.length
    ? Array.from({ length: Math.max(6, galleryImages.length) }, (_, index) => galleryImages[index % galleryImages.length]).slice(0, 6)
    : [];
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
    .slice(0, 3);

  return (
    <main className="page inner-page portfolio-detail-page" aria-label={`Проект ${item.title}`}>
      <SiteHeader active="portfolio" phone={siteSettings.phonePrimary} />

      <section className="section portfolio-detail portfolio-detail--object" aria-labelledby="portfolio-detail-title">
        <div className="portfolio-detail__object-summary">
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
        </div>

        {galleryGridImages.length ? (
          <div className="portfolio-detail__photo-grid" aria-label="Фотографии объекта">
            {galleryGridImages.map((image, index) => (
              <figure key={`${image.src}-grid-${index}`}>
                <img
                  src={image.src}
                  alt={image.alt}
                  loading={index < 3 ? "eager" : "lazy"}
                  decoding="async"
                  fetchPriority={index === 0 ? "high" : "auto"}
                />
              </figure>
            ))}
          </div>
        ) : null}

        <div className="portfolio-detail__content">
          <article>
            <h2>О проекте</h2>
            {paragraphs.map((paragraph, index) => (
              <p key={`${index}-${paragraph.slice(0, 24)}`}>{paragraph}</p>
            ))}
          </article>

          <article>
            <h2>Что было важно</h2>
            <ul>
              <li>Согласовать решения под бюджет и сроки.</li>
              <li>Сохранить прозрачность работ на каждом этапе.</li>
              <li>Передать результат с понятной документацией.</li>
            </ul>
          </article>
        </div>

        {similarItems.length ? (
          <section className="portfolio-detail__similar" aria-labelledby="portfolio-similar-title">
            <div className="home-section__head home-section__head--compact">
              <div>
                <span className="section__kicker">Похожие работы</span>
                <h2 id="portfolio-similar-title">Другие проекты</h2>
              </div>
              <a className="home-section__link" href="/portfolio">
                Все проекты <span aria-hidden="true">→</span>
              </a>
            </div>
            <div>
              {similarItems.map((similar) => {
                const similarImage =
                  getMediaUrl(similar.previewImage, "thumb") ||
                  getMediaUrl(similar.previewImage, "card") ||
                  getMediaUrl(similar.previewImage);

                return (
                  <a key={similar.id} className="home-portfolio-thumb" href={getPortfolioItemPath(similar)}>
                    {similarImage ? (
                      <img
                        src={similarImage}
                        alt={getMediaAlt(similar.previewImage, similar.title)}
                        loading="lazy"
                        decoding="async"
                      />
                    ) : null}
                    <span>{similar.title}</span>
                  </a>
                );
              })}
            </div>
          </section>
        ) : null}
      </section>
    </main>
  );
}
