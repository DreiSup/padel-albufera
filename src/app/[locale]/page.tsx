import Image from "next/image";
import {
  ChevronRight,
  Star,
  MapPin,
  Clock,
  FileText,
  Wrench,
  Key,
  Layers,
  ShieldCheck,
} from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { StickyCta } from "@/components/sticky-cta";
import { HomeStatsSection } from "@/components/home/stats-section";
import { HomeCtaForm } from "@/components/home/cta-form";
import { VideoThumb } from "@/components/home/video-thumb";
import { Button } from "@/components/ui/button";
import { WhatsappIcon } from "@/components/icons";
import { Link } from "@/i18n/navigation";
import { TEL, waHref } from "@/lib/site";
import { formatPrice } from "@/lib/format-price";
import { BLUR } from "@/lib/image-blur";
import type { Locale } from "@/i18n/routing";

const CARD_AMOUNTS = [18900, 24900, 15900, null];
const CARD_HREFS = ["/padel", "/padel", "/pickleball", "/padel#cubiertas"];
const STEP_ICONS = [MapPin, FileText, Wrench, Key];
const WHY_ICONS = [FileText, Layers, ShieldCheck];

const CARD_IMAGES = [
  { src: "/pista-padel-completa-cristales-exterior.jpg", alt: "Pista de pádel estándar con cerramiento de cristal terminada" },
  { src: "/pista-padel-cristal-panoramica-rural.jpg", alt: "Pista de pádel panorámica con vidrio sin postes intermedios" },
  { src: "/pistas-pickleball-multiples-vista-aerea.jpg", alt: "Vista aérea de varias pistas de pickleball" },
  { src: "/pista-padel-azul-jardin-arbolado.jpg", alt: "Pista de pádel a medida en jardín arbolado" },
];

const PROYECTOS = [
  { tipo: "Panorámica", t: "Club deportivo — nombre", loc: "Valencia, España", dato: "Entregada en 6 semanas", img: "/pistas-padel-cristal-panoramica-urbana.jpg", alt: "Dos pistas de pádel panorámicas de cristal en entorno urbano" },
  { tipo: "Pádel ×3", t: "Polideportivo municipal", loc: "Alicante, España", dato: "3 pistas · plazo cumplido", img: "/tres-pistas-padel-azules-vista-aerea.jpg", alt: "Vista aérea de tres pistas de pádel de césped azul" },
  { tipo: "Pickleball", t: "Résidence privada", loc: "Toulouse, Francia", dato: "Pádel + pickleball", img: "/pistas-pickleball-multiples-vista-aerea.jpg", alt: "Vista aérea de varias pistas de pickleball" },
];

const TESTIS = [
  { q: "«Cumplieron plazo y presupuesto al céntimo. La pista se juega de maravilla.»", n: "Nombre Apellido", r: "Gerente · Club deportivo", ini: "NA" },
  { q: "«Obra limpia, comunicación constante y cero sorpresas en la factura.»", n: "Nombre Apellido", r: "Concejal de deportes · Ayuntamiento", ini: "NA" },
  { q: "«La comunidad votó repetir con ellos para la segunda pista.»", n: "Nombre Apellido", r: "Presidente · Comunidad de propietarios", ini: "NA" },
];

interface BuildCard {
  title: string;
  desc: string;
}

interface WhyItem {
  title: string;
  desc: string;
}

interface FaqItem {
  q: string;
  a: string;
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  setRequestLocale(localeParam);
  const locale = localeParam as Locale;
  const t = await getTranslations();

  const cards = t.raw("build.cards") as BuildCard[];
  const whys = t.raw("why.items") as WhyItem[];
  const faqs = t.raw("faq.items") as FaqItem[];
  const statsLabels = t.raw("stats.labels") as string[];
  const badges = t.raw("hero.badges") as string[];

