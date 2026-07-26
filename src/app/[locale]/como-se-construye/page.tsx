import type { Metadata } from "next";
import Image from "next/image";
import { Phone } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { Button } from "@/components/ui/button";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { StickyCta } from "@/components/sticky-cta";
import { WhatsappIcon } from "@/components/icons";

import { BLUR } from "@/lib/image-blur";
import { alternatesDe } from "@/lib/metadata";
import { WhatsAppLink } from "@/components/conversion/whatsapp-link";
import { PhoneLink } from "@/components/conversion/phone-link";
import { PhoneNumber } from "@/components/conversion/phone-number";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "construction" });

  return {
    title: t("meta.title"),
    description: t("meta.description"),
    alternates: alternatesDe(locale, "/como-se-construye"),
  };
}

const HERO = {
  src: "/pista-padel-cesped-verde-campo-construccion.jpg",
  alt: "Pista de pádel en construcción sobre solera de hormigón en una parcela",
};

// Una foto por fase, de obras propias.
const FOTOS_FASE = [
  { src: "/pista-padel-obra-vista-aerea-cristales.jpg", alt: "Vista aérea del replanteo de una pista de pádel en obra" },
  { src: "/pista-padel-obra-nocturna-grua.jpg", alt: "Grúa colocando la estructura de una pista de pádel durante la obra" },
  { src: "/pista-padel-completa-cristales-exterior.jpg", alt: "Estructura de acero y cristal de una pista de pádel montada" },
  { src: "/instalacion-cesped-pista-padel-atardecer.jpg", alt: "Instalación del césped artificial de una pista de pádel al atardecer" },
  { src: "/junta-cesped-artificial-pista-padel.jpg", alt: "Junta encolada entre rollos de césped artificial de una pista de pádel" },
  { src: "/instalacion-linea-central-pista-padel-noche.jpg", alt: "Marcado de la línea central de una pista de pádel con la pista iluminada" },
] as const;

interface Fase {
  n: string;
  t: string;
  d: string;
  dato: string;
}

