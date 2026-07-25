"use client";

import Script from "next/script";

import { consentConfig } from "@/consent.config";
import { useConsent } from "./consent-provider";

// El píxel va en código React y NO dentro de GTM: metiéndolo en GTM se pierde
// el control del `eventID`, y sin ese identificador compartido entre píxel y
// CAPI, Meta cuenta cada conversión dos veces.
//
// Se inyecta solo con consent.marketing === true. El código base ya dispara un
// PageView en la carga inicial: el RouteChangeTracker debe cubrir únicamente
// las navegaciones posteriores, o saldrían dos.

export function MetaPixel() {
  const { consent } = useConsent();
  const pixelId = consentConfig.metaPixelId;

  if (!pixelId || !consent?.marketing) return null;

  return (
    <>
      <Script id="meta-pixel" strategy="afterInteractive">
        {`
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window,document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init','${pixelId}');
fbq('track','PageView');
`}
      </Script>
      <noscript>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          alt=""
          src={`https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1`}
        />
      </noscript>
    </>
  );
}
