"use client";

import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { consentConfig } from "@/consent.config";
import { useConsent } from "./consent-provider";
import { PreferencesModal } from "./preferences-modal";

export function CookieBanner() {
  const t = useTranslations("consent");
  const { consent, isLoaded, acceptAll, rejectAll, openPreferences, preferencesOpen } =
    useConsent();

  // Nada hasta haber leído la cookie, para no parpadear en usuarios que ya
  // decidieron. Al ser position:fixed, el banner no desplaza contenido (0 CLS).
  const mostrarBanner = isLoaded && consent === null;

  return (
    <>
      {mostrarBanner && (
        <div
          role="dialog"
          aria-modal="false"
          aria-label={t("titulo")}
          // Se apila POR ENCIMA de la barra fija de contacto (58 px) en móvil:
          // los botones de WhatsApp y teléfono tienen que seguir alcanzables.
          className="fixed inset-x-0 bottom-[calc(58px+env(safe-area-inset-bottom,0px))] z-50 px-4 pb-4 min-[1100px]:bottom-0 min-[1100px]:px-6 min-[1100px]:pb-6"
        >
          <div className="mx-auto max-w-[560px] rounded-2xl border border-[#2B3034] bg-[#17191B] p-5 text-[#EDEBE5] shadow-[0_8px_28px_rgba(0,0,0,0.28)] min-[1100px]:mx-0 min-[1100px]:max-w-[440px]">
            <p className="m-0 text-[13.5px] leading-[1.55] text-[#C9CDD0]">
              {t("texto")}{" "}
              <Link
                href={consentConfig.cookiePolicyUrl}
                className="underline underline-offset-2 hover:text-[#EDEBE5]"
              >
                {t("verPolitica")}
              </Link>
            </p>

            {/* Requisito legal, no decisión de diseño: "Aceptar todo" y
                "Rechazar todo" comparten variante, tamaño y jerarquía. NO
                degradar el rechazo a variant="ghost" ni a un enlace: hacerlo
                convierte el consentimiento en no válido. */}
            <div className="mt-4 flex flex-col gap-2 min-[420px]:flex-row">
              <Button
                variant="outline"
                size="sm"
                className="min-[420px]:flex-1"
                onClick={acceptAll}
              >
                {t("aceptar")}
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="min-[420px]:flex-1"
                onClick={rejectAll}
              >
                {t("rechazar")}
              </Button>
            </div>

            <button
              type="button"
              onClick={openPreferences}
              className="mt-3 w-full text-center text-[12.5px] text-[#9DA1A5] underline underline-offset-2 hover:text-[#C9CDD0]"
            >
              {t("configurar")}
            </button>
          </div>
        </div>
      )}

      {/* El panel también se abre desde el footer con el consentimiento ya dado. */}
      {isLoaded && preferencesOpen && <PreferencesModal />}
    </>
  );
}