  return (
    <div className="bg-[#F4F2EE] text-[#1A1C1E]">
      <SiteHeader />

      <main className="pt-16 pb-[58px] min-[1100px]:pt-[74px] min-[1100px]:pb-0">
        {/* Hero */}
        <section className="relative flex min-h-[calc(100dvh-64px)] overflow-hidden bg-[#17191B] min-[1100px]:min-h-[calc(100dvh-74px)]">
          <div className="absolute inset-0">
            <Image
              src="/hero.webp"
              alt="Pista de pádel en construcción"
              fill
              priority
              sizes="100vw"
              quality={70}
              className="animate-hero-zoom object-cover"
            />
          </div>
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, rgba(13,15,16,.45), rgba(13,15,16,.12) 34%, rgba(13,15,16,.9) 76%)",
            }}
          />
          <div className="relative mt-auto flex w-full flex-col gap-3.5 px-5 pb-7 min-[900px]:mx-auto min-[900px]:max-w-[1200px] min-[900px]:gap-[18px] min-[900px]:px-10 min-[900px]:pb-[68px]">
            <span className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--acc)] before:h-[3px] before:w-4 before:bg-[var(--acc)]">
              {t("hero.eyebrow")}
            </span>
            <h1 className="font-display text-[43px] leading-[0.95] font-bold uppercase text-white min-[900px]:max-w-[820px] min-[900px]:text-[66px]">
              {t("hero.h1")}
            </h1>
            <p className="m-0 text-[15.5px] leading-[1.5] text-[#D9D7D1] min-[900px]:max-w-[600px] min-[900px]:text-[19px]">
              {t("hero.sub")}
            </p>
            <div className="flex flex-col gap-2.5 min-[900px]:max-w-[560px] min-[900px]:flex-row">
              <Button asChild>
                <a href={`tel:${TEL}`}>{t("common.requestQuote")}</a>
              </Button>
              <Button variant="outline" asChild>
                <a href={waHref(t("common.waMessage"))}>
                  <WhatsappIcon className="size-5" />
                  {t("common.whatsappDirect")}
                </a>
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {badges.map((b) => (
                <span
                  key={b}
                  className="rounded-md border border-white/30 bg-black/40 px-[9px] py-[5px] text-[11.5px] font-semibold text-[#E8E6E0] min-[900px]:text-[12.5px]"
                >
                  {b}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Trust logos */}
        <section className="px-5 pt-[52px] pb-10 min-[900px]:mx-auto min-[900px]:max-w-[1200px] min-[900px]:px-10 min-[900px]:py-[88px]">
          <p className="m-0 mb-4 text-center text-[12px] font-semibold uppercase tracking-[0.14em] text-[#565A5E]">
            {t("proof.title")}
          </p>
          <div className="grid grid-cols-3 gap-2.5 min-[900px]:grid-cols-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <span
                key={i}
                className="flex h-[52px] items-center justify-center rounded-lg border border-[#E5E2D9] bg-white font-mono text-[9.5px] font-semibold tracking-wide text-[#A7A399]"
              >
                LOGO {String(i + 1).padStart(2, "0")}
              </span>
            ))}
          </div>
        </section>

        {/* Qué construimos */}
        <section className="px-5 py-[52px] min-[900px]:mx-auto min-[900px]:max-w-[1200px] min-[900px]:px-10 min-[900px]:py-[88px]">
          <Eyebrow>{t("build.eyebrow")}</Eyebrow>
          <h2 className="font-display mt-2 text-[31px] font-bold uppercase leading-[0.95]">
            {t("build.title")}
          </h2>
          <div className="mt-4 flex flex-col gap-4 min-[900px]:grid min-[900px]:grid-cols-2 min-[900px]:gap-[22px] min-[1100px]:grid-cols-4">
            {cards.map((c, i) => {
              const amount = CARD_AMOUNTS[i];
              const price = amount
                ? formatPrice(locale, amount, t("build.from"))
                : t("build.custom");
              const img = CARD_IMAGES[i];
              return (
                <Link
                  key={c.title}
                  href={CARD_HREFS[i]}
                  className="block overflow-hidden rounded-[10px] border border-[#E5E2D9] bg-white transition-shadow hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)]"
                >
                  <div className="relative aspect-4/3 bg-[#E7E4DC] min-[900px]:aspect-[16/10]">
                    <Image
                      src={img.src}
                      alt={img.alt}
                      fill
                      sizes="(max-width: 900px) 50vw, (max-width: 1100px) 50vw, 25vw"
                      quality={70}
                      placeholder="blur"
                      blurDataURL={BLUR[img.src]}
                      className="object-cover"
                    />
                  </div>
                  <div className="flex flex-col gap-2.5 p-4 pb-[18px]">
                    <h3 className="font-display m-0 text-[23px] font-bold uppercase leading-none min-[1100px]:text-xl">
                      {c.title}
                    </h3>
                    <p className="m-0 text-sm leading-[1.5] text-[#565A5E]">{c.desc}</p>
                    <div className="flex items-baseline justify-between gap-2 border-t border-[#EEEBE3] pt-[11px]">
                      <span className="font-bold text-base">{price}</span>
                      <span className="flex items-center gap-1.5 text-sm font-semibold text-[var(--accd)]">
                        {t("common.seeDetails")} <ChevronRight className="size-4" />
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Proyectos destacados */}
        <section className="bg-[#17191B] text-white">
          <div className="px-5 py-[52px] min-[900px]:mx-auto min-[900px]:max-w-[1200px] min-[900px]:px-10 min-[900px]:py-[88px]">
            <Eyebrow>{t("nav.projects")}</Eyebrow>
            <h2 className="font-display mt-2 text-[31px] font-bold uppercase leading-[0.95]">
              {t("projects.hero.h1")}
            </h2>
            <div className="mt-4 -mx-5 flex snap-x snap-mandatory gap-3.5 overflow-x-auto px-5 pb-2 min-[900px]:mx-0 min-[900px]:px-0">
              {PROYECTOS.map((p) => (
                <div
                  key={p.t}
                  className="w-[295px] shrink-0 snap-start overflow-hidden rounded-[10px] border border-[#2B2F33] bg-[#1E2124]"
                >
                  <div className="relative aspect-4/3 bg-[#26292D]">
                    <Image
                      src={p.img}
                      alt={p.alt}
                      fill
                      sizes="295px"
                      quality={70}
                      placeholder="blur"
                      blurDataURL={BLUR[p.img]}
                      className="object-cover"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5 p-4">
                    <span className="inline-flex self-start rounded-md bg-[var(--acc)] px-2 py-1 text-[10.5px] font-bold uppercase tracking-wide text-[#07130C]">
                      {p.tipo}
                    </span>
                    <h3 className="font-display m-0 text-[19px] font-semibold uppercase leading-tight text-white">
                      {p.t}
                    </h3>
                    <p className="m-0 flex items-center gap-1.5 text-[13px] text-[#9FA4A8]">
                      <MapPin className="size-[15px]" /> {p.loc}
                    </p>
                    <p className="m-0 flex items-center gap-1.5 text-[13px] text-[#D8D6CF]">
                      <Clock className="size-[15px]" /> {p.dato}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="mt-4 w-full border-white/30 min-[900px]:mx-auto min-[900px]:max-w-[460px]" asChild>
              <Link href="/proyectos">
                {t("nav.projects")} <ChevronRight className="size-[17px]" />
              </Link>
            </Button>
          </div>
        </section>

        {/* Proceso */}
        <section className="px-5 py-[52px] min-[900px]:mx-auto min-[900px]:max-w-[1200px] min-[900px]:px-10 min-[900px]:py-[88px]">
          <Eyebrow>{t("process.hero.eyebrow")}</Eyebrow>
          <h2 className="font-display mt-2 text-[31px] font-bold uppercase leading-[0.95]">
            {t("process.timeline.title")}
          </h2>
          <div className="mt-2">
            {(t.raw("process.timeline.steps") as { t: string; d: string }[])
              .slice(0, 4)
              .map((s, i) => {
                const Icon = STEP_ICONS[i];
                return (
                  <div key={s.t} className="flex gap-4 border-b border-[#E2DFD6] py-5">
                    <span className="font-display w-[50px] shrink-0 text-[40px] font-bold leading-[0.9] text-[var(--accd)]">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <Icon className="mt-[3px] size-5 shrink-0 text-[var(--accd)]" />
                    <div>
                      <h3 className="font-display m-0 mb-1 text-xl font-bold uppercase leading-none">
                        {s.t}
                      </h3>
                      <p className="m-0 text-sm leading-[1.5] text-[#565A5E]">{s.d}</p>
                    </div>
                  </div>
                );
              })}
          </div>
        </section>

        {/* Cifras */}
        <HomeStatsSection labels={statsLabels} />

        {/* Testimonios */}
        <section className="px-5 py-[52px] min-[900px]:mx-auto min-[900px]:max-w-[1200px] min-[900px]:px-10 min-[900px]:py-[88px]">
          <Eyebrow>{t("testimonials.eyebrow")}</Eyebrow>
          <h2 className="font-display mt-2 text-[31px] font-bold uppercase leading-[0.95]">
            {t("testimonials.title")}
          </h2>
          <div className="mt-4 -mx-5 flex snap-x snap-mandatory gap-3.5 overflow-x-auto px-5 pb-2 min-[900px]:mx-0 min-[900px]:px-0">
            {TESTIS.map((tst) => (
              <div
                key={tst.n + tst.r}
                className="flex w-[300px] shrink-0 snap-start flex-col gap-3 rounded-[10px] border border-[#E5E2D9] bg-white p-5"
              >
                <div className="flex gap-[3px] text-[#EFB810]">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="size-[17px] fill-current stroke-none" />
                  ))}
                </div>
                <p className="m-0 text-[14.5px] leading-[1.55] text-[#2A2D30]">{tst.q}</p>
                <div className="mt-auto flex items-center gap-2.5">
                  <span className="font-display flex size-[42px] shrink-0 items-center justify-center rounded-full bg-[#17191B] text-[15px] font-bold text-white">
                    {tst.ini}
                  </span>
                  <div>
                    <p className="m-0 text-[13.5px] font-bold">{tst.n}</p>
                    <p className="m-0 text-xs text-[#7A7E82]">{tst.r}</p>
                  </div>
                </div>
              </div>
            ))}
            <div className="flex w-[220px] shrink-0 snap-start flex-col items-start justify-center gap-2.5 rounded-[10px] border border-[#E5E2D9] bg-white p-5">
              <span className="flex size-10 items-center justify-center rounded-full border-[1.5px] border-[#E0DDD3] text-lg font-bold text-[#4285F4]">
                G
              </span>
              <span className="font-display text-[34px] font-bold leading-none">4,9</span>
              <div className="flex gap-[3px] text-[#EFB810]">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="size-[15px] fill-current stroke-none" />
                ))}
              </div>
              <p className="m-0 text-xs text-[#7A7E82]">{t("testimonials.googleNote")}</p>
            </div>
          </div>
        </section>

        {/* Por qué nosotros */}
        <section className="px-5 pt-0 pb-[52px] min-[900px]:mx-auto min-[900px]:max-w-[1200px] min-[900px]:px-10 min-[900px]:pb-[88px]">
          <Eyebrow>{t("why.eyebrow")}</Eyebrow>
          <h2 className="font-display mt-2 text-[31px] font-bold uppercase leading-[0.95]">
            {t("why.title")}
          </h2>
          <div>
            {whys.map((w, i) => {
              const Icon = WHY_ICONS[i];
              return (
                <div key={w.title} className="flex flex-col gap-2.5 border-b border-[#E2DFD6] py-[22px]">
                  <span className="flex size-11 items-center justify-center rounded-lg bg-[var(--acc)]/[.13] text-[var(--accd)]">
                    <Icon className="size-5" />
                  </span>
                  <h3 className="font-display m-0 text-xl font-bold uppercase leading-none">
                    {w.title}
                  </h3>
                  <p className="m-0 text-sm leading-[1.5] text-[#565A5E]">{w.desc}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Vídeo */}
        <section className="bg-[#17191B] text-white">
          <div className="px-5 py-[52px] min-[900px]:mx-auto min-[900px]:max-w-[1200px] min-[900px]:px-10 min-[900px]:py-[88px]">
            <Eyebrow>{t("video.eyebrow")}</Eyebrow>
            <h2 className="font-display mt-2 text-[31px] font-bold uppercase leading-[0.95]">
              {t("video.title")}
            </h2>
            <VideoThumb />
            <p className="m-0 mt-3 text-center text-[13px] text-[#A2A7AB]">
              {t("video.caption")}
            </p>
          </div>
        </section>

        {/* FAQ */}
        <section className="px-5 py-[52px] min-[900px]:mx-auto min-[900px]:max-w-[1200px] min-[900px]:px-10 min-[900px]:py-[88px]">
          <Eyebrow>{t("faq.eyebrow")}</Eyebrow>
          <h2 className="font-display mt-2 text-[31px] font-bold uppercase leading-[0.95]">
            {t("faq.title")}
          </h2>
          <Accordion type="single" collapsible className="mt-2 min-[900px]:max-w-[900px]">
            {faqs.map((f, i) => (
              <AccordionItem key={i} value={`item-${i}`}>
                <AccordionTrigger>{f.q}</AccordionTrigger>
                <AccordionContent>{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>

        {/* CTA final */}
        <HomeCtaForm />
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
