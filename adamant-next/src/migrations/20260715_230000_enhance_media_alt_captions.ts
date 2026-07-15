import { type MigrateDownArgs, type MigrateUpArgs } from "@payloadcms/db-sqlite";

import type { Config } from "../payload-types";

type Payload = MigrateUpArgs["payload"];
type Req = MigrateUpArgs["req"];
type CollectionSlug = keyof Config["collections"];

type MediaDoc = {
  alt?: string | null;
  caption?: string | null;
  filename?: string | null;
  id: number | string;
  mimeType?: string | null;
};

type MediaRef =
  | number
  | string
  | {
      id?: number | string | null;
      mimeType?: string | null;
    }
  | null
  | undefined;

type Candidate = {
  alt: string;
  caption: string;
  priority: number;
};

type CandidateMap = Map<string, Candidate>;

const brand = "АДАМАНТ Строй";
const region = "Санкт-Петербург и Ленинградская область";

function normalizeText(value?: string | null) {
  return value?.replace(/\s+/g, " ").trim() || "";
}

function trimText(value: string, maxLength: number) {
  const normalized = normalizeText(value);

  if (normalized.length <= maxLength) {
    return normalized;
  }

  return `${normalized.slice(0, maxLength - 1).trim()}…`;
}

function mediaId(ref: MediaRef) {
  if (!ref) return null;
  if (typeof ref === "number" || typeof ref === "string") return String(ref);
  return ref.id ? String(ref.id) : null;
}

function addCandidate(candidates: CandidateMap, ref: MediaRef, candidate: Candidate) {
  const id = mediaId(ref);

  if (!id) {
    return;
  }

  const current = candidates.get(id);

  if (!current || candidate.priority > current.priority) {
    candidates.set(id, {
      alt: trimText(candidate.alt, 150),
      caption: trimText(candidate.caption, 240),
      priority: candidate.priority,
    });
  }
}

function cleanFilename(filename?: string | null) {
  const withoutExtension = normalizeText(filename || "")
    .replace(/\.[a-z0-9]+$/i, "")
    .replace(/chatgpt-image/gi, "")
    .replace(/\b\d{4,}\b/g, "")
    .replace(/\b\d{2,}\b/g, "")
    .replace(/[-_]+/g, " ")
    .replace(/\bwebp\b|\bjpg\b|\bjpeg\b|\bpng\b/gi, "")
    .replace(/\s+/g, " ")
    .trim();

  return withoutExtension || "изображение строительного проекта";
}

function isImage(media: MediaDoc) {
  const mimeType = normalizeText(media.mimeType);
  const filename = normalizeText(media.filename).toLowerCase();

  return (
    mimeType.startsWith("image/") ||
    /\.(avif|gif|jpe?g|png|svg|webp)$/i.test(filename)
  );
}

function projectArea(project: { area?: number | null; projectArea?: number | null }) {
  const area = project.area ?? project.projectArea;
  return typeof area === "number" && area > 0 ? `${area} м²` : "";
}

function categoryTitle(category: unknown) {
  if (category && typeof category === "object" && "title" in category) {
    return normalizeText((category as { title?: string | null }).title);
  }

  return "";
}

function locationText(value?: string | null) {
  const location = normalizeText(value);
  return location ? `, ${location}` : "";
}

function detailSentence(value: string | null | undefined, fallback: string) {
  return normalizeText(value) || fallback;
}

async function findAll<T>({
  collection,
  payload,
  req,
}: {
  collection: CollectionSlug;
  payload: Payload;
  req: Req;
}) {
  const result = await payload.find({
    collection,
    depth: 2,
    draft: true,
    limit: 2000,
    overrideAccess: true,
    req,
  });

  return result.docs as T[];
}

async function addGlobalCandidates({
  candidates,
  payload,
  req,
}: {
  candidates: CandidateMap;
  payload: Payload;
  req: Req;
}) {
  const [homePage, aboutPage, blogPage, siteSettings] = await Promise.all([
    payload.findGlobal({ slug: "home-page", depth: 2, draft: true, req }),
    payload.findGlobal({ slug: "about-page", depth: 2, draft: true, req }),
    payload.findGlobal({ slug: "blog-page", depth: 2, draft: true, req }),
    payload.findGlobal({ slug: "site-settings", depth: 2, draft: true, req }),
  ]);

  addCandidate(candidates, homePage.heroImage, {
    alt: `Строительство загородного дома под ключ от ${brand} в ${region}`,
    caption: `Главный баннер ${brand}: современный загородный дом, проектирование и строительство под ключ в ${region}.`,
    priority: 45,
  });

  addCandidate(candidates, aboutPage.heroImage, {
    alt: `${brand}: строительство частных домов под ключ в ${region}`,
    caption: `Изображение раздела о компании ${brand}: строительство, проектирование и сопровождение загородных домов под ключ.`,
    priority: 45,
  });

  for (const item of blogPage.instagramVideos ?? []) {
    addCandidate(candidates, item.posterImage, {
      alt: `Обложка видео «${normalizeText(item.title || item.label)}» в блоге ${brand}`,
      caption: `Видеообложка блога ${brand}: ${normalizeText(item.title || item.label)} о строительстве, ремонте и реализованных проектах.`,
      priority: 42,
    });
  }

  for (const stat of siteSettings.companyStats ?? []) {
    addCandidate(candidates, stat.iconImage, {
      alt: `Иконка показателя ${brand}: ${normalizeText(stat.value)} ${normalizeText(stat.label)}`,
      caption: `Графическая иконка показателя компании ${brand}: ${normalizeText(stat.value)} ${normalizeText(stat.label)}.`,
      priority: 20,
    });
  }
}

