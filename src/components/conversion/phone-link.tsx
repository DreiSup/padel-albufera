"use client";

import type { ReactNode } from "react";
import { useLocale } from "next-intl";

import { pushEvento } from "@/lib/analytics";
import { useAttribution } from "@/lib/attribution/use-attribution";
import { phoneNumber, PHONE_DNI_CLASS, type Placement } from "@/lib/contact";

// Enlace de teléfono. Única forma de enlazar al teléfono en toda la web.
//
// El número se renderiza SIEMPRE desde aquí y el nodo lleva PHONE_DNI_CLASS,
// para que el script de sustitución dinámica de número de Google Ads pueda
// reemplazarlo por el número de desvío. Si alguien escribe un tel: a mano en
// otro sitio, ese número quedará fuera del informe de llamadas.

interface PhoneLinkProps {
  placement: Placement;
  className?: string;
  "aria-label"?: string;
  children: ReactNode;
}

export function PhoneLink({
  placement,
  className,
  "aria-label": ariaLabel,
  children,
}: PhoneLinkProps) {
  const locale = useLocale();
  const attr = useAttribution();

  function medir() {
    pushEvento({
      event: "phone_click",
      ref_code: attr?.ref ?? "",
      placement,
      page_path: window.location.pathname,
      locale,
    });
  }

  return (
    <a
      href={`tel:${phoneNumber(locale)}`}
      className={`${PHONE_DNI_CLASS}${className ? ` ${className}` : ""}`}
      aria-label={ariaLabel}
      onClick={medir}
    >
      {children}
    </a>
  );
}
