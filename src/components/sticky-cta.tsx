import { Phone } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { WhatsappIcon } from "@/components/icons";
import { WhatsAppLink } from "@/components/conversion/whatsapp-link";
import { PhoneLink } from "@/components/conversion/phone-link";

/**
 * Alto de la barra + el hueco seguro del dispositivo. Las páginas reservan este
 * mismo espacio con `pb-[var(--sticky-cta-h)]`, así que la barra no tapa el
 * final del contenido ni provoca CLS (es `fixed`, no desplaza nada).
 */
export const STICKY_CTA_H = "calc(58px + env(safe-area-inset-bottom, 0px))";

// Barra fija de contacto en móvil. Es el punto de conversión más usado del
// sitio, así que ambos botones miden con su placement.
export async function StickyCta() {
  const t = await getTranslations();
  return (
    <div
      className="fixed inset-x-0 bottom-0 z-45 flex shadow-[0_-4px_18px_rgba(0,0,0,0.16)] min-[1100px]:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      <WhatsAppLink
        placement="sticky"
        className="flex h-[58px] flex-1 items-center justify-center gap-2 bg-[#25D366] text-[15.5px] font-bold text-[#062B14]"
      >
        <WhatsappIcon className="size-5" /> {t("bar.whatsapp")}
      </WhatsAppLink>
      <PhoneLink
        placement="sticky"
        className="flex h-[58px] flex-1 items-center justify-center gap-2 bg-[var(--acc)] text-[15.5px] font-bold text-[#07130C]"
      >
        <Phone className="size-5" /> {t("bar.call")}
      </PhoneLink>
    </div>
  );
}
