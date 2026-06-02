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

export const metadata = createPageMetadata({
  title: "Блог Адамант Строй | Отзывы и статьи о строительстве домов",
  description: "Статьи, видео и разборы по строительству загородных домов, проектированию, материалам и выбору подрядчика.",
  path: "/blog",
});

const reviewVideos = [
  {
    image: "/дом из бруса.png",
    instagramUrl: "https://www.instagram.com/adamantushka/",
    title: "Обзор реализованного проекта",
    label: "Обзор проекта",
  },
  {
    image: "/каркасный дом.png",
    instagramUrl: "https://www.instagram.com/adamantushka/",
    title: "Видео с готового объекта",
    label: "Готовый объект",
  },
  {
    image: "/дом из газобетона.png",
    instagramUrl: "https://www.instagram.com/adamantushka/",
    title: "Дом после завершения работ",
    label: "Дом после сдачи",
  },
];

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

    if (hostname === "instagram.com" || hostname === "www.instagram.com") {
      return permalink.replace(/\/?$/, "/embed");
    }
  } catch {
    return null;
  }

  return null;
}

export default async function BlogPage() {
  const [siteSettings, blogPage, posts] = await Promise.all([
    getSiteSettings(),
    getBlogPage(),
    getPosts(),
  ]);

  const cmsVideos = blogPage.instagramVideos?.filter((video) => video?.label && video?.title) ?? [];
  const videos = (cmsVideos.length ? cmsVideos : reviewVideos).map((video, index) => {
    const fallback = reviewVideos[index % reviewVideos.length];
    const posterUrl =
      "posterImage" in video
        ? getMediaUrl(video.posterImage, "card") || getMediaUrl(video.posterImage)
        : "";

    return {
      image: posterUrl || fallback.image,
      socialUrl: getSocialPermalink(video.instagramUrl) || fallback.instagramUrl,
      label: video.label || fallback.label,
      title: video.title || fallback.title,
      videoUrl: "videoUrl" in video ? video.videoUrl?.trim() || "" : "",
    };
  });

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
              <span className="section__kicker">{blogPage.eyebrow}</span>
              <h1 id="blog-title">{blogPage.title}</h1>
              <p>{blogPage.subtitle}</p>
            </div>
            <div className="blog-reviews__actions" aria-label="Навигация по видео">
              <button className="home-project-preview__arrow" type="button" aria-label="Предыдущие видео" data-slider-prev>
                ‹
              </button>
              <button className="home-project-preview__arrow home-project-preview__arrow--active" type="button" aria-label="Следующие видео" data-slider-next>
                ›
              </button>
            </div>
          </div>

          <div className="blog-reviews__videos js-wheel-slider" aria-label="Видео Адамант Строй">
            {videos.map((video, index) => {
              const embedUrl = getVideoEmbed(video.socialUrl);

              return (
                <article
                  className="review-video-card"
                  key={`${index}-${video.label}`}
                >
                  {video.videoUrl ? (
                    <video
                      src={video.videoUrl}
                      poster={video.image}
                      preload="metadata"
                      playsInline
                      controls
                    >
                      Ваш браузер не поддерживает видео.
                    </video>
                  ) : embedUrl ? (
                    <iframe
                      className="review-video-card__embed"
                      src={embedUrl}
                      title={video.title}
                      loading="lazy"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                  ) : (
                    <a
                      className="review-video-card__poster"
                      href={video.socialUrl}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`Смотреть ролик: ${video.label}`}
                    >
                      <img src={video.image} alt={video.title} loading="lazy" decoding="async" />
                      <span
                        className="review-video-card__play"
                        aria-hidden="true"
                      >
                        <span />
                      </span>
                    </a>
                  )}
                  <div className="review-video-card__caption">
                    <strong>{video.label}</strong>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section section--blog blog-articles-section" aria-labelledby="blog-articles-title">
        <div className="blog-articles" id="blog-articles">
          <div className="blog-articles__intro">
            <span className="section__kicker">Статьи</span>
            <h2 id="blog-articles-title">Полезные материалы о строительстве</h2>
          </div>

          <div className="blog-grid">
            {posts.map((post) => (
              <article className="blog-card" key={post.id}>
                {getMediaUrl(post.coverImage, "card") || getMediaUrl(post.coverImage) ? (
                  <div className="blog-card__media">
                    <img
                      src={getMediaUrl(post.coverImage, "card") || getMediaUrl(post.coverImage)}
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
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
