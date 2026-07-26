// Punto único de configuración de la capa de consentimiento.
//
// Para reutilizar esta capa en otro proyecto: copiar src/lib/consent,
// src/components/consent y este fichero, y tocar SOLO este fichero más las
// variables de entorno. Los literales de la interfaz no viven aquí: van por
// next-intl en messages/*.json (namespace `consent`), siguiendo el patrón del
// resto de la web y dejando la traducción a FR/EN preparada.

export const CONSENT_CATEGORIES = ["necesarias", "analitica", "marketing"] as const;

export const consentConfig = {
  cookieName: "cc_consent",
  cookieMaxAgeDays: 180,
  /** Subirlo invalida todos los consentimientos y vuelve a mostrar el banner. */
  policyVersion: 1,
  categories: CONSENT_CATEGORIES,
  gtmId: process.env.NEXT_PUBLIC_GTM_ID,
  cookiePolicyUrl: "/politica-cookies",
  privacyPolicyUrl: "/politica-privacidad",
} as const;

/** Cookies de terceros a borrar al revocar (Google Analytics, Ads y Meta). */
export const THIRD_PARTY_COOKIES = [
  "_ga",
  "_gid",
  "_gat",
  "_gcl_au",
  "_gcl_aw",
  "_gcl_dc",
] as const;

/** Prefijos de cookie con sufijo variable (p. ej. _ga_XXXXXXXX de GA4). */
export const THIRD_PARTY_COOKIE_PREFIXES = ["_ga_", "_gac_", "_gcl_"] as const;
