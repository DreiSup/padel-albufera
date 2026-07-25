import type { Metadata } from "next";

import { routing } from "@/i18n/routing";

// Alternantes de idioma (hreflang) y canonical, en un solo sitio.
//
// Sin esto, Google puede tratar /fr/padel y /padel como páginas duplicadas y
// elegir por su cuenta cuál indexar. Con Francia como mercado prioritario, eso
// es exactamente lo que no queremos.
//
// `localePrefix: "as-needed"` implica que el idioma por defecto NO lleva
// prefijo: /padel en español, /fr/padel en francés.

export function rutaLocalizada(locale: string, ruta: string): string {
  const prefijo = locale === routing.defaultLocale ? "" : `/${locale}`;
  const limpia = ruta === "/" ? "" : ruta;
  return `${prefijo}${limpia}` || "/";
}

/** Bloque `alternates` con canonical y todos los hreflang de una ruta. */
export function alternatesDe(locale: string, ruta: string): Metadata["alternates"] {
  return {
    canonical: rutaLocalizada(locale, ruta),
    languages: {
      ...Object.fromEntries(
        routing.locales.map((l) => [l, rutaLocalizada(l, ruta)]),
      ),
      "x-default": rutaLocalizada(routing.defaultLocale, ruta),
    },
  };
}

interface MetadataPaginaOpts {
  locale: string;
  ruta: string;
  title: string;
  description: string;
}

/** Metadatos completos de una página: título, descripción, canonical y OG. */
export function metadataPagina({
  locale,
  ruta,
  title,
  description,
}: MetadataPaginaOpts): Metadata {
  return {
    title,
    description,
    alternates: alternatesDe(locale, ruta),
    openGraph: { title, description, url: rutaLocalizada(locale, ruta) },
  };
}
