import type { Metadata } from "next";
import Image from "next/image";
import { Camera, Check, Clock, Euro, FileText, Key, MapPin, Phone, ShieldCheck, Wrench } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";

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

import { BLUR } from "@/lib/image-blur";
import { metadataPagina } from "@/lib/metadata";
import { WhatsAppLink } from "@/components/conversion/whatsapp-link";
import { PhoneLink } from "@/components/conversion/phone-link";
import { PhoneNumber } from "@/components/conversion/phone-number";

const STEP_ICONS = [MapPin, FileText, Wrench, Key];
const PLEDGE_ICONS = [Euro, Clock, Camera, ShieldCheck];
const HERO_IMG = { src: "/pista-padel-cesped-verde-nave-industrial.jpg", alt: "Equipo trabajando en la construcción de una pista de pádel junto a una nave industrial" };
const STEP_IMAGES: ({ src: string; alt: string } | null)[] = [
  { src: "/pista-padel-cristal-panoramica-rural.jpg", alt: "Visita técnica y estudio de viabilidad en la parcela de una futura pista de pádel" },
  { src: "/pista-padel-cesped-verde-campo-construccion.jpg", alt: "Redacción del proyecto técnico y presupuesto cerrado antes de iniciar la obra" },
  { src: "/pista-padel-obra-nocturna-grua.jpg", alt: "Obra de pista de pádel con grúa e iluminación al atardecer" },
  { src: "/dos-pistas-padel-azules-vista-aerea.jpg", alt: "Dos pistas de pádel terminadas y listas para jugar, vista aérea" },
];

interface Step {
  t: string;
  dur: string;
  tag: string;
  d: string;
  deliv: string[];
}

interface Pledge {
  t: string;
  d: string;
}

interface FaqItem {
  q: string;
  a: string;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "process" });

  return metadataPagina({
    locale,
    ruta: "/proceso",
    title: `${t("hero.h1")} | Pádel & Pickleball Albufera`,
    description: t("hero.sub"),
  });
}

