// Envío de eventos de conversión a Meta por partida doble: píxel (navegador) y
// CAPI (servidor), con el MISMO event_id y el MISMO event_name.
//
// Si esos dos campos no coinciden, Meta no deduplica y cuenta la conversión dos
// veces: el coste por resultado se falsea y la optimización de campañas se
// corrompe. Es el fallo más caro de esta integración.

import { readConsent } from "@/lib/consent/storage";

export type MetaEventName = "Lead" | "Contact" | "Purchase" | "CompleteRegistration";

interface UserData {
  email?: string;
  phone?: string;
}

function nuevoEventId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;
}

export async function trackMetaEvent(
  eventName: MetaEventName,
  customData?: Record<string, unknown>,
  userData?: UserData,
): Promise<void> {
  if (typeof window === "undefined") return;

  // Sin consentimiento de marketing no se hace nada: ni píxel ni fetch.
  const consent = readConsent();
  if (!consent?.marketing) return;

  const eventId = nuevoEventId();

  window.fbq?.("track", eventName, customData ?? {}, { eventID: eventId });

  try {
    await fetch("/api/meta-capi", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        eventName,
        eventId,
        customData,
        userData,
        eventSourceUrl: window.location.href,
      }),
      keepalive: true,
    });
  } catch {
    // Un fallo de medición nunca puede romper el flujo del usuario.
  }
}
