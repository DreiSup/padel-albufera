/**
 * Atribución de campaña. Esto es lo que permite saber qué keyword de Google Ads
 * generó una obra de 20.000 €, meses después del clic.
 */
export interface Attribution {
  /** Código corto que viaja en el mensaje de WhatsApp y cruza el lead. */
  ref: string;
  /** Timestamp unix (segundos) de la primera captura de ESTA campaña. */
  ts: number;
  gclid?: string;
  /** Sustituye a gclid en iOS/apps cuando no hay cookies de terceros. */
  gbraid?: string;
  wbraid?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  /** Primera página de la visita atribuida. */
  landing_path?: string;
  locale?: string;
}

/** Parámetros de la URL que capturamos, en orden de prioridad de clic. */
export const CLICK_IDS = ["gclid", "gbraid", "wbraid"] as const;

export const UTM_PARAMS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
] as const;
