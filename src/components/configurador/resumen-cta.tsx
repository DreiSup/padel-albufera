import { Phone } from "lucide-react";

import { Button } from "@/components/ui/button";
import { WhatsappIcon } from "@/components/icons";
import { TEL, TEL_LABEL } from "@/lib/site";
import { referencia, type Tr } from "@/lib/configurador/mensaje";
import type { Estado } from "@/lib/configurador/estado";

interface ResumenProps {
  estado: Estado;
  t: Tr;
  waHref: string;
  onWhatsapp: () => void;
  onTelefono: () => void;
}

// Cerrar el círculo: "esta es tu pista, pregúntanos por ella". El mensaje de
// WhatsApp llega ya redactado con toda la configuración; el usuario puede
// editarlo antes de enviar.
export function ResumenCta({ estado, t, waHref, onWhatsapp, onTelefono }: ResumenProps) {
  return (
    <section className="mt-10 rounded-2xl border border-[#E2DFD6] bg-[#17191B] p-6 text-[#EDEBE5]">
      <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--acc)]">
        {t("resumen.eyebrow", { ref: referencia(estado) })}
      </span>
      <h2 className="font-display mt-2 text-[24px] font-bold uppercase leading-[1.05]">
        {t("resumen.titulo")}
      </h2>
      <p className="mt-2 max-w-[46ch] text-[14px] leading-[1.55] text-[#C9CDD0]">
        {t("resumen.sub")}
      </p>

      <div className="mt-5 flex flex-col gap-2.5 min-[560px]:flex-row">
        <Button variant="whatsapp" asChild className="min-[560px]:flex-1">
          <a href={waHref} onClick={onWhatsapp} target="_blank" rel="noopener noreferrer">
            <WhatsappIcon className="size-5" />
            {t("resumen.whatsapp")}
          </a>
        </Button>
        <Button variant="outline" asChild className="min-[560px]:flex-1">
          <a href={`tel:${TEL}`} onClick={onTelefono}>
            <Phone className="size-5" />
            {t("resumen.telefono")} · {TEL_LABEL}
          </a>
        </Button>
      </div>
    </section>
  );
}
