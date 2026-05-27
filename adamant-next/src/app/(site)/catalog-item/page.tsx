import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import {
  getCatalogItem,
  getCatalogItems,
  getMediaAlt,
  getMediaUrl,
  getSiteSettings,
  splitParagraphs,
} from "@/site/cms";
import { ProductGallery } from "@/site/components/ProductGallery";
import { SiteHeader } from "@/site/components/SiteHeader";
import { getCatalogItemPath } from "@/site/routes";
import { createPageMetadata } from "@/site/seo";

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

const fallbackImages = ["/home-main-new.webp", "/request-house.jpg", "/main1.jpg", "/main2.jpg"];

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
      title: "Проект дома | Адамант Строй",
      description:
        "Проекты загородных домов для строительства под ключ в Санкт-Петербурге и Ленинградской области.",
      path: "/catalog",
    });
  }

  return createPageMetadata({
    title: `${item.title} | Адамант Строй`,
    description:
      item.cardSummary ||
      item.description ||
      "Описание проекта дома, галерея, стоимость и заявка на расчет строительства под ключ.",
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
  const galleryImages = [
    {
      alt: getMediaAlt(item.previewImage, item.title),
      src:
        getMediaUrl(item.previewImage) ||
        getMediaUrl(item.previewImage, "card") ||
        getMediaUrl(item.detailImage) ||
        getMediaUrl(item.detailImage, "card"),
      thumbSrc:
        getMediaUrl(item.previewImage, "thumb") ||
        getMediaUrl(item.previewImage, "card") ||
        getMediaUrl(item.previewImage),
    },
    {
      alt: getMediaAlt(item.detailImage, item.title),
      src:
        getMediaUrl(item.detailImage) ||
        getMediaUrl(item.detailImage, "card") ||
        getMediaUrl(item.previewImage) ||
        getMediaUrl(item.previewImage, "card"),
      thumbSrc:
        getMediaUrl(item.detailImage, "thumb") ||
        getMediaUrl(item.detailImage, "card") ||
        getMediaUrl(item.detailImage),
    },
    ...relatedItems.flatMap((related) => [
      {
        alt: getMediaAlt(related.previewImage, related.title),
        src: getMediaUrl(related.previewImage) || getMediaUrl(related.previewImage, "card"),
        thumbSrc:
          getMediaUrl(related.previewImage, "thumb") ||
          getMediaUrl(related.previewImage, "card") ||
          getMediaUrl(related.previewImage),
      },
      {
        alt: getMediaAlt(related.detailImage, related.title),
        src: getMediaUrl(related.detailImage) || getMediaUrl(related.detailImage, "card"),
        thumbSrc:
          getMediaUrl(related.detailImage, "thumb") ||
          getMediaUrl(related.detailImage, "card") ||
          getMediaUrl(related.detailImage),
      },
    ]),
    ...fallbackImages.map((src) => ({
      alt: item.title,
      src,
      thumbSrc: src,
    })),
  ]
    .filter((image) => image.src)
    .filter(
      (image, index, images) =>
        images.findIndex((candidate) => candidate.src === image.src) === index,
    )
    .slice(0, 8);

  const productPrice = productPrices[item.itemKey] || "от 12 800 000 ₽";
  const tagLabels = item.tags?.map((tag) => tag.label).filter(Boolean) ?? [];
  const area = findTag(tagLabels, /(м²|м2|м\^2|кв)/i, "168 м²");
  const floors = findTag(tagLabels, /этаж/i, "2 этажа");
  const rooms = findTag(tagLabels, /(комнат|спальн)/i, "4 комнаты");
  const bathrooms = findTag(tagLabels, /(сануз|ванн)/i, "2 санузла");
  const benefits = [...tagLabels, ...defaultBenefits]
    .filter((label, index, labels) => labels.indexOf(label) === index)
    .slice(0, 5);
  const descriptionParagraphs = getParagraphs(item.description);
  const additionalImages = galleryImages.slice(0, 5);
  const planCards = [
    { title: "План 1 этажа", meta: area },
    { title: "План 2 этажа", meta: "100 м²" },
    { title: "Генплан участка", meta: "12 соток", image: galleryImages[1]?.src || galleryImages[0]?.src },
  ];
  const relatedCards = relatedItems.length
    ? relatedItems
    : catalogItems.filter((candidate) => candidate.id !== item.id).slice(0, 3);

  return (
    <main className="page inner-page product-page product-page--catalog" aria-label="Карточка проекта Адамант">
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

        <ProductGallery images={galleryImages} title={item.title} />

        <div className="product-headline">
          <div>
            <h1 id="product-title" data-product-title>
              {item.title}
            </h1>
            <p className="product-headline__location">
              <DetailIconSvg type="location" />
              Ленинградская область
            </p>
          </div>

          <div className="product-headline__actions">
            <a className="product-headline__back" href={backTarget.href}>
              Вернуться к списку проектов
            </a>
            <button
              className="product-headline__button js-open-estimate"
              type="button"
              data-estimate-service={item.title}
            >
              Получить консультацию
            </button>
          </div>
        </div>

        <div className="product-specs" aria-label="Характеристики проекта">
          {[
            { icon: "area" as const, label: "Площадь", value: area },
            { icon: "floors" as const, label: "Этажность", value: floors },
            { icon: "rooms" as const, label: "Комнаты", value: rooms },
            { icon: "bath" as const, label: "Санузлы", value: bathrooms },
            { icon: "clock" as const, label: "Срок строительства", value: "7 месяцев" },
            { icon: "location" as const, label: "Локация", value: "Лен. область" },
          ].map((spec) => (
            <article className="product-spec-card" key={spec.label}>
              <span className="product-spec-card__icon">
                <DetailIconSvg type={spec.icon} />
              </span>
              <div>
                <span>{spec.label}</span>
                <strong>{spec.value}</strong>
              </div>
            </article>
          ))}
        </div>

        <div className="product-info-grid">
          <article className="product-info-card" data-product-description>
            <h2>О проекте</h2>
            {descriptionParagraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </article>

          <article className="product-info-card product-info-card--benefits">
            <h2>Преимущества проекта</h2>
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

        <section className="product-section" aria-labelledby="product-photos-title">
          <h2 id="product-photos-title">Дополнительные фото</h2>
          <div className="product-photo-strip">
            {additionalImages.map((image, index) => (
              <figure key={`${image.src}-additional-${index}`}>
                <img src={image.src} alt={image.alt} />
              </figure>
            ))}
          </div>
        </section>

        <section className="product-section" aria-labelledby="product-plans-title">
          <h2 id="product-plans-title">Планировка</h2>
          <div className="product-plans">
            {planCards.map((plan, index) => (
              <article className="product-plan-card" key={plan.title}>
                <div>
                  <h3>{plan.title}</h3>
                  <p>{plan.meta}</p>
                </div>
                {plan.image ? (
                  <img src={plan.image} alt="" aria-hidden="true" />
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

        {relatedCards.length ? (
          <section className="product-section" aria-labelledby="product-related-title">
            <h2 id="product-related-title">Похожие проекты</h2>
            <div className="product-related">
              {relatedCards.slice(0, 3).map((related, index) => {
                const href = getCatalogItemPath(related);
                const relatedTags = related.tags?.slice(0, 3).map((tag) => tag.label).join(" · ");
                const relatedImage =
                  getMediaUrl(related.previewImage, "card") ||
                  getMediaUrl(related.previewImage) ||
                  galleryImages[index + 1]?.src ||
                  galleryImages[0]?.src;

                return (
                  <article className="product-related-card" data-card-link={href} tabIndex={0} key={related.id}>
                    <img src={relatedImage} alt={getMediaAlt(related.previewImage, related.title)} />
                    <div>
                      <h3>{related.title}</h3>
                      <p>{relatedTags || "Современный проект под ключ"}</p>
                      <strong>{productPrices[related.itemKey] || productPrice}</strong>
                    </div>
                    <a href={href} aria-label={`Смотреть проект ${related.title}`}>→</a>
                  </article>
                );
              })}
            </div>
          </section>
        ) : null}

        <section className="product-consult" aria-labelledby="product-consult-title">
          <div>
            <h2 id="product-consult-title">Хотите такой же дом?</h2>
            <p>Оставьте заявку на консультацию — наш менеджер подберет лучшее решение для вашего проекта.</p>
          </div>
          <form className="product-consult-form contact-form">
            <input name="service" type="hidden" value={item.title} />
            <input name="name" type="text" placeholder="Ваше имя" />
            <input name="phone" type="tel" placeholder="Телефон" required />
            <button type="submit">Получить консультацию</button>
            <label>
              <input name="privacy" type="checkbox" required />
              <span>Я согласен на обработку персональных данных</span>
            </label>
          </form>
          <img src={galleryImages[0]?.src || "/home-main-new.webp"} alt="" aria-hidden="true" />
        </section>
      </section>
    </main>
  );
}
