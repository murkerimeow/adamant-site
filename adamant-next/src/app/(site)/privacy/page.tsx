import { getSiteSettings } from "@/site/cms";
import { SiteHeader } from "@/site/components/SiteHeader";
import { createPageMetadata } from "@/site/seo";

export const dynamic = "force-dynamic";

export const metadata = createPageMetadata({
  title: "Политика обработки данных | Адамант Строй",
  description: "Политика обработки персональных данных и использования cookies на сайте Адамант Строй.",
  index: false,
  path: "/privacy",
});

export default async function PrivacyPage() {
  const siteSettings = await getSiteSettings();

  return (
    <main className="page inner-page privacy-page" aria-label="Политика обработки данных">
      <SiteHeader active="home" phone={siteSettings.phonePrimary} />

      <section className="section privacy-content" aria-labelledby="privacy-title">
        <span className="section__kicker">Документы</span>
        <h1 id="privacy-title">Политика обработки данных</h1>
        <p>
          Мы используем данные из форм обратной связи только для обработки вашего обращения:
          чтобы связаться с вами, ответить на вопросы и подготовить расчёт по проекту.
        </p>
        <p>
          На сайте применяются технические cookies, необходимые для корректной работы интерфейса,
          форм заявок и сохранения выбранных настроек. Вы можете ограничить cookies в настройках
          браузера, но часть функций сайта может работать нестабильно.
        </p>
        <p>
          Данные не передаются третьим лицам, кроме случаев, когда это требуется для обработки
          заявки или предусмотрено законодательством Российской Федерации.
        </p>
        <p>
          По вопросам обработки данных можно написать на почту
          {" "}
          <a href="mailto:stroy.178@inbox.ru">stroy.178@inbox.ru</a>.
        </p>
      </section>
    </main>
  );
}
