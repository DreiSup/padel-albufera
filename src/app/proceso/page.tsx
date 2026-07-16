"use client";

import { Camera, Check, Clock, Euro, FileText, Key, MapPin, Phone, ShieldCheck, Wrench } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { StickyCta } from "@/components/sticky-cta";
import { WhatsappIcon } from "@/components/icons";
import { TEL, TEL_LABEL, waHref } from "@/lib/site";

const STEPS = [
  {
    n: "1",
    dur: "48–72 h",
    t: "Visita y estudio gratuito",
    icon: MapPin,
    tag: "Sin coste ni compromiso",
    d: "Vamos a tu parcela, medimos, analizamos accesos, terreno y normativa municipal, y resolvemos tus dudas en persona.",
    deliv: ["Replanteo y toma de medidas", "Estudio de viabilidad", "Recomendación de modelo"],
  },
  {
    n: "2",
    dur: "3–5 días",
    t: "Proyecto y presupuesto cerrado",
    icon: FileText,
    tag: "Precio final por escrito",
    d: "Redactamos la memoria técnica, los planos y el presupuesto detallado. El precio que firmas es el que pagas.",
    deliv: ["Memoria técnica y planos", "Presupuesto cerrado sin partidas abiertas", "Documentación para licencia"],
  },
  {
    n: "3",
    dur: "4–8 semanas",
    t: "Construcción con plazo comprometido",
    icon: Wrench,
    tag: "Equipo propio",
    d: "Ejecutamos con nuestro equipo, sin subcontratas encadenadas, y te enviamos fotos de seguimiento cada semana.",
    deliv: ["Cimentación y obra civil", "Montaje de estructura y vidrio", "Fotos de avance semanales"],
  },
  {
    n: "4",
    dur: "1 día + postventa",
    t: "Entrega lista para jugar",
    icon: Key,
    tag: "Garantía 10 años",
    d: "Revisión final contigo, entrega de garantía documentada y plan de mantenimiento. Y seguimos disponibles después.",
    deliv: ["Prueba y revisión conjunta", "Garantía de 10 años por escrito", "Plan de mantenimiento postventa"],
  },
];

const PLEDGES = [
  { icon: Euro, t: "Presupuesto cerrado", d: "Sin partidas abiertas ni sobrecostes de última hora. Lo que firmas es lo que pagas." },
  { icon: Clock, t: "Plazo comprometido", d: "La fecha de entrega queda fijada en contrato, no es una estimación optimista." },
  { icon: Camera, t: "Transparencia total", d: "Fotos de seguimiento cada semana y un único interlocutor durante toda la obra." },
  { icon: ShieldCheck, t: "Garantía real", d: "10 años por escrito y servicio postventa de mantenimiento en los 4 países." },
];

const FAQS = [
  { q: "¿La visita y el presupuesto tienen coste?", a: "No. La fase 1 —visita, medición y estudio de viabilidad— es totalmente gratuita y sin compromiso." },
  { q: "¿El precio puede cambiar durante la obra?", a: "No, salvo que tú pidas cambios de alcance. El presupuesto es cerrado y sin partidas abiertas." },
  { q: "¿Subcontratáis la obra?", a: "Ejecutamos con equipo propio. Si algún oficio puntual se apoya en un especialista, seguimos siendo tu único interlocutor y responsables del resultado." },
  { q: "¿Cómo sigo el avance si estoy lejos?", a: "Te enviamos fotos de seguimiento cada semana por WhatsApp o email. Útil sobre todo para proyectos en Francia, Alemania y Bélgica." },
  { q: "¿Qué pasa tras la entrega?", a: "Recibes la garantía de 10 años por escrito y un plan de mantenimiento. Seguimos disponibles para postventa." },
];

