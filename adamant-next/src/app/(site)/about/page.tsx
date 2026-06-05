import {
  getAboutPage,
  getCompanyStats,
  getMediaAlt,
  getMediaUrl,
  getSiteSettings,
  getTeamMembers,
  splitParagraphs,
} from "@/site/cms";
import { SiteHeader } from "@/site/components/SiteHeader";
import { createPageMetadata } from "@/site/seo";
import Link from "next/link";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const aboutPage = await getAboutPage();

  return createPageMetadata({
    title: aboutPage.seoTitle || "Заполните SEO Title в Payload",
    description: aboutPage.seoDescription || "Заполните SEO Description в Payload",
    path: "/about",
  });
}

function AboutIcon({ type }: { type: "care" | "eco" | "home" | "people" | "shield" | "target" }) {
  const commonProps = {
    fill: "none",
    stroke: "currentColor",
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    strokeWidth: 1.9,
  };

  if (type === "people") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="9" cy="8.5" r="2.6" {...commonProps} />
        <circle cx="16" cy="9.5" r="2.1" {...commonProps} />
        <path d="M4.5 19a4.7 4.7 0 0 1 9 0" {...commonProps} />
        <path d="M13.5 18.8a3.7 3.7 0 0 1 6 0" {...commonProps} />
      </svg>
    );
  }

  if (type === "shield") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 3.8 18.5 6v5.3c0 4.1-2.6 7.6-6.5 8.9-3.9-1.3-6.5-4.8-6.5-8.9V6L12 3.8Z" {...commonProps} />
        <path d="m9.2 12 1.8 1.8 3.9-4" {...commonProps} />
      </svg>
    );
  }

  if (type === "care") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 19.5s-7-4.2-7-9.2A3.8 3.8 0 0 1 12 8a3.8 3.8 0 0 1 7 2.3c0 5-7 9.2-7 9.2Z" {...commonProps} />
      </svg>
    );
  }

  if (type === "eco") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M5 18c8 .2 13.2-4.5 14-13-8.2.2-13.5 5-14 13Z" {...commonProps} />
        <path d="M5 18c2.9-4.5 6.7-7.4 11.3-9" {...commonProps} />
      </svg>
    );
  }

  if (type === "target") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="7.5" {...commonProps} />
        <circle cx="12" cy="12" r="3.4" {...commonProps} />
        <path d="M15 9 20 4" {...commonProps} />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4.5 11.2 12 5l7.5 6.2" {...commonProps} />
      <path d="M6.6 10.2v8.3h10.8v-8.3" {...commonProps} />
      <path d="M10 18.5v-4.8h4v4.8" {...commonProps} />
    </svg>
  );
}

const approachTrustCards = [
  {
    icon: "people",
    title: "Управление проектом",
    items: ["Собственная команда", "Один ответственный менеджер", "Понятные этапы и сроки"],
  },
  {
    icon: "target",
    title: "Финансовая прозрачность",
    items: ["Фиксированная смета", "Официальный договор", "Без скрытых доплат"],
  },
  {
    icon: "shield",
    title: "Контроль и гарантия",
    items: ["Технадзор на этапах", "Сертифицированные материалы", "Гарантия до 5 лет"],
  },
] as const;

const aboutStatIcons: Record<string, "home" | "people" | "shield"> = {
  builtHomes: "home",
  estimateDay: "shield",
  happyFamilies: "people",
  marketYears: "home",
  region: "people",
  warranty: "shield",
};

const fallbackTeam = [
  { name: "Александр Петров", role: "Основатель, генеральный директор", description: "Отвечает за стратегию и развитие компании." },
  { name: "Михаил Иванов", role: "Технический директор", description: "Контролирует качество работ и внедряет новые технологии." },
  { name: "Екатерина Смирнова", role: "Руководитель проектов", description: "Координирует проекты на всех этапах." },
  { name: "Дмитрий Кузнецов", role: "Руководитель строительных работ", description: "Отвечает за соблюдение сроков и качества." },
  { name: "Ольга Белова", role: "Менеджер по работе с клиентами", description: "Помогает подобрать оптимальное решение." },
  { name: "Снежана Прокопьева", role: "Супердиректор", description: "Держит команду в тонусе и помогает проектам двигаться быстрее." },
  { name: "Игорь Важенин", role: "Просто директор", description: "Следит за порядком в процессах и важными решениями." },
  { name: "Тимур Абдуллаев", role: "Прораб", description: "Координирует работы на объекте и отвечает за качество этапов." },
  { name: "Мурад Керимов", role: "Просто мимо пробегал", description: "Появился вовремя и добавил команде хорошего настроения." },
] as const;

function getInitials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

