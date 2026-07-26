import type { Metadata } from "next";

import { getPathname } from "@/i18n/navigation";
import { routing, type AppPathname } from "@/i18n/routing";

// Alternantes de idioma (hreflang) y canonical, en un solo sitio.
//
// Las URLs se piden a `getPathname` de next-intl, NUNCA se construyen a mano:
// con slugs traducidos, concatenar `/${locale}${ruta}` daría `/fr/padel` en vez
// de `/fr/terrain-de-padel` y el clúster hreflang quedaría roto. Y un solo
// error en un clúster hace que Google ignore el clúster entero.

export function rutaLocalizada(locale: string, ruta: AppPathname): string {
  return getPathname({ locale: locale as (typeof routing.locales)[number], href: ruta });
}

/** Bloque `alternates` con canonical y todos los hreflang de una ruta. */
export function alternatesDe(locale: string, ruta: AppPathname): Metadata["alternates"] {
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
  ruta: AppPathname;
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
