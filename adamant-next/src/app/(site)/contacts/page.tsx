import {
  getContactsPage,
  getPhoneHref,
  getSiteSettings,
  getWorkingHoursParts,
} from "@/site/cms";
import { SiteHeader } from "@/site/components/SiteHeader";
import { createPageMetadata } from "@/site/seo";
import { SocialIcon, socialLinks } from "@/site/socials";
import Link from "next/link";

export const dynamic = "force-dynamic";

export const metadata = createPageMetadata({
  title: "Контакты Адамант Строй | Санкт-Петербург",
  description:
    "Контакты строительной компании Адамант Строй: телефон, адрес офиса, режим работы и реквизиты.",
  path: "/contacts",
});

function ContactIcon({ type }: { type: "mail" | "map" | "message" | "phone" }) {
  const commonProps = {
    fill: "none",
    stroke: "currentColor",
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    strokeWidth: 2,
  };

  if (type === "mail") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4.5 6.5h15v11h-15z" {...commonProps} />
        <path d="m5 7 7 6 7-6" {...commonProps} />
      </svg>
    );
  }

  if (type === "map") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 21s6-5.1 6-10.3A6 6 0 1 0 6 10.7C6 15.9 12 21 12 21Z" {...commonProps} />
        <circle cx="12" cy="10.7" r="2" {...commonProps} />
      </svg>
    );
  }

  if (type === "message") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M5 6.5h14v9H9l-4 3v-12Z" {...commonProps} />
        <path d="M8.5 10h7" {...commonProps} />
        <path d="M8.5 13h4.5" {...commonProps} />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M7.2 5.5 9.4 4l3 5-2 1.4a10 10 0 0 0 4.2 4.2l1.4-2 5 3-1.5 2.2c-.5.8-1.5 1.2-2.4.9C10.5 16.9 7.1 13.5 5.3 6.9c-.3-.9.1-1.9.9-2.4Z" {...commonProps} />
    </svg>
  );
}

const trustItems = [
  "Фиксированная смета без скрытых платежей",
  "Гарантия на все виды работ и конструкций",
  "Соблюдение сроков по договору",
  "Официальный договор и прозрачные условия",
] as const;

