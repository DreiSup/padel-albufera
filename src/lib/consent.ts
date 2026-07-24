// Lectura/escritura de la decisión de consentimiento (Consent Mode v2).
//
// Se guarda en localStorage, no en el estado de React: tiene que sobrevivir a
// recargas y estar disponible antes de que se pinte nada. La clave y el
// formato deben coincidir con el script inline de ConsentInit, que lee lo
// mismo de forma síncrona antes de fijar el consentimiento por defecto.
//
// Caduca a los ~6 meses (más conservador que el máximo de 13 meses de la
// CNIL francesa): pasado ese plazo se vuelve a preguntar, como recomiendan
// las autoridades de protección de datos.

export type ConsentState = "granted" | "denied";

export const CONSENT_KEY = "consentimiento-cookies";
const VIGENCIA_MS = 1000 * 60 * 60 * 24 * 180;

interface Registro {
  v: ConsentState;
  t: number;
}

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

/** Decisión guardada y vigente, o null si no hay ninguna (o ha caducado). */
export function leerConsentimiento(): ConsentState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(CONSENT_KEY);
    if (!raw) return null;
    const r = JSON.parse(raw) as Registro;
    if (Date.now() - r.t > VIGENCIA_MS) return null;
    return r.v === "granted" || r.v === "denied" ? r.v : null;
  } catch {
    return null;
  }
}

/** Guarda la decisión y actualiza Consent Mode en el acto. */
export function guardarConsentimiento(estado: ConsentState) {
  if (typeof window === "undefined") return;
  try {
    const registro: Registro = { v: estado, t: Date.now() };
    window.localStorage.setItem(CONSENT_KEY, JSON.stringify(registro));
  } catch {
    // Storage bloqueado (modo privado, cuota llena): la sesión sigue
    // funcionando, solo se volverá a preguntar en la próxima carga.
  }
  window.gtag?.("consent", "update", {
    ad_storage: estado,
    ad_user_data: estado,
    ad_personalization: estado,
    analytics_storage: estado,
    functionality_storage: estado,
    personalization_storage: estado,
  });
}

/** Borra la decisión (para el botón "cambiar mi decisión" de la política). */
export function olvidarConsentimiento() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(CONSENT_KEY);
  } catch {
    // Nada que limpiar si el storage no está disponible.
  }
}
