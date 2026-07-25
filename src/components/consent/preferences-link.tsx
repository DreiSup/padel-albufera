"use client";

import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { useConsent } from "./consent-provider";

// Enlace permanente en el footer: revocar tiene que costar los mismos clics
// que aceptar. Abre el mismo panel granular que el banner.
export function PreferencesLink({ className }: { className?: string }) {
  const t = useTranslations("consent");
  const { openPreferences } = useConsent();
  return (
    <button type="button" onClick={openPreferences} className={className}>
      {t("preferencias")}
    </button>
  );
}

// Retirada total desde la política de cookies: borra la decisión y las cookies
// que Google y Meta ya hubieran escrito, y recarga.
export function WithdrawButton() {
  const t = useTranslations("consent");
  const { withdraw } = useConsent();
  return (
    <Button variant="ghost" onClick={withdraw}>
      {t("retirar")}
    </Button>
  );
}
