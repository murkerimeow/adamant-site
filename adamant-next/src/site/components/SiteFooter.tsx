import { getCatalogItems, getServices, getSiteSettings } from "@/site/cms";
import { SocialIcon, socialLinks } from "@/site/socials";

const footerNavItems = [
  { href: "/", label: "Главная" },
  { href: "/services", label: "Услуги" },
  { href: "/portfolio", label: "Портфолио" },
  { href: "/catalog", label: "Каталог" },
  { href: "/blog", label: "Блог" },
  { href: "/contacts", label: "Контакты" },
  { href: "/about", label: "О нас" },
  { href: "/vacancies", label: "Вакансии" },
];

export async function SiteFooter() {
  const [siteSettings, services, catalogItems] = await Promise.all([
    getSiteSettings(),
    getServices(),
    getCatalogItems(),
  ]);

  const catalogByTitle = new Map(catalogItems.map((item) => [item.title, item]));
  const footerServices = services.slice(0, 5);
  const currentYear = new Date().getFullYear();

  return (
    <footer className="home-footer" aria-label="Подвал сайта">
      <div className="home-footer__cta">
        <div>
          <span>Начать проект</span>
          <h2>Рассчитаем дом под ваш участок и бюджет</h2>
          <p>
            Оставьте заявку, и мы уточним задачу, подберем технологию строительства
            и подготовим понятный первый расчет.
          </p>
        </div>
        <button className="home-footer__cta-button js-open-estimate" type="button">
          Получить расчет
        </button>
      </div>

      <div className="home-footer__main">
        <div className="home-footer__brand">
          <a className="home-footer__logo" href="/" aria-label="Адамант">
            <img src="/logo-new.PNG" alt="Адамант" />
          </a>
          <p>
            Строим современные загородные дома под ключ в Санкт-Петербурге
            и Ленинградской области с прозрачной сметой и контролем сроков.
          </p>
          <button className="home-footer__button js-open-estimate" type="button">
            Оставить заявку
          </button>
        </div>

        <nav className="home-footer__column" aria-label="Навигация в футере">
          <h2>Разделы</h2>
          <div className="home-footer__links">
            {footerNavItems.map((item) => (
              <a key={item.href} href={item.href}>
                {item.label}
              </a>
            ))}
          </div>
        </nav>

        <div className="home-footer__column">
          <h2>Услуги</h2>
          <div className="home-footer__links">
            {footerServices.map((service) => {
              const catalogItem = catalogByTitle.get(service.title);
              const href = catalogItem
                ? `/catalog-item?item=${encodeURIComponent(catalogItem.itemKey)}&source=services`
                : "/services";

              return (
                <a key={service.id} href={href}>
                  {service.title}
                </a>
              );
            })}
          </div>
        </div>

        <div className="home-footer__column home-footer__contacts">
          <h2>Контакты</h2>
          <button className="home-footer__contact-link js-open-estimate" type="button">
            {siteSettings.phonePrimary}
          </button>
          {siteSettings.email ? (
            <a className="home-footer__contact-link" href={`mailto:${siteSettings.email}`}>
              {siteSettings.email}
            </a>
          ) : null}
          {siteSettings.address ? <span>{siteSettings.address}</span> : null}
          {siteSettings.workingHours ? <span>{siteSettings.workingHours}</span> : null}

          <div className="home-footer__socials" aria-label="Соцсети">
            {socialLinks.map((social) => (
              <a
                key={social.key}
                className={`home-footer__social-link home-footer__social-link--${social.key}`}
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
      </div>

      <div className="home-footer__bottom">
        <span>© {currentYear} Адамант Строй</span>
        <span>Проектирование и строительство частных домов под ключ</span>
      </div>
    </footer>
  );
}
