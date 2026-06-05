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
    title: blogPage.seoTitle || blogPage.title || "Заполните SEO Title в Payload",
    description:
      blogPage.seoDescription || blogPage.subtitle || "Заполните SEO Description в Payload",
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
    blogPage.instagramVideos
      ?.map((video) => {
        const posterUrl =
          getMediaUrl(video.posterImage, "card") || getMediaUrl(video.posterImage);
        const socialUrl = getSocialPermalink(video.instagramUrl);
        const videoUrl = video.videoUrl?.trim() || "";
        const embedUrl = getVideoEmbed(socialUrl);

        return {
          embedUrl,
          image: posterUrl,
          label: video.label?.trim() || "Видео",
          socialUrl,
          title: video.title?.trim() || video.label?.trim() || "Видео Адамант Строй",
          videoUrl,
        };
      })
      .filter((video) => video.videoUrl || video.embedUrl || video.image || video.socialUrl) ?? [];

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
              <span className="section__kicker">
                {blogPage.eyebrow || "Заполните плашку в Payload"}
              </span>
              <h1 id="blog-title">{blogPage.title || "Заполните заголовок в Payload"}</h1>
              <p>{blogPage.subtitle || "Заполните описание в Payload"}</p>
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
                    ) : (
                      <span>Добавьте обложку видео в Payload</span>
                    )}
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
            ) : (
              <div className="review-video-card review-video-card--placeholder">
                Добавьте видео в Payload
              </div>
            )}
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
