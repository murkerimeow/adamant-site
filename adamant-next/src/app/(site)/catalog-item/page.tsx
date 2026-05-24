import { notFound } from "next/navigation";

import { getCatalogItem, getMediaAlt, getMediaUrl, getSiteSettings } from "@/site/cms";
import { ProductGallery } from "@/site/components/ProductGallery";
import { SiteHeader } from "@/site/components/SiteHeader";
import { createPageMetadata } from "@/site/seo";

export const dynamic = "force-dynamic";

export const metadata = createPageMetadata({
  title: "Карточка проекта | Адамант Строй",
  description: "Описание проекта дома, галерея, стоимость и заявка на расчет строительства под ключ.",
  path: "/catalog-item",
});

type CatalogItemPageProps = {
  searchParams: Promise<{
    item?: string;
    slug?: string;
    source?: string;
  }>;
};

const productPrices: Record<string, string> = {
  timber: "от 5 000 000 ₽",
  gasbeton: "от 6 500 000 ₽",
  frame: "от 4 500 000 ₽",
  commercial: "от 2 000 000 ₽",
  renovation: "от 1 500 000 ₽",
};

const backTargets = {
  catalog: { active: "catalog", href: "/catalog", text: "← Назад к каталогу" },
  portfolio: { active: "portfolio", href: "/portfolio", text: "← Назад к портфолио" },
  services: { active: "services", href: "/services", text: "← Назад к услугам" },
} as const;

export default async function CatalogItemPage({
  searchParams,
}: CatalogItemPageProps) {
  const params = await searchParams;
  const source =
    params.source === "services" || params.source === "portfolio"
      ? params.source
      : "catalog";

  const [siteSettings, item] = await Promise.all([
    getSiteSettings(),
    getCatalogItem({
      itemKey: params.item,
      slug: params.slug,
    }),
  ]);

  if (!item) {
    notFound();
  }

  const backTarget = backTargets[source];
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
  ]
    .filter((image) => image.src)
    .filter(
      (image, index, images) =>
        images.findIndex((candidate) => candidate.src === image.src) === index,
    );

  if (!galleryImages.length) {
    galleryImages.push({
      alt: item.title,
      src: "/Picture.PNG",
      thumbSrc: "/Picture.PNG",
    });
  }

  const productPrice = productPrices[item.itemKey];

  return (
    <main className="page inner-page product-page" aria-label="Карточка товара Адамант">
      <SiteHeader active={backTarget.active} phone={siteSettings.phonePrimary} />

      <section
        className="product-detail"
        aria-labelledby="product-title"
        data-product-page
        data-cms-product="true"
      >
        <a className="product-detail__back" href={backTarget.href}>
          {backTarget.text}
        </a>

        <div className="product-detail__layout">
          <div className="product-detail__content">
            <h1 id="product-title" data-product-title>
              {item.title}
            </h1>
            <p data-product-description>{item.description}</p>
            {productPrice ? (
              <div className="product-detail__price" aria-label="Стоимость">
                <span>{productPrice}</span>
              </div>
            ) : null}
            <button
              className="product-detail__button js-open-estimate"
              type="button"
              data-estimate-service={item.title}
            >
              Оставить заявку
            </button>
          </div>

          <div className="product-detail__media">
            <ProductGallery images={galleryImages} title={item.title} />
          </div>
        </div>
      </section>
    </main>
  );
}
