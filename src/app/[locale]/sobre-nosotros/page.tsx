import type { Metadata } from "next";
import Image from "next/image";
import { Heart, MapPin, Phone, ShieldCheck, Users, Wrench } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { Button } from "@/components/ui/button";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { StickyCta } from "@/components/sticky-cta";
import { WhatsappIcon } from "@/components/icons";
import { AboutStatsCounter } from "@/components/about/stats-counter";

import { BLUR } from "@/lib/image-blur";
import { metadataPagina } from "@/lib/metadata";
import { WhatsAppLink } from "@/components/conversion/whatsapp-link";
import { PhoneLink } from "@/components/conversion/phone-link";
import { PhoneNumber } from "@/components/conversion/phone-number";

const HERO_IMG = { src: "/pintado-lineas-pista-padel-azul.jpg", alt: "Operario del equipo pintando las líneas de una pista de pádel" };
const STORY_IMG = { src: "/instalacion-cesped-pista-padel-atardecer.jpg", alt: "Equipo instalando el césped artificial de una pista de pádel al atardecer" };
const TEAM_IMG = { src: "/equipo-pavimentos-albufera-furgoneta.jpg", alt: "Equipo de Pavimentos Albufera junto a la furgoneta de la empresa" };

const VALUE_ICONS = [Wrench, ShieldCheck, Heart, Users];

const TEAM_ROLES = [
  "Fundador · Dirección de obra",
  "Jefe de obra",
  "Proyectos y presupuestos",
  "Atención al cliente",
];

const CERTS = ["CERT 01", "CERT 02", "CERT 03", "SEGURO RC", "HOMOLOG.", "ISO ····"];

interface Milestone {
  y: string;
  t: string;
}

interface Value {
  t: string;
  d: string;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about" });

  return metadataPagina({
    locale,
    ruta: "/sobre-nosotros",
    title: `${t("hero.h1")} | Pádel & Pickleball Albufera`,
    description: t("hero.sub"),
  });
}

