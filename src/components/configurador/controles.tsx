import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { CATALOGO, type GrupoCatalogo } from "@/lib/configurador/catalogo";
import type { Estado } from "@/lib/configurador/estado";

interface ControlesProps {
  estado: Estado;
  onSelect: (grupo: GrupoCatalogo, id: string) => void;
  t: (key: string) => string;
}

function activo(estado: Estado, g: GrupoCatalogo, id: string) {
  if (g.control === "multi") {
    return (estado[g.clave] as string[]).includes(id);
  }
  return estado[g.clave] === id;
}

// Controles por pasos, no como un muro de opciones. En móvil, acordeón con uno
// abierto cada vez. El orden importa: primero lo que más cambia el aspecto
// (versión, modalidad, color), después lo técnico.
export function Controles({ estado, onSelect, t }: ControlesProps) {
  const visibles = CATALOGO.filter((g) => !g.visible || g.visible(estado));

  return (
    <Accordion
      type="single"
      collapsible
      defaultValue={CATALOGO[0].clave}
      className="w-full"
    >
      {visibles.map((g, i) => {
        const num = String(i + 1).padStart(2, "0");
        const ayuda = t(`cat.${g.clave}.help`);
        return (
          <AccordionItem key={g.clave} value={g.clave}>
            <AccordionTrigger>
              <span className="flex items-baseline gap-2.5">
                <span className="font-mono text-[11px] text-[var(--accd)]">{num}</span>
                <span className="font-display text-[17px] font-bold uppercase leading-none tracking-[-0.01em]">
                  {t(`cat.${g.clave}.title`)}
                </span>
              </span>
            </AccordionTrigger>
            <AccordionContent>
              {ayuda ? <p className="mb-3 max-w-[52ch]">{ayuda}</p> : null}

              {g.control === "tarjetas" && (
                <div className="flex flex-col gap-2">
                  {g.opciones.map((o) => {
                    const on = activo(estado, g, o.id);
                    return (
                      <button
                        key={o.id}
                        type="button"
                        aria-pressed={on}
                        onClick={() => onSelect(g, o.id)}
                        className={`rounded-lg border-[1.5px] px-3.5 py-3 text-left transition-colors ${
                          on
                            ? "border-[#1C201E] bg-[#1C201E] text-[#F2F1ED]"
                            : "border-[#D8D4C9] bg-white text-[#1A1C1E] hover:border-[#B9B4A6]"
                        }`}
                      >
                        <strong className="block text-[15px] font-semibold">
                          {t(`cat.${g.clave}.options.${o.id}.name`)}
                        </strong>
                        <small
                          className={`mt-0.5 block text-[12.5px] leading-[1.45] ${
                            on ? "text-[#C9CDCB]" : "text-[#7A7E82]"
                          }`}
                        >
                          {t(`cat.${g.clave}.options.${o.id}.desc`)}
                        </small>
                      </button>
                    );
                  })}
                </div>
              )}

              {g.control === "muestras" && (
                <div className="flex flex-wrap gap-2">
                  {g.opciones.map((o) => {
                    const on = activo(estado, g, o.id);
                    return (
                      <button
                        key={o.id}
                        type="button"
                        aria-pressed={on}
                        onClick={() => onSelect(g, o.id)}
                        className={`flex items-center gap-2 rounded-lg border-[1.5px] px-3 py-2 text-[13.5px] font-medium transition-colors ${
                          on
                            ? "border-[#1C201E] bg-[#1C201E] text-[#F2F1ED]"
                            : "border-[#D8D4C9] bg-white text-[#1A1C1E] hover:border-[#B9B4A6]"
                        }`}
                      >
                        <span
                          className="size-4 shrink-0 rounded-full border border-black/15"
                          style={{ background: o.hex }}
                        />
                        {t(`cat.${g.clave}.options.${o.id}.name`)}
                        {o.codigo ? (
                          <span
                            className={`font-mono text-[10.5px] ${
                              on ? "text-[#9DA1A5]" : "text-[#9DA1A5]"
                            }`}
                          >
                            {o.codigo}
                          </span>
                        ) : null}
                      </button>
                    );
                  })}
                </div>
              )}

              {(g.control === "chips" || g.control === "multi") && (
                <div className="flex flex-wrap gap-2">
                  {g.opciones.map((o) => {
                    const on = activo(estado, g, o.id);
                    const sub = t(`cat.${g.clave}.options.${o.id}.sub`);
                    return (
                      <button
                        key={o.id}
                        type="button"
                        aria-pressed={on}
                        onClick={() => onSelect(g, o.id)}
                        className={`rounded-full border-[1.5px] px-3.5 py-2 text-[13.5px] font-medium transition-colors ${
                          on
                            ? "border-[#1C201E] bg-[#1C201E] text-[#F2F1ED]"
                            : "border-[#D8D4C9] bg-white text-[#1A1C1E] hover:border-[#B9B4A6]"
                        }`}
                      >
                        {t(`cat.${g.clave}.options.${o.id}.name`)}
                        {sub ? (
                          <span
                            className={`ml-1.5 text-[11.5px] ${
                              on ? "text-[#C9CDCB]" : "text-[#8A8E92]"
                            }`}
                          >
                            {sub}
                          </span>
                        ) : null}
                      </button>
                    );
                  })}
                </div>
              )}
            </AccordionContent>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
}
