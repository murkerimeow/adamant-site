import { unstable_noStore as noStore } from "next/cache";
import { getPayload } from "payload";

import type {
  HomePage,
  Media,
  Portfolio,
  Post,
  Review,
  Service,
  SiteSetting,
  TeamMember,
} from "@/payload-types";
import config from "@payload-config";

export type PageIntroGlobal = {
  eyebrow?: string | null;
  seoDescription?: string | null;
  seoTitle?: string | null;
  subtitle?: string | null;
  title: string;
};

export type BlogPageGlobal = PageIntroGlobal & {
  instagramVideos?:
    | {
        id?: string | null;
        instagramUrl?: string | null;
        label: string;
        posterImage?: number | Media | null;
        title: string;
        videoUrl?: string | null;
      }[]
    | null;
};

export type HomePageGlobal = HomePage & {
  seoDescription?: string | null;
  seoTitle?: string | null;
  sectionEyebrows?: {
    about?: string | null;
    projects?: string | null;
    trust?: string | null;
    process?: string | null;
    services?: string | null;
    portfolio?: string | null;
    reviews?: string | null;
    faq?: string | null;
  } | null;
  sectionHeadings?: {
    about?: string | null;
    projects?: string | null;
    trust?: string | null;
    process?: string | null;
    processLead?: string | null;
    services?: string | null;
    portfolio?: string | null;
    reviews?: string | null;
    faq?: string | null;
  } | null;
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
  seoDescription?: string | null;
  seoTitle?: string | null;
  itemKey: string;
  showInCatalog?: boolean | null;
  isHit?: boolean | null;
  landingCategory?: number | CatalogCategoryDoc | null;
  order: number;
  previewImage?: number | Media | null;
  detailImage?: number | Media | null;
  gallery?:
    | {
        id?: string | null;
        image?: number | Media | null;
      }[]
    | null;
  price?: number | null;
  area?: number | null;
  floors?: number | null;
  rooms?: number | null;
  cardSummary?: string | null;
  description: string;
  advantages?: { id?: string | null; text: string }[] | null;
  layouts?:
    | {
        id?: string | null;
        image?: number | Media | null;
        meta?: string | null;
        title: string;
      }[]
    | null;
  model3d?: number | Media | null;
  tags?: { id?: string | null; label: string }[] | null;
  _status?: "draft" | "published" | null;
};

export type CatalogCategoryDoc = {
  id: number | string;
  title: string;
  slug: string;
  description?: string | null;
  h1?: string | null;
  heroImage?: number | Media | null;
  seoDescription?: string | null;
  seoTitle?: string | null;
  showInHeader?: boolean | null;
  order?: number | null;
};

export type ServiceCardDoc = Service & {
  href?: string | null;
  icon?: string | null;
  showOnServicesPage?: boolean | null;
};

export type PortfolioItemDoc = Portfolio & {
  catalogItem?: number | CatalogItemDoc | null;
  gallery?:
    | {
        id?: string | null;
        image?: number | Media | null;
      }[]
    | null;
};

export type ReviewDoc = Review & {
  avatar?: number | Media | null;
  poster?: number | Media | null;
  video?: number | Media | null;
};

export type TeamMemberDoc = TeamMember & {
  avatar?: number | Media | null;
};

export type CompanyStatKey =
  | "builtHomes"
  | "custom"
  | "estimateDay"
  | "happyFamilies"
  | "marketYears"
  | "region"
  | "warranty";

