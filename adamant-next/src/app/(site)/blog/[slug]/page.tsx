/* eslint-disable @next/next/no-html-link-for-pages */

import type { Metadata } from "next";
import { notFound } from "next/navigation";

import {
  getMediaAlt,
  getMediaUrl,
  getPostBySlug,
  getSiteSettings,
  splitParagraphs,
} from "@/site/cms";
import { SiteHeader } from "@/site/components/SiteHeader";

export const dynamic = "force-dynamic";

type BlogPostPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  return {
    title: post ? `${post.title} | Адамант` : "Блог | Адамант",
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const [siteSettings, post] = await Promise.all([getSiteSettings(), getPostBySlug(slug)]);

  if (!post) {
    notFound();
  }

  const paragraphs = splitParagraphs(post.content);
  const coverImage =
    getMediaUrl(post.coverImage, "card") || getMediaUrl(post.coverImage);

  return (
    <main className="page inner-page blog-post-page" aria-label={`Пост блога ${post.title}`}>
      <SiteHeader active="blog" phone={siteSettings.phonePrimary} />

      <section className="section about-section" aria-labelledby="post-title">
        <a className="product-detail__back" href="/blog">
          ← Назад к блогу
        </a>

        <div className="about-hero blog-post">
          <div className="section__intro about-copy">
            <span className="about-kicker">{post.category || "Блог"}</span>
            <h1 id="post-title">{post.title}</h1>
            <p>{post.excerpt}</p>
            {post.publishedAt ? (
              <p className="blog-post__meta">
                {new Intl.DateTimeFormat("ru-RU", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                }).format(new Date(post.publishedAt))}
              </p>
            ) : null}
          </div>

          {coverImage ? (
            <figure className="about-media" aria-label={post.title}>
              <img src={coverImage} alt={getMediaAlt(post.coverImage, post.title)} />
            </figure>
          ) : null}
        </div>

        <article className="contact-form contact-requisites blog-post__card">
          {paragraphs.map((paragraph, index) => (
            <p className="blog-post__paragraph" key={`${index}-${paragraph.slice(0, 20)}`}>
              {paragraph}
            </p>
          ))}
        </article>
      </section>
    </main>
  );
}
