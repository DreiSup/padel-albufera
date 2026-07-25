import type { CONSENT_CATEGORIES } from "@/consent.config";

export type ConsentCategory = (typeof CONSENT_CATEGORIES)[number];

/** Categorías que el usuario puede elegir ("necesarias" siempre va activa). */
export type OptionalCategory = Exclude<ConsentCategory, "necesarias">;

export interface ConsentState {
  /** policyVersion con la que se dio el consentimiento. */
  v: number;
  /** Timestamp unix en segundos. */
  ts: number;
  /** uuid, para enlazar con el registro de prueba de consentimiento. */
  id: string;
  analitica: boolean;
  marketing: boolean;
}

/** Lo que el usuario puede modificar desde el panel de preferencias. */
export type ConsentPreferences = Record<OptionalCategory, boolean>;
