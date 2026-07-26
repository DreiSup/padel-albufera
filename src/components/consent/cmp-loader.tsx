import Script from "next/script";

// Punto de integración de la CMP externa. NO instala ninguna CMP: solo deja el
// hueco listo. Se activa rellenando NEXT_PUBLIC_CMP_ID y, si hace falta, la
// URL del script.
//
// Cómo enchufar cada una:
//
//   Axeptio → NEXT_PUBLIC_CMP_ID = tu clientId
//             NEXT_PUBLIC_CMP_SRC = https://static.axept.io/sdk-slim.js
//             (Axeptio además necesita window.axeptioSettings; ver abajo)
//
//   Didomi  → NEXT_PUBLIC_CMP_ID = tu apiKey
//             NEXT_PUBLIC_CMP_SRC = https://sdk.privacy-center.org/<apiKey>/loader.js
//
// Ambas están certificadas por Google y emiten el `consent update` por su
// cuenta, así que no hay que escribirlo aquí. El `consent default` ya se ha
// fijado inline en el <head> (ConsentDefaultScript), que es lo que exigen.
//
// Estrategia afterInteractive: la CMP no debe bloquear el render. El default
// restrictivo ya está puesto, así que nada se dispara mientras tanto.

const CMP_ID = process.env.NEXT_PUBLIC_CMP_ID;
const CMP_SRC = process.env.NEXT_PUBLIC_CMP_SRC;

export function CmpLoader() {
  if (!CMP_ID || !CMP_SRC) return null;

  return (
    <>
      {/* Axeptio lee su configuración de esta variable global. Para Didomi es
          inocuo: ignora lo que no conoce. */}
      <Script id="cmp-settings" strategy="afterInteractive">
        {`window.axeptioSettings={clientId:${JSON.stringify(CMP_ID)},cookiesVersion:"base"};`}
      </Script>
      <Script
        id="cmp-loader"
        src={CMP_SRC}
        strategy="afterInteractive"
        data-id={CMP_ID}
      />
    </>
  );
}
