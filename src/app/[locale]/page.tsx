"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import {
  Phone,
  X,
  ChevronRight,
  Star,
  MapPin,
  Clock,
  FileText,
  Wrench,
  Key,
  Layers,
  ShieldCheck,
  Play,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { StickyCta } from "@/components/sticky-cta";
import { WhatsappIcon } from "@/components/icons";
import { TEL, TEL_LABEL, waHref } from "@/lib/site";
import { formatPrice } from "@/lib/format-price";
import type { Locale } from "@/i18n/routing";

const CARD_AMOUNTS = [18900, 24900, 15900, null];
const STEP_ICONS = [MapPin, FileText, Wrench, Key];
const WHY_ICONS = [FileText, Layers, ShieldCheck];

const PROYECTOS = [
  { tipo: "Panorámica", t: "Club deportivo — nombre", loc: "Valencia, España", dato: "Entregada en 6 semanas" },
  { tipo: "Pádel ×3", t: "Polideportivo municipal", loc: "Alicante, España", dato: "3 pistas · plazo cumplido" },
  { tipo: "Pickleball", t: "Résidence privada", loc: "Toulouse, Francia", dato: "Pádel + pickleball" },
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

function useCountUp(active: boolean) {
  const [vals, setVals] = useState([0, 0, 0, 0]);
  const ran = useRef(false);

  useEffect(() => {
    if (!active || ran.current) return;
    ran.current = true;
    const targets = [17, 120, 10, 4];
    const duration = 1400;
    const t0 = performance.now();
    let raf: number;
    const step = (t: number) => {
      const p = Math.min(1, (t - t0) / duration);
      const e = 1 - Math.pow(1 - p, 3);
      setVals(targets.map((tg) => Math.round(tg * e)));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [active]);

  return vals;
}

export default function HomePage() {
  const t = useTranslations();
  const locale = useLocale() as Locale;
  const [sent, setSent] = useState(false);
  const [statsInView, setStatsInView] = useState(false);
  const statsRef = useRef<HTMLDivElement>(null);
  const [c0, c1, c2, c3] = useCountUp(statsInView);

  const cards = t.raw("build.cards") as BuildCard[];
  const stepsShort = (t.raw("process.timeline.steps") as { t: string; d: string }[]).slice(0, 4);
  const whys = t.raw("why.items") as WhyItem[];
  const faqs = t.raw("faq.items") as FaqItem[];
  const statsLabels = t.raw("stats.labels") as string[];
  const badges = t.raw("hero.badges") as string[];

  useEffect(() => {
    const el = statsRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setStatsInView(true);
        });
      },
      { threshold: 0.35 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div className="bg-[#F4F2EE] text-[#1A1C1E]">
      <SiteHeader />

      <main className="pt-16 pb-[58px] min-[900px]:pt-[74px] min-[900px]:pb-0">
        {/* Hero */}
        <section className="relative flex min-h-[648px] bg-[#17191B] min-[900px]:min-h-[680px]">
          <div className="absolute inset-0">
            <Image
              src="/hero.webp"
              alt="Pista de pádel en construcción"
              fill
              priority
              className="object-cover"
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
              return (
                <div key={c.title} className="overflow-hidden rounded-[10px] border border-[#E5E2D9] bg-white">
                  <div className="relative aspect-4/3 bg-[#E7E4DC] min-[900px]:aspect-[16/10]" />
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
                </div>
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
                  <div className="aspect-4/3 bg-[#26292D]" />
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
            <Button variant="outline" className="mt-4 w-full border-white/30 min-[900px]:mx-auto min-[900px]:max-w-[460px]">
              {t("nav.projects")} <ChevronRight className="size-[17px]" />
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
            {stepsShort.map((s, i) => {
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
        <section ref={statsRef} className="bg-[#17191B] px-5 py-[52px] text-white min-[900px]:py-[88px]">
          <div className="grid grid-cols-2 gap-x-4 gap-y-7 min-[900px]:mx-auto min-[900px]:max-w-[1000px] min-[900px]:grid-cols-4">
            <Stat value={`${c0}+`} label={statsLabels[0]} />
            <Stat value={`+${c1}`} label={statsLabels[1]} />
            <Stat value={`${c2}`} label={statsLabels[2]} />
            <Stat value={`${c3}`} label={statsLabels[3]} />
          </div>
        </section>

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
        <section className="relative overflow-hidden bg-[#17191B]">
          <div className="absolute inset-0 bg-[#0F1113]/88" />
          <div className="relative flex flex-col gap-3.5 px-5 py-14 text-white min-[900px]:mx-auto min-[900px]:max-w-[1200px] min-[900px]:items-start min-[900px]:px-10">
            <Eyebrow>{t("cta.eyebrow")}</Eyebrow>
            <h2 className="font-display text-[34px] font-bold uppercase leading-[0.95] text-white">
              {t("cta.title")}
            </h2>
            <p className="m-0 text-[15px] leading-[1.5] text-[#C9CDD0]">
              {t("cta.sub")}
            </p>
            <Button variant="whatsapp" asChild>
              <a href={waHref(t("common.waMessage"))}>
                <WhatsappIcon className="size-5" />
                {t("common.whatsappDirect")}
              </a>
            </Button>
            <Button variant="outline" asChild>
              <a href={`tel:${TEL}`}>
                <Phone className="size-5" />
                {t("common.call")} · {TEL_LABEL}
              </a>
            </Button>
            <div className="my-1 flex items-center gap-3 text-xs font-semibold uppercase tracking-wide text-[#7A7E82] before:h-px before:flex-1 before:bg-[#2B3034] after:h-px after:flex-1 after:bg-[#2B3034]">
              {t("cta.or")}
            </div>
            {!sent ? (
              <form
                className="flex flex-col gap-3"
                onSubmit={(e) => {
                  e.preventDefault();
                  setSent(true);
                }}
              >
                <Field id="f-nom" label={t("cta.nameLabel")} placeholder={t("cta.namePh")} />
                <Field id="f-tel" label={t("cta.phoneLabel")} placeholder="+34 600 000 000" type="tel" />
                <div>
                  <label htmlFor="f-tipo" className="mb-1.5 block text-[11.5px] font-semibold uppercase tracking-wide text-[#9FA4A8]">
                    {t("cta.typeLabel")}
                  </label>
                  <select
                    id="f-tipo"
                    className="h-[50px] w-full rounded-lg border-[1.5px] border-[#3A3F44] bg-[#212428] px-3.5 text-[15px] font-medium text-white"
                  >
                    {(t.raw("cta.typeOptions") as string[]).map((opt) => (
                      <option key={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
                <Button type="submit" className="w-full">
                  {t("cta.submit")}
                </Button>
                <p className="m-0 text-[11.5px] leading-[1.5] text-[#7A7E82]">
                  {t("cta.privacy")}
                </p>
              </form>
            ) : (
              <div className="flex flex-col gap-3 rounded-[10px] border-[1.5px] border-[var(--acc)]/40 bg-[var(--acc)]/[.12] p-5">
                <h3 className="font-display m-0 text-xl font-bold uppercase leading-none text-white">
                  {t("cta.successTitle")}
                </h3>
                <p className="m-0 text-[15px] text-[#C9CDD0]">
                  {t("cta.successSub")}
                </p>
                <Button variant="whatsapp" asChild>
                  <a href={waHref(t("common.waMessage"))}>
                    <WhatsappIcon className="size-5" />
                    {t("cta.openWhatsApp")}
                  </a>
                </Button>
              </div>
            )}
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
    <span className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--accd)] before:h-[3px] before:w-4 before:bg-[var(--acc)]">
      {children}
    </span>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <div className="font-display text-[62px] font-bold leading-[0.9] text-[var(--acc)] min-[900px]:text-[78px]">
        {value}
      </div>
      <div className="mt-1.5 text-[12.5px] font-semibold uppercase tracking-wide text-[#9FA4A8]">
        {label}
      </div>
    </div>
  );
}

function Field({
  id,
  label,
  placeholder,
  type = "text",
}: {
  id: string;
  label: string;
  placeholder: string;
  type?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-[11.5px] font-semibold uppercase tracking-wide text-[#9FA4A8]">
        {label}
      </label>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        className="h-[50px] w-full rounded-lg border-[1.5px] border-[#3A3F44] bg-[#212428] px-3.5 text-[15px] font-medium text-white placeholder:text-[#565A5E]"
      />
    </div>
  );
}

function VideoThumb() {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative mt-4 aspect-video overflow-hidden rounded-[10px] bg-[#0F1113]">
      <div className="absolute inset-0 bg-black/35" />
      <button
        onClick={() => setOpen(true)}
        aria-label="Ver vídeo"
        className="absolute inset-0 m-auto flex size-[66px] items-center justify-center rounded-full bg-[var(--acc)] text-[#07130C] shadow-[0_10px_34px_rgba(0,0,0,0.45)]"
      >
        <Play className="ml-[3px] size-[26px] fill-current" />
      </button>
      {open && (
        <div
          className="fixed inset-0 z-70 flex items-center justify-center bg-[#0A0C0E]/85 p-5"
          onClick={() => setOpen(false)}
        >
          <div className="relative flex aspect-video w-full items-center justify-center rounded-[10px] bg-black">
            <button
              onClick={() => setOpen(false)}
              aria-label="Cerrar"
              className="absolute -top-[46px] right-0 flex size-10 items-center justify-center rounded-lg border-[1.5px] border-white/35 text-white"
            >
              <X className="size-5" />
            </button>
            <span className="font-mono text-xs text-[#9FA4A8]">VÍDEO OBRA</span>
          </div>
        </div>
      )}
    </div>
  );
}
