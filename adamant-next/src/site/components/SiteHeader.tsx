/* eslint-disable @next/next/no-html-link-for-pages */
import { getCatalogCategories } from "@/site/cms";
import { getCatalogCategoryPath } from "@/site/routes";
import { SocialIcon, socialLinks } from "@/site/socials";

type SiteHeaderProps = {
  active?:
    | "about"
    | "blog"
    | "catalog"
    | "contacts"
    | "home"
    | "mortgage"
    | "portfolio"
    | "reviews"
    | "services"
    | "vacancies";
  phone: string;
};

const navItems = [
  { href: "/", key: "home", label: "Главная" },
  { href: "/services", key: "services", label: "Услуги" },
  { href: "/mortgage", key: "mortgage", label: "Ипотека", badge: "NEW" },
  { href: "/portfolio", key: "portfolio", label: "Портфолио" },
  { href: "/catalog", key: "catalog", label: "Каталог" },
  { href: "/blog", key: "blog", label: "Блог" },
  { href: "/#reviews", key: "reviews", label: "Отзывы" },
  { href: "/vacancies", key: "vacancies", label: "Вакансии" },
  { href: "/contacts", key: "contacts", label: "Контакты" },
  { href: "/about", key: "about", label: "О нас" },
] as const;

export async function SiteHeader({ active, phone }: SiteHeaderProps) {
  const catalogCategories = await getCatalogCategories();

  return (
    <header className="header">
      <a className="brand" href="/" aria-label="Адамант">
        <img
          className="brand__mark"
          src="/logo-new.PNG"
          alt="Адамант"
          loading="eager"
          decoding="async"
        />
      </a>

      <nav className="nav" aria-label="Основная навигация">
        {navItems.map((item) => {
          const isCatalog = item.key === "catalog";

          return (
            <div
              key={item.href}
              className={`nav__item${isCatalog ? " nav__item--catalog" : ""}`}
            >
              <a
                aria-haspopup={isCatalog ? "menu" : undefined}
                className={`nav__link${item.key === active ? " nav__link--active" : ""}`}
                href={item.href}
              >
                <span className="nav__label">{item.label}</span>
                {"badge" in item ? (
                  <>
                    {" "}
                    <span className="nav__badge">{item.badge}</span>
                  </>
                ) : null}
                {isCatalog ? (
                  <span className="nav__chevron" aria-hidden="true">
                    <svg focusable="false" viewBox="0 0 16 16">
                      <path d="M4.2 6.1 8 9.9l3.8-3.8" />
                    </svg>
                  </span>
                ) : null}
              </a>
              {isCatalog ? (
                <>
                  <button
                    className="nav__submenu-toggle"
                    type="button"
                    aria-label="Показать категории каталога"
                    aria-expanded="false"
                    data-nav-submenu-toggle="catalog"
                  >
                    +
                  </button>
                  <div className="nav__dropdown" aria-label="Категории каталога">
                    {catalogCategories.map((category) => (
                      <a key={category.id} href={getCatalogCategoryPath(category)}>
                        {category.title}
                      </a>
                    ))}
                    <a className="nav__dropdown-all" href="/catalog">
                      Все
                    </a>
                  </div>
                </>
              ) : null}
            </div>
          );
        })}

        <div className="nav__mobile-contact" aria-label="Контакты">
          <button className="nav__mobile-phone js-open-callback" type="button">
            {phone}
          </button>
          <div className="nav__mobile-socials" aria-label="Соцсети">
            {socialLinks.map((social) => (
              <a
                key={social.key}
                className={`nav__mobile-social nav__mobile-social--${social.key}`}
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
      </nav>

      <button className="phone js-open-callback" type="button" aria-label={`Заказать обратный звонок по номеру ${phone}`}>
        {phone}
      </button>
      <button
        className="mobile-menu-toggle"
        type="button"
        aria-label="Open menu"
        aria-expanded="false"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>
    </header>
  );
}
