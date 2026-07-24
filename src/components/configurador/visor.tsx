import Image from "next/image";
import { Moon, Sun, Sparkles } from "lucide-react";
import type { RefObject } from "react";

import { BLUR } from "@/lib/image-blur";
import { VISTAS, type Vista } from "@/lib/configurador/catalogo";

const POSTER = "/pista-padel-azul-cristal-jardin.jpg";

interface VisorProps {
  contenedorRef: RefObject<HTMLDivElement | null>;
  canvasRef: RefObject<HTMLCanvasElement | null>;
  ready: boolean;
  vista: Vista;
  onVista: (v: Vista) => void;
  noche: boolean;
  onToggleNoche: () => void;
  alta: boolean;
  onToggleCalidad: () => void;
  medida: string;
  t: (key: string) => string;
}

// El visor: póster real (el LCP de verdad) con el canvas WebGL montándose
// encima cuando está listo. Quien tenga JS bloqueado o una conexión pésima
// ve igualmente una pista bonita; el LCP lo marca la foto, no el canvas.
export function Visor({
  contenedorRef,
  canvasRef,
  ready,
  vista,
  onVista,
  noche,
  onToggleNoche,
  alta,
  onToggleCalidad,
  medida,
  t,
}: VisorProps) {
  return (
    <div className="sticky top-16 z-20 bg-[#DFDDD6] min-[1100px]:top-[74px]">
      <div
        ref={contenedorRef}
        className="relative aspect-[4/3] max-h-[52vh] w-full overflow-hidden bg-gradient-to-b from-[#cfd3d2] to-[#e2ded6] min-[1100px]:aspect-auto min-[1100px]:max-h-none min-[1100px]:h-[calc(100vh-74px)]"
      >
        {/* Póster estático: LCP con priority. Se desvanece al montar el 3D. */}
        <Image
          src={POSTER}
          alt={t("visor.posterAlt")}
          fill
          priority
          sizes="(max-width: 1100px) 100vw, 62vw"
          quality={70}
          placeholder="blur"
          blurDataURL={BLUR[POSTER]}
          className={`object-cover transition-opacity duration-500 ${
            ready ? "opacity-0" : "opacity-100"
          }`}
        />

        <canvas
          ref={canvasRef}
          aria-label={t("visor.canvasAria")}
          className={`absolute inset-0 block h-full w-full touch-none transition-opacity duration-500 ${
            ready ? "opacity-100" : "opacity-0"
          }`}
        />

        {!ready && (
          <div className="pointer-events-none absolute inset-0 grid place-content-center text-center font-mono text-[11px] uppercase tracking-[0.14em] text-[#5d6360]">
            {t("visor.cargando")}
          </div>
        )}

        {/* Etiqueta de medida arriba a la izquierda */}
        <span className="pointer-events-none absolute left-2.5 top-2.5 rounded-sm bg-[#F2F1ED]/70 px-2 py-1 font-mono text-[10.5px] tracking-[0.1em] text-[#3b423f]">
          {medida}
        </span>

        {/* HUD inferior: vistas + noche/calidad */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 p-2.5">
          <div className="pointer-events-auto flex max-w-[70%] gap-1 overflow-x-auto [scrollbar-width:none] min-[1100px]:max-w-none min-[1100px]:flex-wrap">
            {VISTAS.map((v) => {
              const activa = v === vista;
              return (
                <button
                  key={v}
                  type="button"
                  aria-pressed={activa}
                  onClick={() => onVista(v)}
                  className={`shrink-0 rounded-sm border px-2.5 py-1.5 font-mono text-[10.5px] uppercase leading-none tracking-[0.08em] backdrop-blur-[6px] ${
                    activa
                      ? "border-[#1C201E] bg-[#1C201E] text-[#F2F1ED]"
                      : "border-[#1C201E]/15 bg-[#F2F1ED]/85 text-[#1C201E]"
                  }`}
                >
                  {t(`visor.vistas.${v}`)}
                </button>
              );
            })}
          </div>
          <div className="pointer-events-auto flex gap-1">
            <button
              type="button"
              onClick={onToggleCalidad}
              aria-pressed={alta}
              title={t("visor.calidadTitle")}
              className={`flex items-center gap-1 rounded-sm border px-2.5 py-1.5 font-mono text-[10.5px] uppercase leading-none tracking-[0.08em] backdrop-blur-[6px] ${
                alta
                  ? "border-[#1C201E] bg-[#1C201E] text-[#F2F1ED]"
                  : "border-[#1C201E]/15 bg-[#F2F1ED]/85 text-[#1C201E]"
              }`}
            >
              <Sparkles className="size-3.5" />
              {t("visor.calidad")}
            </button>
            <button
              type="button"
              onClick={onToggleNoche}
              className="flex items-center gap-1 rounded-sm border border-[#1C201E]/15 bg-[#F2F1ED]/85 px-2.5 py-1.5 font-mono text-[10.5px] uppercase leading-none tracking-[0.08em] backdrop-blur-[6px] text-[#1C201E]"
            >
              {noche ? <Sun className="size-3.5" /> : <Moon className="size-3.5" />}
              {noche ? t("visor.dia") : t("visor.noche")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