export default async function ProcesoPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("process");
  const tc = await getTranslations();
  const steps = t.raw("timeline.steps") as Step[];
  const pledges = t.raw("pledges.items") as Pledge[];
  const faqs = t.raw("faq.items") as FaqItem[];

  return (
    <div className="bg-[#F4F2EE] text-[#1A1C1E]">
      <SiteHeader />

      <main className="pt-16 pb-[58px] min-[1100px]:pt-[74px] min-[1100px]:pb-0">
        {/* Hero */}
        <section className="relative flex min-h-[360px] bg-[#17191B] min-[900px]:min-h-[440px]">
          <div className="absolute inset-0">
            <Image
              src={HERO_IMG.src}
              alt={HERO_IMG.alt}
              fill
              priority
              sizes="100vw"
              quality={70}
              placeholder="blur"
              blurDataURL={BLUR[HERO_IMG.src]}
              className="object-cover"
            />
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
              {t("hero.eyebrow")}
            </span>
            <h1 className="font-display text-[38px] leading-[0.95] font-bold uppercase text-white min-[900px]:text-[58px]">
              {t("hero.h1")}
            </h1>
            <p className="m-0 text-[15px] leading-[1.5] text-[#D9D7D1]">
              {t("hero.sub")}
            </p>
          </div>
        </section>

        {/* Timeline */}
        <section className="px-5 py-[52px] min-[900px]:mx-auto min-[900px]:max-w-[1200px] min-[900px]:px-10 min-[900px]:py-[88px]">
          <Eyebrow>{t("timeline.eyebrow")}</Eyebrow>
          <h2 className="font-display mt-2 text-[31px] font-bold uppercase leading-[0.95]">
            {t("timeline.title")}
          </h2>
          <div className="relative mt-4 pl-[52px] before:absolute before:top-2 before:bottom-6 before:left-[19px] before:w-0.5 before:bg-[#DAD6CB] min-[900px]:max-w-[760px]">
            {steps.map((s, i) => {
              const Icon = STEP_ICONS[i];
              return (
                <div key={s.t} className="relative pb-[30px]">
                  <span className="font-display absolute -left-[52px] top-0 flex size-10 items-center justify-center rounded-full bg-[var(--acc)] text-lg font-bold text-[#07130C] shadow-[0_0_0_5px_#F4F2EE]">
                    {i + 1}
                  </span>
                  <p className="m-0 mb-0.5 text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--accd)]">
                    {t("timeline.phaseLabel")} {i + 1} · {s.dur}
                  </p>
                  <h3 className="font-display m-0 mb-1.5 text-[23px] font-bold uppercase leading-none">{s.t}</h3>
                  <p className="m-0 mb-3 text-[14.5px] leading-[1.55] text-[#565A5E]">{s.d}</p>
                  <span className="inline-flex items-center gap-1.5 rounded-md border border-[#E5E2D9] bg-white px-2.5 py-1.5 text-[12.5px] font-semibold text-[#2A2D30]">
                    <Icon className="size-[15px]" />
                    {s.tag}
                  </span>
                  <div className="relative mt-3.5 aspect-[16/10] overflow-hidden rounded-[10px] bg-[#E7E4DC]">
                    {STEP_IMAGES[i] && (
                      <Image
                        src={STEP_IMAGES[i]!.src}
                        alt={STEP_IMAGES[i]!.alt}
                        fill
                        sizes="(max-width: 900px) 100vw, 760px"
                        quality={70}
                        placeholder="blur"
                        blurDataURL={BLUR[STEP_IMAGES[i]!.src]}
                        className="object-cover"
                      />
                    )}
                  </div>
                  <ul className="m-0 mt-3 flex list-none flex-col gap-2 p-0">
                    {s.deliv.map((d) => (
                      <li key={d} className="flex items-start gap-2.5 text-sm leading-[1.4] text-[#3A3D40]">
                        <Check className="mt-0.5 size-[17px] shrink-0 text-[var(--accd)]" />
                        {d}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </section>

        {/* CTA intermedio */}
        <section className="px-5 pb-[52px] min-[900px]:mx-auto min-[900px]:max-w-[1200px] min-[900px]:px-10 min-[900px]:pb-[88px]">
          <div className="flex flex-col items-start gap-3 rounded-2xl border border-[#E5E2D9] bg-white p-6 min-[900px]:max-w-[760px] min-[900px]:flex-row min-[900px]:items-center min-[900px]:justify-between min-[900px]:gap-6">
            <div>
              <h3 className="font-display m-0 text-xl font-bold uppercase leading-none">
                {t("midCta.title")}
              </h3>
              <p className="m-0 mt-1.5 text-sm leading-[1.5] text-[#565A5E]">{t("midCta.sub")}</p>
            </div>
            <div className="flex w-full flex-col gap-2 min-[900px]:w-auto min-[900px]:shrink-0 min-[900px]:flex-row">
              <Button variant="whatsapp" asChild>
                <WhatsAppLink placement="proceso" mensaje={"Hola, quiero reservar la visita técnica gratuita."}>
                  <WhatsappIcon className="size-5" />
                  {tc("common.whatsappDirect")}
                </WhatsAppLink>
              </Button>
              <Button variant="ghost" asChild>
                <PhoneLink placement="proceso">
                  <Phone className="size-5" />
                  {tc("common.call")}
                </PhoneLink>
              </Button>
            </div>
          </div>
        </section>

        {/* Compromisos */}
        <section className="bg-[#17191B] text-white">
          <div className="px-5 py-[52px] min-[900px]:mx-auto min-[900px]:max-w-[1200px] min-[900px]:px-10 min-[900px]:py-[88px]">
            <Eyebrow>{t("pledges.eyebrow")}</Eyebrow>
            <h2 className="font-display mt-2 text-[31px] font-bold uppercase leading-[0.95] text-white">
              {t("pledges.title")}
            </h2>
            <div className="mt-4 flex flex-col gap-3">
              {pledges.map((p, i) => {
                const Icon = PLEDGE_ICONS[i];
                return (
                  <div key={p.t} className="flex items-start gap-3.5 rounded-xl border border-[#2B3034] bg-[#212428] p-[22px]">
                    <span className="flex size-[46px] shrink-0 items-center justify-center rounded-[10px] bg-[var(--acc)]/[.14] text-[var(--acc)]">
                      <Icon className="size-5" />
                    </span>
                    <div>
                      <h3 className="font-display m-0 mb-1 text-lg font-bold uppercase leading-none">{p.t}</h3>
                      <p className="m-0 text-[13.5px] leading-[1.5] text-[#A2A7AB]">{p.d}</p>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-4 flex flex-col items-center gap-1.5 rounded-2xl border-2 border-[var(--acc)] bg-[var(--acc)]/[.08] px-[22px] py-[26px] text-center min-[900px]:mx-auto min-[900px]:max-w-[560px]">
              <span className="font-mono text-[9.5px] uppercase tracking-wide text-[#8A8E92]">sello / logo garantía</span>
              <div className="font-display text-[76px] leading-[0.85] font-bold text-[var(--acc)]">{t("pledges.sealYears")}</div>
              <div className="font-display text-[22px] font-bold uppercase tracking-wide">{t("pledges.sealWord")}</div>
              <p className="m-0 text-[13px] text-[#A2A7AB]">{t("pledges.sealNote")}</p>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="px-5 py-[52px] min-[900px]:mx-auto min-[900px]:max-w-[1200px] min-[900px]:px-10 min-[900px]:py-[88px]">
          <Eyebrow>{t("faq.eyebrow")}</Eyebrow>
          <h2 className="font-display mt-2 text-[31px] font-bold uppercase leading-[0.95]">
            {t("faq.title")}
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
        <section className="bg-[#17191B] text-white">
          <div className="flex flex-col items-start gap-3.5 px-5 py-14 min-[900px]:mx-auto min-[900px]:max-w-[1200px] min-[900px]:px-10">
            <Eyebrow>{t("cta.eyebrow")}</Eyebrow>
            <h2 className="font-display text-[34px] font-bold uppercase leading-[0.95] text-white">
              {t("cta.title")}
            </h2>
            <p className="m-0 text-[15px] leading-[1.5] text-[#C9CDD0]">
              {t("cta.sub")}
            </p>
            <Button variant="whatsapp" asChild>
              <WhatsAppLink placement="proceso" mensaje={"Hola, quiero reservar la visita técnica gratuita."}>
                <WhatsappIcon className="size-5" />
                {tc("common.whatsappDirect")}
              </WhatsAppLink>
            </Button>
            <Button variant="outline" asChild>
              <PhoneLink placement="proceso">
                <Phone className="size-5" />
                {tc("common.call")} · <PhoneNumber />
              </PhoneLink>
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
