import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Configurador3D } from "@/components/configurador/configurador-3d";
import { BLUR } from "@/lib/image-blur";
import { routing } from "@/i18n/routing";

const rutaLocal = (locale: string) =>
  locale === routing.defaultLocale ? "/configurador" : `/${locale}/configurador`;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "configurator" });

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

// Prueba social: una pista real en un jardín real vale más que cualquier render.
const OBRAS = [
  "/pista-padel-cristal-panoramica-rural.jpg",
  "/pista-padel-completa-cristales-exterior.jpg",
  "/pista-padel-cesped-verde-arboleda-nublado.jpg",
] as const;

const FAQS = ["licencia", "ruido", "espacio", "plazo", "mantenimiento"] as const;

export default async function ConfiguradorPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("configurator");

  // Intro con el H1 (SEO, servido). Destaca la solera: es lo que separa a este
  // cliente de un montador de kits.
  const intro = (
    <div>
      <span className="flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--accd)] before:h-[3px] before:w-4 before:bg-[var(--acc)]">
        {t("hero.eyebrow")}
      </span>
      <h1 className="font-display mt-2 text-[clamp(30px,7.5vw,40px)] font-bold uppercase leading-[1.02] tracking-[-0.03em]">
        {t.rich("hero.h1", {
          em: (chunks) => <em className="not-italic text-[var(--accd)]">{chunks}</em>,
        })}
      </h1>
      <p className="mt-3 max-w-[46ch] text-[15px] leading-[1.55] text-[#3d443f]">
        {t("hero.sub")}
      </p>
      <p className="mt-3 border-l-2 border-[var(--acc)] pl-2.5 font-mono text-[11px] leading-[1.5] tracking-[0.02em] text-[var(--accd)]">
        {t("hero.solera")}
      </p>
    </div>
  );

  const social = (
    <section className="mt-10">
      <h2 className="font-display text-[19px] font-bold uppercase tracking-[-0.01em]">
        {t("social.titulo")}
      </h2>
      <p className="mt-1 max-w-[46ch] text-[13.5px] text-[#7A7E82]">
        {t("social.sub")}
      </p>
      <div className="mt-4 grid grid-cols-2 gap-2.5">
        {OBRAS.map((src, i) => (
          <div
            key={src}
            className={`relative aspect-[4/3] overflow-hidden rounded-[10px] bg-[#E7E4DC] ${
              i === 0 ? "col-span-2" : ""
            }`}
          >
            <Image
              src={src}
              alt={t(`social.alt.${i}`)}
              fill
              sizes="(max-width: 1100px) 100vw, 440px"
              quality={70}
              placeholder="blur"
              blurDataURL={BLUR[src]}
              className="object-cover"
            />
          </div>
        ))}
      </div>
    </section>
  );

  // FAQ en HTML servido (no cargada por JS): <details> nativo, para SEO y para
  // que el lead llegue con menos frenos.
  const faq = (
    <section className="mt-10">
      <h2 className="font-display text-[19px] font-bold uppercase tracking-[-0.01em]">
        {t("faq.titulo")}
      </h2>
      <div className="mt-4 overflow-hidden rounded-xl border border-[#E2DFD6] bg-white">
        {FAQS.map((q) => (
          <details
            key={q}
            className="group border-b border-[#EDEBE4] last:border-0 [&_summary::-webkit-details-marker]:hidden"
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3.5 text-[14.5px] font-semibold text-[#1A1C1E]">
              {t(`faq.q.${q}`)}
              <span className="shrink-0 text-[var(--accd)] transition-transform group-open:rotate-45">
                +
              </span>
            </summary>
            <p className="px-4 pb-4 text-[14px] leading-[1.6] text-[#565A5E]">
              {t(`faq.a.${q}`)}
            </p>
          </details>
        ))}
      </div>
    </section>
  );

  return (
    <div className="bg-[#F4F2EE] text-[#1A1C1E]">
      <SiteHeader />
      <main className="pt-16 min-[1100px]:pt-[74px]">
        <Configurador3D intro={intro} social={social} faq={faq} />
      </main>
      <SiteFooter />
    </div>
  );
}
