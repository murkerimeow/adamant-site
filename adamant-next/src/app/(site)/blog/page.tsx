import {
  getBlogPage,
  getMediaAlt,
  getMediaUrl,
  getPosts,
  getSiteSettings,
} from "@/site/cms";
import { SiteHeader } from "@/site/components/SiteHeader";
import Script from "next/script";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Блог Адамант Строй | Отзывы и статьи о строительстве домов",
};

const reviewVideos = [
  {
    image: "/дом из бруса.png",
    title: "Обзор реализованного проекта",
    label: "Обзор проекта",
  },
  {
    image: "/каркасный дом.png",
    title: "Видео с готового объекта",
    label: "Готовый объект",
  },
  {
    image: "/дом из газобетона.png",
    title: "Дом после завершения работ",
    label: "Дом после сдачи",
  },
];

function getInstagramPermalink(url?: string | null) {
  const value = url?.trim();
  if (!value) return null;

  try {
    const parsed = new URL(/^https?:\/\//i.test(value) ? value : `https://${value}`);
    const hostname = parsed.hostname.replace(/^www\./, "");

    if (hostname !== "instagram.com") {
      return null;
    }

    return parsed.toString();
  } catch {
    return null;
  }
}

export default async function BlogPage() {
  const [siteSettings, blogPage, posts] = await Promise.all([
    getSiteSettings(),
    getBlogPage(),
    getPosts(),
  ]);

  const videos = reviewVideos.map((fallback, index) => {
    const cmsVideo = blogPage.instagramVideos?.[index];

    return {
      ...fallback,
      instagramUrl: getInstagramPermalink(cmsVideo?.instagramUrl),
      label: cmsVideo?.label || fallback.label,
      title: cmsVideo?.title || fallback.title,
    };
  });
  const hasInstagramVideos = videos.some((video) => video.instagramUrl);

  const dateFormatter = new Intl.DateTimeFormat("ru-RU", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <main className="page inner-page blog-page" aria-label="Блог Адамант">
      <SiteHeader active="blog" phone={siteSettings.phonePrimary} />

      <section className="section section--blog blog-reviews-section" aria-labelledby="blog-title">
        <div className="blog-reviews">
          <div className="blog-reviews__copy">
            <div className="blog-reviews__headline">
              <span className="section__kicker">{blogPage.eyebrow}</span>
              <h1 id="blog-title">{blogPage.title}</h1>
              <p>{blogPage.subtitle}</p>
            </div>
          </div>

          <div className="blog-reviews__videos" aria-label="Видеоотзывы клиентов">
            {videos.map((video, index) => (
              <article
                className={`review-video-card${
                  video.instagramUrl ? " review-video-card--instagram" : ""
                }`}
                key={`${index}-${video.label}`}
              >
                {video.instagramUrl ? (
                  <div className="review-video-card__embed">
                    <blockquote
                      className="instagram-media"
                      data-instgrm-permalink={video.instagramUrl}
                      data-instgrm-version="14"
                    >
                      <a href={video.instagramUrl} target="_blank" rel="noreferrer">
                        Смотреть в Instagram: {video.label}
                      </a>
                    </blockquote>
                  </div>
                ) : (
                  <>
                    <img src={video.image} alt={video.title} />
                    <button
                      className="review-video-card__play"
                      type="button"
                      aria-label={`Смотреть видео: ${video.label}`}
                    >
                      <span aria-hidden="true" />
                    </button>
                  </>
                )}
                <div className="review-video-card__caption">
                  <span>видео</span>
                  <strong>{video.label}</strong>
                </div>
              </article>
            ))}
          </div>
        </div>

        {hasInstagramVideos ? (
          <Script async src="https://www.instagram.com/embed.js" strategy="afterInteractive" />
        ) : null}

        <div className="blog-articles" id="blog-articles">
          <div className="blog-articles__intro">
            <span className="section__kicker">Статьи</span>
            <h2>Полезные материалы о строительстве</h2>
          </div>

          <div className="blog-grid">
            {posts.map((post) => (
              <article className="blog-card" key={post.id}>
                {getMediaUrl(post.coverImage, "card") || getMediaUrl(post.coverImage) ? (
                  <div className="blog-card__media">
                    <img
                      src={getMediaUrl(post.coverImage, "card") || getMediaUrl(post.coverImage)}
                      alt={getMediaAlt(post.coverImage, post.title)}
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
