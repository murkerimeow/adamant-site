/* eslint-disable @next/next/no-html-link-for-pages */
import { getHeaderCatalogCategories, getSiteSettings } from "@/site/cms";
import { getCatalogCategoryPath } from "@/site/routes";
import { SocialIcon, socialLinks } from "@/site/socials";

type HeaderNavKey =
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

type HeaderNavItem = {
  badge?: string;
  href: string;
  key: HeaderNavKey;
  label: string;
};

type HeaderNavSettingsItem = {
  badge?: string | null;
  href?: string | null;
  label?: string | null;
  navKey?: HeaderNavKey | null;
  showInHeader?: boolean | null;
};

type SiteSettingsWithHeaderNav = {
  headerNavItems?: HeaderNavSettingsItem[] | null;
};

type SiteHeaderProps = {
  active?: HeaderNavKey;
  phone: string;
};

const defaultNavItems: HeaderNavItem[] = [
  { href: "/", key: "home", label: "Главная" },
  { href: "/services", key: "services", label: "Услуги" },
  { href: "/mortgage", key: "mortgage", label: "Ипотека", badge: "NEW" },
  { href: "/portfolio", key: "portfolio", label: "Портфолио" },
  { href: "/catalog", key: "catalog", label: "Проекты" },
  { href: "/blog", key: "blog", label: "Блог" },
  { href: "/#reviews", key: "reviews", label: "Отзывы" },
  { href: "/vacancies", key: "vacancies", label: "Вакансии" },
  { href: "/contacts", key: "contacts", label: "Контакты" },
  { href: "/about", key: "about", label: "О нас" },
];

const defaultNavItemByKey = defaultNavItems.reduce(
  (items, item) => ({
    ...items,
    [item.key]: item,
  }),
  {} as Record<HeaderNavKey, HeaderNavItem>,
);

function getHeaderNavItems(siteSettings: SiteSettingsWithHeaderNav): HeaderNavItem[] {
  const configuredItems = siteSettings.headerNavItems;

  if (!Array.isArray(configuredItems) || configuredItems.length === 0) {
    return defaultNavItems;
  }

  const visibleItems: HeaderNavItem[] = [];

  for (const item of configuredItems) {
    if (item.showInHeader === false) {
      continue;
    }

    const navKey = item.navKey;

    if (!navKey) {
      continue;
    }

    const defaultItem = defaultNavItemByKey[navKey];

    if (!defaultItem) {
      continue;
    }

    visibleItems.push({
      ...defaultItem,
      badge: item.badge?.trim() || undefined,
      href: item.href?.trim() || defaultItem.href,
      label: item.label?.trim() || defaultItem.label,
    });
  }

  return visibleItems;
}

export async function SiteHeader({ active, phone }: SiteHeaderProps) {
  const [catalogCategories, siteSettings] = await Promise.all([
    getHeaderCatalogCategories(),
    getSiteSettings(),
  ]);
  const navItems = getHeaderNavItems(siteSettings as SiteSettingsWithHeaderNav);
  const showCatalogDropdown = navItems.some((item) => item.key === "catalog");

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
              key={`${item.key}-${item.href}`}
              className={`nav__item${isCatalog ? " nav__item--catalog" : ""}`}
            >
              <a
                aria-haspopup={isCatalog ? "menu" : undefined}
                className={`nav__link${item.key === active ? " nav__link--active" : ""}`}
                href={item.href}
              >
                <span className="nav__label">{item.label}</span>
                {item.badge ? (
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
                    aria-label="Показать категории проектов"
                    aria-expanded="false"
                    data-nav-submenu-toggle="catalog"
                  >
                    +
                  </button>
                  <div className="nav__dropdown" aria-label="Категории проектов">
                    <a className="nav__dropdown-all" href="/catalog">
                      Все
                    </a>
                    {catalogCategories.map((category) => (
                      <a key={category.id} href={getCatalogCategoryPath(category)}>
                        {category.title}
                      </a>
                    ))}
                  </div>
                </>
              ) : null}
            </div>
          );
        })}

        <div className="nav__mobile-contact" aria-label="Контакты">
          <a className="nav__mobile-cabinet" href="/client/login">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="12" cy="12" r="9" />
              <path d="M12 12a3.1 3.1 0 1 0 0-6.2 3.1 3.1 0 0 0 0 6.2Z" />
              <path d="M6.8 18.1a5.6 5.6 0 0 1 10.4 0" />
            </svg>
            <span>Личный кабинет</span>
          </a>
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

      {showCatalogDropdown ? (
        <div className="header-projects-dropdown" aria-label="Категории проектов">
          <a className="header-projects-dropdown__all" href="/catalog">
            Все
          </a>
          {catalogCategories.map((category) => (
            <a key={`header-${category.id}`} href={getCatalogCategoryPath(category)}>
              {category.title}
            </a>
          ))}
        </div>
      ) : null}

      <button className="phone js-open-callback" type="button" aria-label={`Заказать обратный звонок по номеру ${phone}`}>
        {phone}
      </button>
      <a className="cabinet-link" href="/client/login" aria-label="Личный кабинет" title="Личный кабинет">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="12" cy="12" r="9" />
          <path d="M12 12a3.1 3.1 0 1 0 0-6.2 3.1 3.1 0 0 0 0 6.2Z" />
          <path d="M6.8 18.1a5.6 5.6 0 0 1 10.4 0" />
        </svg>
      </a>
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
