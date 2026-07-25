"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  clearConsent,
  clearThirdPartyCookies,
  readConsent,
  writeConsent,
} from "@/lib/consent/storage";
import type { ConsentPreferences, ConsentState } from "@/lib/consent/types";

interface ConsentContextValue {
  consent: ConsentState | null;
  /** false hasta que se ha leído la cookie en cliente. */
  isLoaded: boolean;
  preferencesOpen: boolean;
  acceptAll: () => void;
  rejectAll: () => void;
  savePreferences: (prefs: ConsentPreferences) => void;
  openPreferences: () => void;
  closePreferences: () => void;
  withdraw: () => void;
}

const ConsentContext = createContext<ConsentContextValue | null>(null);

export function useConsent(): ConsentContextValue {
  const ctx = useContext(ConsentContext);
  if (!ctx) throw new Error("useConsent debe usarse dentro de <ConsentProvider>");
  return ctx;
}

export function ConsentProvider({ children }: { children: ReactNode }) {
  // Arranca en null y la cookie se lee en efecto: leerla en el render daría
  // desajuste de hidratación, y usar cookies() de next/headers en el layout
  // convertiría toda la web en dinámica y perderíamos el SSG.
  const [consent, setConsent] = useState<ConsentState | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [preferencesOpen, setPreferencesOpen] = useState(false);

  useEffect(() => {
    // document.cookie es un sistema externo que no existe en SSR.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setConsent(readConsent());
    setIsLoaded(true);
  }, []);

  const guardar = useCallback((prefs: ConsentPreferences) => {
    const nuevo = writeConsent(prefs);
    setConsent(nuevo);
    setPreferencesOpen(false);

    // Prueba de consentimiento. Es informativo: si falla, la decisión del
    // usuario ya está guardada en su cookie y la web sigue igual.
    void fetch("/api/consent-log", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: nuevo.id,
        analitica: nuevo.analitica,
        marketing: nuevo.marketing,
      }),
      keepalive: true,
    }).catch(() => {});
  }, []);

  const acceptAll = useCallback(
    () => guardar({ analitica: true, marketing: true }),
    [guardar],
  );

  const rejectAll = useCallback(
    () => guardar({ analitica: false, marketing: false }),
    [guardar],
  );

  // Revocar de verdad exige recargar: un script ya inyectado no se puede
  // descargar de memoria, así que borramos rastro y empezamos de cero.
  const withdraw = useCallback(() => {
    clearConsent();
    clearThirdPartyCookies();
    window.location.reload();
  }, []);

  const value = useMemo<ConsentContextValue>(
    () => ({
      consent,
      isLoaded,
      preferencesOpen,
      acceptAll,
      rejectAll,
      savePreferences: guardar,
      openPreferences: () => setPreferencesOpen(true),
      closePreferences: () => setPreferencesOpen(false),
      withdraw,
    }),
    [consent, isLoaded, preferencesOpen, acceptAll, rejectAll, guardar, withdraw],
  );

  return <ConsentContext.Provider value={value}>{children}</ConsentContext.Provider>;
}
