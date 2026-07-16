import { Phone } from "lucide-react";
import { useTranslations } from "next-intl";

import { WhatsappIcon } from "@/components/icons";
import { TEL, waHref } from "@/lib/site";

export function StickyCta() {
  const t = useTranslations();
  return (
    <div className="fixed bottom-0 left-0 right-0 z-45 flex shadow-[0_-4px_18px_rgba(0,0,0,0.16)] min-[900px]:hidden">
      <a
        href={waHref(t("common.waMessage"))}
        className="flex h-[58px] flex-1 items-center justify-center gap-2 bg-[#25D366] text-[15.5px] font-bold text-[#062B14]"
      >
        <WhatsappIcon className="size-5" /> {t("bar.whatsapp")}
      </a>
      <a
        href={`tel:${TEL}`}
        className="flex h-[58px] flex-1 items-center justify-center gap-2 bg-[var(--acc)] text-[15.5px] font-bold text-[#07130C]"
      >
        <Phone className="size-5" /> {t("bar.call")}
      </a>
    </div>
  );
}
