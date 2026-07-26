import type { MetadataRoute } from "next";

import { getPathname } from "@/i18n/navigation";
import { pathnames, routing, type AppPathname } from "@/i18n/routing";
import { SITE_URL } from "@/lib/site";

// Sitemap con alternantes por idioma. Cada URL declara sus equivalentes en los
// demás locales (`languages`), que es lo que Google usa como hreflang.
//
// Las rutas salen del mismo mapa `pathnames` que gobierna la navegación: añadir
// una página la mete en el sitemap sola, y no hay forma de que el sitemap y los
// enlaces reales discrepen.

const LEGALES: AppPathname[] = ["/politica-cookies", "/politica-privacidad"];

function url(locale: string, ruta: AppPathname): string {
  const p = getPathname({
    locale: locale as (typeof routing.locales)[number],
    href: ruta,
  });
  return `${SITE_URL}${p === "/" ? "" : p}` || SITE_URL;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const rutas = Object.keys(pathnames) as AppPathname[];

  return rutas.map((ruta) => ({
    url: url(routing.defaultLocale, ruta),
    lastModified: new Date(),
    changeFrequency: ruta === "/" ? "weekly" : "monthly",
    // La home y las páginas de servicio son las que captan; las legales, no.
    priority: ruta === "/" ? 1 : LEGALES.includes(ruta) ? 0.3 : 0.8,
    alternates: {
      languages: Object.fromEntries(
        routing.locales.map((l) => [l, url(l, ruta)]),
      ),
    },
  }));
}
