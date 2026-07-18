import { setRequestLocale } from "next-intl/server";

import { ServicePage } from "@/components/service-page";

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
