"use client";

import type { ReactNode } from "react";
import { useLocale, useTranslations } from "next-intl";

import { pushEvento } from "@/lib/analytics";
import { useAttribution } from "@/lib/attribution/use-attribution";
import { waHref, type Placement } from "@/lib/contact";

// Enlace a WhatsApp. Única forma de enlazar a WhatsApp en toda la web.
//
// Construye el mensaje en el idioma activo e inyecta el código de referencia,
// que es lo que permite cruzar el lead con la keyword que lo generó.
//
// El código llega tras la hidratación (vive en cookie). El enlace funciona
// desde el primer render: si aún no hay código, se envía sin él. Un CTA nunca
// se queda esperando a la medición.

interface WhatsAppLinkProps {
  placement: Placement;
  /** Mensaje propio. Por defecto, el genérico del idioma activo. */
  mensaje?: string;
  className?: string;
  "aria-label"?: string;
  children: ReactNode;
}

export function WhatsAppLink({
  placement,
  mensaje,
  className,
  "aria-label": ariaLabel,
  children,
}: WhatsAppLinkProps) {
  const locale = useLocale();
  const t = useTranslations("conversion");
  const attr = useAttribution();

  const base = mensaje ?? t("waDefault");
  const texto = attr?.ref ? `${base}\n${t("refLinea", { ref: attr.ref })}` : base;

  function medir() {
    pushEvento({
      event: "whatsapp_click",
      ref_code: attr?.ref ?? "",
      placement,
      page_path: window.location.pathname,
      locale,
    });
  }

  return (
    <a
      href={waHref(locale, texto)}
      className={className}
      aria-label={ariaLabel}
      onClick={medir}
    >
      {children}
    </a>
  );
}
