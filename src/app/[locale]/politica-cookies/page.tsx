import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { StickyCta } from "@/components/sticky-cta";
import { CambiarConsentimiento } from "@/components/analytics/cambiar-consentimiento";
import { routing } from "@/i18n/routing";

const rutaLocal = (locale: string) =>
  locale === routing.defaultLocale ? "/politica-cookies" : `/${locale}/politica-cookies`;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "cookiePolicy" });

  return {
    title: t("meta.title"),
    description: t("meta.description"),
    alternates: {
      canonical: rutaLocal(locale),
      languages: {
        ...Object.fromEntries(routing.locales.map((l) => [l, rutaLocal(l)])),
        "x-default": rutaLocal(routing.defaultLocale),
      },
    },
  };
}

const SECCIONES = ["que", "guardamos", "terceros", "derechos"] as const;

export default async function PoliticaCookiesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("cookiePolicy");

  return (
    <div className="bg-[#F4F2EE] text-[#1A1C1E]">
      <SiteHeader />
      <main className="pt-16 min-[1100px]:pt-[74px]">
        <div className="mx-auto max-w-[680px] px-5 py-12 min-[900px]:px-10 min-[900px]:py-16">
          <h1 className="font-display text-[32px] font-bold uppercase leading-[1.05] tracking-[-0.02em]">
            {t("titulo")}
          </h1>
          <p className="mt-3 max-w-[54ch] text-[15px] leading-[1.6] text-[#3d443f]">
            {t("intro")}
          </p>

          <div className="mt-8 flex flex-col gap-8">
            {SECCIONES.map((s) => (
              <section key={s}>
                <h2 className="font-display text-[19px] font-bold uppercase tracking-[-0.01em]">
                  {t(`secciones.${s}.titulo`)}
                </h2>
                <p className="mt-2 text-[14.5px] leading-[1.65] text-[#565A5E]">
                  {t(`secciones.${s}.texto`)}
                </p>
              </section>
            ))}
          </div>

          <div className="mt-10 rounded-xl border border-[#E2DFD6] bg-white p-5">
            <h2 className="font-display text-[17px] font-bold uppercase tracking-[-0.01em]">
              {t("cambiar.titulo")}
            </h2>
            <p className="mt-1.5 max-w-[52ch] text-[14px] leading-[1.6] text-[#565A5E]">
              {t("cambiar.texto")}
            </p>
            <div className="mt-3.5">
              <CambiarConsentimiento label={t("cambiar.boton")} />
            </div>
          </div>

          <p className="mt-10 text-xs leading-[1.8] text-[#8A8E92]">
            {t("responsable")}
          </p>
        </div>
      </main>
      <SiteFooter />
      <StickyCta />
    </div>
  );
}
