import {
  getContactsPage,
  getPhoneHref,
  getSiteSettings,
  getWorkingHoursParts,
} from "@/site/cms";
import { SiteHeader } from "@/site/components/SiteHeader";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Контакты Адамант Строй | Санкт-Петербург",
};

export default async function ContactsPage() {
  const [siteSettings, contactsPage] = await Promise.all([
    getSiteSettings(),
    getContactsPage(),
  ]);

  const workingHours = getWorkingHoursParts(siteSettings.workingHours);
  const phones = [siteSettings.phonePrimary, siteSettings.phoneSecondary]
    .filter(Boolean)
    .filter((value, index, list) => list.indexOf(value) === index) as string[];

  return (
    <main className="page inner-page contacts-page" aria-label="Контакты Адамант">
      <SiteHeader active="contacts" phone={siteSettings.phonePrimary} />

      <section className="section contacts-section" aria-labelledby="contacts-title">
        <div className="section__intro section__intro--page contacts-heading">
          <span className="section__kicker">{contactsPage.eyebrow}</span>
          <h1 id="contacts-title">{contactsPage.title}</h1>
          <p>{contactsPage.subtitle}</p>
        </div>

        <div className="contacts-content">
          <section className="contact-form contact-requisites" aria-labelledby="requisites-title">
            <h2 id="requisites-title">Реквизиты</h2>
            <dl className="requisites-list">
              <div>
                <dt>Название</dt>
                <dd>{contactsPage.companyDetails?.legalName}</dd>
              </div>
              <div>
                <dt>ИНН</dt>
                <dd>{contactsPage.companyDetails?.inn}</dd>
              </div>
              <div>
                <dt>ОГРН</dt>
                <dd>{contactsPage.companyDetails?.ogrn}</dd>
              </div>
              <div>
                <dt>КПП</dt>
                <dd>{contactsPage.companyDetails?.kpp}</dd>
              </div>
              <div>
                <dt>Телефон</dt>
                <dd className="requisites-list__stack">
                  {phones.map((phone) => (
                    <a key={phone} href={getPhoneHref(phone)}>
                      {phone}
                    </a>
                  ))}
                </dd>
              </div>
              <div>
                <dt>Режим работы</dt>
                <dd className="requisites-list__stack">
                  {workingHours.map((part, index) => (
                    <span key={`${part}-${index}`}>{part}</span>
                  ))}
                </dd>
              </div>
              <div>
                <dt>Адрес</dt>
                <dd>{contactsPage.officeAddress}</dd>
              </div>
            </dl>
          </section>

          <div className="contacts-map contacts-map--real" aria-label="Карта расположения офиса">
            <iframe
              src={contactsPage.mapEmbedUrl || ""}
              title="Офис Адамант Строй на карте"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      </section>
    </main>
  );
}
