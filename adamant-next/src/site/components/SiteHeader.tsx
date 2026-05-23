/* eslint-disable @next/next/no-html-link-for-pages */

type SiteHeaderProps = {
  active?:
    | "about"
    | "blog"
    | "catalog"
    | "contacts"
    | "home"
    | "mortgage"
    | "portfolio"
    | "services";
  phone: string;
};

const navItems = [
  { href: "/", key: "home", label: "Главная" },
  { href: "/services", key: "services", label: "Услуги" },
  { href: "/mortgage", key: "mortgage", label: "Ипотека", badge: "NEW" },
  { href: "/portfolio", key: "portfolio", label: "Портфолио" },
  { href: "/catalog", key: "catalog", label: "Каталог" },
  { href: "/blog", key: "blog", label: "Блог" },
  { href: "/contacts", key: "contacts", label: "Контакты" },
  { href: "/about", key: "about", label: "О нас" },
] as const;

export function SiteHeader({ active, phone }: SiteHeaderProps) {
  return (
    <header className="header">
      <a className="brand" href="/" aria-label="Адамант">
        <img className="brand__mark" src="/logo-new.PNG" alt="Адамант" />
      </a>

      <nav className="nav" aria-label="Основная навигация">
        {navItems.map((item) => (
          <a
            key={item.href}
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
          </a>
        ))}
      </nav>

      <button className="phone" type="button" aria-label={`Оставить заявку по номеру ${phone}`}>
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
