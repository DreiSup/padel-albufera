"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { guardarConsentimiento, leerConsentimiento } from "@/lib/consent";

// Banner de consentimiento. Aceptar y rechazar tienen el mismo peso visual
// a propósito: un "aceptar" destacado y un "rechazar" apagado es justo el
// patrón que las autoridades de protección de datos (AEPD, CNIL) consideran
// no conforme. Se guarda la decisión y Consent Mode se actualiza al instante.
export function ConsentBanner() {
  const t = useTranslations("consent");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // localStorage es un sistema externo que no existe en SSR: este primer
    // pase tras montar es necesario, no un efecto evitable.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setVisible(leerConsentimiento() === null);
  }, []);

  if (!visible) return null;

  function decidir(estado: "granted" | "denied") {
    guardarConsentimiento(estado);
    setVisible(false);
  }

  return (
    <div
      role="region"
      aria-label={t("titulo")}
      className="fixed inset-x-0 bottom-[calc(58px+env(safe-area-inset-bottom,0px))] z-50 px-4 pb-4 min-[1100px]:bottom-0 min-[1100px]:px-6 min-[1100px]:pb-6"
    >
      <div className="mx-auto flex max-w-[560px] flex-col gap-3.5 rounded-2xl border border-[#2B3034] bg-[#17191B] p-5 text-[#EDEBE5] shadow-[0_8px_28px_rgba(0,0,0,0.28)] min-[560px]:flex-row min-[560px]:items-center min-[560px]:justify-between min-[1100px]:mx-0 min-[1100px]:max-w-[420px]">
        <p className="m-0 text-[13px] leading-[1.55] text-[#C9CDD0]">
          {t("texto")}{" "}
          <Link
            href="/politica-cookies"
            className="underline underline-offset-2 hover:text-[#EDEBE5]"
          >
            {t("masInfo")}
          </Link>
        </p>
        <div className="flex shrink-0 gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => decidir("denied")}
          >
            {t("rechazar")}
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="border-[var(--acc)] text-[var(--acc)] hover:bg-[var(--acc)]/10"
            onClick={() => decidir("granted")}
          >
            {t("aceptar")}
          </Button>
        </div>
      </div>
    </div>
  );
}
