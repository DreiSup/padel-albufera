"use client";

import { useState } from "react";
import Image from "next/image";
import { Phone } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

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
import { specLabel } from "@/lib/spec-labels";
import { BLUR } from "@/lib/image-blur";
import type { Locale } from "@/i18n/routing";

interface ServiceModel {
  name: string;
  cta: string;
  desc: string;
  price: string;
  specs: Record<string, string>;
  ideal: string[];
}

interface ServiceMaterial {
  t: string;
  d: string;
}

interface ServiceFaqItem {
  q: string;
  a: string;
}

const SERVICE_IMAGES: Record<
  "padel" | "pickleball",
  {
    hero: { src: string; alt: string };
    gallery: [{ src: string; alt: string }, { src: string; alt: string }, { src: string; alt: string }];
    materials: { src: string; alt: string }[];
  }
> = {
  padel: {
    hero: {
      src: "/pista-padel-obra-vista-aerea-cristales.jpg",
      alt: "Obra de pista de pádel en construcción, vista aérea con paneles de cristal templado listos para montar",
    },
    gallery: [
      { src: "/dos-pistas-padel-azules-vista-aerea.jpg", alt: "Dos pistas de pádel de césped azul terminadas, vista aérea" },
      { src: "/pista-padel-cristal-zona-industrial.jpg", alt: "Pista de pádel con paredes de cristal en zona industrial" },
      { src: "/pista-padel-azul-cristal-jardin.jpg", alt: "Pista de pádel de césped azul con cerramiento de cristal en jardín arbolado" },
    ],
    materials: [
      { src: "/junta-cesped-artificial-pista-padel.jpg", alt: "Instalación de la junta entre rollos de césped artificial de una pista de pádel" },
      { src: "/pista-padel-completa-cristales-exterior.jpg", alt: "Detalle del cerramiento de cristal templado de una pista de pádel" },
      { src: "/pintado-lineas-pista-padel-azul.jpg", alt: "Operario pintando las líneas sobre la estructura de una pista de pádel azul" },
      { src: "/pista-padel-obra-nocturna-grua.jpg", alt: "Iluminación LED de una pista de pádel encendida al atardecer" },
    ],
  },
  pickleball: {
    hero: {
      src: "/pistas-pickleball-multiples-vista-aerea.jpg",
      alt: "Vista aérea de varias pistas de pickleball recién pintadas",
    },
    gallery: [
      { src: "/pista-padel-cesped-verde-arboleda-nublado.jpg", alt: "Pista de césped verde con cerramiento de malla junto a una arboleda" },
      { src: "/pista-padel-cesped-verde-campo-construccion.jpg", alt: "Pista de césped verde en construcción rodeada de campo" },
      { src: "/pista-padel-cesped-verde-nave-industrial.jpg", alt: "Pista de césped verde con cerramiento de malla junto a una nave industrial" },
    ],
    materials: [],
  },
};

