import { createHash } from "node:crypto";

// Prueba de consentimiento (RGPD art. 7.1: hay que poder DEMOSTRAR que el
// usuario consintió). La cookie no sirve de prueba: vive en el navegador del
// usuario y él puede borrarla.
//
// La persistencia queda detrás de esta interfaz para poder enchufar después
// Postgres/Supabase sin tocar el Route Handler. Hoy es un no-op deliberado:
// no hay base de datos en el proyecto y montar una escritura sin revisarlo
// añadiría dependencia y superficie de ataque a un endpoint público.

export interface ConsentRecord {
  /** uuid que viaja en la cookie: enlaza al usuario con su registro. */
  id: string;
  ts: number;
  policyVersion: number;
  analitica: boolean;
  marketing: boolean;
  userAgent: string;
  /** IP HASHEADA. Nunca en claro: sería un dato personal más que custodiar. */
  ipHash: string;
}

export function hashIp(ip: string): string {
  // Sal por entorno para que el hash no sea reversible por fuerza bruta:
  // el espacio de IPv4 es pequeño y un SHA-256 pelado se rompe en minutos.
  const sal = process.env.CONSENT_IP_SALT || "";
  return createHash("sha256").update(`${sal}${ip}`).digest("hex");
}

export async function saveConsentRecord(record: ConsentRecord): Promise<void> {
  // TODO(persistencia): sustituir por un INSERT cuando exista base de datos.
  // Recomendado: Vercel Postgres (Neon), que ya está en el mismo panel del
  // despliegue y no añade proveedor nuevo.
  if (process.env.NODE_ENV !== "production") {
    console.info("[consent-log] registro (no persistido):", record.id);
  }
}
