import { cookies, headers } from "next/headers";
import { NextResponse } from "next/server";

import { consentConfig } from "@/consent.config";
import { parseConsent } from "@/lib/consent/storage";
import { hashEmail, hashTelefono } from "@/lib/meta/hash";

// Conversions API de Meta. El evento se envía desde el servidor y se deduplica
// contra el del píxel por `event_id` + `event_name`.
//
// Regla número uno: el consentimiento se RE-VERIFICA aquí leyendo la cookie.
// Nunca se confía en un flag enviado por el cliente, porque cualquiera puede
// hacer POST a este endpoint con marketing:true.

const GRAPH_VERSION = process.env.META_GRAPH_API_VERSION || "v25.0";

/**
 * Throttling en memoria. Aviso: en serverless cada instancia tiene su propio
 * Map, así que esto frena abuso trivial, no un ataque distribuido. Para eso
 * haría falta un almacén compartido (Upstash/Redis).
 */
const golpes = new Map<string, { n: number; ventana: number }>();
const VENTANA_MS = 60_000;
const MAX_POR_VENTANA = 20;

function throttled(ip: string): boolean {
  const ahora = Date.now();
  const previo = golpes.get(ip);
  if (!previo || ahora - previo.ventana > VENTANA_MS) {
    golpes.set(ip, { n: 1, ventana: ahora });
    return false;
  }
  previo.n += 1;
  // Limpieza oportunista para que el Map no crezca sin límite.
  if (golpes.size > 5000) {
    for (const [k, v] of golpes) {
      if (ahora - v.ventana > VENTANA_MS) golpes.delete(k);
    }
  }
  return previo.n > MAX_POR_VENTANA;
}

interface Payload {
  eventName?: string;
  eventId?: string;
  customData?: Record<string, unknown>;
  userData?: { email?: string; phone?: string };
  eventSourceUrl?: string;
}

const EVENTOS_VALIDOS = ["Lead", "Contact", "Purchase", "CompleteRegistration"];

export async function POST(request: Request) {
  const cabeceras = await headers();

  // 1. Mismo origen. Evita que el endpoint se use desde otro dominio.
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

  // 2. Throttling por IP.
  const ip = (cabeceras.get("x-forwarded-for") || "").split(",")[0].trim() || "desconocida";
  if (throttled(ip)) {
    return new NextResponse(null, { status: 429 });
  }

  // 3. Consentimiento, releído en servidor.
  const cookieStore = await cookies();
  const consent = parseConsent(cookieStore.get(consentConfig.cookieName)?.value);
  if (!consent?.marketing) {
    return new NextResponse(null, { status: 204 });
  }

  const token = process.env.META_CAPI_ACCESS_TOKEN;
  const pixelId = consentConfig.metaPixelId;
  if (!token || !pixelId) {
    // Sin credenciales no hay nada que enviar, pero no es culpa del usuario.
    return NextResponse.json({ ok: true, skipped: "sin-credenciales" });
  }

  let body: Payload;
  try {
    body = (await request.json()) as Payload;
  } catch {
    return new NextResponse(null, { status: 400 });
  }

  const { eventName, eventId, customData, userData, eventSourceUrl } = body;
  if (!eventName || !eventId || !EVENTOS_VALIDOS.includes(eventName)) {
    return new NextResponse(null, { status: 400 });
  }

  const fbp = cookieStore.get("_fbp")?.value;
  let fbc = cookieStore.get("_fbc")?.value;

  // Si no hay cookie _fbc pero la URL trae fbclid, se construye a mano: sin
  // esto se pierde la atribución de los clics que llegan desde el anuncio.
  if (!fbc && eventSourceUrl) {
    try {
      const fbclid = new URL(eventSourceUrl).searchParams.get("fbclid");
      if (fbclid) fbc = `fb.1.${Date.now()}.${fbclid}`;
    } catch {
      // URL inservible: seguimos sin fbc.
    }
  }

  const payload = {
    data: [
      {
        event_name: eventName,
        event_time: Math.floor(Date.now() / 1000),
        event_id: eventId,
        action_source: "website",
        event_source_url: eventSourceUrl,
        user_data: {
          client_ip_address: ip !== "desconocida" ? ip : undefined,
          client_user_agent: cabeceras.get("user-agent") || undefined,
          fbp,
          fbc,
          em: hashEmail(userData?.email),
          ph: hashTelefono(userData?.phone),
        },
        custom_data: customData,
      },
    ],
    ...(process.env.META_TEST_EVENT_CODE
      ? { test_event_code: process.env.META_TEST_EVENT_CODE }
      : {}),
  };

  try {
    const res = await fetch(
      `https://graph.facebook.com/${GRAPH_VERSION}/${pixelId}/events?access_token=${encodeURIComponent(token)}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      },
    );
    if (!res.ok) {
      console.error("[meta-capi] respuesta de Meta:", res.status, await res.text());
    }
  } catch (error) {
    console.error("[meta-capi] fallo de red:", error);
  }

  // Siempre 200: un fallo de medición no puede romper el flujo del usuario.
  return NextResponse.json({ ok: true });
}
