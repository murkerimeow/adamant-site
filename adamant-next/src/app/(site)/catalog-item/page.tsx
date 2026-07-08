import Link from "next/link";
import Script from "next/script";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createElement } from "react";

import {
  getCatalogCoverMedia,
  getCatalogItem,
  getCatalogItems,
  getMediaAlt,
  getMediaUrl,
  getSiteSettings,
  splitParagraphs,
} from "@/site/cms";
import { ProductGallery } from "@/site/components/ProductGallery";
import { SiteHeader } from "@/site/components/SiteHeader";
import {
  formatArea,
  formatFloors,
  formatProjectPrice,
  formatRooms,
  getCatalogCardMeta,
} from "@/site/catalog-meta";
import { getCatalogItemPath } from "@/site/routes";
import { createPageMetadata, pickSeoDescription, pickSeoTitle, SITE_NAME, SITE_URL } from "@/site/seo";

export const dynamic = "force-dynamic";

type CatalogItemPageProps = {
  searchParams: Promise<{
    item?: string;
    slug?: string;
    source?: string;
  }>;
};

function getCatalogItemCanonical(item: { itemKey?: string | null; slug?: string | null }) {
  return getCatalogItemPath(item);
}

function getAbsoluteUrl(pathOrUrl: string) {
  return pathOrUrl.startsWith("http") ? pathOrUrl : `${SITE_URL}${pathOrUrl}`;
}

function stringifyStructuredData(data: unknown) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

type DetailIcon =
  | "area"
  | "bath"
  | "clock"
  | "floors"
  | "location"
  | "rooms";

const productPrices: Record<string, string> = {
  timber: "от 5 000 000 ₽",
  gasbeton: "от 6 500 000 ₽",
  frame: "от 4 500 000 ₽",
  commercial: "от 2 000 000 ₽",
  renovation: "от 1 500 000 ₽",
};

const backTargets = {
  catalog: { active: "catalog", href: "/catalog", label: "Каталог" },
  portfolio: { active: "portfolio", href: "/portfolio", label: "Портфолио" },
  services: { active: "services", href: "/services", label: "Услуги" },
} as const;

const defaultBenefits = [
  "Панорамное остекление и много света",
  "Открытая терраса для отдыха с семьей",
  "Энергоэффективные материалы и системы отопления",
  "Продуманная планировка под повседневную жизнь",
  "Контроль качества на каждом этапе строительства",
] as const;

const realizationSteps = [
  { title: "Проектирование", text: "Архитектурная проработка и инженерные решения.", time: "3 недели" },
  { title: "Фундамент", text: "Устройство надежного основания под проект.", time: "4 недели" },
  { title: "Строительство", text: "Возведение коробки дома и кровельные работы.", time: "16 недель" },
  { title: "Инженерные работы", text: "Монтаж коммуникаций, отопления и вентиляции.", time: "8 недель" },
  { title: "Отделка и сдача", text: "Чистовая отделка, благоустройство и приемка.", time: "6 недель" },
] as const;

function DetailIconSvg({ type }: { type: DetailIcon }) {
  const commonProps = {
    fill: "none",
    stroke: "currentColor",
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    strokeWidth: 1.8,
  };

  if (type === "floors") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M5 6.5h14" {...commonProps} />
        <path d="M5 12h14" {...commonProps} />
        <path d="M5 17.5h14" {...commonProps} />
      </svg>
    );
  }

  if (type === "rooms") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M7 19V5h10v14" {...commonProps} />
        <path d="M4.5 19h15" {...commonProps} />
        <path d="M9.5 9.5h5" {...commonProps} />
      </svg>
    );
  }

  if (type === "bath") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M5 12.5h14v2.2a4.3 4.3 0 0 1-4.3 4.3H9.3A4.3 4.3 0 0 1 5 14.7v-2.2Z" {...commonProps} />
        <path d="M7 12.5V7.2A2.2 2.2 0 0 1 9.2 5h.5" {...commonProps} />
        <path d="M8.2 19 7 21" {...commonProps} />
        <path d="m16.8 19 1.2 2" {...commonProps} />
      </svg>
    );
  }

  if (type === "clock") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="7.5" {...commonProps} />
        <path d="M12 7.8v4.6l3 1.8" {...commonProps} />
      </svg>
    );
  }

  if (type === "location") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 21s6-5.2 6-10.4A6 6 0 1 0 6 10.6C6 15.8 12 21 12 21Z" {...commonProps} />
        <circle cx="12" cy="10.7" r="2.1" {...commonProps} />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4.5 11.2 12 5l7.5 6.2" {...commonProps} />
      <path d="M6.6 10.2v8.3h10.8v-8.3" {...commonProps} />
      <path d="M10.1 18.5v-4.7h3.8v4.7" {...commonProps} />
    </svg>
  );
}

