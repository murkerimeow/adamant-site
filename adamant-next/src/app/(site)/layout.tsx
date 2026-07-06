import Script from "next/script";

import { getPhoneHref, getSiteSettings } from "@/site/cms";
import { SiteFooter } from "@/site/components/SiteFooter";
import { DEFAULT_OG_IMAGE, SITE_NAME, SITE_URL } from "@/site/seo";
import { socialLinks } from "@/site/socials";

import "../site.css";

type SiteLayoutProps = {
  children: React.ReactNode;
};

function buildStructuredData(siteSettings: Awaited<ReturnType<typeof getSiteSettings>>) {
  const sameAs = socialLinks.map((social) => social.href);

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@id": `${SITE_URL}/#organization`,
        "@type": "HomeAndConstructionBusiness",
        address: siteSettings.address || undefined,
        areaServed: [
          {
            "@type": "AdministrativeArea",
            name: "Санкт-Петербург",
          },
          {
            "@type": "AdministrativeArea",
            name: "Ленинградская область",
          },
        ],
        email: siteSettings.email || undefined,
        image: `${SITE_URL}${DEFAULT_OG_IMAGE}`,
        logo: `${SITE_URL}/logo-new.PNG`,
        name: siteSettings.companyName || SITE_NAME,
        openingHours: siteSettings.workingHours || undefined,
        sameAs,
        telephone: siteSettings.phonePrimary,
        url: SITE_URL,
      },
      {
        "@id": `${SITE_URL}/#website`,
        "@type": "WebSite",
        inLanguage: "ru-RU",
        name: SITE_NAME,
        publisher: {
          "@id": `${SITE_URL}/#organization`,
        },
        url: SITE_URL,
      },
      {
        "@id": `${SITE_URL}/#services`,
        "@type": "OfferCatalog",
        itemListElement: [
          "Строительство домов под ключ",
          "Строительство домов из газобетона",
          "Строительство каркасных домов",
          "Строительство домов из бруса",
          "Отделка коммерческих помещений",
          "Ремонт квартир",
        ].map((name) => ({
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name,
            provider: {
              "@id": `${SITE_URL}/#organization`,
            },
          },
        })),
        name: "Услуги Адамант Строй",
      },
    ],
  };
}

function stringifyStructuredData(data: ReturnType<typeof buildStructuredData>) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

function stringifySiteContacts(data: { phoneHref?: string }) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

export default async function SiteLayout({ children }: SiteLayoutProps) {
  const siteSettings = await getSiteSettings();
  const structuredData = buildStructuredData(siteSettings);
  const siteContacts = {
    phoneHref: siteSettings.phonePrimary ? getPhoneHref(siteSettings.phonePrimary) : undefined,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: stringifyStructuredData(structuredData) }}
      />
      <script
        dangerouslySetInnerHTML={{
          __html: `window.__ADAMANT_SITE_CONTACTS__=${stringifySiteContacts(siteContacts)};`,
        }}
      />
      {children}
      <div className="site-footer-slot">
        <SiteFooter />
      </div>
      <Script src="/site-script.js?v=20260706-site-motion" strategy="afterInteractive" />
    </>
  );
}