export default function ProcesoPage() {
  return (
    <div className="bg-[#F4F2EE] text-[#1A1C1E]">
      <SiteHeader />

      <main className="pt-16 pb-[58px] min-[900px]:pt-[74px] min-[900px]:pb-0">
        {/* Hero */}
        <section className="relative flex min-h-[360px] bg-[#17191B] min-[900px]:min-h-[440px]">
          <div className="absolute inset-0 flex items-center justify-center bg-[#26292D]">
            <span className="font-mono text-[11px] tracking-wide text-[#8A8E92]">
              FOTO REAL OBRA — equipo trabajando
            </span>
          </div>
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, rgba(13,15,16,.4), rgba(13,15,16,.2) 30%, rgba(13,15,16,.9) 74%)",
            }}
          />
          <div className="relative mt-auto flex w-full flex-col gap-3 px-5 pb-6 min-[900px]:mx-auto min-[900px]:max-w-[1200px] min-[900px]:px-10">
            <span className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--acc)] before:h-[3px] before:w-4 before:bg-[var(--acc)]">
              Cómo trabajamos
            </span>
            <h1 className="font-display text-[38px] leading-[0.95] font-bold uppercase text-white min-[900px]:text-[58px]">
              De la visita a la entrega, sin sorpresas
            </h1>
            <p className="m-0 text-[15px] leading-[1.5] text-[#D9D7D1]">
              Un solo interlocutor, precio cerrado por escrito y plazo comprometido en contrato.
            </p>
          </div>
        </section>

        {/* Timeline */}
        <section className="px-5 py-[52px] min-[900px]:mx-auto min-[900px]:max-w-[1200px] min-[900px]:px-10 min-[900px]:py-[88px]">
          <Eyebrow>El proceso</Eyebrow>
          <h2 className="font-display mt-2 text-[31px] font-bold uppercase leading-[0.95]">
            4 fases, un único responsable
          </h2>
          <div className="relative mt-4 pl-[52px] before:absolute before:top-2 before:bottom-6 before:left-[19px] before:w-0.5 before:bg-[#DAD6CB] min-[900px]:max-w-[760px]">
            {STEPS.map((s) => (
              <div key={s.n} className="relative pb-[30px]">
                <span className="font-display absolute -left-[52px] top-0 flex size-10 items-center justify-center rounded-full bg-[var(--acc)] text-lg font-bold text-[#07130C] shadow-[0_0_0_5px_#F4F2EE]">
                  {s.n}
                </span>
                <p className="m-0 mb-0.5 text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--accd)]">
                  Fase {s.n} · {s.dur}
                </p>
                <h3 className="font-display m-0 mb-1.5 text-[23px] font-bold uppercase leading-none">{s.t}</h3>
                <p className="m-0 mb-3 text-[14.5px] leading-[1.55] text-[#565A5E]">{s.d}</p>
                <span className="inline-flex items-center gap-1.5 rounded-md border border-[#E5E2D9] bg-white px-2.5 py-1.5 text-[12.5px] font-semibold text-[#2A2D30]">
                  <s.icon className="size-[15px]" />
                  {s.tag}
                </span>
                <div className="mt-3.5 aspect-[16/10] rounded-[10px] bg-[#E7E4DC]" />
                <ul className="m-0 mt-3 flex list-none flex-col gap-2 p-0">
                  {s.deliv.map((d) => (
                    <li key={d} className="flex items-start gap-2.5 text-sm leading-[1.4] text-[#3A3D40]">
                      <Check className="mt-0.5 size-[17px] shrink-0 text-[var(--accd)]" />
                      {d}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Compromisos */}
        <section className="bg-[#17191B] text-white">
          <div className="px-5 py-[52px] min-[900px]:mx-auto min-[900px]:max-w-[1200px] min-[900px]:px-10 min-[900px]:py-[88px]">
            <Eyebrow>Nuestros compromisos</Eyebrow>
            <h2 className="font-display mt-2 text-[31px] font-bold uppercase leading-[0.95] text-white">
              Lo que firmamos, lo cumplimos
            </h2>
            <div className="mt-4 flex flex-col gap-3">
              {PLEDGES.map((p) => (
                <div key={p.t} className="flex items-start gap-3.5 rounded-xl border border-[#2B3034] bg-[#212428] p-[22px]">
                  <span className="flex size-[46px] shrink-0 items-center justify-center rounded-[10px] bg-[var(--acc)]/[.14] text-[var(--acc)]">
                    <p.icon className="size-5" />
                  </span>
                  <div>
                    <h3 className="font-display m-0 mb-1 text-lg font-bold uppercase leading-none">{p.t}</h3>
                    <p className="m-0 text-[13.5px] leading-[1.5] text-[#A2A7AB]">{p.d}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 flex flex-col items-center gap-1.5 rounded-2xl border-2 border-[var(--acc)] bg-[var(--acc)]/[.08] px-[22px] py-[26px] text-center min-[900px]:mx-auto min-[900px]:max-w-[560px]">
              <span className="font-mono text-[9.5px] uppercase tracking-wide text-[#8A8E92]">sello / logo garantía</span>
              <div className="font-display text-[76px] leading-[0.85] font-bold text-[var(--acc)]">10</div>
              <div className="font-display text-[22px] font-bold uppercase tracking-wide">años de garantía</div>
              <p className="m-0 text-[13px] text-[#A2A7AB]">Por escrito sobre estructura y obra civil, en los 4 países.</p>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="px-5 py-[52px] min-[900px]:mx-auto min-[900px]:max-w-[1200px] min-[900px]:px-10 min-[900px]:py-[88px]">
          <Eyebrow>Preguntas frecuentes</Eyebrow>
          <h2 className="font-display mt-2 text-[31px] font-bold uppercase leading-[0.95]">
            Dudas sobre el proceso
          </h2>
          <Accordion type="single" collapsible className="mt-2 min-[900px]:max-w-[900px]">
            {FAQS.map((f, i) => (
              <AccordionItem key={i} value={`item-${i}`}>
                <AccordionTrigger>{f.q}</AccordionTrigger>
                <AccordionContent>{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>

        {/* CTA final */}
        <section className="bg-[#17191B] text-white">
          <div className="flex flex-col items-start gap-3.5 px-5 py-14 min-[900px]:mx-auto min-[900px]:max-w-[1200px] min-[900px]:px-10">
            <Eyebrow>Empieza por la visita gratuita</Eyebrow>
            <h2 className="font-display text-[34px] font-bold uppercase leading-[0.95] text-white">
              La fase 1 no te cuesta nada
            </h2>
            <p className="m-0 text-[15px] leading-[1.5] text-[#C9CDD0]">
              Reserva la visita técnica y el estudio de viabilidad. Sin coste ni compromiso.
            </p>
            <Button variant="whatsapp" asChild>
              <a href={waHref("Hola, quiero reservar la visita técnica gratuita.")}>
                <WhatsappIcon className="size-5" />
                WhatsApp directo
              </a>
            </Button>
            <Button variant="outline" asChild>
              <a href={`tel:${TEL}`}>
                <Phone className="size-5" />
                Llamar · {TEL_LABEL}
              </a>
            </Button>
          </div>
        </section>
      </main>

      <SiteFooter />
      <StickyCta />
    </div>
  );
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--accd)] before:h-[3px] before:w-4 before:bg-[var(--acc)]">
      {children}
    </span>
  );
}
