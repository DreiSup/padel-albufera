"use client";

import { useEffect } from "react";
import { useLocale } from "next-intl";

import {
  decidirAttribution,
  escribirAttribution,
  extraerDeUrl,
  leerAttribution,
} from "@/lib/attribution/storage";

// Captura los identificadores de campaña al aterrizar.
//
// Lee `window.location.search` dentro de un efecto, NO `useSearchParams`: con
// useSearchParams Next exige un límite de Suspense y saca la página del
// prerenderizado estático. Aquí el componente no renderiza nada, así que el
// HTML servido es idéntico y las rutas siguen siendo SSG.
//
// El POST al webhook es "fire and forget": si el destino está caído, el usuario
// no se entera y los botones de conversión siguen funcionando igual.

export function AttributionTracker() {
  const locale = useLocale();

  useEffect(() => {
    const entrante = extraerDeUrl(window.location.search);
    const previa = leerAttribution();
    const { attribution, esNueva } = decidirAttribution(previa, entrante, {
      landing_path: window.location.pathname,
      locale,
    });

    escribirAttribution(attribution);

    // Solo se notifica cuando hay algo nuevo que registrar: ni en cada
    // navegación interna ni en cada recarga.
    if (!esNueva) return;

    const cuerpo = JSON.stringify({
      ...attribution,
      ref_code: attribution.ref,
      user_agent: navigator.userAgent,
      timestamp: new Date().toISOString(),
    });

    try {
      // sendBeacon no bloquea ni se cancela al navegar. Si no está, fetch con
      // keepalive hace lo mismo.
      if (navigator.sendBeacon) {
        navigator.sendBeacon(
          "/api/lead-ref",
          new Blob([cuerpo], { type: "application/json" }),
        );
      } else {
        void fetch("/api/lead-ref", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: cuerpo,
          keepalive: true,
        }).catch(() => {});
      }
    } catch {
      // Fallo silencioso: la medición nunca puede romper la página.
    }
  }, [locale]);

  return null;
}
