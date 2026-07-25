import { createHash } from "node:crypto";

// Normalización ANTES de hashear. Sin esto el "match quality" de Meta se hunde:
// el hash de "  Juan@Gmail.com " y el de "juan@gmail.com" no se parecen en nada,
// así que un dato mal normalizado equivale a no enviarlo.

export function sha256(valor: string): string {
  return createHash("sha256").update(valor).digest("hex");
}

/** Minúsculas y sin espacios alrededor. */
export function normalizarEmail(email: string): string | null {
  const limpio = email.trim().toLowerCase();
  return limpio.includes("@") ? limpio : null;
}

/**
 * E.164 sin "+" ni separadores. Se asume España (34) si el número llega con
 * 9 dígitos y sin prefijo internacional, que es como lo teclea la gente aquí.
 */
export function normalizarTelefono(telefono: string): string | null {
  let digitos = telefono.replace(/\D/g, "");
  if (!digitos) return null;
  if (digitos.startsWith("00")) digitos = digitos.slice(2);
  if (digitos.length === 9) digitos = `34${digitos}`;
  return digitos.length >= 10 ? digitos : null;
}

export function hashEmail(email?: string): string | undefined {
  if (!email) return undefined;
  const n = normalizarEmail(email);
  return n ? sha256(n) : undefined;
}

export function hashTelefono(telefono?: string): string | undefined {
  if (!telefono) return undefined;
  const n = normalizarTelefono(telefono);
  return n ? sha256(n) : undefined;
}