async function collectCandidates({
  payload,
  req,
}: {
  payload: Payload;
  req: Req;
}) {
  const candidates: CandidateMap = new Map();
  const [
    catalogItems,
    catalogCategories,
    portfolioItems,
    portfolioCategories,
    services,
    posts,
    reviews,
    teamMembers,
  ] = await Promise.all([
    findAll<{
      area?: number | null;
      cardSummary?: string | null;
      detailImage?: MediaRef;
      floors?: number | null;
      gallery?: { image?: MediaRef }[] | null;
      landingCategory?: unknown;
      layouts?: { image?: MediaRef; meta?: string | null; title?: string | null }[] | null;
      nightImage?: MediaRef;
      previewImage?: MediaRef;
      title: string;
    }>({ collection: "catalog", payload, req }),
    findAll<{
      description?: string | null;
      heroImage?: MediaRef;
      title: string;
    }>({ collection: "catalog-categories", payload, req }),
    findAll<{
      category?: unknown;
      description?: string | null;
      gallery?: { image?: MediaRef }[] | null;
      location?: string | null;
      previewImage?: MediaRef;
      projectArea?: number | null;
      summary?: string | null;
      title: string;
    }>({ collection: "portfolio", payload, req }),
    findAll<{
      description?: string | null;
      heroImage?: MediaRef;
      title: string;
    }>({ collection: "portfolio-categories", payload, req }),
    findAll<{
      description?: string | null;
      previewImage?: MediaRef;
      shortDescription?: string | null;
      title: string;
    }>({ collection: "services", payload, req }),
    findAll<{
      category?: string | null;
      coverImage?: MediaRef;
      excerpt?: string | null;
      title: string;
    }>({ collection: "posts", payload, req }),
    findAll<{
      avatar?: MediaRef;
      caption?: string | null;
      name: string;
      poster?: MediaRef;
    }>({ collection: "reviews", payload, req }),
    findAll<{
      avatar?: MediaRef;
      description?: string | null;
      name: string;
      role: string;
    }>({ collection: "team-members", payload, req }),
  ]);

  for (const item of catalogItems) {
    const area = projectArea(item);
    const category = categoryTitle(item.landingCategory);
    const catalogDetails = [category, area].filter(Boolean).join(", ");
    const detailTail = catalogDetails ? ` (${catalogDetails})` : "";

    addCandidate(candidates, item.previewImage, {
      alt: `Проект ${item.title}${detailTail}: фасад загородного дома от ${brand}`,
      caption: `Изображение карточки проекта ${item.title}: архитектура, фасад и общий вид дома для строительства под ключ в ${region}.`,
      priority: 100,
    });

    addCandidate(candidates, item.detailImage, {
      alt: `Проект дома ${item.title}${detailTail}: детальный вид фасада и архитектуры`,
      caption: `Главное изображение проекта ${item.title}: внешний вид дома, фасадные решения и архитектура для каталога ${brand}.`,
      priority: 100,
    });

    addCandidate(candidates, item.nightImage, {
      alt: `Ночная визуализация проекта ${item.title} с подсветкой фасада`,
      caption: `Ночная версия карточки проекта ${item.title}: фасад дома с вечерним освещением и атмосферной подачей для каталога.`,
      priority: 95,
    });

    item.gallery?.forEach((entry, index) => {
      addCandidate(candidates, entry.image, {
        alt: `Проект ${item.title}${detailTail}: фото ${index + 1} фасада, планировки или деталей дома`,
        caption: `Галерея проекта ${item.title}, кадр ${index + 1}: визуализация дома, фасад, планировочные решения и детали строительства под ключ.`,
        priority: 90,
      });
    });

    item.layouts?.forEach((layout, index) => {
      const title = normalizeText(layout.title) || `планировка ${index + 1}`;
      const meta = normalizeText(layout.meta);

      addCandidate(candidates, layout.image, {
        alt: `Планировка проекта ${item.title}: ${title}${meta ? `, ${meta}` : ""}`,
        caption: `Планировочное изображение проекта ${item.title}: ${title}${meta ? `, ${meta}` : ""}, схема помещений и логика будущего дома.`,
        priority: 92,
      });
    });
  }

  for (const category of catalogCategories) {
    addCandidate(candidates, category.heroImage, {
      alt: `Категория каталога «${category.title}»: проекты домов от ${brand}`,
      caption: `Посадочная страница каталога «${category.title}»: подборка проектов домов для строительства под ключ в ${region}.`,
      priority: 80,
    });
  }

  for (const item of portfolioItems) {
    const category = categoryTitle(item.category);
    const area = projectArea(item);
    const details = [category, area].filter(Boolean).join(", ");
    const location = locationText(item.location);
    const detailTail = details ? ` (${details})` : "";

    addCandidate(candidates, item.previewImage, {
      alt: `${item.title}${location}: реализованный объект ${brand}${detailTail}`,
      caption: `Фото реализованного проекта ${item.title}${location}: выполненные строительные, ремонтные или отделочные работы ${brand}.`,
      priority: 100,
    });

    item.gallery?.forEach((entry, index) => {
      addCandidate(candidates, entry.image, {
        alt: `${item.title}${location}: фото ${index + 1} выполненных работ и деталей объекта`,
        caption: `Галерея портфолио ${item.title}, кадр ${index + 1}${location}: результат работ, детали отделки и качество реализации объекта.`,
        priority: 90,
      });
    });
  }

  for (const category of portfolioCategories) {
    addCandidate(candidates, category.heroImage, {
      alt: `Категория портфолио «${category.title}»: реализованные работы ${brand}`,
      caption: `Посадочная страница портфолио «${category.title}»: выполненные объекты, фото работ и примеры реализации ${brand}.`,
      priority: 80,
    });
  }

  for (const service of services) {
    const description = detailSentence(
      service.shortDescription || service.description,
      "комплексные решения под задачу клиента",
    );

    addCandidate(candidates, service.previewImage, {
      alt: `${service.title}: услуга ${brand} для строительства, ремонта и отделки`,
      caption: `Изображение услуги «${service.title}»: ${description}.`,
      priority: 70,
    });
  }

  for (const post of posts) {
    const excerpt = detailSentence(
      post.excerpt,
      "полезный материал о строительстве, ремонте и загородных домах",
    );

    addCandidate(candidates, post.coverImage, {
      alt: `Обложка статьи «${post.title}» в блоге ${brand}`,
      caption: `Иллюстрация к статье «${post.title}»: ${excerpt}.`,
      priority: 65,
    });
  }

  for (const review of reviews) {
    addCandidate(candidates, review.avatar, {
      alt: `Фото клиента ${review.name} для отзыва о ${brand}`,
      caption: `Аватар клиента ${review.name}: отзыв о работе ${brand}${review.caption ? `, ${review.caption}` : ""}.`,
      priority: 55,
    });

    addCandidate(candidates, review.poster, {
      alt: `Обложка видеоотзыва клиента ${review.name} о ${brand}`,
      caption: `Обложка видеоотзыва ${review.name}: впечатления клиента о строительстве, ремонте или отделке от ${brand}.`,
      priority: 60,
    });
  }

  for (const member of teamMembers) {
    const description = normalizeText(member.description);

    addCandidate(candidates, member.avatar, {
      alt: `Фото ${member.name}, ${member.role}, команда ${brand}`,
      caption: `Портрет сотрудника ${brand}: ${member.name}, ${member.role}.${description ? ` ${description}` : ""}`,
      priority: 55,
    });
  }

  await addGlobalCandidates({ candidates, payload, req });

  return candidates;
}

