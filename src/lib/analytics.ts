// Empujar eventos al dataLayer.
//
// Con un ticket de 20.000 € el volumen de cierres es bajo y los algoritmos de
// Meta y Google necesitan señal. Estos eventos son lo que permite cerrar el
// bucle offline (ctwa_clid / GCLID) y saber qué configuró quien acabó comprando.
//
// En Consent Mode básico, GTM solo existe si el usuario consintió. Empujar sin
// consentimiento es inofensivo (la cola queda en memoria y nadie la consume),
// pero se comprueba igualmente para no acumular basura ni dar la falsa
// impresión de que se está midiendo.
//
// El tipo de window.dataLayer se declara una sola vez en src/types/global.d.ts.

import { readConsent } from "@/lib/consent/storage";

export function pushEvento(evento: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  const consent = readConsent();
  if (!consent || (!consent.analitica && !consent.marketing)) return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(evento);
}
