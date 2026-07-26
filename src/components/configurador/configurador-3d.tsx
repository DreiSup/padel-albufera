"use client";

import { Phone } from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { useLocale, useTranslations } from "next-intl";

import { WhatsappIcon } from "@/components/icons";
import { waHref as construirWaHref } from "@/lib/contact";
import { pushEvento } from "@/lib/analytics";
import { useAttribution } from "@/lib/attribution/use-attribution";
import { PhoneLink } from "@/components/conversion/phone-link";
import type { GrupoCatalogo, Vista } from "@/lib/configurador/catalogo";
import {
  ESTADO_INICIAL,
  estadoAQuery,
  queryAEstado,
  type Estado,
} from "@/lib/configurador/estado";
import { construirMensaje, referencia } from "@/lib/configurador/mensaje";
import type { PadelScene } from "@/lib/configurador/engine";

import { Visor } from "./visor";
import { Controles } from "./controles";
import { FichaTecnica } from "./ficha-tecnica";
import { ResumenCta } from "./resumen-cta";

interface Props {
  /** Contenido servido (SEO): intro con H1, prueba social y FAQ. */
  intro: ReactNode;
  social: ReactNode;
  faq: ReactNode;
}

// Island interactivo. Es el único punto de la ruta con estado de cliente:
// mantiene el `estado`, gobierna el motor 3D de forma imperativa, sincroniza
// la configuración con la URL y emite los eventos de conversión. Todo lo
// estático (intro, prueba social, FAQ) llega como slots servidos.
export function Configurador3D({ intro, social, faq }: Props) {
  const t = useTranslations("configurator");
  const tconv = useTranslations("conversion");
  const locale = useLocale();
  const attr = useAttribution();
  // Traductor seguro para claves opcionales (help/sub/desc no siempre existen).
  const tt = (key: string) => (t.has(key) ? t(key) : "");
  // Traductor con valores, para ficha y mensaje.
  const tv = (key: string, values?: Record<string, string | number>) =>
    t(key, values);

  const [estado, setEstado] = useState<Estado>(ESTADO_INICIAL);
  const [vista, setVista] = useState<Vista>("hero");
  const [noche, setNoche] = useState(false);
  const [alta, setAlta] = useState(false);
  const [ready, setReady] = useState(false);

  const contenedorRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const engineRef = useRef<PadelScene | null>(null);
  const estadoRef = useRef(estado);
  const interactuado = useRef(false);
  const sincronizado = useRef(false);

  // 1) Cargar configuración desde la URL (antes de montar el motor).
  //    En el caso común (sin query) no hay segundo render: solo un enlace
  //    compartido dispara el setState. Es un segundo pase deliberado —la URL
  //    es un sistema externo que no existe en SSR—, de ahí la excepción.
  useEffect(() => {
    const desdeURL = queryAEstado(window.location.search);
    if (estadoAQuery(desdeURL) === "") return;
    estadoRef.current = desdeURL;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setEstado(desdeURL);
  }, []);

  // 2) Montar el motor 3D (Three.js entra aquí, en carga diferida).
  useEffect(() => {
    let scene: PadelScene | null = null;
    let cancelado = false;
    (async () => {
      const { PadelScene: Motor } = await import("@/lib/configurador/engine");
      if (cancelado || !canvasRef.current || !contenedorRef.current) return;
      scene = new Motor({
        canvas: canvasRef.current,
        contenedor: contenedorRef.current,
        estado: estadoRef.current,
        rotulo: t("rotulo"),
        onReady: () => setReady(true),
      });
      engineRef.current = scene;
      setAlta(scene.isHighQuality());
    })();
    return () => {
      cancelado = true;
      scene?.dispose();
      engineRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 3) Sincronizar la configuración con la URL (compartible y recuperable).
  //    replaceState: el botón atrás sale de la página, no deshace cambios.
  useEffect(() => {
    if (!sincronizado.current) {
      sincronizado.current = true;
      return;
    }
    const qs = estadoAQuery(estado);
    const url = qs ? `?${qs}` : window.location.pathname;
    window.history.replaceState(null, "", url);
  }, [estado]);

  function aplicar(next: Estado, afecta: GrupoCatalogo["afecta"]) {
    estadoRef.current = next;
    setEstado(next);
    engineRef.current?.applyChange(next, afecta);
    if (!interactuado.current) {
      interactuado.current = true;
      pushEvento({ event: "configurador_interaccion", origen: "configurador_3d" });
    }
  }

  function seleccionar(g: GrupoCatalogo, id: string) {
    let next: Estado;
    if (g.control === "multi") {
      const arr = estado[g.clave] as string[];
      const nuevos = arr.includes(id) ? arr.filter((x) => x !== id) : [...arr, id];
      next = { ...estado, [g.clave]: nuevos };
    } else {
      next = { ...estado, [g.clave]: id };
    }
    aplicar(next, g.afecta);
  }

  function cambiarVista(v: Vista) {
    setVista(v);
    engineRef.current?.setView(v);
  }

  function toggleNoche() {
    const siguiente = !noche;
    setNoche(siguiente);
    engineRef.current?.setNight(siguiente);
  }

  function toggleCalidad() {
    const siguiente = !alta;
    setAlta(siguiente);
    engineRef.current?.setQuality(siguiente);
  }

  // El mensaje lleva la configuración completa MÁS el código de campaña: así
  // se cruza la obra vendida con la keyword que trajo al visitante.
  const mensajeBase = construirMensaje(tv, estado);
  const mensaje = attr?.ref
    ? `${mensajeBase}\n${tconv("refLinea", { ref: attr.ref })}`
    : mensajeBase;
  const waHref = construirWaHref(locale, mensaje);
  const medida = tv(
    estado.modalidad === "dobles" ? "ficha.val.medidaDobles" : "ficha.val.medidaIndividual",
  );

  const paramsConfig = {
    version: estado.version,
    modalidad: estado.modalidad,
    entorno: estado.entorno,
    cristal: estado.cristal,
    ral: estado.ral,
    iluminacion: estado.iluminacion,
    extras: estado.extras.join("|"),
    referencia: referencia(estado),
  };

  const onWhatsapp = () =>
    pushEvento({
      event: "whatsapp_click",
      ref_code: attr?.ref ?? "",
      placement: "configurador",
      page_path: typeof window !== "undefined" ? window.location.pathname : "",
      locale,
      ...paramsConfig,
    });

  return (
    <div className="min-[1100px]:grid min-[1100px]:grid-cols-[minmax(0,1fr)_440px] min-[1100px]:items-start">
      <Visor
        contenedorRef={contenedorRef}
        canvasRef={canvasRef}
        ready={ready}
        vista={vista}
        onVista={cambiarVista}
        noche={noche}
        onToggleNoche={toggleNoche}
        alta={alta}
        onToggleCalidad={toggleCalidad}
        medida={medida}
        t={tt}
      />

      <div className="mx-auto max-w-[640px] px-5 pb-[120px] pt-7 min-[1100px]:mx-0 min-[1100px]:h-[calc(100vh-74px)] min-[1100px]:max-w-none min-[1100px]:overflow-y-auto min-[1100px]:border-l min-[1100px]:border-[#E2DFD6] min-[1100px]:px-8 min-[1100px]:pb-10">
        {intro}
        <div className="mt-6">
          <Controles estado={estado} onSelect={seleccionar} t={tt} />
        </div>
        <FichaTecnica estado={estado} t={tv} />
        {social}
        {faq}
        <ResumenCta
          estado={estado}
          t={tv}
          waHref={waHref}
          onWhatsapp={onWhatsapp}
        />
      </div>

      {/* Barra de contacto siempre visible en móvil, con la config en vivo. */}
      <div
        className="fixed inset-x-0 bottom-0 z-45 flex shadow-[0_-4px_18px_rgba(0,0,0,0.16)] min-[1100px]:hidden"
        style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
      >
        <a
          href={waHref}
          onClick={onWhatsapp}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-[58px] flex-1 items-center justify-center gap-2 bg-[#25D366] text-[15.5px] font-bold text-[#062B14]"
        >
          <WhatsappIcon className="size-5" /> {t("barra.whatsapp")}
        </a>
        <PhoneLink
          placement="configurador"
          className="flex h-[58px] flex-1 items-center justify-center gap-2 bg-[var(--acc)] text-[15.5px] font-bold text-[#07130C]"
        >
          <Phone className="size-5" /> {t("barra.telefono")}
        </PhoneLink>
      </div>
    </div>
  );
}
