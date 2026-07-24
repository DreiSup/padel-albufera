import Script from "next/script";

// Consent Mode v2 — GDPR en España, no negociable.
//
// Va INLINE y ANTES de GTM, en estado denegado por defecto. `beforeInteractive`
// garantiza que este script se inyecta en el <head> y se ejecuta antes que
// cualquier código de Next y antes de que GTM cargue: cuando GTM arranca, el
// consentimiento por defecto ya está fijado.
//
// Conceder consentimiento (pasar a 'granted') es trabajo del banner/CMP, que
// NO se incluye aquí (es un tercero y requiere tu visto bueno). Mientras no
// exista, el estado se queda en denegado: Consent Mode envía pings sin cookies
// y no se recoge dato personal. Ese es el baseline conforme.

export function ConsentInit() {
  return (
    // En App Router, beforeInteractive va precisamente en el layout raíz (docs
    // de Next). La regla de lint está pensada para el Pages Router.
    // eslint-disable-next-line @next/next/no-before-interactive-script-outside-document
    <Script id="consent-mode-default" strategy="beforeInteractive">
      {`
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('consent','default',{
  ad_storage:'denied',
  ad_user_data:'denied',
  ad_personalization:'denied',
  analytics_storage:'denied',
  functionality_storage:'denied',
  personalization_storage:'denied',
  security_storage:'granted',
  wait_for_update:500
});
gtag('set','ads_data_redaction',true);
gtag('set','url_passthrough',true);
`}
    </Script>
  );
}
