import { setRequestLocale } from "next-intl/server";

import { ServicePage } from "@/components/service-page";

export default async function PadelPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <ServicePage
      ns="padel"
      idPrefix="pd"
      waBaseMessage="Hola, quiero un presupuesto para construir una pista de pádel."
    />
  );
}
