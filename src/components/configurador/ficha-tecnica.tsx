import { construirFicha, referencia, type Tr } from "@/lib/configurador/mensaje";
import type { Estado } from "@/lib/configurador/estado";

interface FichaProps {
  estado: Estado;
  t: Tr;
}

// La ficha técnica en vivo: la prueba de que esto no es un juguete. Se actualiza
// con cada cambio y funciona como región aria-live —la vía alternativa al canvas
// para un lector de pantalla—. La solera se destaca siempre.
export function FichaTecnica({ estado, t }: FichaProps) {
  const filas = construirFicha(t, estado);

  return (
    <section aria-label={t("ficha.titulo")} className="mt-8">
      <div className="mb-3 flex items-baseline justify-between gap-3">
        <h2 className="font-display text-[19px] font-bold uppercase tracking-[-0.01em]">
          {t("ficha.titulo")}
        </h2>
        <span className="font-mono text-[11px] tracking-[0.06em] text-[var(--accd)]">
          {t("ficha.ref", { ref: referencia(estado) })}
        </span>
      </div>

      <dl
        aria-live="polite"
        className="overflow-hidden rounded-xl border border-[#E2DFD6] bg-white"
      >
        {filas.map((f) => (
          <div
            key={f.label}
            className={`flex justify-between gap-4 border-b border-[#EDEBE4] px-4 py-3 text-[14px] last:border-0 ${
              f.destaca ? "bg-[var(--acc)]/[.08]" : ""
            }`}
          >
            <dt className="shrink-0 text-[#7A7E82]">{f.label}</dt>
            <dd
              className={`text-right font-medium ${
                f.destaca ? "text-[var(--accd)]" : "text-[#1A1C1E]"
              }`}
            >
              {f.value}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
