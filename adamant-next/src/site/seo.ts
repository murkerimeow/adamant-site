import type { Metadata } from "next";

export const SITE_URL = "https://adamant-stroy.com";
export const SITE_NAME = "Адамант Строй";
export const DEFAULT_DESCRIPTION =
  "Строительство загородных домов под ключ в Санкт-Петербурге и Ленинградской области.";
export const DEFAULT_OG_IMAGE = "/home-main-new.webp";

type PageMetadataInput = {
  title: string;
  description?: string;
  path?: string;
};

export function createPageMetadata({
  title,
  description = DEFAULT_DESCRIPTION,
  path = "/",
}: PageMetadataInput): Metadata {
  const canonical = path.startsWith("http") ? path : `${SITE_URL}${path}`;

  return {
    title,
    description,
    alternates: {
      canonical,
    },
    robots: {
      follow: true,
      googleBot: {
        follow: true,
        index: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
      index: true,
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: SITE_NAME,
      locale: "ru_RU",
      type: "website",
      images: [
        {
          url: DEFAULT_OG_IMAGE,
          width: 1200,
          height: 630,
          alt: SITE_NAME,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [DEFAULT_OG_IMAGE],
    },
  };
}