function findTag(tags: string[], pattern: RegExp, fallback: string) {
  return tags.find((tag) => pattern.test(tag)) || fallback;
}

function getParagraphs(text: string) {
  const paragraphs = splitParagraphs(text);
  return paragraphs.length ? paragraphs : [text];
}

export async function generateMetadata({
  searchParams,
}: CatalogItemPageProps): Promise<Metadata> {
  const params = await searchParams;
  const item = await getCatalogItem({
    itemKey: params.item,
    slug: params.slug,
  });

  if (!item) {
    return createPageMetadata({
      title: `Проект не найден | ${SITE_NAME}`,
      description: "Проект не найден или снят с публикации.",
      index: false,
      path: "/catalog",
    });
  }

  return createPageMetadata({
    title: pickSeoTitle(`${item.title} | ${SITE_NAME}`, item.seoTitle),
    description: pickSeoDescription(
      item.cardSummary ||
        item.description ||
        "Проект дома от АДАМАНТ Строй для строительства под ключ.",
      item.seoDescription,
      item.cardSummary,
      item.description,
    ),
    path: getCatalogItemCanonical(item),
  });
}

export default async function CatalogItemPage({
  searchParams,
}: CatalogItemPageProps) {
  const params = await searchParams;
  const source =
    params.source === "services" || params.source === "portfolio"
      ? params.source
      : "catalog";

  const [siteSettings, item, catalogItems] = await Promise.all([
    getSiteSettings(),
    getCatalogItem({
      itemKey: params.item,
      slug: params.slug,
    }),
    getCatalogItems(),
  ]);

  if (!item) {
    notFound();
  }

  const backTarget = backTargets[source];
  const relatedItems = catalogItems
    .filter((candidate) => candidate.id !== item.id && candidate.showInCatalog)
    .slice(0, 3);
  const coverMedia = getCatalogCoverMedia(item);
  const arrayGalleryImages =
    item.gallery?.map((entry) => ({
      alt: getMediaAlt(entry.image, item.title),
      src: getMediaUrl(entry.image, "card") || getMediaUrl(entry.image),
      thumbSrc:
        getMediaUrl(entry.image, "thumb") ||
        getMediaUrl(entry.image, "card") ||
        getMediaUrl(entry.image),
    })) ?? [];
  const projectGalleryImages = [
    {
      alt: getMediaAlt(coverMedia, item.title),
      src:
        getMediaUrl(coverMedia, "card") ||
        getMediaUrl(coverMedia) ||
        getMediaUrl(item.detailImage, "card") ||
        getMediaUrl(item.detailImage),
      thumbSrc:
        getMediaUrl(coverMedia, "thumb") ||
        getMediaUrl(coverMedia, "card") ||
        getMediaUrl(coverMedia),
    },
    {
      alt: getMediaAlt(item.detailImage, item.title),
      src:
        getMediaUrl(item.detailImage, "card") ||
        getMediaUrl(item.detailImage) ||
        getMediaUrl(item.previewImage, "card") ||
        getMediaUrl(item.previewImage),
      thumbSrc:
        getMediaUrl(item.detailImage, "thumb") ||
        getMediaUrl(item.detailImage, "card") ||
        getMediaUrl(item.detailImage),
    },
    ...arrayGalleryImages,
  ]
    .filter((image) => image.src)
    .filter(
      (image, index, images) =>
        images.findIndex((candidate) => candidate.src === image.src) === index,
    )
    .slice(0, 8);
  const galleryImages = projectGalleryImages;

  const meta = getCatalogCardMeta(item);
  const productPrice = `от ${formatProjectPrice(meta.price)} ₽`;
  const productPriceValue = productPrice.replace(/^от\s*/i, "");
  const tagLabels = item.tags?.map((tag) => tag.label).filter(Boolean) ?? [];
  const area = item.area ? formatArea(item.area) : findTag(tagLabels, /(м²|м2|м\^2|кв)/i, meta.area);
  const floors = item.floors ? formatFloors(item.floors) : findTag(tagLabels, /этаж/i, meta.floors);
  const rooms = item.rooms ? formatRooms(item.rooms) : findTag(tagLabels, /(комнат|спальн)/i, meta.rooms);
  const bathrooms = findTag(tagLabels, /(сануз|ванн)/i, "2 санузла");
  const customBenefits =
    item.advantages?.map((entry) => entry.text).filter(Boolean) ?? [];
  const benefitsSource = customBenefits.length
    ? customBenefits
    : [...tagLabels, ...defaultBenefits];
  const benefits = benefitsSource
    .filter((label, index, labels) => labels.indexOf(label) === index)
    .slice(0, 5);
  const descriptionParagraphs = getParagraphs(item.description);
  const customPlanCards =
    item.layouts
      ?.map((plan, index) => ({
        title: plan.title || `План ${index + 1}`,
        meta: plan.meta || "",
        image: getMediaUrl(plan.image, "card") || getMediaUrl(plan.image),
      }))
      .filter((plan) => plan.title || plan.meta || plan.image) ?? [];
  const planCards = customPlanCards.length
    ? customPlanCards
    : [
        { title: "1 этаж", meta: "", image: "" },
        { title: "2 этаж", meta: "", image: "" },
      ];
  const model3dUrl = getMediaUrl(item.model3d);
  const relatedCards = relatedItems.length
    ? relatedItems
    : catalogItems.filter((candidate) => candidate.id !== item.id).slice(0, 4);
  const visibleRelatedCards = relatedCards.length
    ? Array.from({ length: Math.min(4, Math.max(relatedCards.length, 4)) }, (_, index) => relatedCards[index % relatedCards.length])
    : [];
  const specs = [
    { icon: "area" as const, label: "Площадь", value: area },
    { icon: "floors" as const, label: "Этажность", value: floors },
    { icon: "rooms" as const, label: "Комнаты", value: rooms },
    { icon: "bath" as const, label: "Санузлы", value: bathrooms },
    { icon: "clock" as const, label: "Срок строительства", value: "7 месяцев" },
    { icon: "location" as const, label: "Локация", value: "Лен. область" },
  ];
  const heroSummary =
    item.cardSummary ||
    descriptionParagraphs[0] ||
    "Современный проект загородного дома под ключ.";
  const canonicalPath = getCatalogItemCanonical(item);
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
            item: `${SITE_URL}/catalog`,
            name: "Проекты",
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
        "@id": `${getAbsoluteUrl(canonicalPath)}#product`,
        "@type": "Product",
        additionalProperty: [
          { "@type": "PropertyValue", name: "Площадь", value: area },
          { "@type": "PropertyValue", name: "Этажность", value: floors },
          { "@type": "PropertyValue", name: "Количество комнат", value: rooms },
        ],
        brand: {
          "@id": `${SITE_URL}/#organization`,
        },
        category: "Проект загородного дома",
        description: heroSummary,
        image: galleryImages.map((image) => getAbsoluteUrl(image.src)).slice(0, 8),
        name: item.title,
        offers: meta.price
          ? {
              "@type": "Offer",
              availability: "https://schema.org/InStock",
              price: meta.price,
              priceCurrency: "RUB",
              url: getAbsoluteUrl(canonicalPath),
            }
          : undefined,
        sku: item.slug || item.itemKey,
        url: getAbsoluteUrl(canonicalPath),
      },
    ],
  };

  return (
    <main className="page inner-page product-page product-page--catalog" aria-label="Карточка проекта Адамант">
      <Script
        id={`catalog-item-jsonld-${item.slug || item.itemKey}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: stringifyStructuredData(structuredData) }}
      />
      <SiteHeader active={backTarget.active} phone={siteSettings.phonePrimary} />

      <section
        className="product-detail product-detail--catalog-card"
        aria-labelledby="product-title"
        data-product-page
        data-cms-product="true"
      >
        <nav className="product-breadcrumbs" aria-label="Хлебные крошки">
          <Link href="/">Главная</Link>
          <span aria-hidden="true">/</span>
          <Link href={backTarget.href}>{backTarget.label}</Link>
          <span aria-hidden="true">/</span>
          <span>{item.title}</span>
        </nav>

        <div className="product-hero-card">
          <div className="product-hero-media-stack">
            {item.isHit ? (
              <span className="product-hero-hit">
                <span aria-hidden="true">★</span> Хит проект
              </span>
            ) : null}
            {galleryImages.length ? (
              <ProductGallery images={galleryImages} title={item.title} />
            ) : null}
          </div>

          <aside className="product-hero-info">
            <span className="product-hero-info__eyebrow">Проект загородного дома</span>
            <h1 id="product-title" data-product-title>
              {item.title}
            </h1>
            <p className="product-hero-info__location">
              <DetailIconSvg type="location" />
              Санкт-Петербург и Ленинградская область
            </p>
            <p className="product-hero-info__summary">{heroSummary}</p>
            {descriptionParagraphs[0] !== heroSummary ? (
              <p className="product-hero-info__summary product-hero-info__summary--secondary">
                {descriptionParagraphs[0]}
              </p>
            ) : null}

            <div className="product-hero-info__specs" aria-label="Главные характеристики">
              {specs.slice(0, 4).map((spec) => (
                <article key={`hero-${spec.label}`}>
                  <span>
                    <DetailIconSvg type={spec.icon} />
                  </span>
                  <div>
                    <small>{spec.label}</small>
                    <strong>{spec.value}</strong>
                  </div>
                </article>
              ))}
            </div>

            <div className="product-hero-info__price">
              <span>Стоимость строительства</span>
              <div className="product-hero-info__price-row">
                <span>от</span>
                <strong>{productPriceValue}</strong>
                <em aria-hidden="true">*</em>
              </div>
            </div>

            <div className="product-hero-info__actions">
              <button
                className="product-hero-info__button js-open-estimate"
                type="button"
                data-estimate-service={item.title}
              >
                Хочу такой дом
              </button>
              <Link className="product-hero-info__mortgage" href="/mortgage#mortgage-calculator">
                Рассчитать ипотеку
              </Link>
            </div>

            <p className="product-hero-info__notice">
              <span aria-hidden="true">*</span> Стоимость приблизительная. Стоимость Вашего проекта может значительно отличаться от указанной.
            </p>
          </aside>
        </div>

        <div className="product-info-grid">
          <article className="product-info-card" data-product-description>
            <h2>О проекте</h2>
            {descriptionParagraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </article>

          <article className="product-info-card product-info-card--benefits">
            <h2>Преимущества</h2>
            <ul>
              {benefits.map((benefit) => (
                <li key={benefit}>{benefit}</li>
              ))}
            </ul>
          </article>
        </div>

        <section className="product-section" aria-labelledby="product-steps-title">
          <h2 id="product-steps-title">Этапы реализации</h2>
          <div className="product-steps">
            {realizationSteps.map((step, index) => (
              <article className="product-step-card" key={step.title}>
                <span>{index + 1}</span>
                <div>
                  <h3>{step.title}</h3>
                  <p>{step.text}</p>
                  <small>{step.time}</small>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="product-section" aria-labelledby="product-plans-title">
          <h2 id="product-plans-title">Планировка</h2>
          <p className="product-section__lead">
            Посмотрите модель со всех сторон, приблизьте детали и оцените объем будущего дома
          </p>
          <div className="product-plans">
            {planCards.map((plan, index) => (
              <article className="product-plan-card" key={plan.title}>
                <div>
                  <h3>{plan.title}</h3>
                  <p>{plan.meta}</p>
                </div>
                {plan.image ? (
                  <img src={plan.image} alt={plan.title} loading="lazy" decoding="async" />
                ) : (
                  <div className={`product-plan-card__drawing product-plan-card__drawing--${index + 1}`} aria-hidden="true">
                    <span />
                    <span />
                    <span />
                    <span />
                    <span />
                  </div>
                )}
                <span className="product-plan-card__zoom" aria-hidden="true">⌕</span>
              </article>
            ))}
          </div>
        </section>

        <section className="product-section product-plot-lead" aria-labelledby="product-plot-title">
          <div className="product-plot-lead__form-card">
            <h2 id="product-plot-title">Поможем подобрать участок</h2>
            <p>
              Посмотрите модель со всех сторон, приблизьте детали и оцените объем будущего дома.
            </p>
            <form className="product-plot-form contact-form">
              <input name="service" type="hidden" value={`Подбор участка: ${item.title}`} />
              <input name="name" type="text" placeholder="Имя" />
              <input name="phone" type="tel" placeholder="Телефон *" required />
              <input name="email" type="email" placeholder="E-mail" />
              <textarea name="message" placeholder="Ваши пожелания по участку" />
              <label>
                <input name="privacy" type="checkbox" required />
                <span>Согласен на обработку персональных данных</span>
              </label>
              <button type="submit">Отправить заявку</button>
            </form>
          </div>
          <img
            className="product-plot-lead__image"
            src="/plot-selection.webp"
            alt="Модульный загородный дом на участке"
            loading="lazy"
            decoding="async"
          />
        </section>

        {model3dUrl ? (
          <section className="product-section product-section--tour" aria-labelledby="product-tour-title">
            <Script
              src="https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js"
              strategy="lazyOnload"
              type="module"
            />
            <div className="product-tour-card">
              <div className="product-tour-card__copy">
                <h2 id="product-tour-title">3D-обзор каркасного дома</h2>
                <p>
                  Посмотрите модель со всех сторон, приблизьте детали и оцените объем будущего дома.
                </p>
              </div>
              <div className="product-tour-card__media">
                {createElement("model-viewer", {
                  alt: `3D-модель проекта ${item.title}`,
                  "auto-rotate": true,
                  "camera-controls": true,
                  "camera-orbit": "35deg 64deg 105%",
                  "environment-image": "neutral",
                  exposure: "1.08",
                  "field-of-view": "32deg",
                  "interaction-prompt": "auto",
                  loading: "lazy",
                  "shadow-intensity": "0.78",
                  "shadow-softness": "0.72",
                  src: model3dUrl,
                  className: "product-model-viewer",
                  style: { height: "100%", width: "100%" },
                })}
              </div>
            </div>
          </section>
        ) : null}

        <aside className="product-section product-mortgage-banner" aria-labelledby="product-mortgage-title">
          <div className="product-mortgage-banner__content">
            <h2 id="product-mortgage-title">Постройте дом в ипотеку</h2>
            <p>
              Поможем подобрать банк, подготовить документы и пройти согласование для строительства дома под ключ
            </p>
            <div className="product-mortgage-banner__actions">
              <Link className="product-mortgage-banner__primary" href="/mortgage">
                Получить консультацию
              </Link>
              <Link className="product-mortgage-banner__secondary" href="/mortgage#mortgage-calculator">
                Перейти в раздел
              </Link>
            </div>
            <div className="product-mortgage-banner__banks" aria-label="Банки-партнеры">
              <span className="product-mortgage-banner__bank product-mortgage-banner__bank--sber">СБЕР</span>
              <span className="product-mortgage-banner__bank product-mortgage-banner__bank--vtb">ВТБ</span>
              <span className="product-mortgage-banner__bank product-mortgage-banner__bank--tbank">Т-БАНК</span>
            </div>
          </div>
          <img
            src="/mortgage-banner-new.webp"
            alt="Загородный дом для строительства в ипотеку"
            loading="lazy"
            decoding="async"
          />
        </aside>

        {visibleRelatedCards.length ? (
          <section className="product-section product-section--related" aria-labelledby="product-related-title">
            <h2 id="product-related-title">Похожие проекты</h2>
            <div className="product-related">
              {visibleRelatedCards.map((related, index) => {
                const href = getCatalogItemPath(related);
                const relatedMeta = getCatalogCardMeta(related);
                const relatedCoverMedia = getCatalogCoverMedia(related);
                const relatedDescription = related.cardSummary || related.description || "";
                const relatedImage =
                  getMediaUrl(relatedCoverMedia, "card") ||
                  getMediaUrl(relatedCoverMedia);

                return (
                  <article className="product-related-card" data-card-link={href} tabIndex={0} key={`${related.id}-${index}`}>
                    {relatedImage ? (
                      <img
                        src={relatedImage}
                        alt={getMediaAlt(relatedCoverMedia, related.title)}
                        loading="lazy"
                        decoding="async"
                      />
                    ) : null}
                    <div>
                      <h3>{related.title}</h3>
                      {relatedDescription ? <p>{relatedDescription}</p> : null}
                      <strong>от {formatProjectPrice(relatedMeta.price)} ₽</strong>
                    </div>
                    <a href={href} aria-label={`Смотреть проект ${related.title}`}>Подробнее</a>
                  </article>
                );
              })}
            </div>
          </section>
        ) : null}
      </section>
    </main>
  );
}
