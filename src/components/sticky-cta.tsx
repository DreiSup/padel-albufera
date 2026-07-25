import { Phone } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { WhatsappIcon } from "@/components/icons";
import { ContactLink } from "@/components/contact-link";

// Barra fija de contacto en móvil. Presente en 6 páginas y probablemente el
// punto de conversión más usado del sitio, así que mide (ver ContactLink).
export async function StickyCta() {
  const t = await getTranslations();
  return (
    <div className="fixed bottom-0 left-0 right-0 z-45 flex shadow-[0_-4px_18px_rgba(0,0,0,0.16)] min-[1100px]:hidden">
      <ContactLink
        tipo="whatsapp"
        ubicacion="barra_fija"
        mensaje={t("common.waMessage")}
        className="flex h-[58px] flex-1 items-center justify-center gap-2 bg-[#25D366] text-[15.5px] font-bold text-[#062B14]"
      >
        <WhatsappIcon className="size-5" /> {t("bar.whatsapp")}
      </ContactLink>
      <ContactLink
        tipo="telefono"
        ubicacion="barra_fija"
        className="flex h-[58px] flex-1 items-center justify-center gap-2 bg-[var(--acc)] text-[15.5px] font-bold text-[#07130C]"
      >
        <Phone className="size-5" /> {t("bar.call")}
      </ContactLink>
    </div>
  );
}
