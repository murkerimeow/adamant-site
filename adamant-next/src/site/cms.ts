import { unstable_noStore as noStore } from "next/cache";
import { getPayload } from "payload";

import type {
  HomePage,
  Media,
  Portfolio,
  Post,
  Service,
  SiteSetting,
} from "@/payload-types";
import config from "@payload-config";

export type PageIntroGlobal = {
  eyebrow?: string | null;
  subtitle?: string | null;
  title: string;
};

export type BlogPageGlobal = PageIntroGlobal & {
  instagramVideos?:
    | {
        id?: string | null;
        instagramUrl?: string | null;
        label: string;
        title: string;
      }[]
    | null;
};

export type AboutPageGlobal = PageIntroGlobal & {
  faqItems?:
    | {
        answer: string;
        id?: string | null;
        question: string;
      }[]
    | null;
  intro?: string | null;
  principles?:
    | {
        id?: string | null;
        text: string;
        title: string;
      }[]
    | null;
};

export type ContactsPageGlobal = PageIntroGlobal & {
  companyDetails?: {
    inn?: string | null;
    kpp?: string | null;
    legalName?: string | null;
    ogrn?: string | null;
  } | null;
  mapEmbedUrl?: string | null;
  officeAddress: string;
};

export type CatalogItemDoc = {
  id: number;
  title: string;
  slug: string;
  itemKey: string;
  showInCatalog?: boolean | null;
  catalogCategory: "classic" | "modern" | "other";
  order: number;
  previewImage?: number | Media | null;
  detailImage?: number | Media | null;
  cardSummary?: string | null;
  description: string;
  tags?: { id?: string | null; label: string }[] | null;
  _status?: "draft" | "published" | null;
};

export type VacancyDoc = {
  id: number;
  title: string;
  slug: string;
  order: number;
  salary?: string | null;
  employment?: string | null;
  location?: string | null;
  published?: boolean | null;
  summary: string;
  responsibilities?: { id?: string | null; item: string }[] | null;
  requirements?: { id?: string | null; item: string }[] | null;
  conditions?: { id?: string | null; item: string }[] | null;
};

type CatalogCollectionClient = {
  find(args: {
    collection: string;
    depth?: number;
    draft?: boolean;
    limit?: number;
    overrideAccess?: boolean;
    sort?: string;
    where?: unknown;
  }): Promise<{ docs: CatalogItemDoc[] }>;
};

type VacanciesCollectionClient = {
  find(args: {
    collection: string;
    depth?: number;
    draft?: boolean;
    limit?: number;
    overrideAccess?: boolean;
    sort?: string;
    where?: unknown;
  }): Promise<{ docs: VacancyDoc[] }>;
};

type GlobalsClient = {
  findGlobal(args: {
    depth?: number;
    draft?: boolean;
    overrideAccess?: boolean;
    slug: string;
  }): Promise<unknown>;
};

const publishedWhere = {
  _status: {
    equals: "published",
  },
};

let payloadPromise: ReturnType<typeof getPayload> | null = null;

async function getPayloadClient() {
  if (!payloadPromise) {
    payloadPromise = getPayload({ config });
  }

  return payloadPromise;
}

export function getMediaUrl(
  media?: number | Media | null,
  size?: "card" | "thumb",
) {
  if (!media || typeof media === "number") return "";

  if (size && media.sizes?.[size]?.url) {
    return media.sizes[size].url ?? "";
  }

  return media.url ?? media.thumbnailURL ?? "";
}

export function getMediaAlt(media?: number | Media | null, fallback = "") {
  if (!media || typeof media === "number") return fallback;
  return media.alt || fallback;
}

export function splitParagraphs(text?: string | null) {
  if (!text) return [];

  return text
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.replace(/\n/g, " ").trim())
    .filter(Boolean);
}

export function splitHighlight(text: string, token = "Начните") {
  const index = text.indexOf(token);
  if (index === -1) {
    return {
      lead: text,
      highlight: "",
    };
  }

  return {
    lead: text.slice(0, index).trim(),
    highlight: text.slice(index).trim(),
  };
}

export function getPhoneHref(phone: string) {
  const digits = phone.replace(/[^\d+]/g, "");
  return `tel:${digits}`;
}

export function getWorkingHoursParts(workingHours?: string | null) {
  if (!workingHours) return [];

  const parts = workingHours
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);

  if (parts.length === 2 && /пн|вт|ср|чт|пт|сб|вс/i.test(parts[0])) {
    return [parts[1], parts[0]];
  }

  return parts.length ? parts : [workingHours];
}

export async function getSiteSettings() {
  noStore();
  const payload = await getPayloadClient();

  return payload.findGlobal({
    slug: "site-settings",
    depth: 1,
    draft: false,
    overrideAccess: true,
  }) as Promise<SiteSetting>;
}

