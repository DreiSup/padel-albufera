"use client";

import { useEffect, useState } from "react";

import { leerAttribution } from "./storage";
import type { Attribution } from "./types";

/**
 * Atribución vigente, para inyectar el código de referencia en el mensaje de
 * WhatsApp y en los eventos.
 *
 * Devuelve null en el primer render (la cookie solo existe en cliente). Los
 * componentes que lo usan deben tolerarlo: el enlace se construye igual, solo
 * que sin código, y se completa en cuanto hidrata. Nunca bloquea un CTA.
 */
export function useAttribution(): Attribution | null {
  const [attr, setAttr] = useState<Attribution | null>(null);

  useEffect(() => {
    // document.cookie es un sistema externo que no existe en SSR.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setAttr(leerAttribution());
  }, []);

  return attr;
}