function fallbackCandidate(media: MediaDoc): Candidate {
  const label = cleanFilename(media.filename);

  return {
    alt: `Изображение ${brand}: ${label}`,
    caption: `Медиафайл сайта ${brand}: ${label}. Используется в материалах о строительстве домов, ремонте, отделке или реализованных проектах.`,
    priority: 1,
  };
}

export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  const [mediaResult, candidates] = await Promise.all([
    payload.find({
      collection: "media",
      depth: 0,
      limit: 3000,
      overrideAccess: true,
      req,
    }),
    collectCandidates({ payload, req }),
  ]);

  let updatedCount = 0;

  for (const media of mediaResult.docs as MediaDoc[]) {
    if (!isImage(media)) {
      continue;
    }

    const candidate = candidates.get(String(media.id)) ?? fallbackCandidate(media);
    const nextAlt = candidate.alt;
    const nextCaption = candidate.caption;

    if (media.alt === nextAlt && media.caption === nextCaption) {
      continue;
    }

    await payload.update({
      collection: "media",
      id: media.id,
      data: {
        alt: nextAlt,
        caption: nextCaption,
      },
      overrideAccess: true,
      req,
    });

    updatedCount += 1;
  }

  payload.logger.info(`Enhanced alt and captions for ${updatedCount} media images.`);
}

export async function down({ payload }: MigrateDownArgs): Promise<void> {
  payload.logger.info("Media alt/caption enhancement migration is not reverted automatically.");
}