export async function getHomePage() {
  noStore();
  const payload = await getPayloadClient();

  return payload.findGlobal({
    slug: "home-page",
    depth: 1,
    draft: false,
    overrideAccess: true,
  }) as Promise<HomePage>;
}

export async function getAboutPage() {
  noStore();
  const payload = await getPayloadClient();

  return payload.findGlobal({
    slug: "about-page",
    depth: 1,
    draft: false,
    overrideAccess: true,
  }) as Promise<AboutPageGlobal>;
}

export async function getContactsPage() {
  noStore();
  const payload = await getPayloadClient();

  return payload.findGlobal({
    slug: "contacts-page",
    depth: 1,
    draft: false,
    overrideAccess: true,
  }) as Promise<ContactsPageGlobal>;
}

export async function getServicesPage() {
  noStore();
  const payload = (await getPayloadClient()) as unknown as GlobalsClient;

  return payload.findGlobal({
    slug: "services-page",
    depth: 1,
    draft: false,
    overrideAccess: true,
  }) as Promise<PageIntroGlobal>;
}

export async function getPortfolioPage() {
  noStore();
  const payload = (await getPayloadClient()) as unknown as GlobalsClient;

  return payload.findGlobal({
    slug: "portfolio-page",
    depth: 1,
    draft: false,
    overrideAccess: true,
  }) as Promise<PageIntroGlobal>;
}

export async function getCatalogPage() {
  noStore();
  const payload = (await getPayloadClient()) as unknown as GlobalsClient;

  return payload.findGlobal({
    slug: "catalog-page",
    depth: 1,
    draft: false,
    overrideAccess: true,
  }) as Promise<PageIntroGlobal>;
}

export async function getBlogPage() {
  noStore();
  const payload = (await getPayloadClient()) as unknown as GlobalsClient;

  return payload.findGlobal({
    slug: "blog-page",
    depth: 1,
    draft: false,
    overrideAccess: true,
  }) as Promise<BlogPageGlobal>;
}

export async function getServices() {
  noStore();
  const payload = await getPayloadClient();
  const result = await payload.find({
    collection: "services",
    depth: 1,
    draft: false,
    limit: 100,
    overrideAccess: true,
    sort: "order",
    where: publishedWhere,
  });

  return result.docs as Service[];
}

export async function getPortfolioItems() {
  noStore();
  const payload = await getPayloadClient();
  const result = await payload.find({
    collection: "portfolio",
    depth: 1,
    draft: false,
    limit: 100,
    overrideAccess: true,
    sort: "order",
    where: publishedWhere,
  });

  return result.docs as Portfolio[];
}

export async function getPosts() {
  noStore();
  const payload = await getPayloadClient();
  const result = await payload.find({
    collection: "posts",
    depth: 1,
    draft: false,
    limit: 100,
    overrideAccess: true,
    sort: "-publishedAt",
    where: publishedWhere,
  });

  return result.docs as Post[];
}

export async function getPostBySlug(slug: string) {
  noStore();
  const payload = await getPayloadClient();
  const result = await payload.find({
    collection: "posts",
    depth: 1,
    draft: false,
    limit: 1,
    overrideAccess: true,
    where: {
      and: [
        publishedWhere,
        {
          slug: {
            equals: slug,
          },
        },
      ],
    },
  });

  return (result.docs[0] as Post | undefined) ?? null;
}

export async function getCatalogItems() {
  noStore();
  const payload = (await getPayloadClient()) as unknown as CatalogCollectionClient;
  const result = await payload.find({
    collection: "catalog",
    depth: 1,
    draft: false,
    limit: 100,
    overrideAccess: true,
    sort: "order",
    where: publishedWhere,
  });

  return result.docs;
}

export async function getCatalogItem(params: {
  itemKey?: string;
  slug?: string;
}) {
  noStore();
  const payload = (await getPayloadClient()) as unknown as CatalogCollectionClient;

  const conditions: Array<Record<string, unknown>> = [publishedWhere];

  if (params.itemKey) {
    conditions.push({
      itemKey: {
        equals: params.itemKey,
      },
    });
  } else if (params.slug) {
    conditions.push({
      slug: {
        equals: params.slug,
      },
    });
  }

  const result = await payload.find({
    collection: "catalog",
    depth: 1,
    draft: false,
    limit: 1,
    overrideAccess: true,
    where: {
      and: conditions,
    },
  });

  return result.docs[0] ?? null;
}

export async function getVacancies() {
  noStore();
  const payload = (await getPayloadClient()) as unknown as VacanciesCollectionClient;
  const result = await payload.find({
    collection: "vacancies",
    depth: 1,
    draft: false,
    limit: 100,
    overrideAccess: true,
    sort: "order",
    where: {
      published: {
        equals: true,
      },
    },
  });

  return result.docs;
}
