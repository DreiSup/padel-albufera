// Persistencia del consentimiento en cookie de primera parte.
//
// Cookie y no localStorage porque el Route Handler de la CAPI tiene que poder
// releerla desde el servidor: nunca nos fiamos del flag que manda el cliente.
// La cookie que guarda la propia preferencia es "estrictamente necesaria" y
// está exenta de consentimiento.

import {
  consentConfig,
  THIRD_PARTY_COOKIES,
  THIRD_PARTY_COOKIE_PREFIXES,
} from "@/consent.config";
import type { ConsentPreferences, ConsentState } from "./types";

/**
 * Parseo defensivo del valor crudo de la cookie. Función PURA: no toca
 * `document`, para que el servidor (Route Handler de la CAPI) use exactamente
 * esta misma lógica. Cualquier valor corrupto o de otra versión de política se
 * trata como "sin consentimiento".
 */
export function parseConsent(raw: string | undefined | null): ConsentState | null {
  if (!raw) return null;
  try {
    const parsed: unknown = JSON.parse(decodeURIComponent(raw));
    if (typeof parsed !== "object" || parsed === null) return null;
    const c = parsed as Partial<ConsentState>;
    if (
      typeof c.v !== "number" ||
      typeof c.ts !== "number" ||
      typeof c.id !== "string" ||
      typeof c.analitica !== "boolean" ||
      typeof c.marketing !== "boolean"
    ) {
      return null;
    }
    // Una versión de política distinta caduca el consentimiento.
    if (c.v !== consentConfig.policyVersion) return null;
    return { v: c.v, ts: c.ts, id: c.id, analitica: c.analitica, marketing: c.marketing };
  } catch {
    return null;
  }
}

function leerCookieCruda(nombre: string): string | undefined {
  if (typeof document === "undefined") return undefined;
  const prefijo = `${nombre}=`;
  for (const trozo of document.cookie.split("; ")) {
    if (trozo.startsWith(prefijo)) return trozo.slice(prefijo.length);
  }
  return undefined;
}

export function readConsent(): ConsentState | null {
  return parseConsent(leerCookieCruda(consentConfig.cookieName));
}

export function hasValidConsent(): boolean {
  return readConsent() !== null;
}

function nuevoId(): string {
  // randomUUID solo existe en contexto seguro; en http (no localhost) no está.
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;
}

export function writeConsent(prefs: ConsentPreferences): ConsentState {
  const state: ConsentState = {
    v: consentConfig.policyVersion,
    ts: Math.floor(Date.now() / 1000),
    id: nuevoId(),
    analitica: prefs.analitica,
    marketing: prefs.marketing,
  };
  if (typeof document !== "undefined") {
    const maxAge = consentConfig.cookieMaxAgeDays * 24 * 60 * 60;
    // Secure rompería la cookie en http://localhost durante el desarrollo.
    const secure = location.protocol === "https:" ? "; Secure" : "";
    const valor = encodeURIComponent(JSON.stringify(state));
    document.cookie = `${consentConfig.cookieName}=${valor}; Max-Age=${maxAge}; Path=/; SameSite=Lax${secure}`;
  }
  return state;
}

export function clearConsent(): void {
  if (typeof document === "undefined") return;
  document.cookie = `${consentConfig.cookieName}=; Max-Age=0; Path=/; SameSite=Lax`;
}

/**
 * Borra las cookies que Google y Meta ya hayan escrito. Hay que intentarlo en
 * el dominio actual y en `.dominio.com`, porque se escribieron en el dominio
 * padre y sin coincidencia exacta de Domain/Path el borrado no surte efecto.
 */
export function clearThirdPartyCookies(): void {
  if (typeof document === "undefined") return;

  const host = location.hostname;
  const partes = host.split(".");
  const dominios = new Set<string>([host, `.${host}`]);
  if (partes.length > 2) {
    const raiz = partes.slice(-2).join(".");
    dominios.add(raiz);
    dominios.add(`.${raiz}`);
  }

  const presentes = document.cookie.split("; ").map((c) => c.split("=")[0]);
  const objetivo = presentes.filter(
    (nombre) =>
      (THIRD_PARTY_COOKIES as readonly string[]).includes(nombre) ||
      THIRD_PARTY_COOKIE_PREFIXES.some((p) => nombre.startsWith(p)),
  );

  for (const nombre of objetivo) {
    document.cookie = `${nombre}=; Max-Age=0; Path=/`;
    for (const dominio of dominios) {
      document.cookie = `${nombre}=; Max-Age=0; Path=/; Domain=${dominio}`;
    }
  }
}
