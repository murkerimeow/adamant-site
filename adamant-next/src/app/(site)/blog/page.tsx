import type { Metadata } from "next";

import {
  getBlogPage,
  getMediaAlt,
  getMediaUrl,
  getPosts,
  getSiteSettings,
} from "@/site/cms";
import { SiteHeader } from "@/site/components/SiteHeader";
import { createPageMetadata } from "@/site/seo";

export const dynamic = "force-dynamic";

function getSocialPermalink(url?: string | null) {
  const value = url?.trim();
  if (!value) return null;

  try {
    const parsed = new URL(/^https?:\/\//i.test(value) ? value : `https://${value}`);
    return parsed.toString();
  } catch {
    return null;
  }
}

function getYouTubeId(url?: string | null) {
  const permalink = getSocialPermalink(url);
  if (!permalink) return null;

  try {
    const parsed = new URL(permalink);
    const hostname = parsed.hostname.replace(/^www\./, "").replace(/^m\./, "");
    const parts = parsed.pathname.split("/").filter(Boolean);
    let id: string | null = null;

    if (hostname === "youtube.com" || hostname === "youtube-nocookie.com") {
      if (parts[0] === "shorts" || parts[0] === "embed" || parts[0] === "live") {
        id = parts[1] ?? null;
      } else {
        id = parsed.searchParams.get("v");
      }
    }

    if (hostname === "youtu.be") {
      id = parts[0] ?? null;
    }

    return id && /^[a-zA-Z0-9_-]{6,}$/.test(id) ? id : null;
  } catch {
    return null;
  }
}

function getYouTubeThumbnail(url?: string | null) {
  const id = getYouTubeId(url);
  return id ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : null;
}

function getOEmbedUrl(url?: string | null) {
  const permalink = getSocialPermalink(url);
  if (!permalink) return null;

  try {
    const parsed = new URL(permalink);
    const hostname = parsed.hostname.replace(/^www\./, "").replace(/^m\./, "");
    const encoded = encodeURIComponent(permalink);

    if (hostname === "youtube.com" || hostname === "youtu.be" || hostname === "youtube-nocookie.com") {
      return `https://www.youtube.com/oembed?url=${encoded}&format=json`;
    }

    if (hostname === "tiktok.com" || hostname.endsWith(".tiktok.com")) {
      return `https://www.tiktok.com/oembed?url=${encoded}`;
    }

    if (hostname === "rutube.ru") {
      return `https://rutube.ru/api/oembed/?url=${encoded}`;
    }
  } catch {
    return null;
  }

  return null;
}

function canReadOpenGraphImage(url?: string | null) {
  const permalink = getSocialPermalink(url);
  if (!permalink) return false;

  try {
    const hostname = new URL(permalink).hostname.replace(/^www\./, "").replace(/^m\./, "");
    return (
      hostname === "instagram.com" ||
      hostname.endsWith(".instagram.com") ||
      hostname === "tiktok.com" ||
      hostname.endsWith(".tiktok.com") ||
      hostname === "vk.com" ||
      hostname.endsWith(".vk.com") ||
      hostname === "vk.ru" ||
      hostname.endsWith(".vk.ru") ||
      hostname === "vkvideo.ru" ||
      hostname.endsWith(".vkvideo.ru") ||
      hostname === "rutube.ru"
    );
  } catch {
    return false;
  }
}

function decodeHtmlAttribute(value: string) {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, "\"")
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function getMetaContent(tag: string) {
  const match = tag.match(/\scontent=(["'])(.*?)\1/i);
  return match ? decodeHtmlAttribute(match[2]) : null;
}

function extractOpenGraphImage(html: string) {
  const metaTags = html.match(/<meta\s+[^>]*>/gi) ?? [];

  for (const tag of metaTags) {
    if (/\s(?:property|name)=(["'])(?:og:image|twitter:image|twitter:image:src)\1/i.test(tag)) {
      const content = getMetaContent(tag);
      if (content) return content;
    }
  }

  return null;
}

async function fetchRemoteThumbnail(url?: string | null) {
  const directYoutubeThumbnail = getYouTubeThumbnail(url);
  if (directYoutubeThumbnail) return directYoutubeThumbnail;

  const oEmbedUrl = getOEmbedUrl(url);
  if (oEmbedUrl) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2500);

    try {
      const response = await fetch(oEmbedUrl, {
        headers: { Accept: "application/json", "User-Agent": "AdamantStroyBot/1.0" },
        next: { revalidate: 60 * 60 * 12 },
        signal: controller.signal,
      });

      if (response.ok) {
        const data = (await response.json()) as { thumbnail_url?: string; thumbnailUrl?: string };
        const thumbnail = data.thumbnail_url || data.thumbnailUrl;
        if (thumbnail) return thumbnail;
      }
    } catch {
      // Keep the blog page resilient if the social platform blocks metadata requests.
    } finally {
      clearTimeout(timeout);
    }
  }

  const permalink = getSocialPermalink(url);
  if (!permalink || !canReadOpenGraphImage(permalink)) return null;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 2500);

  try {
    const response = await fetch(permalink, {
      headers: { Accept: "text/html", "User-Agent": "Mozilla/5.0 AdamantStroyBot/1.0" },
      next: { revalidate: 60 * 60 * 12 },
      signal: controller.signal,
    });

    if (!response.ok) return null;
    return extractOpenGraphImage(await response.text());
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

function getVideoEmbed(url?: string | null) {
  const permalink = getSocialPermalink(url);
  if (!permalink) return null;

  try {
    const parsed = new URL(permalink);
    const hostname = parsed.hostname.replace(/^www\./, "");
    const parts = parsed.pathname.split("/").filter(Boolean);

    if (hostname === "youtube.com" || hostname === "m.youtube.com") {
      const id = parts[0] === "shorts" ? parts[1] : parsed.searchParams.get("v");
      return id ? `https://www.youtube-nocookie.com/embed/${id}` : null;
    }

    if (hostname === "youtu.be") {
      return parts[0] ? `https://www.youtube-nocookie.com/embed/${parts[0]}` : null;
    }

    if (hostname === "tiktok.com" || hostname.endsWith(".tiktok.com")) {
      const videoIndex = parts.findIndex((part) => part === "video");
      const id = videoIndex >= 0 ? parts[videoIndex + 1] : null;
      return id ? `https://www.tiktok.com/embed/v2/${id}` : permalink;
    }

    if (hostname === "instagram.com") {
      return permalink.replace(/\/?$/, "/embed");
    }
  } catch {
    return null;
  }

  return null;
}

export async function generateMetadata(): Promise<Metadata> {
  const blogPage = await getBlogPage();

  return createPageMetadata({
    title: blogPage.seoTitle || blogPage.title || "Блог Адамант Строй",
    description:
      blogPage.seoDescription || blogPage.subtitle || "Материалы о строительстве, ремонте и загородных домах.",
    path: "/blog",
  });
}

export default async function BlogPage() {
  const [siteSettings, blogPage, posts] = await Promise.all([
    getSiteSettings(),
    getBlogPage(),
    getPosts(),
  ]);

  const videos =
    (
      await Promise.all(
        (blogPage.instagramVideos ?? []).map(async (video) => {
          const posterUrl =
            getMediaUrl(video.posterImage, "card") || getMediaUrl(video.posterImage);
          const socialUrl = getSocialPermalink(video.instagramUrl);
          const videoUrl = video.videoUrl?.trim() || "";
          const embedUrl = getVideoEmbed(socialUrl);
          const remotePosterUrl = await fetchRemoteThumbnail(socialUrl || videoUrl);

          return {
            embedUrl,
            image: posterUrl || remotePosterUrl,
            label: video.label?.trim() || "Видео",
            socialUrl,
            title: video.title?.trim() || video.label?.trim() || "Видео Адамант Строй",
            videoUrl,
          };
        }),
      )
    ).filter((video) => video.videoUrl || video.embedUrl || video.image || video.socialUrl);

  const dateFormatter = new Intl.DateTimeFormat("ru-RU", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <main className="page inner-page blog-page" aria-label="Блог Адамант">
      <SiteHeader active="blog" phone={siteSettings.phonePrimary} />

      <section className="section section--blog blog-reviews-section" aria-labelledby="blog-title" data-home-services-carousel>
        <div className="blog-reviews">
          <div className="blog-reviews__copy">
            <div className="blog-reviews__headline">
              {blogPage.eyebrow ? <span className="section__kicker">{blogPage.eyebrow}</span> : null}
              <h1 id="blog-title">{blogPage.title || "Блог Адамант Строй"}</h1>
              {blogPage.subtitle ? <p>{blogPage.subtitle}</p> : null}
            </div>
            <div className="blog-reviews__actions" aria-label="Навигация по видео">
              <button className="blog-reviews__all" type="button" data-video-stories-open>
                Смотреть все
              </button>
              <button className="home-project-preview__arrow" type="button" aria-label="Предыдущие видео" data-slider-prev>
                ‹
              </button>
              <button className="home-project-preview__arrow home-project-preview__arrow--active" type="button" aria-label="Следующие видео" data-slider-next>
                ›
              </button>
            </div>
          </div>

          <div className="blog-reviews__videos js-wheel-slider" aria-label="Видео Адамант Строй">
            {videos.length ? (
              videos.map((video, index) => (
                <article className="review-video-card" key={`${index}-${video.title}`}>
                  <button
                    className={`review-video-card__open${video.image ? "" : " review-video-card__open--empty"}`}
                    type="button"
                    data-video-story-open={index}
                    aria-label={`Смотреть ролик: ${video.title}`}
                  >
                    {video.videoUrl ? (
                      <video
                        src={video.videoUrl}
                        poster={video.image || undefined}
                        preload="metadata"
                        playsInline
                        muted
                      />
                    ) : video.image ? (
                      <img src={video.image} alt={video.title} loading="lazy" decoding="async" />
                    ) : null}
                    <span className="review-video-card__brand">
                      <span>Адамант Строй</span>
                      <strong>{video.label}</strong>
                    </span>
                    <span className="review-video-card__play" aria-hidden="true">
                      <span />
                    </span>
                  </button>
                </article>
              ))
            ) : null}
          </div>
        </div>
      </section>

      {videos.length ? (
        <div className="video-stories" data-video-stories hidden>
          <button className="video-stories__backdrop" type="button" aria-label="Закрыть просмотр" data-video-stories-close />
          <div className="video-stories__panel" role="dialog" aria-modal="true" aria-label="Видео Адамант Строй">
            <button className="video-stories__close" type="button" aria-label="Закрыть" data-video-stories-close>
              ×
            </button>
            <div className="video-stories__track" data-video-stories-track>
              {videos.map((video, index) => (
                <section className="video-stories__slide" data-video-story-slide={index} key={`${video.title}-story`}>
                  <div className="video-stories__frame">
                    {video.videoUrl ? (
                      <video
                        src={video.videoUrl}
                        poster={video.image || undefined}
                        controls
                        playsInline
                        preload="metadata"
                      />
                    ) : video.embedUrl ? (
                      <iframe
                        src={video.embedUrl}
                        title={video.title}
                        loading="lazy"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                      />
                    ) : video.socialUrl ? (
                      <a href={video.socialUrl} target="_blank" rel="noreferrer">
                        Открыть видео
                      </a>
                    ) : null}
                  </div>
                  <div className="video-stories__caption">
                    <strong>{video.label}</strong>
                    <span>{video.title}</span>
                  </div>
                </section>
              ))}
            </div>
          </div>
        </div>
      ) : null}

      <section className="section section--blog blog-articles-section" aria-labelledby="blog-articles-title">
        <div className="blog-articles" id="blog-articles">
          <div className="blog-articles__intro">
            <span className="section__kicker">Статьи</span>
            <h2 id="blog-articles-title">Полезные материалы о строительстве</h2>
          </div>

          <div className="blog-grid">
            {posts.map((post) => {
              const coverUrl =
                getMediaUrl(post.coverImage, "card") || getMediaUrl(post.coverImage);

              return (
                <article className="blog-card" key={post.id}>
                  {coverUrl ? (
                    <div className="blog-card__media">
                      <img
                        src={coverUrl}
                        alt={getMediaAlt(post.coverImage, post.title)}
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                  ) : null}
                  <div className="blog-card__body">
                    {post.category || post.publishedAt ? (
                      <span className="blog-card__meta">
                        {post.category || "Статья"}
                        {post.category && post.publishedAt ? " • " : ""}
                        {post.publishedAt
                          ? dateFormatter.format(new Date(post.publishedAt))
                          : ""}
                      </span>
                    ) : null}
                    <h2>{post.title}</h2>
                    <p>{post.excerpt}</p>
                  </div>
                  <a href={`/blog/${post.slug}`}>
                    Читать <span aria-hidden="true">→</span>
                  </a>
                </article>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}