export function ServicePage({
  ns,
  idPrefix,
  waBaseMessage,
}: {
  ns: "padel" | "pickleball";
  idPrefix: string;
  waBaseMessage: string;
}) {
  const t = useTranslations(ns);
  const tc = useTranslations();
  const locale = useLocale() as Locale;
  const [model, setModel] = useState(0);
  const [sent, setSent] = useState(false);

  const tabs = t.raw("models.tabs") as string[];
  const items = t.raw("models.items") as ServiceModel[];
  const materials = t.raw("materials.items") as ServiceMaterial[];
  const faqs = t.raw("faq.items") as ServiceFaqItem[];
  const m = items[model];
  const images = SERVICE_IMAGES[ns];
  const ctaProjectOptions = [...items.map((i) => i.name), t("cover.cta")];

  return (
    <div className="bg-[#F4F2EE] text-[#1A1C1E]">
      <SiteHeader />

      <main className="pt-16 pb-[58px] min-[1100px]:pt-[74px] min-[1100px]:pb-0">
        {/* Hero */}
        <section className="relative flex min-h-[400px] bg-[#17191B] min-[900px]:min-h-[540px]">
          <div className="absolute inset-0">
            <Image
              src={images.hero.src}
              alt={images.hero.alt}
              fill
              sizes="100vw"
              quality={70}
              placeholder="blur"
              blurDataURL={BLUR[images.hero.src]}
              className="object-cover"
            />
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
              {t("hero.eyebrow")}
            </span>
            <h1 className="font-display text-[38px] leading-[0.95] font-bold uppercase text-white min-[900px]:text-[58px]">
              {t("hero.h1")}
            </h1>
            <p className="m-0 text-[15px] leading-[1.5] text-[#D9D7D1] min-[900px]:max-w-[620px] min-[900px]:text-[19px]">
              {t("hero.sub")}
            </p>
            <Button asChild className="min-[900px]:max-w-[360px]">
              <a href={`tel:${TEL}`}>{tc("common.requestQuote")}</a>
            </Button>
          </div>
        </section>

        {/* Modelos */}
        <section className="px-5 pt-6 pb-[52px] min-[900px]:mx-auto min-[900px]:max-w-[1200px] min-[900px]:px-10 min-[900px]:py-[88px]">
          <Eyebrow>{t("models.eyebrow")}</Eyebrow>
          <h2 className="font-display mt-2 text-[31px] font-bold uppercase leading-[0.95]">
            {t("models.title")}
          </h2>

          <div className="sticky top-16 z-30 mt-2 flex gap-2 bg-[#F4F2EE] py-3 min-[1100px]:top-[74px] min-[900px]:mx-auto min-[900px]:max-w-[1120px]">
            {tabs.map((tab, i) => (
              <button
                key={tab}
                onClick={() => setModel(i)}
                className={`font-display h-11 flex-1 rounded-lg border-[1.5px] text-[17px] font-semibold uppercase tracking-wide ${
                  model === i
                    ? "border-[#17191B] bg-[#17191B] text-white"
                    : "border-[#D8D4C9] bg-white text-[#565A5E]"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="mt-2 grid grid-cols-2 gap-2.5 min-[900px]:mx-auto min-[900px]:max-w-[820px]">
            <div className="relative col-span-2 aspect-4/3 overflow-hidden rounded-[10px] bg-[#E7E4DC] min-[900px]:aspect-[16/10]">
              <Image
                src={images.gallery[0].src}
                alt={images.gallery[0].alt}
                fill
                sizes="(max-width: 900px) 100vw, 820px"
                quality={70}
                placeholder="blur"
                blurDataURL={BLUR[images.gallery[0].src]}
                className="object-cover"
              />
            </div>
            <div className="relative aspect-3/4 overflow-hidden rounded-[10px] bg-[#E7E4DC]">
              <Image
                src={images.gallery[1].src}
                alt={images.gallery[1].alt}
                fill
                sizes="(max-width: 900px) 50vw, 400px"
                quality={70}
                placeholder="blur"
                blurDataURL={BLUR[images.gallery[1].src]}
                className="object-cover"
              />
            </div>
            <div className="relative aspect-3/4 overflow-hidden rounded-[10px] bg-[#E7E4DC]">
              <Image
                src={images.gallery[2].src}
                alt={images.gallery[2].alt}
                fill
                sizes="(max-width: 900px) 50vw, 400px"
                quality={70}
                placeholder="blur"
                blurDataURL={BLUR[images.gallery[2].src]}
                className="object-cover"
              />
            </div>
          </div>

          <p className="mut m-0 mt-3 text-[15px] leading-[1.55] text-[#565A5E]">{m.desc}</p>

          <div className="mt-3">
            {Object.entries(m.specs).map(([k, v]) => (
              <div key={k} className="flex justify-between gap-3.5 border-b border-[#E5E2D9] py-[11px] text-sm">
                <span className="shrink-0 text-[#7A7E82]">{specLabel(locale, k)}</span>
                <span className="text-right font-semibold">{v}</span>
              </div>
            ))}
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="self-center text-xs font-semibold uppercase tracking-wide text-[#565A5E]">
              {t("models.idealFor")}
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
            <a href={waHref(`${waBaseMessage} (${m.name}).`)}>
              <WhatsappIcon className="size-5" />
              {m.cta}
            </a>
          </Button>
        </section>

        {/* Comparativa */}
        <section className="bg-[#17191B] text-white">
          <div className="px-5 pt-11 pb-[52px] min-[900px]:mx-auto min-[900px]:max-w-[1200px] min-[900px]:px-10 min-[900px]:py-[88px]">
            <Eyebrow>{t("compare.eyebrow")}</Eyebrow>
            <h2 className="font-display mt-2 text-[31px] font-bold uppercase leading-[0.95] text-white">
              {t("compare.title")}
            </h2>
            <div className="mt-4 flex flex-col gap-4 min-[900px]:grid min-[900px]:grid-cols-3">
              {items.map((mo) => {
                const entries = Object.entries(mo.specs);
                const rows = [entries[1], entries[2], entries[4]].filter(Boolean) as [string, string][];
                return (
                  <div key={mo.name} className="overflow-hidden rounded-[10px] border border-[#E5E2D9] bg-white text-[#1A1C1E]">
                    <div className="flex items-center justify-between bg-[#17191B] px-4 py-3 text-white">
                      <h3 className="font-display m-0 text-xl font-bold uppercase">{mo.name}</h3>
                      <span className="text-[15px] font-bold">{mo.price}</span>
                    </div>
                    <div className="px-4 pt-1.5 pb-3.5">
                      {[...rows, [t("models.idealFor"), mo.ideal.join(" · ")] as [string, string]].map(
                        ([k, v]) => (
                          <div key={k} className="flex justify-between gap-3.5 border-b border-[#E5E2D9] py-[11px] text-sm last:border-0">
                            <span className="shrink-0 text-[#7A7E82]">{specLabel(locale, k)}</span>
                            <span className="text-right font-semibold">{v}</span>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Materiales */}
        <section className="px-5 py-[52px] min-[900px]:mx-auto min-[900px]:max-w-[1200px] min-[900px]:px-10 min-[900px]:py-[88px]">
          <Eyebrow>{t("materials.eyebrow")}</Eyebrow>
          <h2 className="font-display mt-2 text-[31px] font-bold uppercase leading-[0.95]">
            {t("materials.title")}
          </h2>
          <div className="mt-4 grid grid-cols-2 gap-3 min-[900px]:grid-cols-4">
            {materials.map((mt, i) => {
              const img = images.materials[i];
              return (
                <div key={mt.t} className="overflow-hidden rounded-[10px] border border-[#E5E2D9] bg-white">
                  <div className="relative aspect-square bg-[#E7E4DC]">
                    {img && (
                      <Image
                        src={img.src}
                        alt={img.alt}
                        fill
                        sizes="(max-width: 900px) 50vw, 280px"
                        quality={70}
                        placeholder="blur"
                        blurDataURL={BLUR[img.src]}
                        className="object-cover"
                      />
                    )}
                  </div>
                  <div className="px-[13px] pt-3 pb-3.5">
                    <h3 className="font-display m-0 mb-0.5 text-lg font-bold uppercase leading-none">{mt.t}</h3>
                    <p className="m-0 text-[12.5px] leading-[1.45] text-[#565A5E]">{mt.d}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Cubiertas */}
        <section className="bg-[#17191B] text-white">
          <div className="px-5 py-[52px] min-[900px]:mx-auto min-[900px]:max-w-[1200px] min-[900px]:px-10 min-[900px]:py-[88px]">
            <Eyebrow>{t("cover.eyebrow")}</Eyebrow>
            <h2 className="font-display mt-2 text-[31px] font-bold uppercase leading-[0.95] text-white">
              {t("cover.title")}
            </h2>
            <p className="m-0 mt-3 text-[15px] leading-[1.55] text-[#A2A7AB]">
              {t("cover.desc")}
            </p>
            <div className="mt-4 aspect-video rounded-[10px] bg-[#26292D] min-[900px]:max-w-[1120px]" />
            <Button variant="outline" className="mt-4 w-full border-white/30" asChild>
              <a href={waHref(tc("common.waMessage"))}>
                <WhatsappIcon className="size-5" />
                {t("cover.cta")}
              </a>
            </Button>
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
        <section className="relative overflow-hidden bg-[#17191B]">
          <div className="absolute inset-0 bg-[#0F1113]/90" />
          <div className="relative flex flex-col gap-3.5 px-5 py-14 text-white min-[900px]:mx-auto min-[900px]:max-w-[1200px] min-[900px]:items-start min-[900px]:px-10">
            <Eyebrow>{tc("common.requestQuote")}</Eyebrow>
            <h2 className="font-display text-[34px] font-bold uppercase leading-[0.95] text-white">
              {t("cta.title")}
            </h2>
            <p className="m-0 text-[15px] leading-[1.5] text-[#C9CDD0]">
              {t("cta.sub")}
            </p>
            <Button variant="whatsapp" asChild>
              <a href={waHref(waBaseMessage)}>
                <WhatsappIcon className="size-5" />
                {tc("common.whatsappDirect")}
              </a>
            </Button>
            <Button variant="outline" asChild>
              <a href={`tel:${TEL}`}>
                <Phone className="size-5" />
                {tc("common.call")} · {TEL_LABEL}
              </a>
            </Button>
            <div className="my-1 flex items-center gap-3 text-xs font-semibold uppercase tracking-wide text-[#7A7E82] before:h-px before:flex-1 before:bg-[#2B3034] after:h-px after:flex-1 after:bg-[#2B3034]">
              {tc("cta.or")}
            </div>
            {!sent ? (
              <form
                className="flex flex-col gap-3"
                onSubmit={(e) => {
                  e.preventDefault();
                  setSent(true);
                }}
              >
                <Field id={`${idPrefix}-nom`} label={tc("cta.nameLabel")} placeholder={tc("cta.namePh")} />
                <Field id={`${idPrefix}-tel`} label={tc("cta.phoneLabel")} placeholder="+34 600 000 000" type="tel" />
                <div>
                  <label htmlFor={`${idPrefix}-tipo`} className="mb-1.5 block text-[11.5px] font-semibold uppercase tracking-wide text-[#9FA4A8]">
                    {t("models.title")}
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
                  {tc("cta.submit")}
                </Button>
                <p className="m-0 text-[11.5px] leading-[1.5] text-[#7A7E82]">
                  {tc("cta.privacy")}
                </p>
              </form>
            ) : (
              <div className="flex flex-col gap-3 rounded-[10px] border-[1.5px] border-[var(--acc)]/40 bg-[var(--acc)]/[.12] p-5">
                <h3 className="font-display m-0 text-xl font-bold uppercase leading-none text-white">
                  {tc("cta.successTitle")}
                </h3>
                <p className="m-0 text-[15px] text-[#C9CDD0]">
                  {tc("cta.successSub")}
                </p>
                <Button variant="whatsapp" asChild>
                  <a href={waHref(tc("common.waMessage"))}>
                    <WhatsappIcon className="size-5" />
                    {tc("cta.openWhatsApp")}
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
