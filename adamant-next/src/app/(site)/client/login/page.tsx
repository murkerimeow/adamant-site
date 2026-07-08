import { redirect } from "next/navigation";

import { getClientAccessFromCookies } from "@/client-access/server";
import { getSiteSettings } from "@/site/cms";
import { SiteHeader } from "@/site/components/SiteHeader";
import { createPageMetadata } from "@/site/seo";

export const dynamic = "force-dynamic";

export const metadata = createPageMetadata({
  title: "Вход в личный кабинет | АДАМАНТ Строй",
  description: "Вход в личный кабинет клиента АДАМАНТ Строй.",
  index: false,
  path: "/client/login",
});

type ClientLoginPageProps = {
  searchParams: Promise<{
    error?: string;
  }>;
};

export default async function ClientLoginPage({ searchParams }: ClientLoginPageProps) {
  const activeSession = await getClientAccessFromCookies();

  if (activeSession) {
    redirect("/client");
  }

  const [siteSettings, params] = await Promise.all([getSiteSettings(), searchParams]);
  const hasError = params.error === "1";

  return (
    <div className="page inner-page client-auth-page">
      <SiteHeader phone={siteSettings.phonePrimary} />
      <main className="client-auth">
        <section className="client-auth__panel" aria-labelledby="client-login-title">
          <div className="client-auth__intro">
            <p className="eyebrow">Личный кабинет</p>
            <h1 id="client-login-title">Вход для клиентов</h1>
          </div>
          <form className="client-auth__form" action="/api/client-login" method="post">
            <label>
              <span>Логин</span>
              <input
                autoComplete="username"
                name="login"
                placeholder="client-123"
                required
                type="text"
              />
            </label>
            <label>
              <span>Пароль</span>
              <input autoComplete="current-password" name="password" required type="password" />
            </label>
            {hasError ? (
              <p className="client-auth__error">Неверный логин или пароль.</p>
            ) : null}
            <button type="submit">Войти</button>
          </form>
        </section>
      </main>
    </div>
  );
}
