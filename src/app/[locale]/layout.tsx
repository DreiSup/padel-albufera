import type { Metadata } from "next";
import { Suspense } from "react";
import { Barlow_Condensed, Instrument_Sans } from "next/font/google";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import { AttributionTracker } from "@/components/attribution/attribution-tracker";
import { CmpLoader } from "@/components/consent/cmp-loader";
import { ConsentDefaultScript } from "@/components/consent/consent-default-script";
import { ConsentProvider } from "@/components/consent/consent-provider";
import { CookieBanner } from "@/components/consent/cookie-banner";
import { GtmLoader } from "@/components/consent/gtm-loader";
import { RouteChangeTracker } from "@/components/consent/route-change-tracker";
import { routing } from "@/i18n/routing";
import { SITE_URL } from "@/lib/site";
import { negocioJsonLd } from "@/lib/structured-data";
import { JsonLdScript } from "@/components/json-ld";
import "../globals.css";

/** Imagen de previsualización al compartir. Foto real de obra, no un render. */
const OG_IMAGE = "/pista-padel-azul-cristal-jardin.jpg";

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
  const title = `Pádel & Pickleball Albufera | ${t("h1")}`;

  return {
    // Sin metadataBase, Next no puede convertir las rutas de Open Graph en URLs
    // absolutas y al compartir por WhatsApp —el canal principal del negocio— no
    // aparece ni miniatura ni descripción.
    metadataBase: new URL(SITE_URL),
    title,
    description: t("sub"),
    openGraph: {
      type: "website",
      siteName: "Pádel & Pickleball Albufera",
      locale,
      title,
      description: t("sub"),
      images: [
        {
          url: OG_IMAGE,
          width: 1600,
          height: 1200,
          alt: "Pista de pádel de cristal construida por Pavimentos Albufera",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: t("sub"),
      images: [OG_IMAGE],
    },
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
      <head>
        {/* Consent Mode v2. Inline y lo primero de todo: cuando hay CMP externa,
            el default restrictivo tiene que estar fijado antes de que la CMP y
            GTM arranquen. Sin CMP no emite nada y manda el modo básico, donde
            GtmLoader no descarga nada hasta tener un sí. */}
        <ConsentDefaultScript />
      </head>
      <body>
        <JsonLdScript data={negocioJsonLd(locale)} />
        <CmpLoader />
        <NextIntlClientProvider>
          <ConsentProvider>
            {children}
            {/* Captura gclid/utm al aterrizar. No renderiza nada y lee la URL
                con window.location, así que no saca la ruta del SSG. */}
            <AttributionTracker />
            {/* useSearchParams exige Suspense o rompe el prerender estático. */}
            <Suspense fallback={null}>
              <RouteChangeTracker />
            </Suspense>
            <GtmLoader />
            <CookieBanner />
          </ConsentProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