export type CompanyStatDoc = {
  id?: string | null;
  label?: string | null;
  showOnAbout?: boolean | null;
  showOnHome?: boolean | null;
  statKey?: CompanyStatKey | null;
  value?: string | null;
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

type CatalogCategoriesCollectionClient = {
  find(args: {
    collection: string;
    depth?: number;
    draft?: boolean;
    limit?: number;
    overrideAccess?: boolean;
    sort?: string;
    where?: unknown;
  }): Promise<{ docs: CatalogCategoryDoc[] }>;
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

type ReviewsCollectionClient = {
  find(args: {
    collection: string;
    depth?: number;
    draft?: boolean;
    limit?: number;
    overrideAccess?: boolean;
    sort?: string;
    where?: unknown;
  }): Promise<{ docs: ReviewDoc[] }>;
};

type TeamMembersCollectionClient = {
  find(args: {
    collection: string;
    depth?: number;
    draft?: boolean;
    limit?: number;
    overrideAccess?: boolean;
    sort?: string;
    where?: unknown;
  }): Promise<{ docs: TeamMemberDoc[] }>;
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

export function getCatalogCoverMedia(
  item: Pick<CatalogItemDoc, "detailImage" | "gallery" | "previewImage">,
) {
  return (
    item.previewImage ||
    item.gallery?.find((entry) => entry.image)?.image ||
    item.detailImage ||
    null
  );
}

export function getCatalogLandingCategorySlug(item: Pick<CatalogItemDoc, "itemKey" | "landingCategory">) {
  if (item.landingCategory && typeof item.landingCategory !== "number") {
    return item.landingCategory.slug;
  }

  const legacyByItemKey: Record<string, string> = {
    frame: "karkasnye-doma",
    gasbeton: "doma-iz-gazobetona",
    "modulnij-dom": "modulnye-doma",
    onefloor: "dachnye-doma",
    terrace: "dachnye-doma",
    timber: "doma-iz-brusa",
  };

  if (item.itemKey && legacyByItemKey[item.itemKey]) {
    return legacyByItemKey[item.itemKey];
  }

  return "";
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

export function getCompanyStats(
  siteSettings: Pick<SiteSetting, "companyStats">,
  surface: "about" | "home",
) {
  const stats = ((siteSettings.companyStats ?? []) as CompanyStatDoc[])
    .filter((stat) => {
      const isEnabled =
        surface === "home" ? stat.showOnHome !== false : stat.showOnAbout !== false;

      return isEnabled && stat.value?.trim() && stat.label?.trim();
    })
    .map((stat) => ({
      id: stat.id ?? `${stat.statKey ?? "custom"}-${stat.value}-${stat.label}`,
      key: stat.statKey ?? "custom",
      label: stat.label?.trim() ?? "",
      value: stat.value?.trim() ?? "",
    }));

  if (stats.length) {
    return stats;
  }

  return [
    {
      id: `company-stats-placeholder-${surface}`,
      key: "custom" as const,
      label: "заполните в настройках сайта",
      value: "—",
    },
  ];
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
  }) as Promise<HomePageGlobal>;
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

  return result.docs as ServiceCardDoc[];
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

  return result.docs as PortfolioItemDoc[];
}

export async function getPortfolioItemBySlug(slug: string) {
  noStore();
  const payload = await getPayloadClient();
  const result = await payload.find({
    collection: "portfolio",
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

  return (result.docs[0] as PortfolioItemDoc | undefined) ?? null;
}

export async function getReviews() {
  noStore();
  const payload = (await getPayloadClient()) as unknown as ReviewsCollectionClient;
  const result = await payload.find({
    collection: "reviews",
    depth: 1,
    draft: false,
    limit: 20,
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

export async function getTeamMembers() {
  noStore();
  const payload = (await getPayloadClient()) as unknown as TeamMembersCollectionClient;
  const result = await payload.find({
    collection: "team-members",
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

export async function getCatalogCategories() {
  noStore();

  try {
    const payload = (await getPayloadClient()) as unknown as CatalogCategoriesCollectionClient;
    const result = await payload.find({
      collection: "catalog-categories",
      depth: 0,
      draft: false,
      limit: 100,
      overrideAccess: true,
      sort: "order",
      where: {
        showInHeader: {
          equals: true,
        },
      },
    });

    return result.docs;
  } catch {
    return [];
  }
}

export async function getCatalogSitemapCategories() {
  noStore();

  try {
    const payload = (await getPayloadClient()) as unknown as CatalogCategoriesCollectionClient;
    const result = await payload.find({
      collection: "catalog-categories",
      depth: 0,
      draft: false,
      limit: 100,
      overrideAccess: true,
      sort: "order",
    });

    return result.docs;
  } catch {
    return [];
  }
}

export async function getCatalogCategoryBySlug(slug: string) {
  noStore();
  const payload = (await getPayloadClient()) as unknown as CatalogCategoriesCollectionClient;
  const result = await payload.find({
    collection: "catalog-categories",
    depth: 1,
    draft: false,
    limit: 1,
    overrideAccess: true,
    where: {
      slug: {
        equals: slug,
      },
    },
  });

  return result.docs[0] ?? null;
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
