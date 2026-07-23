import { Boxes, Phone } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { Button } from "@/components/ui/button";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { StickyCta } from "@/components/sticky-cta";
import { WhatsappIcon } from "@/components/icons";
import { TEL, TEL_LABEL, waHref } from "@/lib/site";

export default async function ConfiguradorPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("configurator");
  const tc = await getTranslations();

  return (
    <div className="bg-[#F4F2EE] text-[#1A1C1E]">
      <SiteHeader />

      <main className="pt-16 pb-[58px] min-[1100px]:pt-[74px] min-[1100px]:pb-0">
        <section className="bg-[#17191B] text-[#EDEBE5]">
          <div className="px-5 pt-[34px] pb-[30px] min-[900px]:mx-auto min-[900px]:max-w-[1200px] min-[900px]:px-10">
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

        <section className="px-5 py-[52px] min-[900px]:mx-auto min-[900px]:max-w-[1200px] min-[900px]:px-10 min-[900px]:py-[88px]">
          <div className="flex flex-col items-center gap-4 rounded-2xl border-2 border-dashed border-[#D8D4C9] bg-white px-6 py-16 text-center min-[900px]:max-w-[720px] min-[900px]:mx-auto">
            <span className="flex size-14 items-center justify-center rounded-full bg-[var(--acc)]/[.14] text-[var(--accd)]">
              <Boxes className="size-7" />
            </span>
            <p className="m-0 max-w-[440px] text-[15px] leading-[1.55] text-[#565A5E]">
              {t("comingSoon")}
            </p>
          </div>

          <div className="mt-6 flex flex-col gap-2.5 min-[900px]:mx-auto min-[900px]:max-w-[360px]">
            <Button variant="whatsapp" asChild>
              <a href={waHref(tc("common.waMessage"))}>
                <WhatsappIcon className="size-5" />
                {tc("common.whatsappDirect")}
              </a>
            </Button>
            <Button variant="outline" asChild>
              <a href={`tel:${TEL}`}>
                <Phone className="size-5" />
                {tc("common.call")} · {TEL_LABEL}
              </a>
            </Button>
          </div>
        </section>
      </main>

      <SiteFooter />
      <StickyCta />
    </div>
  );
}
