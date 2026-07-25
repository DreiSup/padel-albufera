import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { ServicePage } from "@/components/service-page";
import { metadataPagina } from "@/lib/metadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pickleball" });

  return metadataPagina({
    locale,
    ruta: "/pickleball",
    title: `${t("hero.h1")} | Pádel & Pickleball Albufera`,
    description: t("hero.sub"),
  });
}

export default async function PickleballPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <ServicePage
      ns="pickleball"
      idPrefix="pk"
      waBaseMessage="Hola, quiero un presupuesto para construir una pista de pickleball."
    />
  );
}
