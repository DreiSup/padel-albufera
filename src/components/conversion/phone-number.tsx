"use client";

import { useLocale } from "next-intl";

import { phoneLabel, PHONE_DNI_CLASS } from "@/lib/contact";

// Número de teléfono visible, como texto. Punto único de renderizado: el
// script de sustitución dinámica de Google Ads sustituye el contenido de los
// nodos con PHONE_DNI_CLASS, así que ningún número puede quedar hardcodeado
// suelto en el HTML o se escapará del informe de llamadas.
export function PhoneNumber({ className }: { className?: string }) {
  const locale = useLocale();
  return (
    <span className={`${PHONE_DNI_CLASS}${className ? ` ${className}` : ""}`}>
      {phoneLabel(locale)}
    </span>
  );
}
