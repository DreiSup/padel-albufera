import { defineRouting } from "next-intl/routing";

/**
 * Slugs traducidos por idioma.
 *
 * La clave es la ruta interna (la carpeta en `src/app/[locale]/`); el valor, la
 * URL pública de cada idioma. Para Francia esto no es cosmético: la landing de
 * Google Ads es `/fr/terrain-de-padel`, que es la keyword exacta, y un francés
 * que ve `/fr/proyectos` en las SERP hace menos clic que uno que ve
 * `/fr/realisations`.
 *
 * Al declarar `pathnames`, next-intl obliga a que todo `<Link href>` use una de
 * estas claves. Es deliberado: así una ruta nueva no se puede olvidar aquí.
 */
export const pathnames = {
  "/": "/",
  "/padel": {
    es: "/padel",
    fr: "/terrain-de-padel",
    en: "/padel-court",
  },
  "/pickleball": {
    es: "/pickleball",
    fr: "/terrain-de-pickleball",
    en: "/pickleball-court",
  },
  "/configurador": {
    es: "/configurador",
    fr: "/configurateur",
    en: "/configurator",
  },
  "/proyectos": {
    es: "/proyectos",
    fr: "/realisations",
    en: "/projects",
  },
  "/proceso": {
    es: "/proceso",
    fr: "/notre-processus",
    en: "/process",
  },
  "/como-se-construye": {
    es: "/como-se-construye",
    fr: "/comment-construire-un-terrain-de-padel",
    en: "/how-a-padel-court-is-built",
  },
  "/sobre-nosotros": {
    es: "/sobre-nosotros",
    fr: "/a-propos",
    en: "/about-us",
  },
  "/contacto": {
    es: "/contacto",
    fr: "/contact",
    en: "/contact",
  },
  "/politica-cookies": {
    es: "/politica-cookies",
    fr: "/politique-cookies",
    en: "/cookie-policy",
  },
  "/politica-privacidad": {
    es: "/politica-privacidad",
    fr: "/politique-de-confidentialite",
    en: "/privacy-policy",
  },
} as const;

export const routing = defineRouting({
  // "de" and "nl" are temporarily disabled — re-add here to bring them back.
  locales: ["es", "fr", "en"],
  defaultLocale: "es",
  localePrefix: "as-needed",
  pathnames,
});

export type Locale = (typeof routing.locales)[number];
export type AppPathname = keyof typeof pathnames;
