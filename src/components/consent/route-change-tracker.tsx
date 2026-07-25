"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";

import { useConsent } from "./consent-provider";

// En App Router no hay recarga entre rutas, así que ni GTM ni el píxel detectan
// solos los cambios de página. Este componente los avisa.
//
// Se salta el primer render: esa vista ya la cubren la carga inicial de GTM y
// el PageView del código base del píxel. Sin ese salto, cada entrada contaría dos veces.
//
// Debe ir envuelto en <Suspense> en el layout: useSearchParams sin Suspense
// rompe el prerenderizado estático en build.

export function RouteChangeTracker() {
  const { consent } = useConsent();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const primeraVez = useRef(true);

  const analitica = consent?.analitica ?? false;
  const marketing = consent?.marketing ?? false;
  const qs = searchParams.toString();

  useEffect(() => {
    if (primeraVez.current) {
      primeraVez.current = false;
      return;
    }

    const pagePath = qs ? `${pathname}?${qs}` : pathname;

    if (analitica || marketing) {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: "spa_page_view",
        page_path: pagePath,
        page_title: document.title,
      });
    }

    if (marketing) {
      window.fbq?.("track", "PageView");
    }
  }, [pathname, qs, analitica, marketing]);

  return null;
}
