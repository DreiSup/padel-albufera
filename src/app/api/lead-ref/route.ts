import { headers } from "next/headers";
import { NextResponse } from "next/server";

// Registro de atribución. Reenvía a un webhook configurable
// (`LEAD_WEBHOOK_URL`): hoy un Google Apps Script que escribe en una hoja,
// mañana un CRM. Este handler NO conoce el formato del destino: reenvía el
// objeto tal cual, así que cambiar de destino es cambiar la variable.
//
// Endpoint público, así que se valida origen y se limita por IP.

const golpes = new Map<string, { n: number; ventana: number }>();
const VENTANA_MS = 60_000;
const MAX_POR_VENTANA = 30;

function throttled(ip: string): boolean {
  const ahora = Date.now();
  const previo = golpes.get(ip);
  if (!previo || ahora - previo.ventana > VENTANA_MS) {
    golpes.set(ip, { n: 1, ventana: ahora });
    return false;
  }
  previo.n += 1;
  if (golpes.size > 5000) {
    for (const [k, v] of golpes) {
      if (ahora - v.ventana > VENTANA_MS) golpes.delete(k);
    }
  }
  return previo.n > MAX_POR_VENTANA;
}

/** Solo se reenvían campos conocidos: nada de proxy abierto hacia el webhook. */
const CAMPOS = [
  "ref_code",
  "ref",
  "gclid",
  "gbraid",
  "wbraid",
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  "landing_path",
  "locale",
  "user_agent",
  "timestamp",
] as const;

const LIMITE_LONGITUD = 512;

export async function POST(request: Request) {
  const cabeceras = await headers();

  const origin = cabeceras.get("origin");
  const host = cabeceras.get("host");
  if (origin && host) {
    try {
      if (new URL(origin).host !== host) {
        return new NextResponse(null, { status: 403 });
      }
    } catch {
      return new NextResponse(null, { status: 403 });
    }
  }

  const ip = (cabeceras.get("x-forwarded-for") || "").split(",")[0].trim() || "desconocida";
  if (throttled(ip)) return new NextResponse(null, { status: 429 });

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return new NextResponse(null, { status: 400 });
  }

  if (typeof body.ref_code !== "string" || !/^[A-Z0-9]{4,12}$/.test(body.ref_code)) {
    return new NextResponse(null, { status: 400 });
  }

  const payload: Record<string, string> = {};
  for (const campo of CAMPOS) {
    const v = body[campo];
    if (typeof v === "string" && v) payload[campo] = v.slice(0, LIMITE_LONGITUD);
  }
  payload.ip_pais = cabeceras.get("x-vercel-ip-country") ?? "";

  const webhook = process.env.LEAD_WEBHOOK_URL;
  if (!webhook) {
    // Sin webhook configurado no es un error: la cookie ya está escrita en el
    // navegador y el código de referencia funciona igual.
    return new NextResponse(null, { status: 204 });
  }

  try {
    const res = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      // Apps Script tarda; sin tope, la función se quedaría colgada.
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) {
      console.error("[lead-ref] webhook respondió", res.status);
    }
  } catch (error) {
    console.error("[lead-ref] fallo al reenviar:", error);
  }

  // Siempre 204: al cliente le da igual y no debe reintentar.
  return new NextResponse(null, { status: 204 });
}
