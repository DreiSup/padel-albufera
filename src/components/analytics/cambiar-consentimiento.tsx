"use client";

import { Button } from "@/components/ui/button";
import { olvidarConsentimiento } from "@/lib/consent";

// Retirar el consentimiento tiene que ser tan fácil como darlo. Borra la
// decisión guardada y recarga: el banner vuelve a aparecer con Consent Mode
// otra vez en denegado por defecto.
export function CambiarConsentimiento({ label }: { label: string }) {
  return (
    <Button
      variant="ghost"
      onClick={() => {
        olvidarConsentimiento();
        window.location.reload();
      }}
    >
      {label}
    </Button>
  );
}
