// Fuente única de verdad de los datos de contacto, por idioma.
//
// Todo desde variables de entorno: cambiar un número de campaña no debe
// requerir tocar código ni desplegar una rama. Si una variable falta, se cae al
// número español, que es el de la empresa.

import type { Locale } from "@/i18n/routing";

/** Solo dígitos, formato internacional, como exige wa.me. */
const WHATSAPP: Record<string, string | undefined> = {
  es: process.env.NEXT_PUBLIC_WHATSAPP_ES,
  fr: process.env.NEXT_PUBLIC_WHATSAPP_FR,
  en: process.env.NEXT_PUBLIC_WHATSAPP_ES,
};

/** Formato E.164 con "+", como exige el href tel:. */
const TELEFONO: Record<string, string | undefined> = {
  es: process.env.NEXT_PUBLIC_PHONE_ES,
  fr: process.env.NEXT_PUBLIC_PHONE_FR,
  en: process.env.NEXT_PUBLIC_PHONE_ES,
};

const WHATSAPP_FALLBACK = "34614207633";
const TELEFONO_FALLBACK = "+34614207633";

export function whatsappNumber(locale: string): string {
  return WHATSAPP[locale] || WHATSAPP.es || WHATSAPP_FALLBACK;
}

export function phoneNumber(locale: string): string {
  return TELEFONO[locale] || TELEFONO.es || TELEFONO_FALLBACK;
}

/** Versión legible del teléfono, agrupada por bloques. */
export function phoneLabel(locale: string): string {
  const n = phoneNumber(locale);
  const m = n.match(/^\+(\d{2})(\d{3})(\d{2})(\d{2})(\d{2})$/);
  return m ? `+${m[1]} ${m[2]} ${m[3]} ${m[4]} ${m[5]}` : n;
}

/**
 * Dónde vive un CTA. Viaja en el evento para poder ver qué punto de la página
 * convierte y mover el resto en consecuencia.
 */
export type Placement =
  | "hero"
  | "sticky"
  | "cabecera"
  | "menu_movil"
  | "footer"
  | "seccion-precio"
  | "formulario"
  | "configurador"
  | "servicio"
  | "proceso"
  | "proyectos"
  | "sobre_nosotros"
  | "contacto"
  | "como_se_construye"
  | "landing_fr"
  | "menu_movil";

/**
 * Clase que marca el nodo del teléfono para la sustitución dinámica de número
 * de Google (recursos de llamada con informes de llamadas). El script de Google
 * busca un contenedor identificable; sin esto tendría que adivinar entre texto
 * suelto. NO la quites ni la renombres sin actualizar la configuración en Ads.
 */
export const PHONE_DNI_CLASS = "js-phone-number";

export function waHref(locale: Locale | string, mensaje: string): string {
  return `https://wa.me/${whatsappNumber(locale)}?text=${encodeURIComponent(mensaje)}`;
}
