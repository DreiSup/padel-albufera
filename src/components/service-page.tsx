"use client";

import { useState } from "react";
import { Phone } from "lucide-react";

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

export interface ServiceModel {
  tab: string;
  name: string;
  cta: string;
  desc: string;
  price: string;
  specs: { k: string; v: string }[];
  ideal: string[];
}

export interface ServiceMaterial {
  t: string;
  d: string;
}

export interface ServiceFaq {
  q: string;
  a: string;
}

export interface ServicePageProps {
  idPrefix: string;
  heroEyebrow: string;
  heroTitle: string;
  heroSubtitle: string;
  models: ServiceModel[];
  materials: ServiceMaterial[];
  faqTitle: string;
  faqs: ServiceFaq[];
  ctaProjectOptions: string[];
  waBaseMessage: string;
}

export function ServicePage({
  idPrefix,
  heroEyebrow,
  heroTitle,
  heroSubtitle,
  models,
  materials,
  faqTitle,
  faqs,
  ctaProjectOptions,
  waBaseMessage,
}: ServicePageProps) {
  const [model, setModel] = useState(0);
  const [sent, setSent] = useState(false);
  const m = models[model];

  return (
    <div className="bg-[#F4F2EE] text-[#1A1C1E]">
      <SiteHeader />

      <main className="pt-16 pb-[58px] min-[900px]:pt-[74px] min-[900px]:pb-0">
        {/* Hero */}
        <section className="relative flex min-h-[400px] bg-[#17191B] min-[900px]:min-h-[540px]">
          <div className="absolute inset-0 flex items-center justify-center bg-[#26292D]">
            <span className="font-mono text-[11px] tracking-wide text-[#8A8E92]">
              FOTO REAL OBRA — hero servicio
            </span>
          </div>
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, rgba(13,15,16,.4), rgba(13,15,16,.15) 30%, rgba(13,15,16,.9) 74%)",
            }}
          />
          <div className="relative mt-auto flex w-full flex-col gap-[13px] px-5 pb-[26px] min-[900px]:mx-auto min-[900px]:max-w-[1200px] min-[900px]:px-10 min-[900px]:pb-14">
            <span className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--acc)] before:h-[3px] before:w-4 before:bg-[var(--acc)]">
              {heroEyebrow}
            </span>
            <h1 className="font-display text-[38px] leading-[0.95] font-bold uppercase text-white min-[900px]:text-[58px]">
              {heroTitle}
            </h1>
            <p className="m-0 text-[15px] leading-[1.5] text-[#D9D7D1] min-[900px]:max-w-[620px] min-[900px]:text-[19px]">
              {heroSubtitle}
            </p>
            <Button asChild className="min-[900px]:max-w-[360px]">
              <a href={`tel:${TEL}`}>Pide presupuesto gratis</a>
            </Button>
          </div>
        </section>

        {/* Modelos */}
        <section className="px-5 pt-6 pb-[52px] min-[900px]:mx-auto min-[900px]:max-w-[1200px] min-[900px]:px-10 min-[900px]:py-[88px]">
          <Eyebrow>Modelos</Eyebrow>
          <h2 className="font-display mt-2 text-[31px] font-bold uppercase leading-[0.95]">
            Elige tu pista
          </h2>

          <div className="sticky top-16 z-30 mt-2 flex gap-2 bg-[#F4F2EE] py-3 min-[900px]:top-[74px] min-[900px]:mx-auto min-[900px]:max-w-[1120px]">
            {models.map((mo, i) => (
              <button
                key={mo.tab}
                onClick={() => setModel(i)}
                className={`font-display h-11 flex-1 rounded-lg border-[1.5px] text-[17px] font-semibold uppercase tracking-wide ${
                  model === i
                    ? "border-[#17191B] bg-[#17191B] text-white"
                    : "border-[#D8D4C9] bg-white text-[#565A5E]"
                }`}
              >
                {mo.tab}
              </button>
            ))}
          </div>

          <div className="mt-2 grid grid-cols-2 gap-2.5 min-[900px]:mx-auto min-[900px]:max-w-[820px]">
            <div className="col-span-2 aspect-4/3 rounded-[10px] bg-[#E7E4DC] min-[900px]:aspect-[16/10]" />
            <div className="aspect-3/4 rounded-[10px] bg-[#E7E4DC]" />
            <div className="aspect-3/4 rounded-[10px] bg-[#E7E4DC]" />
          </div>

          <p className="mut m-0 mt-3 text-[15px] leading-[1.55] text-[#565A5E]">{m.desc}</p>

          <div className="mt-3">
            {m.specs.map((s) => (
              <div key={s.k} className="flex justify-between gap-3.5 border-b border-[#E5E2D9] py-[11px] text-sm">
                <span className="shrink-0 text-[#7A7E82]">{s.k}</span>
                <span className="text-right font-semibold">{s.v}</span>
              </div>
            ))}
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="self-center text-xs font-semibold uppercase tracking-wide text-[#565A5E]">
              Ideal para
            </span>
            {m.ideal.map((ic) => (
              <span key={ic} className="rounded-md border-[1.5px] border-[#D8D4C9] bg-white px-2.5 py-1.5 text-xs font-semibold text-[#2A2D30]">
                {ic}
              </span>
            ))}
          </div>

          <div className="mt-1 flex items-baseline justify-between gap-2">
            <span className="text-lg font-bold">{m.price}</span>
          </div>

          <Button asChild className="mt-3 w-full">
            <a href={waHref(`Hola, quiero presupuesto para una ${m.name.toLowerCase()}.`)}>
              <WhatsappIcon className="size-5" />
              {m.cta}
            </a>
          </Button>
        </section>

        {/* Comparativa */}
        <section className="bg-[#17191B] text-white">
          <div className="px-5 pt-11 pb-[52px] min-[900px]:mx-auto min-[900px]:max-w-[1200px] min-[900px]:px-10 min-[900px]:py-[88px]">
            <Eyebrow>Comparativa</Eyebrow>
            <h2 className="font-display mt-2 text-[31px] font-bold uppercase leading-[0.95] text-white">
              Los 3 modelos, frente a frente
            </h2>
            <div className="mt-4 flex flex-col gap-4 min-[900px]:grid min-[900px]:grid-cols-3">
              {models.map((mo) => (
                <div key={mo.name} className="overflow-hidden rounded-[10px] border border-[#E5E2D9] bg-white text-[#1A1C1E]">
                  <div className="flex items-center justify-between bg-[#17191B] px-4 py-3 text-white">
                    <h3 className="font-display m-0 text-xl font-bold uppercase">{mo.name}</h3>
                    <span className="text-[15px] font-bold">{mo.price}</span>
                  </div>
                  <div className="px-4 pt-1.5 pb-3.5">
                    {[mo.specs[1], mo.specs[2], mo.specs[4], { k: "Ideal para", v: mo.ideal.join(" · ") }].map(
                      (r) => (
                        <div key={r.k} className="flex justify-between gap-3.5 border-b border-[#E5E2D9] py-[11px] text-sm last:border-0">
                          <span className="shrink-0 text-[#7A7E82]">{r.k}</span>
                          <span className="text-right font-semibold">{r.v}</span>
                        </div>
                      )
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Materiales */}
        <section className="px-5 py-[52px] min-[900px]:mx-auto min-[900px]:max-w-[1200px] min-[900px]:px-10 min-[900px]:py-[88px]">
          <Eyebrow>Materiales y calidades</Eyebrow>
          <h2 className="font-display mt-2 text-[31px] font-bold uppercase leading-[0.95]">
            Lo que hace que dure 20 años
          </h2>
          <div className="mt-4 grid grid-cols-2 gap-3 min-[900px]:grid-cols-4">
            {materials.map((mt) => (
              <div key={mt.t} className="overflow-hidden rounded-[10px] border border-[#E5E2D9] bg-white">
                <div className="aspect-square bg-[#E7E4DC]" />
                <div className="px-[13px] pt-3 pb-3.5">
                  <h3 className="font-display m-0 mb-0.5 text-lg font-bold uppercase leading-none">{mt.t}</h3>
                  <p className="m-0 text-[12.5px] leading-[1.45] text-[#565A5E]">{mt.d}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Cubiertas */}
        <section className="bg-[#17191B] text-white">
          <div className="px-5 py-[52px] min-[900px]:mx-auto min-[900px]:max-w-[1200px] min-[900px]:px-10 min-[900px]:py-[88px]">
            <Eyebrow>Cubiertas y cerramientos</Eyebrow>
            <h2 className="font-display mt-2 text-[31px] font-bold uppercase leading-[0.95] text-white">
              Juega los 365 días del año
            </h2>
            <p className="m-0 mt-3 text-[15px] leading-[1.55] text-[#A2A7AB]">
              Cubrimos pistas nuevas o existentes con estructuras a medida: lona tensada, panel o cerramiento
              completo. También sobre pistas que no construimos nosotros.
            </p>
            <div className="mt-4 aspect-video rounded-[10px] bg-[#26292D] min-[900px]:max-w-[1120px]" />
            <Button variant="outline" className="mt-4 w-full border-white/30" asChild>
              <a href={waHref("Hola, quiero presupuesto para cubrir una pista.")}>
                <WhatsappIcon className="size-5" />
                Presupuesto de cubierta
              </a>
            </Button>
          </div>
        </section>

        {/* FAQ */}
        <section className="px-5 py-[52px] min-[900px]:mx-auto min-[900px]:max-w-[1200px] min-[900px]:px-10 min-[900px]:py-[88px]">
          <Eyebrow>Preguntas frecuentes</Eyebrow>
          <h2 className="font-display mt-2 text-[31px] font-bold uppercase leading-[0.95]">
            {faqTitle}
          </h2>
          <Accordion type="single" collapsible className="mt-2 min-[900px]:max-w-[900px]">
            {faqs.map((f, i) => (
              <AccordionItem key={i} value={`item-${i}`}>
                <AccordionTrigger>{f.q}</AccordionTrigger>
                <AccordionContent>{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>

        {/* CTA final */}
        <section className="relative overflow-hidden bg-[#17191B]">
          <div className="absolute inset-0 bg-[#0F1113]/90" />
          <div className="relative flex flex-col gap-3.5 px-5 py-14 text-white min-[900px]:mx-auto min-[900px]:max-w-[1200px] min-[900px]:items-start min-[900px]:px-10">
            <Eyebrow>Presupuesto gratis</Eyebrow>
            <h2 className="font-display text-[34px] font-bold uppercase leading-[0.95] text-white">
              ¿Qué pista encaja en tu proyecto?
            </h2>
            <p className="m-0 text-[15px] leading-[1.5] text-[#C9CDD0]">
              Te lo decimos gratis tras una visita técnica. Presupuesto cerrado en 48 h.
            </p>
            <Button variant="whatsapp" asChild>
              <a href={waHref(waBaseMessage)}>
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
            <div className="my-1 flex items-center gap-3 text-xs font-semibold uppercase tracking-wide text-[#7A7E82] before:h-px before:flex-1 before:bg-[#2B3034] after:h-px after:flex-1 after:bg-[#2B3034]">
              o déjanos tus datos
            </div>
            {!sent ? (
              <form
                className="flex flex-col gap-3"
                onSubmit={(e) => {
                  e.preventDefault();
                  setSent(true);
                }}
              >
                <Field id={`${idPrefix}-nom`} label="Nombre" placeholder="Tu nombre" />
                <Field id={`${idPrefix}-tel`} label="Teléfono" placeholder="+34 600 000 000" type="tel" />
                <div>
                  <label htmlFor={`${idPrefix}-tipo`} className="mb-1.5 block text-[11.5px] font-semibold uppercase tracking-wide text-[#9FA4A8]">
                    Modelo que te interesa
                  </label>
                  <select
                    id={`${idPrefix}-tipo`}
                    className="h-[50px] w-full rounded-lg border-[1.5px] border-[#3A3F44] bg-[#212428] px-3.5 text-[15px] font-medium text-white"
                  >
                    {ctaProjectOptions.map((opt) => (
                      <option key={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
                <Button type="submit" className="w-full">
                  Recibir presupuesto gratis
                </Button>
                <p className="m-0 text-[11.5px] leading-[1.5] text-[#7A7E82]">
                  Al enviar aceptas la política de privacidad. Respuesta en menos de 24 h laborables.
                </p>
              </form>
            ) : (
              <div className="flex flex-col gap-3 rounded-[10px] border-[1.5px] border-[var(--acc)]/40 bg-[var(--acc)]/[.12] p-5">
                <h3 className="font-display m-0 text-xl font-bold uppercase leading-none text-white">
                  Recibido. Te contactamos en menos de 24 h laborables.
                </h3>
                <p className="m-0 text-[15px] text-[#C9CDD0]">
                  ¿Prisa? Escríbenos ahora por WhatsApp:
                </p>
                <Button variant="whatsapp" asChild>
                  <a href={waHref()}>
                    <WhatsappIcon className="size-5" />
                    Abrir WhatsApp
                  </a>
                </Button>
              </div>
            )}
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

function Field({
  id,
  label,
  placeholder,
  type = "text",
}: {
  id: string;
  label: string;
  placeholder: string;
  type?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-[11.5px] font-semibold uppercase tracking-wide text-[#9FA4A8]">
        {label}
      </label>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        className="h-[50px] w-full rounded-lg border-[1.5px] border-[#3A3F44] bg-[#212428] px-3.5 text-[15px] font-medium text-white placeholder:text-[#565A5E]"
      />
    </div>
  );
}
