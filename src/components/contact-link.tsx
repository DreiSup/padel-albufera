"use client";

import type { ReactNode } from "react";

import { pushEvento } from "@/lib/analytics";
import { trackMetaEvent } from "@/lib/meta/track";
import { TEL, waHref } from "@/lib/site";

// Enlace de contacto que SÍ mide. Existe porque la conversión de este negocio
// es exactamente esto —un clic a WhatsApp o al teléfono— y hasta ahora solo lo
// medía el configurador: Google Ads y Meta optimizaban sobre una fracción de
// las conversiones reales.
//
// Es una hoja cliente minúscula: las páginas siguen siendo Server Components y
// solo este botón lleva JavaScript.
//
// `ubicacion` distingue desde dónde se convirtió (barra fija, cabecera, pie…),
// que es lo que permite después saber qué punto de la página funciona.

interface ContactLinkProps {
  tipo: "whatsapp" | "telefono";
  ubicacion: string;
  /** Mensaje prerredactado de WhatsApp. Ignorado si tipo === "telefono". */
  mensaje?: string;
  className?: string;
  "aria-label"?: string;
  children: ReactNode;
}

export function ContactLink({
  tipo,
  ubicacion,
  mensaje,
  className,
  "aria-label": ariaLabel,
  children,
}: ContactLinkProps) {
  const href = tipo === "whatsapp" ? waHref(mensaje) : `tel:${TEL}`;

  function medir() {
    pushEvento({
      event: tipo === "whatsapp" ? "whatsapp_click" : "telefono_click",
      origen: ubicacion,
    });
    // Con consentimiento de marketing, la misma conversión va a Meta por
    // píxel y CAPI con el mismo eventID. Sin consentimiento no hace nada.
    void trackMetaEvent("Contact", { origen: ubicacion, canal: tipo });
  }

  return (
    <a href={href} className={className} aria-label={ariaLabel} onClick={medir}>
      {children}
    </a>
  );
}
