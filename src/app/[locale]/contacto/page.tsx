import Image from "next/image";
import { Mail, MapPin, Phone } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { StickyCta } from "@/components/sticky-cta";
import { WhatsappIcon } from "@/components/icons";
import { ContactoForm } from "@/components/contacto/form";
import { TEL, TEL_LABEL, waHref } from "@/lib/site";
import { BLUR } from "@/lib/image-blur";

const TEAM_IMG = { src: "/equipo-pavimentos-albufera-furgoneta.jpg", alt: "Equipo de Pavimentos Albufera junto a la furgoneta de la empresa" };

export default async function ContactoPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("contact");
  const tc = await getTranslations();

  return (
    <div className="bg-[#F4F2EE] text-[#1A1C1E]">
      <SiteHeader />

      <main className="pt-16 pb-[58px] min-[1100px]:pt-[74px] min-[1100px]:pb-0">
        {/* Cabecera contacto */}
        <section className="bg-[#17191B] text-[#EDEBE5]">
          <div className="px-5 pt-[34px] pb-[30px] min-[900px]:mx-auto min-[900px]:max-w-[1200px] min-[900px]:px-10">
            <Eyebrow>{t("header.eyebrow")}</Eyebrow>
            <h1 className="font-display mt-2 text-[36px] font-bold uppercase leading-[0.95] text-white">
              {t("header.title")}
            </h1>
            <p className="m-0 mt-2 text-[15px] leading-[1.55] text-[#C9CDD0]">
              {t("header.sub")}
            </p>
            <div className="mt-[18px] grid grid-cols-2 gap-2.5 min-[900px]:max-w-[560px]">
              <a
                href={waHref(tc("common.waMessage"))}
                className="flex flex-col gap-2 rounded-[10px] border border-[#25D366] bg-[#25D366] p-4 text-[#062B14]"
              >
                <WhatsappIcon className="size-5" />
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-wide opacity-75">
                    {t("header.quickWrite")}
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
                    {t("header.quickCall")}
                  </div>
                  <div className="font-display text-[19px] font-bold uppercase leading-none">
                    {tc("common.call")}
                  </div>
                </div>
              </a>
            </div>
          </div>
        </section>

        <ContactoForm />

        {/* Datos de contacto */}
        <section className="px-5 py-11 min-[900px]:mx-auto min-[900px]:max-w-[1200px] min-[900px]:px-10">
          <Eyebrow>{t("info.eyebrow")}</Eyebrow>
          <h2 className="font-display mt-2 text-[31px] font-bold uppercase leading-[0.95]">
            {t("info.title")}
          </h2>
          <div className="mt-2">
            <InfoLine icon={Phone} title={t("info.phone")}>
              <a href={`tel:${TEL}`}>{TEL_LABEL}</a> · {t("info.phoneNote")}
            </InfoLine>
            <InfoLine icon={WhatsappIcon} title={t("info.whatsapp")}>
              <a href={waHref(tc("common.waMessage"))}>{tc("common.whatsappDirect")}</a> · {t("info.whatsappNote")}
            </InfoLine>
            <InfoLine icon={Mail} title={t("info.email")}>
              info@padelalbufera.com
            </InfoLine>
            <InfoLine icon={MapPin} title={t("info.where")} last>
              C/ Dirección física, 00 · 46000 Valencia
              <br />
              {t("info.coverageNote")}
            </InfoLine>
          </div>
          <div className="relative mt-[18px] aspect-[16/10] overflow-hidden rounded-[10px] bg-[#E7E4DC] min-[900px]:max-w-[900px]">
            <Image
              src={TEAM_IMG.src}
              alt={TEAM_IMG.alt}
              fill
              sizes="(max-width: 900px) 100vw, 900px"
              quality={70}
              placeholder="blur"
              blurDataURL={BLUR[TEAM_IMG.src]}
              className="object-cover"
            />
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
    <span className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--acc)] before:h-[3px] before:w-4 before:bg-[var(--acc)]">
      {children}
    </span>
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
