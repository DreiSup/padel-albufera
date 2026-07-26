"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { useLocale } from "next-intl";

import { pushEvento } from "@/lib/analytics";
import { useAttribution } from "@/lib/attribution/use-attribution";

// Vistas de página, manuales.
//
// El App Router no recarga entre rutas, así que GTM no detecta las navegaciones
// por su cuenta. Aquí se emite `page_view` en TODAS las vistas, incluida la
// primera: una sola fuente de verdad en vez de repartirlas entre GA4 y esto.
//
// ⚠️ REQUIERE configuración en GTM: hay que DESACTIVAR el `page_view`
// automático de la etiqueta de configuración de GA4 ("Enviar un evento de
// vista de página cuando se cargue esta configuración"). Si se deja activo,
// cada vista inicial se cuenta dos veces.
//
// Debe ir envuelto en <Suspense> en el layout: useSearchParams sin Suspense
// rompe el prerenderizado estático en build.

export function RouteChangeTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const locale = useLocale();
  const attr = useAttribution();
  const ultimaVista = useRef<string | null>(null);

  const qs = searchParams.toString();

  useEffect(() => {
    const pagePath = qs ? `${pathname}?${qs}` : pathname;
    // Evita duplicar si el efecto se reejecuta sin cambio real de ruta (por
    // ejemplo cuando llega la cookie de atribución y cambia `attr`).
    if (ultimaVista.current === pagePath) return;
    ultimaVista.current = pagePath;

    pushEvento({
      event: "page_view",
      page_path: pagePath,
      page_title: document.title,
      locale,
      ref_code: attr?.ref ?? "",
    });
  }, [pathname, qs, locale, attr]);

  return null;
}