export default async function AboutPage() {
  const [siteSettings, aboutPage, teamMembers] = await Promise.all([
    getSiteSettings(),
    getAboutPage(),
    getTeamMembers(),
  ]);

  const paragraphs = splitParagraphs(aboutPage.intro);
  const stats = getCompanyStats(siteSettings, "about").slice(0, 5).map((stat) => ({
    ...stat,
    icon: aboutStatIcons[stat.key] ?? "home",
  }));
  const team = teamMembers;

  return (
    <main className="page inner-page about-page about-page--fresh" aria-label="О компании Адамант">
      <SiteHeader active="about" phone={siteSettings.phonePrimary} />

      <section className="section about-redesign" aria-labelledby="about-title">
        <div className="about-redesign__hero">
          <img
            src="/about-banner.webp"
            alt=""
            loading="eager"
            decoding="async"
            fetchPriority="high"
          />
          <div className="about-redesign__hero-content">
            <nav className="page-breadcrumbs" aria-label="Хлебные крошки">
              <Link href="/">Главная</Link>
              <span aria-hidden="true">/</span>
              <span>{aboutPage.eyebrow || "Заполните плашку в Payload"}</span>
            </nav>
            <span className="about-redesign__eyebrow">{aboutPage.eyebrow || "Заполните плашку в Payload"}</span>
            <h1 id="about-title">{aboutPage.title || "Заполните заголовок в Payload"}</h1>
            <p>{aboutPage.subtitle || "Заполните описание в Payload"}</p>
            <button className="js-open-message" type="button">
              Написать нам
            </button>
          </div>
        </div>

        <div className="about-redesign__stats" aria-label="Показатели">
          {stats.map((stat) => (
            <article key={`${stat.value}-${stat.label}`}>
              <span>
                <AboutIcon type={stat.icon} />
              </span>
              <strong>{stat.value}</strong>
              <small>{stat.label}</small>
            </article>
          ))}
        </div>

        <section className="about-redesign__story" aria-labelledby="about-story-title">
          <div>
            <h2 id="about-story-title">Наша история</h2>
            {paragraphs.length ? (
              paragraphs.slice(0, 3).map((paragraph, index) => (
                <p key={`${index}-${paragraph.slice(0, 20)}`}>{paragraph}</p>
              ))
            ) : (
              <p>Заполните историю компании в Payload.</p>
            )}
            <a href="/contacts">
              Подробнее о компании <span aria-hidden="true">→</span>
            </a>
          </div>
          <img src="/дом из бруса.png" alt="" loading="lazy" decoding="async" />
        </section>

        <section className="about-redesign__approach" aria-labelledby="about-approach-title">
          <div className="about-approach-intro">
            <span>Наш подход</span>
            <h2 id="about-approach-title">Почему нам доверяют</h2>
            <i aria-hidden="true" />
            <p>
              Выстраиваем понятную систему работы и берем на себя все ключевые
              процессы строительства, чтобы вы получили качественный результат
              без лишних рисков и забот.
            </p>
          </div>
          <div className="about-approach-cards">
            {approachTrustCards.map((item, index) => (
              <article key={item.title} className="about-approach-card">
                <span className="about-approach-card__icon" aria-hidden="true">
                  <AboutIcon type={item.icon} />
                </span>
                <strong className="about-approach-card__number">
                  {String(index + 1).padStart(2, "0")}
                </strong>
                <h3>{item.title}</h3>
                <i aria-hidden="true" />
                <ul>
                  {item.items.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section className="about-redesign__team" aria-labelledby="about-team-title" data-home-services-carousel>
          <div className="about-redesign__section-head">
            <h2 id="about-team-title">Наша команда</h2>
            <a href="/vacancies">
              Все специалисты <span aria-hidden="true">→</span>
            </a>
            <div className="about-redesign__team-actions" aria-label="Навигация по команде">
              <button className="home-project-preview__arrow" type="button" aria-label="Предыдущие специалисты" data-slider-prev>
                ‹
              </button>
              <button className="home-project-preview__arrow home-project-preview__arrow--active" type="button" aria-label="Следующие специалисты" data-slider-next>
                ›
              </button>
            </div>
          </div>
          <div className="about-redesign__team-track js-wheel-slider">
            {team.length ? team.map((member) => {
              const avatarUrl =
                "avatar" in member
                  ? getMediaUrl(member.avatar) || getMediaUrl(member.avatar, "thumb")
                  : "";
              const nameParts = member.name.split(/\s+/).filter(Boolean);

              return (
              <article key={member.name}>
                <div
                  className={`about-redesign__avatar${avatarUrl ? " about-redesign__avatar--image" : ""}`}
                  aria-hidden="true"
                >
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt={getMediaAlt("avatar" in member ? member.avatar : null, member.name)}
                      loading="lazy"
                      decoding="async"
                    />
                  ) : (
                    <span>{getInitials(member.name)}</span>
                  )}
                </div>
                <h3>
                  {nameParts.map((part) => (
                    <span key={`${member.name}-${part}`}>{part}</span>
                  ))}
                </h3>
                <strong>{member.role}</strong>
                <p>{member.description}</p>
              </article>
              );
            }) : (
              <article className="about-redesign__team-empty">
                <div className="about-redesign__avatar" aria-hidden="true">
                  <span>?</span>
                </div>
                <h3>
                  <span>Добавьте</span>
                  <span>команду</span>
                </h3>
                <strong>Payload</strong>
                <p>Создайте сотрудников в разделе команды.</p>
              </article>
            )}
          </div>
        </section>

        <section className="about-redesign__cta about-redesign__cta--career" aria-label="Отклик на вакансию">
          <div>
            <h2>Хотите работать с нами?</h2>
            <p>Оставьте контакты и коротко расскажите о себе. Мы свяжемся, если найдем подходящую роль в команде.</p>
            <div>
              <a href="/vacancies">Смотреть вакансии <span aria-hidden="true">→</span></a>
            </div>
          </div>
          <form className="contact-form about-redesign__career-form" aria-label="Отклик на вакансию">
            <input name="name" type="text" placeholder="Ваше имя" aria-label="Ваше имя" />
            <input name="phone" type="tel" placeholder="Телефон *" aria-label="Телефон" required />
            <input name="email" type="email" placeholder="E-mail" aria-label="E-mail" />
            <textarea name="message" rows={3} placeholder="Расскажите о себе" aria-label="Сообщение" />
            <input type="hidden" name="service" value="Отклик на вакансию" />
            <label>
              <input type="checkbox" name="privacy" required />
              <span>Я согласен на обработку персональных данных</span>
            </label>
            <button type="submit" disabled>Отправить отклик</button>
            <p className="contact-form__status" aria-live="polite" />
          </form>
        </section>
      </section>
    </main>
  );
}
