import Script from "next/script";

// Consent Mode v2 — GDPR en España, no negociable.
//
// Va INLINE y ANTES de GTM, en estado denegado por defecto. `beforeInteractive`
// garantiza que este script se inyecta en el <head> y se ejecuta antes que
// cualquier código de Next y antes de que GTM cargue: cuando GTM arranca, el
// consentimiento por defecto ya está fijado.
//
// Si el visitante ya decidió en una visita anterior (localStorage, ~6 meses
// de vigencia — ver src/lib/consent.ts, misma clave y formato), arranca
// directamente en ese estado para no perder señal en cada recarga. Sin
// decisión previa, el estado es denegado: Consent Mode envía pings sin
// cookies y no se recoge dato personal. `window.gtag` queda expuesto para
// que ConsentBanner pueda enviar `consent update` cuando el usuario decide.

export function ConsentInit() {
  return (
    // En App Router, beforeInteractive va precisamente en el layout raíz (docs
    // de Next). La regla de lint está pensada para el Pages Router.
    // eslint-disable-next-line @next/next/no-before-interactive-script-outside-document
    <Script id="consent-mode-default" strategy="beforeInteractive">
      {`
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
window.gtag = gtag;
var estado = 'denied';
try {
  var g = JSON.parse(localStorage.getItem('consentimiento-cookies') || 'null');
  if (g && g.v === 'granted' && (Date.now() - g.t) < 1000*60*60*24*180) estado = 'granted';
} catch (e) {}
gtag('consent','default',{
  ad_storage:estado,
  ad_user_data:estado,
  ad_personalization:estado,
  analytics_storage:estado,
  functionality_storage:estado,
  personalization_storage:estado,
  security_storage:'granted',
  wait_for_update:500
});
gtag('set','ads_data_redaction',true);
gtag('set','url_passthrough',true);
`}
    </Script>
  );
}
