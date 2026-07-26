// Lectura y escritura de la atribución en cookie de primera parte.
//
// Cookie y no localStorage a propósito: tiene que sobrevivir a la navegación y
// el servidor tiene que poder leerla (hoy no hace falta, pero el día que haya
// CRM o conversiones mejoradas, sí).

import { CLICK_IDS, UTM_PARAMS, type Attribution } from "./types";

export const ATTRIBUTION_COOKIE = "pa_attr";
const VIGENCIA_DIAS = 90;

/**
 * Alfabeto sin caracteres ambiguos: fuera 0/O, 1/I/l. El código se dicta por
 * teléfono y se teclea a mano en una hoja de cálculo, así que confundir un cero
 * con una O cuesta un lead mal cruzado.
 */
const ALFABETO = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";

export function generarRef(longitud = 6): string {
  let salida = "";
  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    const bytes = new Uint8Array(longitud);
    crypto.getRandomValues(bytes);
    for (let i = 0; i < longitud; i++) salida += ALFABETO[bytes[i] % ALFABETO.length];
    return salida;
  }
  for (let i = 0; i < longitud; i++) {
    salida += ALFABETO[Math.floor(Math.random() * ALFABETO.length)];
  }
  return salida;
}

/** Parseo defensivo. Puro: sin acceso a `document`, para reutilizar en servidor. */
export function parseAttribution(raw: string | undefined | null): Attribution | null {
  if (!raw) return null;
  try {
    const p: unknown = JSON.parse(decodeURIComponent(raw));
    if (typeof p !== "object" || p === null) return null;
    const a = p as Partial<Attribution>;
    if (typeof a.ref !== "string" || typeof a.ts !== "number") return null;
    return a as Attribution;
  } catch {
    return null;
  }
}

export function leerAttribution(): Attribution | null {
  if (typeof document === "undefined") return null;
  const prefijo = `${ATTRIBUTION_COOKIE}=`;
  for (const trozo of document.cookie.split("; ")) {
    if (trozo.startsWith(prefijo)) return parseAttribution(trozo.slice(prefijo.length));
  }
  return null;
}

export function escribirAttribution(a: Attribution): void {
  if (typeof document === "undefined") return;
  const maxAge = VIGENCIA_DIAS * 24 * 60 * 60;
  // Secure rompería la cookie en http://localhost durante el desarrollo.
  const secure = location.protocol === "https:" ? "; Secure" : "";
  const valor = encodeURIComponent(JSON.stringify(a));
  document.cookie = `${ATTRIBUTION_COOKIE}=${valor}; Max-Age=${maxAge}; Path=/; SameSite=Lax${secure}`;
}

/** ¿Trae la URL algún identificador de clic o campaña? */
export function extraerDeUrl(search: string): Partial<Attribution> {
  const p = new URLSearchParams(search);
  const out: Partial<Attribution> = {};
  for (const k of CLICK_IDS) {
    const v = p.get(k);
    if (v) out[k] = v;
  }
  for (const k of UTM_PARAMS) {
    const v = p.get(k);
    if (v) out[k] = v;
  }
  return out;
}

export function tieneClickId(a: Partial<Attribution>): boolean {
  return CLICK_IDS.some((k) => Boolean(a[k]));
}

export function tieneCampana(a: Partial<Attribution>): boolean {
  return tieneClickId(a) || Boolean(a.utm_source) || Boolean(a.utm_campaign);
}

/**
 * Decide la atribución final. Criterio: **último clic no directo gana**.
 *
 * Es el mismo modelo que usa GA4, y es el correcto aquí: si alguien llegó hace
 * dos meses por una campaña de hormigón y hoy vuelve por un anuncio de pádel y
 * pide presupuesto, la venta es de la campaña de pádel. Con "primera captura
 * gana" atribuirías años de leads a la primera campaña que se lanzó.
 *
 * Navegar dentro del sitio NO sobrescribe: solo lo hace una llegada nueva con
 * parámetros de campaña.
 *
 * El `ref` NO se regenera al reatribuir: si el visitante ya mandó un WhatsApp
 * con ese código, cambiarlo rompería el cruce en la hoja de cálculo.
 */
export function decidirAttribution(
  previa: Attribution | null,
  entrante: Partial<Attribution>,
  contexto: { landing_path: string; locale: string },
): { attribution: Attribution; esNueva: boolean } {
  const hayCampanaNueva = tieneCampana(entrante);

  if (previa && !hayCampanaNueva) {
    return { attribution: previa, esNueva: false };
  }

  const attribution: Attribution = {
    ref: previa?.ref ?? generarRef(),
    ts: Math.floor(Date.now() / 1000),
    ...entrante,
    landing_path: contexto.landing_path,
    locale: contexto.locale,
  };

  // Primera visita sin campaña: se guarda igual para tener un ref estable.
  return { attribution, esNueva: hayCampanaNueva || !previa };
}
