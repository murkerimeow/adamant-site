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
import { SiteHeader } from "@/site/components/SiteHeader";
import { getPortfolioItemPath } from "@/site/routes";
import { createPageMetadata } from "@/site/seo";

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
    title: item ? `${item.title} | Портфолио Адамант Строй` : "Портфолио Адамант Строй",
    description:
      item?.summary ||
      "Реализованный проект Адамант Строй: фото, описание работ и ключевые параметры объекта.",
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
  const galleryImages = [
    {
      alt: getMediaAlt(item.previewImage, item.title),
      src: imageUrl,
    },
    ...(item.gallery?.map((entry) => ({
      alt: getMediaAlt(entry.image, item.title),
      src: getMediaUrl(entry.image) || getMediaUrl(entry.image, "card"),
    })) ?? []),
  ]
    .filter((image) => image.src)
    .filter(
      (image, index, images) =>
        images.findIndex((candidate) => candidate.src === image.src) === index,
    );
  const paragraphs = splitParagraphs(item.description || item.summary);
  const similarItems = portfolioItems
    .filter((candidate) => candidate.id !== item.id)
    .slice(0, 3);

  return (
    <main className="page inner-page portfolio-detail-page" aria-label={`Проект ${item.title}`}>
      <SiteHeader active="portfolio" phone={siteSettings.phonePrimary} />

      <section className="section portfolio-detail" aria-labelledby="portfolio-detail-title">
        <nav className="page-breadcrumbs" aria-label="Хлебные крошки">
          <a href="/">Главная</a>
          <span aria-hidden="true">/</span>
          <a href="/portfolio">Портфолио</a>
          <span aria-hidden="true">/</span>
          <span>{item.title}</span>
        </nav>

        <div className="portfolio-detail__hero">
          <div className="portfolio-detail__gallery" data-portfolio-gallery-size={galleryImages.length}>
            {galleryImages.length ? (
              <div className="portfolio-detail__gallery-track">
                {galleryImages.map((image, index) => (
                  <figure key={`${image.src}-${index}`}>
                    <img
                      src={image.src}
                      alt={image.alt}
                      loading={index === 0 ? "eager" : "lazy"}
                      decoding="async"
                      fetchPriority={index === 0 ? "high" : "auto"}
                    />
                  </figure>
                ))}
              </div>
            ) : null}
            {galleryImages.length > 1 ? (
              <div className="portfolio-detail__dots" aria-label="Фотографии проекта">
                {galleryImages.map((image, index) => (
                  <span key={`${image.src}-dot-${index}`} />
                ))}
              </div>
            ) : null}
          </div>

          <aside className="portfolio-detail__summary">
            <span className="section__kicker">{item.category === "classic" ? "Классический проект" : "Современный проект"}</span>
            <h1 id="portfolio-detail-title">{item.title}</h1>
            <p>{item.summary}</p>

            <dl>
              {item.location ? (
                <div>
                  <dt>Локация</dt>
                  <dd>{item.location}</dd>
                </div>
              ) : null}
              {item.projectArea ? (
                <div>
                  <dt>Площадь</dt>
                  <dd>{item.projectArea} м²</dd>
                </div>
              ) : null}
              {item.tags?.slice(0, 4).map((tag) => (
                <div key={tag.id ?? tag.label}>
                  <dt>Особенность</dt>
                  <dd>{tag.label}</dd>
                </div>
              ))}
            </dl>

            <button className="js-open-estimate" type="button">
              Оставить заявку
            </button>
          </aside>
        </div>

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