export default async function ComoSeConstruyePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("construction");
  const tc = await getTranslations();
  const fases = t.raw("fases") as Fase[];

  return (
    <div className="bg-[#F4F2EE] text-[#1A1C1E]">
      <SiteHeader />

      <main className="pt-16 pb-[58px] min-[1100px]:pt-[74px] min-[1100px]:pb-0">
        {/* Hero: la foto marca el LCP de esta ruta. */}
        <section className="relative">
          <div className="relative aspect-[4/3] w-full min-[900px]:aspect-[21/9]">
            <Image
              src={HERO.src}
              alt={HERO.alt}
              fill
              priority
              sizes="100vw"
              quality={70}
              placeholder="blur"
              blurDataURL={BLUR[HERO.src]}
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0F1113] via-[#0F1113]/55 to-transparent" />
          </div>
          <div className="absolute inset-x-0 bottom-0 px-5 pb-7 text-[#EDEBE5] min-[900px]:mx-auto min-[900px]:max-w-[1200px] min-[900px]:px-10 min-[900px]:pb-12">
            <span className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--acc)] before:h-[3px] before:w-4 before:bg-[var(--acc)]">
              {t("hero.eyebrow")}
            </span>
            <h1 className="font-display mt-2 text-[36px] font-bold uppercase leading-[0.95] text-white min-[900px]:text-[52px]">
              {t("hero.h1")}
            </h1>
            <p className="m-0 mt-2 max-w-[560px] text-[15px] leading-[1.55] text-[#C9CDD0]">
              {t("hero.sub")}
            </p>
          </div>
        </section>

        {/* La solera: el argumento de venta que separa de un montador de kits. */}
        <section className="bg-[#17191B] px-5 py-12 text-[#EDEBE5] min-[900px]:px-10 min-[900px]:py-16">
          <div className="min-[900px]:mx-auto min-[900px]:max-w-[1200px]">
            <h2 className="font-display m-0 text-[26px] font-bold uppercase leading-[1.05] text-white min-[900px]:text-[34px]">
              {t("solera.titulo")}
            </h2>
            <p className="m-0 mt-3 max-w-[62ch] text-[15px] leading-[1.6] text-[#C9CDD0]">
              {t("solera.texto")}
            </p>
            <div className="mt-6 grid gap-3 min-[700px]:grid-cols-3">
              {(["1", "2", "3"] as const).map((n) => (
                <div key={n} className="rounded-xl border border-[#2B3034] bg-[#1E2124] p-4">
                  <p className="font-display m-0 text-[17px] font-bold uppercase leading-none text-[var(--acc)]">
                    {t(`solera.dato${n}`)}
                  </p>
                  <p className="m-0 mt-1.5 text-[13.5px] leading-[1.5] text-[#9DA1A5]">
                    {t(`solera.dato${n}d`)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Las seis fases */}
        <section className="px-5 py-12 min-[900px]:mx-auto min-[900px]:max-w-[1200px] min-[900px]:px-10 min-[900px]:py-16">
          <h2 className="font-display m-0 text-[26px] font-bold uppercase leading-[1.05] min-[900px]:text-[34px]">
            {t("fasesTitulo")}
          </h2>

          <div className="mt-7 flex flex-col gap-8 min-[900px]:gap-12">
            {fases.map((f, i) => {
              const foto = FOTOS_FASE[i];
              return (
                <article
                  key={f.n}
                  className={`grid gap-4 min-[900px]:grid-cols-2 min-[900px]:items-center min-[900px]:gap-8 ${
                    i % 2 === 1 ? "min-[900px]:[&>figure]:order-2" : ""
                  }`}
                >
                  <figure className="relative m-0 aspect-[4/3] overflow-hidden rounded-xl bg-[#E7E4DC]">
                    <Image
                      src={foto.src}
                      alt={foto.alt}
                      fill
                      sizes="(max-width: 900px) 100vw, 50vw"
                      quality={70}
                      placeholder="blur"
                      blurDataURL={BLUR[foto.src]}
                      className="object-cover"
                    />
                  </figure>
                  <div>
                    <span className="font-mono text-[13px] font-semibold text-[var(--accd)]">
                      {f.n}
                    </span>
                    <h3 className="font-display m-0 mt-1 text-[21px] font-bold uppercase leading-[1.1] min-[900px]:text-[25px]">
                      {f.t}
                    </h3>
                    <p className="m-0 mt-2 max-w-[54ch] text-[14.5px] leading-[1.6] text-[#565A5E]">
                      {f.d}
                    </p>
                    <p className="m-0 mt-3 inline-block rounded-lg border border-[#E2DFD6] bg-white px-3 py-2 text-[12.5px] font-semibold text-[#3d443f]">
                      {f.dato}
                    </p>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* Cierre */}
        <section className="bg-[#17191B] px-5 py-12 text-[#EDEBE5] min-[900px]:px-10 min-[900px]:py-16">
          <div className="min-[900px]:mx-auto min-[900px]:max-w-[1200px]">
            <h2 className="font-display m-0 text-[26px] font-bold uppercase leading-[1.05] text-white min-[900px]:text-[34px]">
              {t("cierre.titulo")}
            </h2>
            <p className="m-0 mt-2 max-w-[52ch] text-[15px] leading-[1.55] text-[#C9CDD0]">
              {t("cierre.sub")}
            </p>
            <div className="mt-6 flex flex-col gap-2.5 min-[560px]:flex-row min-[560px]:max-w-[560px]">
              <Button variant="whatsapp" asChild className="min-[560px]:flex-1">
                <WhatsAppLink placement="como_se_construye"
                  mensaje={tc("common.waMessage")}
                >
                  <WhatsappIcon className="size-5" />
                  {tc("common.whatsappDirect")}
                </WhatsAppLink>
              </Button>
              <Button variant="outline" asChild className="min-[560px]:flex-1">
                <PhoneLink placement="como_se_construye">
                  <Phone className="size-5" />
                  {tc("common.call")} · <PhoneNumber />
                </PhoneLink>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
      <StickyCta />
    </div>
  );
}
