// Datos estructurados (JSON-LD), generados desde TypeScript tipado.
//
// Nada de strings sueltos: un JSON-LD mal formado no da error, simplemente se
// ignora en silencio y te quedas sin rich results sin enterarte.

import { SITE_URL } from "./site";
import { phoneNumber } from "./contact";

interface Thing {
  "@type": string;
  [k: string]: unknown;
}

export interface JsonLd extends Thing {
  "@context": "https://schema.org";
}

const ID_NEGOCIO = `${SITE_URL}/#negocio`;

/**
 * Zonas de servicio. España entera más las tres regiones francesas objetivo de
 * la campaña: Occitanie, PACA y Nouvelle-Aquitaine.
 */
const AREA_SERVIDA: Thing[] = [
  { "@type": "Country", name: "España" },
  { "@type": "AdministrativeArea", name: "Occitanie", containedInPlace: { "@type": "Country", name: "France" } },
  { "@type": "AdministrativeArea", name: "Provence-Alpes-Côte d'Azur", containedInPlace: { "@type": "Country", name: "France" } },
  { "@type": "AdministrativeArea", name: "Nouvelle-Aquitaine", containedInPlace: { "@type": "Country", name: "France" } },
];

/**
 * GeneralContractor es un subtipo de LocalBusiness y describe mejor a una
 * empresa que ejecuta obra que el genérico.
 *
 * TODO(cliente): `address` y `taxID` llevan datos de relleno. Hay que
 * sustituirlos por los reales antes de publicar; un NAP incorrecto en los datos
 * estructurados perjudica el SEO local más que no ponerlos.
 */
export function negocioJsonLd(locale: string): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "GeneralContractor",
    "@id": ID_NEGOCIO,
    name: "Pavimentos Albufera",
    alternateName: "Pádel & Pickleball Albufera",
    url: `${SITE_URL}${locale === "es" ? "" : `/${locale}`}`,
    telephone: phoneNumber(locale),
    email: "info@padelalbufera.com",
    image: `${SITE_URL}/pista-padel-azul-cristal-jardin.jpg`,
    logo: `${SITE_URL}/logo.webp`,
    address: {
      "@type": "PostalAddress",
      streetAddress: "C/ Dirección física, 00",
      addressLocality: "Valencia",
      postalCode: "46000",
      addressRegion: "Comunidad Valenciana",
      addressCountry: "ES",
    },
    areaServed: AREA_SERVIDA,
    knowsLanguage: ["es", "fr", "en"],
    priceRange: "€€€",
  };
}

export function servicioJsonLd(opts: {
  nombre: string;
  descripcion: string;
  url: string;
  imagen?: string;
}): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: opts.nombre,
    description: opts.descripcion,
    url: `${SITE_URL}${opts.url}`,
    serviceType: opts.nombre,
    provider: { "@id": ID_NEGOCIO },
    areaServed: AREA_SERVIDA,
    ...(opts.imagen ? { image: `${SITE_URL}${opts.imagen}` } : {}),
  };
}

export function migasJsonLd(items: { nombre: string; url: string }[]): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.nombre,
      item: `${SITE_URL}${item.url}`,
    })),
  };
}
