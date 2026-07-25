import type { Metadata } from "next";
import { Suspense } from "react";
import { Barlow_Condensed, Instrument_Sans } from "next/font/google";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import { ConsentProvider } from "@/components/consent/consent-provider";
import { CookieBanner } from "@/components/consent/cookie-banner";
import { GtmLoader } from "@/components/consent/gtm-loader";
import { MetaPixel } from "@/components/consent/meta-pixel";
import { RouteChangeTracker } from "@/components/consent/route-change-tracker";
import { routing } from "@/i18n/routing";
import "../globals.css";

const barlowCondensed = Barlow_Condensed({
  variable: "--font-barlow-condensed",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const instrumentSans = Instrument_Sans({
  variable: "--font-instrument-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "hero" });

  return {
    title: `Pádel & Pickleball Albufera | ${t("h1")}`,
    description: t("sub"),
  };
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);

  return (
    <html
      lang={locale}
      className={`${barlowCondensed.variable} ${instrumentSans.variable}`}
    >
      {/* Consent Mode BÁSICO: ni GTM ni el píxel se inyectan aquí. Cada loader
          decide si cargar según el consentimiento, ya dentro del provider. */}
      <body>
        <NextIntlClientProvider>
          <ConsentProvider>
            {children}
            {/* useSearchParams exige Suspense o rompe el prerender estático. */}
            <Suspense fallback={null}>
              <RouteChangeTracker />
            </Suspense>
            <GtmLoader />
            <MetaPixel />
            <CookieBanner />
          </ConsentProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
