import type { Metadata } from "next";
import Image from "next/image";
import { Phone } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { Button } from "@/components/ui/button";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { StickyCta } from "@/components/sticky-cta";
import { WhatsappIcon } from "@/components/icons";
import { ProjectsGallery } from "@/components/proyectos/gallery";

import { BLUR } from "@/lib/image-blur";
import { metadataPagina } from "@/lib/metadata";
import { WhatsAppLink } from "@/components/conversion/whatsapp-link";
import { PhoneLink } from "@/components/conversion/phone-link";
import { PhoneNumber } from "@/components/conversion/phone-number";

const HERO_IMG = { src: "/pistas-padel-cristal-panoramica-urbana.jpg", alt: "Dos pistas de pádel panorámicas de cristal en entorno urbano, uno de nuestros proyectos entregados" };

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "projects" });

  return metadataPagina({
    locale,
    ruta: "/proyectos",
    title: `${t("hero.h1")} | Pádel & Pickleball Albufera`,
    description: t("hero.sub"),
  });
}

export default async function ProyectosPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("projects");

  return (
    <div className="bg-[#F4F2EE] text-[#1A1C1E]">
      <SiteHeader />

      <main className="pt-16 pb-[58px] min-[1100px]:pt-[74px] min-[1100px]:pb-0">
        {/* Hero */}
        <section className="relative flex min-h-[340px] bg-[#17191B] min-[900px]:min-h-[420px]">
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

        <ProjectsGallery />

        {/* CTA final */}
        <section className="bg-[#17191B] text-white">
          <div className="flex flex-col items-start gap-3.5 px-5 py-14 min-[900px]:mx-auto min-[900px]:max-w-[1200px] min-[900px]:px-10">
            <span className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--acc)] before:h-[3px] before:w-4 before:bg-[var(--acc)]">
              {t("cta.eyebrow")}
            </span>
            <h2 className="font-display text-[34px] font-bold uppercase leading-[0.95] text-white">
              {t("cta.title")}
            </h2>
            <p className="m-0 text-[15px] leading-[1.5] text-[#C9CDD0]">
              {t("cta.sub")}
            </p>
            <Button variant="whatsapp" asChild>
              <WhatsAppLink placement="proyectos" mensaje={"Hola, he visto vuestros proyectos y quiero un presupuesto."}>
                <WhatsappIcon className="size-5" />
                WhatsApp directo
              </WhatsAppLink>
            </Button>
            <Button variant="outline" asChild>
              <PhoneLink placement="proyectos">
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
