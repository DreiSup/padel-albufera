import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { consentConfig } from "@/consent.config";
import { hashIp, saveConsentRecord } from "@/lib/consent/record";

// Registro de la decisión de consentimiento. Endpoint público, así que se
// valida el origen y se acepta únicamente la forma exacta esperada.

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

  let body: { id?: string; analitica?: boolean; marketing?: boolean };
  try {
    body = await request.json();
  } catch {
    return new NextResponse(null, { status: 400 });
  }

  if (
    typeof body.id !== "string" ||
    typeof body.analitica !== "boolean" ||
    typeof body.marketing !== "boolean"
  ) {
    return new NextResponse(null, { status: 400 });
  }

  const ip = (cabeceras.get("x-forwarded-for") || "").split(",")[0].trim();

  try {
    await saveConsentRecord({
      id: body.id,
      ts: Math.floor(Date.now() / 1000),
      policyVersion: consentConfig.policyVersion,
      analitica: body.analitica,
      marketing: body.marketing,
      userAgent: cabeceras.get("user-agent") || "",
      ipHash: ip ? hashIp(ip) : "",
    });
  } catch (error) {
    console.error("[consent-log] fallo al registrar:", error);
  }

  return new NextResponse(null, { status: 204 });
}