export default async function ContactsPage() {
  const [siteSettings, contactsPage] = await Promise.all([
    getSiteSettings(),
    getContactsPage(),
  ]);

  const workingHours = getWorkingHoursParts(siteSettings.workingHours);
  const phones = [siteSettings.phonePrimary, siteSettings.phoneSecondary]
    .filter(Boolean)
    .filter((value, index, list) => list.indexOf(value) === index) as string[];
  const requisites = contactsPage.companyDetails;

  return (
    <main className="page inner-page contacts-page contacts-page--fresh" aria-label="Контакты Адамант">
      <SiteHeader active="contacts" phone={siteSettings.phonePrimary} />

      <section className="section contact-redesign" aria-labelledby="contacts-title">
        <nav className="page-breadcrumbs" aria-label="Хлебные крошки">
          <Link href="/">Главная</Link>
          <span aria-hidden="true">/</span>
          <span>Контакты</span>
        </nav>

        <div className="contact-redesign__top">
          <div className="contact-redesign__info">
            <h1 id="contacts-title">Контакты</h1>
            <p>
              Мы всегда на связи и готовы ответить на ваши вопросы, помочь с
              выбором проекта и рассчитать стоимость строительства.
            </p>

            <div className="contact-redesign__list">
              <article>
                <span className="contact-redesign__icon">
                  <ContactIcon type="phone" />
                </span>
                <div>
                  <h2>Телефон</h2>
                  {phones.map((phone) => (
                    <a key={phone} href={getPhoneHref(phone)}>
                      {phone}
                    </a>
                  ))}
                  <small>{workingHours.join(", ") || "Ежедневно с 9:00 до 20:00"}</small>
                </div>
              </article>

              <article>
                <span className="contact-redesign__icon">
                  <ContactIcon type="mail" />
                </span>
                <div>
                  <h2>E-mail</h2>
                  {siteSettings.email ? <a href={`mailto:${siteSettings.email}`}>{siteSettings.email}</a> : null}
                  <small>Ответим в течение 15 минут</small>
                </div>
              </article>

              <article>
                <span className="contact-redesign__icon">
                  <ContactIcon type="map" />
                </span>
                <div>
                  <h2>Офис и шоурум</h2>
                  <p>{contactsPage.officeAddress}</p>
                  <small>{siteSettings.workingHours || "Пн-Пт с 10:00 до 18:00"}</small>
                </div>
              </article>

              <article>
                <span className="contact-redesign__icon">
                  <ContactIcon type="message" />
                </span>
                <div>
                  <h2>Мессенджеры</h2>
                  <small>Напишите нам в удобном мессенджере</small>
                  <div className="contact-redesign__messengers">
                    {socialLinks.slice(0, 3).map((social) => (
                      <a
                        key={social.key}
                        href={social.href}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={social.label}
                        title={social.label}
                      >
                        <SocialIcon name={social.key} />
                      </a>
                    ))}
                  </div>
                </div>
              </article>
            </div>
          </div>

          <form className="contact-form contact-redesign__form" aria-label="Форма заявки">
            <h2>Оставьте заявку</h2>
            <p>Мы свяжемся с вами, ответим на вопросы и подготовим бесплатный расчёт сметы.</p>

            <div className="contact-redesign__form-row">
              <input name="name" type="text" placeholder="Ваше имя" aria-label="Ваше имя" />
              <input name="phone" type="tel" placeholder="Телефон *" aria-label="Телефон" required />
            </div>
            <input name="email" type="email" placeholder="E-mail" aria-label="E-mail" />
            <textarea name="message" rows={5} placeholder="Расскажите о вашем проекте" aria-label="Сообщение" />

            <label className="contact-redesign__consent">
              <input type="checkbox" name="privacy" required />
              <span>Согласен на <span>обработку персональных данных</span></span>
            </label>

            <button type="submit">Отправить заявку</button>
          </form>
        </div>

        <div className="contact-redesign__middle">
          <section className="contact-redesign__consult" aria-labelledby="contacts-consult-title">
            <div>
              <span className="contact-redesign__icon">
                <ContactIcon type="message" />
              </span>
              <h2 id="contacts-consult-title">Бесплатная консультация и расчёт сметы</h2>
              <p>
                Оставьте заявку и получите предварительный расчёт стоимости вашего дома уже сегодня.
              </p>
              <ul>
                <li>Проконсультируем по проекту и этапам работ</li>
                <li>Рассчитаем стоимость строительства</li>
                <li>Подберём оптимальные материалы</li>
                <li>Ответим на все ваши вопросы</li>
              </ul>
              <button className="js-open-estimate" type="button">
                Получить консультацию <span aria-hidden="true">→</span>
              </button>
            </div>
            <img src="/request-house.jpg" alt="" />
          </section>

          <aside className="contact-redesign__aside">
            <section>
              <h2>Мы в социальных сетях</h2>
              <p>Подписывайтесь и следите за нашими проектами и новостями.</p>
              <div className="contact-redesign__socials">
                {socialLinks.map((social) => (
                  <a
                    key={social.key}
                    href={social.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={social.label}
                    title={social.label}
                  >
                    <SocialIcon name={social.key} />
                  </a>
                ))}
              </div>
            </section>

            <section>
              <h2>Реквизиты компании</h2>
              <dl>
                <div>
                  <dt>Компания</dt>
                  <dd>{requisites?.legalName || siteSettings.companyName}</dd>
                </div>
                <div>
                  <dt>ИНН</dt>
                  <dd>{requisites?.inn}</dd>
                </div>
                <div>
                  <dt>КПП</dt>
                  <dd>{requisites?.kpp}</dd>
                </div>
                <div>
                  <dt>ОГРН</dt>
                  <dd>{requisites?.ogrn}</dd>
                </div>
              </dl>
            </section>
          </aside>
        </div>

        <section className="contact-redesign__map" aria-label="Карта расположения офиса">
          {contactsPage.mapEmbedUrl ? (
            <iframe
              src={contactsPage.mapEmbedUrl}
              title="Офис Адамант Строй на карте"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          ) : null}
          <div>
            <h2>Наш офис</h2>
            <p>{contactsPage.officeAddress}</p>
            <a href={contactsPage.mapEmbedUrl || "#"} target="_blank" rel="noreferrer">
              Посмотреть на карте <span aria-hidden="true">→</span>
            </a>
          </div>
        </section>

        <div className="contact-redesign__trust" aria-label="Преимущества">
          {trustItems.map((item, index) => (
            <article key={item}>
              <span>{index + 1}</span>
              <p>{item}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