export default async function SobreNosotrosPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("about");
  const tf = await getTranslations("footer");

  const milestones = t.raw("milestones.items") as Milestone[];
  const values = t.raw("values.items") as Value[];
  const statLabels = t.raw("story.stats") as string[];
  const zones = tf.raw("zones") as string[];

  return (
    <div className="bg-[#F4F2EE] text-[#1A1C1E]">
      <SiteHeader />

      <main className="pt-16 pb-[58px] min-[1100px]:pt-[74px] min-[1100px]:pb-0">
        {/* Hero */}
        <section className="relative flex min-h-[380px] bg-[#17191B] min-[900px]:min-h-[460px]">
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

        {/* Historia */}
        <section className="px-5 py-[52px] min-[900px]:mx-auto min-[900px]:max-w-[1200px] min-[900px]:px-10 min-[900px]:py-[88px]">
          <Eyebrow>{t("story.eyebrow")}</Eyebrow>
          <h2 className="font-display mt-2 text-[31px] font-bold uppercase leading-[0.95]">
            {t("story.title")}
          </h2>
          <p className="m-0 mt-3 text-[17px] leading-[1.6] text-[#33363A]">{t("story.lead")}</p>
          <div className="relative mt-4 aspect-4/3 overflow-hidden rounded-[10px] bg-[#E7E4DC] min-[900px]:max-w-[1000px]">
            <Image
              src={STORY_IMG.src}
              alt={STORY_IMG.alt}
              fill
              sizes="(max-width: 900px) 100vw, 1000px"
              quality={70}
              placeholder="blur"
              blurDataURL={BLUR[STORY_IMG.src]}
              className="object-cover"
            />
          </div>
          <AboutStatsCounter labels={statLabels} />
        </section>

        {/* Hitos */}
        <section className="bg-[#17191B] text-white">
          <div className="px-5 py-[52px] min-[900px]:mx-auto min-[900px]:max-w-[1200px] min-[900px]:px-10 min-[900px]:py-[88px]">
            <Eyebrow>{t("milestones.eyebrow")}</Eyebrow>
            <h2 className="font-display mt-2 text-[31px] font-bold uppercase leading-[0.95] text-white">
              {t("milestones.title")}
            </h2>
            <div className="relative mt-4 pl-[46px] before:absolute before:top-1.5 before:bottom-1.5 before:left-2 before:w-0.5 before:bg-[#2B3034] min-[900px]:max-w-[760px]">
              {milestones.map((m) => (
                <div key={m.y} className="relative pb-[22px] before:absolute before:-left-[42px] before:top-1 before:size-3.5 before:rounded-full before:bg-[var(--acc)] before:shadow-[0_0_0_4px_#17191B]">
                  <div className="font-display text-[22px] font-bold leading-none text-[var(--acc)]">{m.y}</div>
                  <p className="m-0 mt-1 text-[14.5px] leading-[1.5] text-[#C9CDD0]">{m.t}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Valores */}
        <section className="px-5 py-[52px] min-[900px]:mx-auto min-[900px]:max-w-[1200px] min-[900px]:px-10 min-[900px]:py-[88px]">
          <Eyebrow>{t("values.eyebrow")}</Eyebrow>
          <h2 className="font-display mt-2 text-[31px] font-bold uppercase leading-[0.95]">
            {t("values.title")}
          </h2>
          <div className="mt-4 flex flex-col gap-3">
            {values.map((v, i) => {
              const Icon = VALUE_ICONS[i];
              return (
                <div key={v.t} className="flex items-start gap-3.5 rounded-[10px] border border-[#E5E2D9] bg-white p-[18px]">
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-[10px] bg-[var(--acc)]/[.14] text-[var(--accd)]">
                    <Icon className="size-5" />
                  </span>
                  <div>
                    <h3 className="font-display m-0 mb-1 text-lg font-bold uppercase leading-none">{v.t}</h3>
                    <p className="m-0 text-[13.5px] leading-[1.5] text-[#565A5E]">{v.d}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Equipo */}
        <section className="px-5 pt-0 pb-[52px] min-[900px]:mx-auto min-[900px]:max-w-[1200px] min-[900px]:px-10 min-[900px]:pb-[88px]">
          <Eyebrow>{t("team.eyebrow")}</Eyebrow>
          <h2 className="font-display mt-2 text-[31px] font-bold uppercase leading-[0.95]">
            {t("team.title")}
          </h2>
          <p className="m-0 mt-2 text-[15px] leading-[1.55] text-[#565A5E]">{t("team.note")}</p>
          <div className="relative mt-4 aspect-[16/10] overflow-hidden rounded-[10px] bg-[#E7E4DC] min-[900px]:max-w-[1000px]">
            <Image
              src={TEAM_IMG.src}
              alt={TEAM_IMG.alt}
              fill
              sizes="(max-width: 900px) 100vw, 1000px"
              quality={70}
              placeholder="blur"
              blurDataURL={BLUR[TEAM_IMG.src]}
              className="object-cover"
            />
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3.5 min-[900px]:grid-cols-4">
            {TEAM_ROLES.map((r) => (
              <div key={r} className="overflow-hidden rounded-[10px] border border-[#E5E2D9] bg-white">
                <div className="aspect-square bg-[#E7E4DC]" />
                <div className="px-[13px] pt-3 pb-3.5">
                  <h3 className="font-display m-0 text-[17px] font-bold uppercase leading-none">Nombre Apellido</h3>
                  <p className="m-0 mt-0.5 text-xs text-[#7A7E82]">{r}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Cobertura */}
        <section className="bg-[#17191B] text-white">
          <div className="px-5 py-[52px] min-[900px]:mx-auto min-[900px]:max-w-[1200px] min-[900px]:px-10 min-[900px]:py-[88px]">
            <Eyebrow>{t("coverage.eyebrow")}</Eyebrow>
            <h2 className="font-display mt-2 text-[31px] font-bold uppercase leading-[0.95] text-white">
              {t("coverage.title")}
            </h2>
            <div className="mt-4 aspect-[16/10] rounded-[10px] bg-[#26292D] min-[900px]:max-w-[1000px]" />
            <div className="mt-3.5 flex flex-wrap gap-2">
              {zones.map((z) => (
                <span key={z} className="flex items-center gap-1.5 rounded-md border border-[#2B3034] bg-[#212428] px-2.5 py-1.5 text-[12.5px] font-semibold text-[#E4E2DC]">
                  <MapPin className="size-3.5 text-[var(--acc)]" />
                  {z}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Certificaciones */}
        <section className="px-5 py-[52px] min-[900px]:mx-auto min-[900px]:max-w-[1200px] min-[900px]:px-10 min-[900px]:py-[88px]">
          <Eyebrow>{t("certs.eyebrow")}</Eyebrow>
          <h2 className="font-display mt-2 text-[31px] font-bold uppercase leading-[0.95]">
            {t("certs.title")}
          </h2>
          <p className="m-0 mt-2 text-[15px] leading-[1.55] text-[#565A5E]">{t("certs.note")}</p>
          <div className="mt-4 grid grid-cols-3 gap-2.5 min-[900px]:grid-cols-6">
            {CERTS.map((c) => (
              <span
                key={c}
                className="flex h-16 items-center justify-center rounded-lg border border-[#E5E2D9] bg-white p-1 text-center font-mono text-[9px] font-semibold text-[#A7A399]"
              >
                {c}
              </span>
            ))}
          </div>
        </section>

        {/* CTA final */}
        <section className="bg-[#17191B] text-white">
          <div className="flex flex-col items-start gap-3.5 px-5 py-14 min-[900px]:mx-auto min-[900px]:max-w-[1200px] min-[900px]:px-10">
            <Eyebrow>{t("cta.eyebrow")}</Eyebrow>
            <h2 className="font-display text-[34px] font-bold uppercase leading-[0.95] text-white">
              {t("cta.title")}
            </h2>
            <p className="m-0 text-[15px] leading-[1.5] text-[#C9CDD0]">{t("cta.sub")}</p>
            <Button variant="whatsapp" asChild>
              <WhatsAppLink placement="sobre_nosotros" mensaje={"Hola, quiero conocer vuestro trabajo y pedir una visita."}>
                <WhatsappIcon className="size-5" />
                WhatsApp directo
              </WhatsAppLink>
            </Button>
            <Button variant="outline" asChild>
              <PhoneLink placement="sobre_nosotros">
                <Phone className="size-5" />
                <PhoneNumber />
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
