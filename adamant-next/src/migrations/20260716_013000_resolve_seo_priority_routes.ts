import { type MigrateDownArgs, type MigrateUpArgs } from "@payloadcms/db-sqlite";

type Payload = MigrateUpArgs["payload"];
type Req = MigrateUpArgs["req"];

type MediaDoc = {
  alt?: string | null;
  caption?: string | null;
  filename?: string | null;
  id: number | string;
};

const constructionOldSlug = "dom-iz-gazobetona";
const constructionNewSlug = "stroitelstvo-zagorodnyh-domov";
const mortgageSlug = "ipoteka-na-stroitelstvo-doma";

const beregDescriptors = [
  "общий вид современного жилого пространства",
  "планировочное решение и функциональные зоны",
  "лаконичная отделка и спокойная палитра интерьера",
  "световые сценарии и детали современной отделки",
  "сочетание фактур, мебели и встроенного хранения",
  "интерьерная композиция с акцентом на комфорт",
  "детали кухни-гостиной и повседневной эргономики",
  "оформление жилой зоны в современном стиле",
  "практичные материалы и аккуратные интерьерные узлы",
  "визуальная концепция квартиры с продуманной отделкой",
];

function includesBereg(filename?: string | null) {
  return (filename || "").toLowerCase().includes("bereg-");
}

async function findServiceBySlug(payload: Payload, req: Req, slug: string) {
  const result = await payload.find({
    collection: "services",
    depth: 0,
    limit: 1,
    overrideAccess: true,
    req,
    where: {
      slug: {
        equals: slug,
      },
    },
  });

  return result.docs[0] ?? null;
}

async function updateServiceRoutes(payload: Payload, req: Req) {
  const [oldConstructionService, newConstructionService, mortgageService] =
    await Promise.all([
      findServiceBySlug(payload, req, constructionOldSlug),
      findServiceBySlug(payload, req, constructionNewSlug),
      findServiceBySlug(payload, req, mortgageSlug),
    ]);

  if (oldConstructionService && !newConstructionService) {
    await payload.update({
      collection: "services",
      data: {
        href: `/services/${constructionNewSlug}`,
        slug: constructionNewSlug,
      },
      id: oldConstructionService.id,
      overrideAccess: true,
      req,
    });
  }

  const activeConstructionService =
    newConstructionService || oldConstructionService;

  if (activeConstructionService) {
    await payload.update({
      collection: "services",
      data: {
        href: `/services/${constructionNewSlug}`,
      },
      id: activeConstructionService.id,
      overrideAccess: true,
      req,
    });
  }

  if (mortgageService) {
    await payload.update({
      collection: "services",
      data: {
        href: "/mortgage",
      },
      id: mortgageService.id,
      overrideAccess: true,
      req,
    });
  }
}

async function updateBeregMedia(payload: Payload, req: Req) {
  const mediaResult = await payload.find({
    collection: "media",
    depth: 0,
    limit: 1000,
    overrideAccess: true,
    req,
  });

  const beregImages = (mediaResult.docs as MediaDoc[])
    .filter((media) => includesBereg(media.filename))
    .sort((a, b) => Number(a.id) - Number(b.id));

  let updatedCount = 0;

  for (const [index, media] of beregImages.entries()) {
    const frame = index + 1;
    const descriptor = beregDescriptors[index % beregDescriptors.length];
    const alt = `Дизайн интерьера квартиры в ЖК Bereg, Санкт-Петербург: ${descriptor}, фото ${frame}`;
    const caption = `ЖК Bereg, Санкт-Петербург — кадр ${frame}: интерьерный проект АДАМАНТ Строй, ${descriptor}, современная отделка и продуманная эргономика.`;

    if (media.alt === alt && media.caption === caption) {
      continue;
    }

    await payload.update({
      collection: "media",
      data: {
        alt,
        caption,
      },
      id: media.id,
      overrideAccess: true,
      req,
    });

    updatedCount += 1;
  }

  payload.logger.info(`Updated Bereg portfolio alt and captions for ${updatedCount} media items.`);
}

export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  await updateServiceRoutes(payload, req);
  await updateBeregMedia(payload, req);
}

export async function down({ payload }: MigrateDownArgs): Promise<void> {
  payload.logger.info("SEO route/media cleanup migration is not reverted automatically.");
}
