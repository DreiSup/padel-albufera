import Image from "next/image";
import { getLocale, getTranslations } from "next-intl/server";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { StickyCta } from "@/components/sticky-cta";
import { ModelSelector } from "@/components/service/model-selector";
import { ServiceCtaForm } from "@/components/service/cta-form";
import { Button } from "@/components/ui/button";
import { WhatsappIcon } from "@/components/icons";
import { TEL, waHref } from "@/lib/site";
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

type Gallery = [{ src: string; alt: string }, { src: string; alt: string }, { src: string; alt: string }];

const SERVICE_IMAGES: Record<
  "padel" | "pickleball",
  {
    hero: { src: string; alt: string };
    gallery: [Gallery, Gallery, Gallery];
    materials: { src: string; alt: string }[];
  }
> = {
  padel: {
    hero: {
      src: "/pista-padel-obra-vista-aerea-cristales.jpg",
      alt: "Obra de pista de pádel en construcción, vista aérea con paneles de cristal templado listos para montar",
    },
    gallery: [
      [
        { src: "/pista-padel-completa-cristales-exterior.jpg", alt: "Pista de pádel estándar con cerramiento de cristal terminada" },
        { src: "/junta-cesped-artificial-pista-padel.jpg", alt: "Instalación de la junta entre rollos de césped artificial de una pista de pádel estándar" },
        { src: "/pintado-lineas-pista-padel-azul.jpg", alt: "Operario pintando las líneas de una pista de pádel estándar" },
      ],
      [
        { src: "/pista-padel-cristal-panoramica-rural.jpg", alt: "Pista de pádel panorámica con vidrio sin postes intermedios" },
        { src: "/pista-padel-cristal-zona-industrial.jpg", alt: "Pista de pádel panorámica con paredes de cristal en zona industrial" },
        { src: "/pista-padel-azul-cristal-jardin.jpg", alt: "Pista de pádel panorámica de césped azul con cerramiento de cristal en jardín" },
      ],
      [
        { src: "/pista-padel-obra-vista-aerea-cristales.jpg", alt: "Obra de pista de pádel de competición, vista aérea con cristal templado" },
        { src: "/instalacion-linea-central-pista-padel-noche.jpg", alt: "Instalación de la línea central de una pista de pádel de competición de noche" },
        { src: "/pista-padel-cesped-artificial-lastres-noche.jpg", alt: "Césped artificial de competición instalado con iluminación nocturna" },
      ],
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
      [
        { src: "/pistas-pickleball-multiples-vista-aerea.jpg", alt: "Pista de pickleball estándar recién pintada, vista aérea" },
        { src: "/pista-padel-cesped-verde-arboleda-nublado.jpg", alt: "Pista de pickleball estándar con cerramiento de malla junto a una arboleda" },
        { src: "/pista-padel-cesped-verde-campo-construccion.jpg", alt: "Base de pista de pickleball estándar en construcción" },
      ],
      [
        { src: "/pista-padel-cesped-verde-nave-industrial.jpg", alt: "Pista de pickleball con recinto completo junto a una nave industrial" },
        { src: "/dos-pistas-padel-azules-vista-aerea.jpg", alt: "Recinto de pistas de pickleball terminado, vista aérea" },
        { src: "/pista-padel-cesped-verde-arboleda-nublado.jpg", alt: "Detalle del cerramiento perimetral de un recinto de pickleball" },
      ],
      [
        { src: "/pista-padel-azul-jardin-arbolado.jpg", alt: "Complejo multipista de pickleball en jardín arbolado" },
        { src: "/pista-padel-cesped-verde-campo-construccion.jpg", alt: "Obra de un complejo multipista de pickleball en construcción" },
        { src: "/pista-padel-cesped-verde-nave-industrial.jpg", alt: "Varias pistas de pickleball compartiendo cimentación e iluminación" },
      ],
    ],
    materials: [
      { src: "/pistas-pickleball-multiples-vista-aerea.jpg", alt: "Pavimento acrílico multicapa de una pista de pickleball, vista aérea" },
      { src: "/pista-padel-cesped-verde-arboleda-nublado.jpg", alt: "Líneas de juego pintadas sobre la superficie de una pista de pickleball" },
      { src: "/pista-padel-cesped-verde-nave-industrial.jpg", alt: "Cerramiento perimetral galvanizado de una pista de pickleball" },
      { src: "/pista-padel-obra-nocturna-grua.jpg", alt: "Iluminación LED de una pista de pickleball encendida al atardecer" },
    ],
  },
};

export async function ServicePage({
  ns,
  idPrefix,
  waBaseMessage,
}: {
  ns: "padel" | "pickleball";
  idPrefix: string;
  waBaseMessage: string;
}) {
  const t = await getTranslations(ns);
  const tc = await getTranslations();
  const locale = (await getLocale()) as Locale;

  const items = t.raw("models.items") as ServiceModel[];
  const materials = t.raw("materials.items") as ServiceMaterial[];
  const faqs = t.raw("faq.items") as ServiceFaqItem[];
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
              priority
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

          <ModelSelector
            ns={ns}
            items={items}
            gallery={images.gallery}
            locale={locale}
            waBaseMessage={waBaseMessage}
          />
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
        <section id="cubiertas" className="scroll-mt-24 bg-[#17191B] text-white">
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
        <ServiceCtaForm
          ns={ns}
          idPrefix={idPrefix}
          waBaseMessage={waBaseMessage}
          ctaProjectOptions={ctaProjectOptions}
        />
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
