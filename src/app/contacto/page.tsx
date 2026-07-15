"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight, Check, Mail, MapPin, Phone } from "lucide-react";

import { Button } from "@/components/ui/button";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { StickyCta } from "@/components/sticky-cta";
import { CoverIcon, GridIcon, PadelIcon, RenoIcon, WhatsappIcon } from "@/components/icons";
import { TEL, TEL_LABEL, waHref } from "@/lib/site";

const PROJECT_OPTIONS = [
  { key: "padel", icon: PadelIcon, t: "Pista de pádel", d: "Estándar, panorámica o competición" },
  { key: "pickleball", icon: GridIcon, t: "Pista de pickleball", d: "Estándar, recinto o multipista" },
  { key: "cubierta", icon: CoverIcon, t: "Cubierta / cerramiento", d: "Sobre pista nueva o existente" },
  { key: "reforma", icon: RenoIcon, t: "Reforma / reconversión", d: "Césped, vidrio, o de tenis a pádel" },
  { key: "otro", icon: ArrowRight, t: "Otro / no lo tengo claro", d: "Te asesoramos en la visita" },
] as const;

type ProjectKey = (typeof PROJECT_OPTIONS)[number]["key"];

export default function ContactoPage() {
  const [step, setStep] = useState(1);
  const [proj, setProj] = useState<ProjectKey>("padel");
  const [done, setDone] = useState(false);

  const picked = PROJECT_OPTIONS.find((o) => o.key === proj) ?? PROJECT_OPTIONS[0];

  const next = () => {
    setStep((s) => Math.min(3, s + 1));
    window.scrollTo({ top: 0 });
  };
  const back = () => {
    setStep((s) => Math.max(1, s - 1));
    window.scrollTo({ top: 0 });
  };
  const submit = () => {
    setDone(true);
    window.scrollTo({ top: 0 });
  };
  const reset = () => {
    setDone(false);
    setStep(1);
  };

  return (
    <div className="bg-[#F4F2EE] text-[#1A1C1E]">
      <SiteHeader />

      <main className="pt-16 pb-[58px]">
        {/* Cabecera contacto */}
        <section className="bg-[#17191B] px-5 pt-[34px] pb-[30px] text-[#EDEBE5]">
          <Eyebrow>Contacto</Eyebrow>
          <h1 className="font-display mt-2 text-[36px] font-bold uppercase leading-[0.95] text-white">
            Pide tu presupuesto gratis
          </h1>
          <p className="m-0 mt-2 text-[15px] leading-[1.55] text-[#C9CDD0]">
            Respondemos en menos de 24 h laborables — normalmente mucho antes.
          </p>
          <div className="mt-[18px] grid grid-cols-2 gap-2.5">
            <a
              href={waHref()}
              className="flex flex-col gap-2 rounded-[10px] border border-[#25D366] bg-[#25D366] p-4 text-[#062B14]"
            >
              <WhatsappIcon className="size-5" />
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-wide opacity-75">
                  Escríbenos
                </div>
                <div className="font-display text-[19px] font-bold uppercase leading-none">
                  WhatsApp
                </div>
              </div>
            </a>
            <a
              href={`tel:${TEL}`}
              className="flex flex-col gap-2 rounded-[10px] border border-[#2B3034] bg-[#212428] p-4 text-white"
            >
              <Phone className="size-5 text-[var(--acc)]" />
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-wide opacity-70">
                  Llámanos
                </div>
                <div className="font-display text-[19px] font-bold uppercase leading-none">
                  Teléfono
                </div>
              </div>
            </a>
          </div>
        </section>

        {/* Formulario multipaso */}
        <section className="px-5 pt-[26px] pb-10">
          {!done ? (
            <>
              <div className="mb-[22px] flex items-center gap-1.5">
                {[1, 2, 3].map((n) => (
                  <span
                    key={n}
                    className={`h-[5px] flex-1 rounded-full ${
                      step >= n ? "bg-[var(--acc)]" : "bg-[#DAD6CB]"
                    }`}
                  />
                ))}
              </div>
              <p className="m-0 mb-1.5 text-xs font-semibold text-[#7A7E82]">Paso {step} de 3</p>

              {step === 1 && (
                <div>
                  <h2 className="font-display m-0 mb-1 text-[26px] font-bold uppercase leading-none">
                    ¿Qué proyecto tienes en mente?
                  </h2>
                  <p className="m-0 mb-5 text-sm text-[#565A5E]">
                    Elige lo que mejor encaje. Podemos afinarlo luego.
                  </p>
                  <div className="flex flex-col gap-2.5">
                    {PROJECT_OPTIONS.map((o) => {
                      const on = proj === o.key;
                      return (
                        <button
                          key={o.key}
                          onClick={() => setProj(o.key)}
                          className={`flex w-full items-center gap-3 rounded-[10px] border-[1.5px] bg-white p-4 text-left ${
                            on ? "border-[var(--acc)] bg-[var(--acc)]/[.07]" : "border-[#D8D4C9]"
                          }`}
                        >
                          <span
                            className={`flex size-10 shrink-0 items-center justify-center rounded-lg ${
                              on ? "bg-[var(--acc)] text-[#07130C]" : "bg-[#F0EEE7] text-[#33363A]"
                            }`}
                          >
                            <o.icon className="size-5" />
                          </span>
                          <div>
                            <p className="m-0 text-[15.5px] font-semibold">{o.t}</p>
                            <p className="m-0 mt-0.5 text-[12.5px] text-[#7A7E82]">{o.d}</p>
                          </div>
                          <span
                            className={`ml-auto flex size-[22px] shrink-0 items-center justify-center rounded-full border-2 ${
                              on ? "border-[var(--acc)] bg-[var(--acc)] text-[#07130C]" : "border-[#C9C5BA]"
                            }`}
                          >
                            {on && <Check className="size-3.5" />}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                  <div className="mt-6 flex gap-2.5">
                    <Button className="flex-1" onClick={next}>
                      Continuar <ArrowRight className="size-5" />
                    </Button>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div>
                  <h2 className="font-display m-0 mb-1 text-[26px] font-bold uppercase leading-none">
                    ¿Dónde y para cuándo?
                  </h2>
                  <p className="m-0 mb-5 text-sm text-[#565A5E]">
                    Nos ayuda a estimar desplazamiento y plazos.
                  </p>
                  <FormField id="c-loc" label="Localidad y país">
                    <input id="c-loc" className={inputCls} placeholder="Ej. Valencia, España" />
                  </FormField>
                  <FormField id="c-when" label="¿Para cuándo?">
                    <select id="c-when" className={inputCls}>
                      <option>Lo antes posible</option>
                      <option>En 1–3 meses</option>
                      <option>En 3–6 meses</option>
                      <option>Solo estoy informándome</option>
                    </select>
                  </FormField>
                  <FormField id="c-msg" label="Cuéntanos más (opcional)">
                    <textarea
                      id="c-msg"
                      className={`${inputCls} h-auto min-h-[90px] resize-y py-3`}
                      placeholder="Superficie disponible, nº de pistas, si ya tienes solera…"
                    />
                  </FormField>
                  <div className="mt-6 flex gap-2.5">
                    <Button variant="ghost" onClick={back} aria-label="Atrás">
                      <ArrowLeft className="size-5" />
                    </Button>
                    <Button className="flex-1" onClick={next}>
                      Continuar <ArrowRight className="size-5" />
                    </Button>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div>
                  <h2 className="font-display m-0 mb-1 text-[26px] font-bold uppercase leading-none">
                    ¿Cómo te contactamos?
                  </h2>
                  <p className="m-0 mb-5 text-sm text-[#565A5E]">
                    Solo lo justo para enviarte el presupuesto.
                  </p>
                  <FormField id="c-nom" label="Nombre">
                    <input id="c-nom" className={inputCls} placeholder="Tu nombre" />
                  </FormField>
                  <FormField id="c-tel" label="Teléfono / WhatsApp">
                    <input id="c-tel" type="tel" className={inputCls} placeholder="+34 600 000 000" />
                  </FormField>
                  <FormField id="c-email" label="Email (opcional)">
                    <input id="c-email" type="email" className={inputCls} placeholder="tucorreo@ejemplo.com" />
                  </FormField>
                  <div className="rounded-[10px] bg-[#F0EEE7] p-4">
                    <div className="flex justify-between gap-3 py-1.5 text-[13.5px]">
                      <span className="text-[#7A7E82]">Proyecto</span>
                      <span className="text-right font-semibold">{picked.t}</span>
                    </div>
                    <div className="flex justify-between gap-3 py-1.5 text-[13.5px]">
                      <span className="text-[#7A7E82]">Respuesta</span>
                      <span className="text-right font-semibold">&lt; 24 h laborables</span>
                    </div>
                  </div>
                  <p className="m-0 mt-3.5 text-[11.5px] leading-[1.5] text-[#7A7E82]">
                    Al enviar aceptas la política de privacidad.
                  </p>
                  <div className="mt-6 flex gap-2.5">
                    <Button variant="ghost" onClick={back} aria-label="Atrás">
                      <ArrowLeft className="size-5" />
                    </Button>
                    <Button className="flex-1" onClick={submit}>
                      Enviar solicitud
                    </Button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center gap-3.5 py-5 text-center">
              <span className="flex size-[74px] items-center justify-center rounded-full bg-[var(--acc)]/[.14] text-[var(--accd)]">
                <Check className="size-[34px]" />
              </span>
              <h2 className="font-display m-0 text-[26px] font-bold uppercase leading-none">
                ¡Solicitud enviada!
              </h2>
              <p className="m-0 text-sm text-[#565A5E]">
                Te contactamos en menos de 24 h laborables para tu <strong>{picked.t}</strong>.
              </p>
              <Button variant="whatsapp" className="w-full" asChild>
                <a href={waHref()}>
                  <WhatsappIcon className="size-5" />
                  ¿Prisa? Escríbenos por WhatsApp
                </a>
              </Button>
              <Button variant="ghost" className="w-full" onClick={reset}>
                Enviar otra solicitud
              </Button>
            </div>
          )}
        </section>

        {/* Datos de contacto */}
        <section className="px-5 py-11">
          <Eyebrow>Otras vías</Eyebrow>
          <h2 className="font-display mt-2 text-[31px] font-bold uppercase leading-[0.95]">
            Datos de contacto
          </h2>
          <div className="mt-2">
            <InfoLine icon={Phone} title="Teléfono">
              <a href={`tel:${TEL}`}>{TEL_LABEL}</a> · L–V 8:00–18:00
            </InfoLine>
            <InfoLine icon={WhatsappIcon} title="WhatsApp">
              <a href={waHref()}>Chat directo</a> · respuesta &lt; 1 h laborable
            </InfoLine>
            <InfoLine icon={Mail} title="Email">
              info@padelalbufera.com
            </InfoLine>
            <InfoLine icon={MapPin} title="Dónde estamos" last>
              C/ Dirección física, 00 · 46000 Valencia
              <br />
              Cobertura: España · Francia · Alemania · Bélgica
            </InfoLine>
          </div>
          <div className="mt-[18px] aspect-[16/10] rounded-[10px] bg-[#E7E4DC]" />
        </section>
      </main>

      <SiteFooter />
      <StickyCta />
    </div>
  );
}

const inputCls =
  "h-[50px] w-full rounded-lg border-[1.5px] border-[#D8D4C9] bg-white px-3.5 text-[15px] font-medium text-[#1A1C1E] box-border";

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--acc)] before:h-[3px] before:w-4 before:bg-[var(--acc)]">
      {children}
    </span>
  );
}

function FormField({
  id,
  label,
  children,
}: {
  id: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-3.5">
      <label htmlFor={id} className="mb-1.5 block text-[11.5px] font-semibold uppercase tracking-wide text-[#565A5E]">
        {label}
      </label>
      {children}
    </div>
  );
}

function InfoLine({
  icon: IconComp,
  title,
  children,
  last = false,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  children: React.ReactNode;
  last?: boolean;
}) {
  return (
    <div className={`flex items-start gap-3.5 py-4 ${last ? "" : "border-b border-[#E2DFD6]"}`}>
      <span className="flex size-11 shrink-0 items-center justify-center rounded-[10px] border border-[#E5E2D9] bg-white text-[var(--accd)]">
        <IconComp className="size-5" />
      </span>
      <div>
        <p className="m-0 text-[15px] font-bold">{title}</p>
        <p className="m-0 mt-0.5 text-sm leading-[1.5] text-[#565A5E]">{children}</p>
      </div>
    </div>
  );
}
