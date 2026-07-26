"use client";

import Script from "next/script";
import { useEffect, useRef, useState } from "react";

import { consentConfig } from "@/consent.config";
import { useConsent } from "./consent-provider";

// Carga de GTM. Dos modos, según haya CMP externa configurada o no.
//
// CON CMP externa (NEXT_PUBLIC_CMP_ID puesto):
//   El `consent default` ya lo fijó ConsentDefaultScript inline en el <head>, y
//   la CMP emite su propio `consent update`. Aquí solo se inyecta el contenedor
//   en cuanto arranca, porque el default restrictivo ya protege.
//
// SIN CMP (modo básico, por defecto):
//   GTM no se descarga hasta que el banner propio recibe un sí. El orden es
//   obligatorio: `consent default` (todo denied) → `consent update` (estado
//   real) → y SOLO ENTONCES inyectar. Al revés, las etiquetas se
//   inicializarían sin conocer el estado.

/**
 * gtag empuja el objeto `arguments`, no un array. No es un capricho de estilo:
 * el procesado de comandos `consent` de Google espera esa forma exacta, y con
 * un array plano los comandos se ignoran en silencio.
 */
const capturarArguments = function (): IArguments {
  // eslint-disable-next-line prefer-rest-params
  return arguments;
} as (...args: unknown[]) => IArguments;

function gtag(...args: unknown[]) {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(capturarArguments(...args));
}

/** Con CMP externa el consentimiento lo gobierna ella, no nuestro banner. */
const CMP_EXTERNA = Boolean(process.env.NEXT_PUBLIC_CMP_ID);

export function GtmLoader() {
  const { consent } = useConsent();
  const [inyectar, setInyectar] = useState(false);
  // El `default` solo puede emitirse una vez por carga de página.
  const inicializado = useRef(false);

  const permitido = CMP_EXTERNA || Boolean(consent && (consent.analitica || consent.marketing));

  useEffect(() => {
    if (!consentConfig.gtmId || !permitido) return;

    if (CMP_EXTERNA) {
      // El default ya está inline en el <head> y el update lo manda la CMP.
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ "gtm.start": Date.now(), event: "gtm.js" });
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setInyectar(true);
      return;
    }

    if (!consent) return;

    if (!inicializado.current) {
      inicializado.current = true;
      gtag("consent", "default", {
        ad_storage: "denied",
        ad_user_data: "denied",
        ad_personalization: "denied",
        analytics_storage: "denied",
        functionality_storage: "denied",
        personalization_storage: "denied",
        security_storage: "granted",
      });
    }

    gtag("consent", "update", {
      analytics_storage: consent.analitica ? "granted" : "denied",
      ad_storage: consent.marketing ? "granted" : "denied",
      ad_user_data: consent.marketing ? "granted" : "denied",
      ad_personalization: consent.marketing ? "granted" : "denied",
    });

    // Consentimiento parcial (analítica sí, marketing no): redacta los datos
    // publicitarios y mantiene el paso de identificadores por URL.
    gtag("set", "ads_data_redaction", !consent.marketing);
    gtag("set", "url_passthrough", true);

    // Evento de arranque que el contenedor espera encontrar ya en la cola.
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ "gtm.start": Date.now(), event: "gtm.js" });

    // Si el usuario cambia preferencias con GTM ya cargado, lo anterior emite
    // solo un `consent update`; esto no reinyecta nada porque el estado ya es true.
     
    setInyectar(true);
  }, [consent, permitido]);

  if (!consentConfig.gtmId || !inyectar) return null;

  return (
    <>
      <Script
        id="gtm-loader"
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtm.js?id=${consentConfig.gtmId}`}
      />
      {/* El noscript solo existe con consentimiento: en modo básico no puede
          quedar fijo en el layout, o cargaría el iframe sin permiso. */}
      <noscript>
        <iframe
          src={`https://www.googletagmanager.com/ns.html?id=${consentConfig.gtmId}`}
          height="0"
          width="0"
          style={{ display: "none", visibility: "hidden" }}
        />
      </noscript>
    </>
  );
}
