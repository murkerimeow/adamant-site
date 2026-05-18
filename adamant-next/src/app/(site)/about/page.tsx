import { getAboutPage, getHomePage, getSiteSettings, splitParagraphs } from "@/site/cms";
import { SiteHeader } from "@/site/components/SiteHeader";
import { SocialIcon, socialLinks } from "@/site/socials";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "О компании Адамант Строй | Строительство загородных домов под ключ",
};

const aboutSocials = [
  {
    key: "telegram",
    label: "Telegram",
    href: "https://t.me/adamant_stroy",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          fill="#ffffff"
          d="M20.54 4.44 3.9 10.86c-1.14.46-1.13 1.1-.2 1.39l4.27 1.33 1.65 5.08c.2.56.1.79.69.79.46 0 .66-.21.92-.47l2.07-2.01 4.31 3.18c.79.43 1.36.21 1.56-.73l2.84-13.4c.29-1.15-.44-1.67-1.47-1.2Z"
        />
        <path
          fill="#dff1ff"
          d="m9.59 13.28 8.6-5.42c.43-.26.82-.12.5.17l-7.36 6.65-.29 3.09c-.04.43-.23.43-.48.22l-1.88-4.71c-.09-.22.01-.33.91 0Z"
          opacity="0.55"
        />
      </svg>
    ),
  },
  {
    key: "vk",
    label: "ВКонтакте",
    href: "https://vk.ru/adamant_stroyrem",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          fill="#ffffff"
          d="M5.3 7.68c.16 4.9 2.72 7.85 7.14 8.5h.29v-2.8c1.57.16 2.75 1.29 3.22 2.8h2.28c-.61-2.28-2.2-3.54-3.19-4.02.98-.58 2.39-2 2.71-4.48h-2.08c-.42 2-1.71 3.42-2.74 3.58V7.68h-2.08v6.26c-1.04-.26-2.37-1.82-2.43-6.26H5.3Z"
        />
      </svg>
    ),
  },
  {
    key: "max",
    label: "MAX",
    href: "https://max.ru/join/5IZHwoGqh8laOBvd3atPM0OKvMjmQSwytpyKBs1cQ8c",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          fill="#ffffff"
          d="M4.8 17.5V6.5h2.2L12 12.05l5-5.55h2.2v11H17v-7.22L12 15.82 7 10.28v7.22Z"
        />
      </svg>
    ),
  },
  {
    key: "tiktok",
    label: "TikTok",
    href: "https://www.tiktok.com/@adamantushka",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          fill="#25F4EE"
          d="M10.27 9.86v1.86a4.12 4.12 0 0 0-1.33-.22A4.18 4.18 0 0 0 4.76 15.68a4.18 4.18 0 0 0 4.18 4.18 4.18 4.18 0 0 0 4.18-4.18V8.86c1.1.82 2.43 1.27 3.84 1.3V7.17a3.92 3.92 0 0 1-1.08-.16 3.95 3.95 0 0 1-2.76-2.81h-2.85v11.48a1.33 1.33 0 1 1-1.33-1.33c.47 0 .88.12 1.33.31V9.86Z"
        />
        <path
          fill="#FE2C55"
          d="M11.1 9.15v1.78c-.37-.1-.77-.16-1.18-.16a4.18 4.18 0 0 0-4.18 4.18 4.16 4.16 0 0 0 1.18 2.91 4.18 4.18 0 0 1-2.16-3.67 4.18 4.18 0 0 1 4.18-4.18c.43 0 .82.07 1.18.2V5.53h2.84c.19.95.75 1.81 1.53 2.44a4 4 0 0 0 2.15.88v2.12a6.96 6.96 0 0 1-3.68-1.16v5.87a4.18 4.18 0 0 1-4.18 4.18c-.8 0-1.55-.22-2.16-.6a4.2 4.2 0 0 0 6.34-3.58V9.81a7.05 7.05 0 0 0 3.68 1.04V7.86c-.45 0-.88-.08-1.3-.23a4.04 4.04 0 0 1-2.38-2.1h-1.86V9.15Z"
        />
        <path
          fill="#ffffff"
          d="M12.47 4.2c.2 1.08.84 2.04 1.75 2.71a4 4 0 0 0 2.38.8v2.12a6.92 6.92 0 0 1-3.47-.94v4.78a4.18 4.18 0 1 1-4.18-4.17c.46 0 .9.08 1.32.22v2.18a1.8 1.8 0 0 0-1.32-.57 1.84 1.84 0 1 0 1.84 1.84V4.2h1.68Z"
        />
      </svg>
    ),
  },
  {
    key: "youtube",
    label: "YouTube",
    href: "https://www.youtube.com/",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path fill="#ffffff" d="M10.25 15.42 16.06 12l-5.81-3.42v6.84Z" />
      </svg>
    ),
  },
] as const;

export default async function AboutPage() {
  const [siteSettings, aboutPage, homePage] = await Promise.all([
    getSiteSettings(),
    getAboutPage(),
    getHomePage(),
  ]);

  const paragraphs = splitParagraphs(aboutPage.intro);
  const experienceStat = homePage.stats?.[3];

  return (
    <main className="page inner-page" aria-label="О компании Адамант">
      <SiteHeader active="about" phone={siteSettings.phonePrimary} />

      <section className="section about-section" aria-labelledby="about-title">
        <div className="about-hero">
          <div className="section__intro about-copy">
            <span className="about-kicker">{aboutPage.eyebrow}</span>
            <h1 id="about-title">{aboutPage.title}</h1>
            {aboutPage.subtitle ? <p>{aboutPage.subtitle}</p> : null}
            {paragraphs.map((paragraph, index) => (
              <p key={`${index}-${paragraph.slice(0, 20)}`}>{paragraph}</p>
            ))}

            <div className="about-socials" aria-label="Наши соцсети">
              <span className="about-socials__title">Наши соцсети</span>
              <div className="about-socials__list">
                {socialLinks.map((social) => (
                  <a
                    key={social.key}
                    className={`about-socials__item about-socials__item--${social.key}`}
                    href={social.href}
                    aria-label={social.label}
                    title={social.label}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <SocialIcon name={social.key} />
                  </a>
                ))}
              </div>
            </div>
          </div>

          <figure className="about-media" aria-label="Строительство современного дома">
            <img src="/строительство.png" alt="" />
            {experienceStat ? (
              <figcaption>
                <strong>{experienceStat.value}</strong>
                <span>{experienceStat.label}</span>
              </figcaption>
            ) : null}
          </figure>
        </div>

        <div className="about-principles" aria-label="Принципы работы">
          {aboutPage.principles?.map((principle, index) => (
            <article key={principle.id ?? `${principle.title}-${index}`}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h2>{principle.title}</h2>
              <p>{principle.text}</p>
            </article>
          ))}
        </div>

        <div className="faq" aria-label="Частые вопросы">
          <div className="faq__heading">
            <span>Вопросы</span>
            <h2>FAQ</h2>
            <p>Коротко о том, что обычно важно до начала проекта.</p>
          </div>

          <div className="faq__list">
            {aboutPage.faqItems?.map((item, index) => (
              <details
                className="faq-item"
                key={item.id ?? `${item.question}-${index}`}
                open={index === 0}
              >
                <summary>{item.question}</summary>
                <p>{item.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
