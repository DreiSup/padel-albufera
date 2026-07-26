// Consent Mode v2: estado por defecto, INLINE en el <head>.
//
// Solo se emite cuando hay CMP externa configurada (NEXT_PUBLIC_CMP_ID). Es el
// patrón que una CMP certificada (Axeptio, Didomi) espera encontrar: el default
// restrictivo ya fijado antes de que la CMP y GTM arranquen, para que ninguna
// etiqueta llegue a ejecutarse sin conocer el estado.
//
// Va como <script dangerouslySetInnerHTML> y NO con next/script, a propósito:
// `beforeInteractive` no garantiza precedencia sobre un script de terceros
// inyectado por la propia CMP, y aquí el orden es el requisito. Un <script>
// inline en el head se ejecuta antes que todo lo demás, sin discusión.
//
// Sin CMP configurada, este componente no renderiza nada y manda el modo
// básico: GtmLoader no descarga nada hasta que el banner propio recibe un sí.

const REGIONES_RESTRICTIVAS = [
  // EEE
  "AT", "BE", "BG", "HR", "CY", "CZ", "DK", "EE", "FI", "FR", "DE", "GR",
  "HU", "IS", "IE", "IT", "LV", "LI", "LT", "LU", "MT", "NL", "NO", "PL",
  "PT", "RO", "SK", "SI", "ES", "SE",
  // Reino Unido y Suiza
  "GB", "CH",
];

export function ConsentDefaultScript() {
  if (!process.env.NEXT_PUBLIC_CMP_ID) return null;

  const regiones = JSON.stringify(REGIONES_RESTRICTIVAS);

  return (
    <script
      id="consent-mode-default"
      dangerouslySetInnerHTML={{
        __html: `
window.dataLayer=window.dataLayer||[];
function gtag(){dataLayer.push(arguments);}
window.gtag=gtag;
gtag('consent','default',{
  ad_storage:'denied',
  ad_user_data:'denied',
  ad_personalization:'denied',
  analytics_storage:'denied',
  functionality_storage:'denied',
  personalization_storage:'denied',
  security_storage:'granted',
  wait_for_update:500,
  region:${regiones}
});
gtag('set','ads_data_redaction',true);
gtag('set','url_passthrough',true);
`.trim(),
      }}
    />
  );
}
