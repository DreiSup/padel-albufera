import type { MetadataRoute } from "next";

import { routing } from "@/i18n/routing";
import { NAV_ROUTES, SITE_URL } from "@/lib/site";

// Sitemap con alternantes por idioma. Cada URL declara sus equivalentes en los
// demás locales (`languages`), que es lo que Google usa como hreflang.
//
// `localePrefix: "as-needed"` implica que el español NO lleva prefijo: la ruta
// canónica de la home es "/" y la francesa "/fr". Construir las URLs a mano en
// vez de con getPathname evita que un cambio de configuración pase inadvertido.

const RUTAS_LEGALES = ["/politica-cookies", "/politica-privacidad"];

function urlDe(locale: string, ruta: string): string {
  const prefijo = locale === routing.defaultLocale ? "" : `/${locale}`;
  const limpia = ruta === "/" ? "" : ruta;
  return `${SITE_URL}${prefijo}${limpia}` || `${SITE_URL}/`;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const rutas = [...NAV_ROUTES.map((r) => r.href), ...RUTAS_LEGALES];

  return rutas.map((ruta) => ({
    url: urlDe(routing.defaultLocale, ruta),
    lastModified: new Date(),
    changeFrequency: ruta === "/" ? "weekly" : "monthly",
    // La home y las páginas de servicio son las que captan; las legales, no.
    priority: ruta === "/" ? 1 : RUTAS_LEGALES.includes(ruta) ? 0.3 : 0.8,
    alternates: {
      languages: Object.fromEntries(
        routing.locales.map((l) => [l, urlDe(l, ruta)]),
      ),
    },
  }));
}
