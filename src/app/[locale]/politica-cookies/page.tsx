import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { StickyCta } from "@/components/sticky-cta";
import { PreferencesLink, WithdrawButton } from "@/components/consent/preferences-link";
import { alternatesDe } from "@/lib/metadata";

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
    alternates: alternatesDe(locale, "/politica-cookies"),
  };
}

const SECCIONES = ["que", "servidor", "terceros", "derechos"] as const;

interface Fila {
  nombre: string;
  proveedor: string;
  finalidad: string;
  duracion: string;
  categoria: string;
  transferencia: string;
}

export default async function PoliticaCookiesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("cookiePolicy");
  const filas = t.raw("filas") as Fila[];

  return (
    <div className="bg-[#F4F2EE] text-[#1A1C1E]">
      <SiteHeader />
      <main className="pt-16 min-[1100px]:pt-[74px]">
        <div className="mx-auto max-w-[760px] px-5 py-12 min-[900px]:px-10 min-[900px]:py-16">
          <h1 className="font-display text-[32px] font-bold uppercase leading-[1.05] tracking-[-0.02em]">
            {t("titulo")}
          </h1>
          <p className="mt-3 max-w-[60ch] text-[15px] leading-[1.6] text-[#3d443f]">
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

          <section className="mt-10">
            <h2 className="font-display text-[19px] font-bold uppercase tracking-[-0.01em]">
              {t("tabla.titulo")}
            </h2>
            {/* La tabla desborda en móvil: scroll propio, nunca scroll del body. */}
            <div className="mt-3 overflow-x-auto rounded-xl border border-[#E2DFD6] bg-white">
              <table className="w-full min-w-[640px] border-collapse text-left text-[13px]">
                <thead>
                  <tr className="border-b border-[#E2DFD6] bg-[#F8F7F3]">
                    {(["nombre", "proveedor", "finalidad", "duracion", "categoria", "transferencia"] as const).map(
                      (c) => (
                        <th key={c} className="px-3 py-2.5 font-semibold text-[#3d443f]">
                          {t(`tabla.${c}`)}
                        </th>
                      ),
                    )}
                  </tr>
                </thead>
                <tbody>
                  {filas.map((f) => (
                    <tr key={f.nombre} className="border-b border-[#EDEBE4] last:border-0">
                      <td className="px-3 py-2.5 font-mono text-[12px]">{f.nombre}</td>
                      <td className="px-3 py-2.5 text-[#565A5E]">{f.proveedor}</td>
                      <td className="px-3 py-2.5 text-[#565A5E]">{f.finalidad}</td>
                      <td className="px-3 py-2.5 text-[#565A5E]">{f.duracion}</td>
                      <td className="px-3 py-2.5 text-[#565A5E]">{f.categoria}</td>
                      <td className="px-3 py-2.5 text-[#565A5E]">{f.transferencia}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <div className="mt-10 rounded-xl border border-[#E2DFD6] bg-white p-5">
            <h2 className="font-display text-[17px] font-bold uppercase tracking-[-0.01em]">
              {t("cambiar.titulo")}
            </h2>
            <p className="mt-1.5 max-w-[56ch] text-[14px] leading-[1.6] text-[#565A5E]">
              {t("cambiar.texto")}
            </p>
            <div className="mt-3.5 flex flex-wrap items-center gap-3">
              <PreferencesLink className="text-[14px] font-semibold text-[var(--accd)] underline underline-offset-2" />
              <WithdrawButton />
            </div>
          </div>

          <p className="mt-10 text-xs leading-[1.8] text-[#8A8E92]">{t("responsable")}</p>
          <p className="mt-3 rounded-lg border border-[#E2DFD6] bg-[#F8F7F3] p-3 text-xs leading-[1.7] text-[#8A8E92]">
            {t("aviso")}
          </p>
        </div>
      </main>
      <SiteFooter />
      <StickyCta />
    </div>
  );
}
