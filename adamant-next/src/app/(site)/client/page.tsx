import { redirect } from "next/navigation";

import { getClientAccessFromCookies } from "@/client-access/server";
import { getSiteSettings } from "@/site/cms";
import { SiteHeader } from "@/site/components/SiteHeader";
import { createPageMetadata } from "@/site/seo";

export const dynamic = "force-dynamic";

export const metadata = createPageMetadata({
  title: "Личный кабинет | АДАМАНТ Строй",
  description: "Личный кабинет клиента АДАМАНТ Строй.",
  index: false,
  path: "/client",
});

export default async function ClientCabinetPage() {
  const activeSession = await getClientAccessFromCookies();

  if (!activeSession) {
    redirect("/client/login");
  }

  const siteSettings = await getSiteSettings();

  return (
    <div className="page inner-page client-cabinet-page">
      <SiteHeader phone={siteSettings.phonePrimary} />
      <main className="client-cabinet">
        <section className="client-cabinet__panel" aria-labelledby="client-cabinet-title">
          <div className="client-cabinet__topline">
            <h1 id="client-cabinet-title">Личный кабинет</h1>
            <form action="/api/client-logout" method="post">
              <button type="submit">Выйти</button>
            </form>
          </div>
          <div className="client-cabinet__empty" aria-hidden="true" />
        </section>
      </main>
    </div>
  );
}
