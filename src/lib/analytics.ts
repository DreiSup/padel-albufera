// Empujar eventos al dataLayer.
//
// Con un ticket de 20.000 € el volumen de cierres es bajo y los algoritmos de
// Meta y Google necesitan señal. Estos eventos son lo que permite cerrar el
// bucle offline (ctwa_clid / GCLID) y saber qué configuró quien acabó comprando.
//
// El estado de consentimiento lo gobierna Consent Mode v2 (denegado por
// defecto, ver ConsentInit): los tags de GTM solo disparan tras el
// consentimiento. Empujar al dataLayer es seguro en cualquier caso.

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

export function pushEvento(evento: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(evento);
}
