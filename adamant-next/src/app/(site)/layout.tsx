import Script from "next/script";

import { SiteFooter } from "@/site/components/SiteFooter";

import "../site.css";

type SiteLayoutProps = {
  children: React.ReactNode;
};

export default function SiteLayout({ children }: SiteLayoutProps) {
  return (
    <>
      {children}
      <div className="site-footer-slot">
        <SiteFooter />
      </div>
      <Script src="/site-script.js" strategy="afterInteractive" />
    </>
  );
}
