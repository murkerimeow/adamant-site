import {
  getContactsPage,
  getPhoneHref,
  getSiteSettings,
  getWorkingHoursParts,
} from "@/site/cms";
import { SiteHeader } from "@/site/components/SiteHeader";
import { createPageMetadata } from "@/site/seo";
import { SocialIcon, socialLinks } from "@/site/socials";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const contactsPage = await getContactsPage();

  return createPageMetadata({
    title: contactsPage.seoTitle || "Заполните SEO Title в Payload",
    description: contactsPage.seoDescription || "Заполните SEO Description в Payload",
    path: "/contacts",
  });
}

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

export default async function ContactsPage() {
  const [siteSettings, contactsPage] = await Promise.all([
    getSiteSettings(),
    getContactsPage(),
  ]);

  const workingHours = getWorkingHoursParts(siteSettings.workingHours);
  const contactPhone = siteSettings.phonePrimary;
  const contactEmail = siteSettings.email?.trim() || "info@adamant-stroy.com";
  const officeAddress = siteSettings.address?.trim() || contactsPage.officeAddress;
  const requisites = contactsPage.companyDetails;

  return (
    <main className="page inner-page contacts-page contacts-page--fresh" aria-label="Контакты Адамант">
      <SiteHeader active="contacts" phone={siteSettings.phonePrimary} />

      <section className="section contact-redesign contact-redesign--reference" aria-labelledby="contacts-title">
        <div className="contact-redesign__top">
          <section className="contact-redesign__info contact-redesign__card">
            <h1 id="contacts-title">Контакты</h1>

            <div className="contact-redesign__list">
              <article>
                <span className="contact-redesign__icon">
                  <ContactIcon type="phone" />
                </span>
                <div>
                  <h2>Телефон</h2>
                  <a href={getPhoneHref(contactPhone)}>{contactPhone}</a>
                  <small>На связи 24/7</small>
                </div>
              </article>

              <article>
                <span className="contact-redesign__icon">
                  <ContactIcon type="mail" />
                </span>
                <div>
                  <h2>E-mail</h2>
                  <a href={`mailto:${contactEmail}`}>{contactEmail}</a>
                  <small>Ответим в самое ближайшее время</small>
                </div>
              </article>

              <article>
                <span className="contact-redesign__icon">
                  <ContactIcon type="map" />
                </span>
                <div>
                  <h2>Наш офис</h2>
                  <p>{officeAddress}</p>
                  <small>{workingHours.join(", ") || siteSettings.workingHours || "ПН-ПТ, 10:00 - 16:00"}</small>
                </div>
              </article>
            </div>
          </section>

          <div className="contact-redesign__side">
            <section className="contact-redesign__card contact-redesign__requisites">
              <h2>Реквизиты компании</h2>
              <dl>
                <div>
                  <dt>Наименование:</dt>
                  <dd>{requisites?.legalName || siteSettings.companyName}</dd>
                </div>
                <div>
                  <dt>ИНН:</dt>
                  <dd>{requisites?.inn}</dd>
                </div>
                <div>
                  <dt>КПП:</dt>
                  <dd>{requisites?.kpp}</dd>
                </div>
                <div>
                  <dt>ОГРН:</dt>
                  <dd>{requisites?.ogrn}</dd>
                </div>
              </dl>
            </section>

            <section className="contact-redesign__card contact-redesign__social-card">
              <h2>Наши соцсети</h2>
              <p>Подписывайтесь и следите за нашими проектами и новостями</p>
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
          </div>
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
        </section>

        <section className="contact-redesign__message">
          <form className="contact-form contact-redesign__form" aria-label="Форма заявки">
            <h2>Напишите нам</h2>
            <p>Мы свяжемся с вами, ответим на вопросы и подготовим бесплатный расчёт сметы</p>

            <input name="name" type="text" placeholder="Имя" aria-label="Имя" />
            <input name="phone" type="tel" placeholder="Телефон *" aria-label="Телефон" required />
            <input name="email" type="email" placeholder="E-mail" aria-label="E-mail" />
            <textarea name="message" rows={5} placeholder="Ваши пожелания по участку" aria-label="Сообщение" />

            <label className="contact-redesign__consent">
              <input type="checkbox" name="privacy" required />
              <span>Согласен на <span>обработку персональных данных</span></span>
            </label>

            <button type="submit">Отправить</button>
            <p className="contact-form__status" aria-live="polite" />
          </form>

          <img
            src="/plot-selection.webp"
            alt="Модульный загородный дом на участке"
            loading="lazy"
            decoding="async"
          />
        </section>
      </section>
    </main>
  );
}
