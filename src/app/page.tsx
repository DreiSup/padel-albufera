"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import {
  Phone,
  Menu,
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

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const WA_NUMBER = "34614207633";
const WA_MESSAGE = "Hola, quiero un presupuesto para construir una pista.";
const waHref = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(WA_MESSAGE)}`;
const TEL = "+34614207633";
const TEL_LABEL = "+34 614 20 76 33";

const NAV_LINKS = [
  "Inicio",
  "Pistas de pádel",
  "Pistas de pickleball",
  "Proyectos",
  "Proceso",
  "Sobre nosotros",
  "Contacto",
];

const LANGS = ["ES", "FR", "EN", "DE", "NL"];

const CARDS = [
  {
    t: "Pista de pádel estándar",
    d: "La configuración más demandada por clubes y comunidades.",
    p: "desde 18.900 €",
  },
  {
    t: "Pista de pádel panorámica",
    d: "Vidrio sin postes intermedios: máxima visibilidad, acabado premium.",
    p: "desde 24.900 €",
  },
  {
    t: "Pista de pickleball",
    d: "El deporte que más crece en Europa, en la mitad de espacio.",
    p: "desde 15.900 €",
  },
  {
    t: "Pista a medida / cubiertas",
    d: "Cubiertas, cerramientos y proyectos singulares a tu medida.",
    p: "proyecto a medida",
  },
];

const PROYECTOS = [
  {
    tipo: "Panorámica",
    t: "Club deportivo — nombre",
    loc: "Valencia, España",
    dato: "Entregada en 6 semanas",
  },
  {
    tipo: "Pádel ×3",
    t: "Polideportivo municipal",
    loc: "Alicante, España",
    dato: "3 pistas · plazo cumplido",
  },
  {
    tipo: "Pickleball",
    t: "Résidence privada",
    loc: "Toulouse, Francia",
    dato: "Pádel + pickleball",
  },
];

const PASOS = [
  {
    n: "01",
    t: "Visita y estudio gratuito",
    d: "Analizamos terreno, accesos y normativa. Sin coste ni compromiso.",
    icon: MapPin,
  },
  {
    n: "02",
    t: "Proyecto y presupuesto cerrado",
    d: "Memoria técnica y precio final por escrito. Sin sorpresas.",
    icon: FileText,
  },
  {
    n: "03",
    t: "Construcción con plazo comprometido",
    d: "Equipo propio y fotos de seguimiento semanales de tu obra.",
    icon: Wrench,
  },
  {
    n: "04",
    t: "Entrega lista para jugar",
    d: "Garantía de 10 años documentada y plan de mantenimiento.",
    icon: Key,
  },
];

const WHYS = [
  {
    t: "Presupuesto cerrado",
    d: "Precio final por escrito antes de empezar. Lo que firmas es lo que pagas.",
    icon: FileText,
  },
  {
    t: "Materiales de primera",
    d: "Césped de competición, vidrio templado de 12 mm y estructura galvanizada.",
    icon: Layers,
  },
  {
    t: "Garantía 10 años",
    d: "Por escrito, con servicio postventa de mantenimiento en España y Francia.",
    icon: ShieldCheck,
  },
];

const TESTIS = [
  {
    q: "«Cumplieron plazo y presupuesto al céntimo. La pista se juega de maravilla.»",
    n: "Nombre Apellido",
    r: "Gerente · Club deportivo",
    ini: "NA",
  },
  {
    q: "«Obra limpia, comunicación constante y cero sorpresas en la factura.»",
    n: "Nombre Apellido",
    r: "Concejal de deportes · Ayuntamiento",
    ini: "NA",
  },
  {
    q: "«La comunidad votó repetir con ellos para la segunda pista.»",
    n: "Nombre Apellido",
    r: "Presidente · Comunidad de propietarios",
    ini: "NA",
  },
];

const FAQS = [
  {
    q: "¿Cuánto cuesta construir una pista de pádel?",
    a: "Una pista estándar llave en mano parte de 18.900 € y una panorámica de 24.900 € (cifras orientativas). El precio final depende de terreno, accesos y acabados: lo cerramos por escrito tras la visita gratuita.",
  },
  {
    q: "¿Cuánto tarda la obra?",
    a: "Entre 4 y 8 semanas desde el inicio de obra, según cimentación y modelo. El plazo queda comprometido en contrato.",
  },
  {
    q: "¿Qué incluye llave en mano?",
    a: "Todo: movimiento de tierras, solera, estructura, vidrio templado, césped, iluminación LED y legalización. Entregamos la pista lista para jugar.",
  },
  {
    q: "¿Trabajáis fuera de España?",
    a: "Sí. Ejecutamos obra en Francia, Alemania y Bélgica con el mismo equipo propio y la misma garantía que en España.",
  },
  {
    q: "¿Qué garantía ofrecéis?",
    a: "10 años por escrito sobre estructura y obra civil, más servicio postventa de mantenimiento.",
  },
  {
    q: "¿Hacéis reformas de pistas existentes?",
    a: "Sí: sustitución de césped, vidrio, redes e iluminación, y reconversión de pistas de tenis en pádel o pickleball.",
  },
];

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
  const [menuOpen, setMenuOpen] = useState(false);
  const [compact, setCompact] = useState(false);
  const [sent, setSent] = useState(false);
  const [statsInView, setStatsInView] = useState(false);
  const [lang, setLang] = useState("ES");
  const statsRef = useRef<HTMLDivElement>(null);
  const [c0, c1, c2, c3] = useCountUp(statsInView);

  useEffect(() => {
    const onScroll = () => setCompact(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
      {/* Header */}
      <header
        className={`fixed top-0 left-0 right-0 z-40 border-b border-[#E2DFD6] bg-[#F6F4EF]/95 backdrop-blur transition-[height] ${
          compact ? "h-[54px]" : "h-16"
        }`}
      >
        <div className="mx-auto flex h-full max-w-5xl items-center justify-between px-4">
          <Image
            src="/logo.webp"
            alt="Pádel & Pickleball Albufera"
            width={140}
            height={34}
            className={`block w-auto transition-[height] ${compact ? "h-[29px]" : "h-[34px]"}`}
            priority
          />
          <div className="flex items-center gap-2">
            <a
              href={`tel:${TEL}`}
              aria-label="Llamar"
              className="flex size-11 items-center justify-center rounded-lg border-[1.5px] border-[#E0DDD3] bg-white text-[#1A1C1E]"
            >
              <Phone className="size-5" />
            </a>
            <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
              <SheetTrigger asChild>
                <button
                  aria-label="Menú"
                  className="flex size-11 items-center justify-center rounded-lg border-[1.5px] border-[#E0DDD3] bg-white text-[#1A1C1E]"
                >
                  <Menu className="size-5" />
                </button>
              </SheetTrigger>
              <SheetContent>
                <div className="mb-4 flex items-center justify-between">
                  <Image src="/logo.webp" alt="" width={120} height={30} style={{ height: 30, width: "auto" }} />
                  <SheetClose asChild>
                    <button
                      aria-label="Cerrar menú"
                      className="flex size-11 items-center justify-center rounded-lg border-[1.5px] border-[#E0DDD3] bg-white text-[#1A1C1E]"
                    >
                      <X className="size-5" />
                    </button>
                  </SheetClose>
                </div>
                <nav className="flex flex-col">
                  {NAV_LINKS.map((link) => (
                    <span
                      key={link}
                      className="font-display border-b border-[#E2DFD6] py-3 text-[19px] font-semibold uppercase tracking-wide text-[#1A1C1E]"
                    >
                      {link}
                    </span>
                  ))}
                </nav>
                <div className="mt-4 flex gap-2">
                  {LANGS.map((l) => (
                    <button
                      key={l}
                      onClick={() => setLang(l)}
                      className={`rounded-md border-[1.5px] px-[13px] py-[7px] text-[12.5px] font-semibold ${
                        lang === l
                          ? "border-[#17191B] bg-[#17191B] text-white"
                          : "border-[#D8D4C9] bg-white text-[#565A5E]"
                      }`}
                    >
                      {l}
                    </button>
                  ))}
                </div>
                <div className="mt-4 flex flex-col gap-2.5">
                  <Button variant="whatsapp" asChild>
                    <a href={waHref}>
                      <WhatsappIcon className="size-5" />
                      WhatsApp directo
                    </a>
                  </Button>
                  <Button asChild>
                    <a href={`tel:${TEL}`}>
                      <Phone className="size-5" />
                      Llamar ahora
                    </a>
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <main className="pt-16 pb-[58px]">
        {/* Hero */}
        <section className="relative flex min-h-[648px] bg-[#17191B]">
          <div className="absolute inset-0 flex items-center justify-center bg-[#26292D]">
            <span className="font-mono text-[11px] tracking-wide text-[#8A8E92]">
              FOTO REAL OBRA — hero 4:5
            </span>
          </div>
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, rgba(13,15,16,.45), rgba(13,15,16,.12) 34%, rgba(13,15,16,.9) 76%)",
            }}
          />
          <div className="relative mt-auto flex w-full flex-col gap-3.5 px-5 pb-7">
            <span className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--acc)] before:h-[3px] before:w-4 before:bg-[var(--acc)]">
              Constructora de pistas · ES · FR · DE · BE
            </span>
            <h1 className="font-display text-[43px] leading-[0.95] font-bold uppercase text-white">
              Construimos tu pista de pádel o pickleball llave en mano
            </h1>
            <p className="m-0 text-[15.5px] leading-[1.5] text-[#D9D7D1]">
              Del hormigón al último acabado. 17 años de obra deportiva. Garantía de 10 años.
            </p>
            <div className="flex flex-col gap-2.5">
              <Button asChild>
                <a href={`tel:${TEL}`}>Pide presupuesto gratis</a>
              </Button>
              <Button variant="outline" asChild>
                <a href={waHref}>
                  <WhatsappIcon className="size-5" />
                  WhatsApp directo
                </a>
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {["17+ años", "+120 proyectos", "Garantía 10 años", "ES · FR · DE · BE"].map(
                (b) => (
                  <span
                    key={b}
                    className="rounded-md border border-white/30 bg-black/40 px-[9px] py-[5px] text-[11.5px] font-semibold text-[#E8E6E0]"
                  >
                    {b}
                  </span>
                )
              )}
            </div>
          </div>
        </section>

        {/* Trust logos */}
        <section className="px-5 pt-[52px] pb-10">
          <p className="m-0 mb-4 text-center text-[12px] font-semibold uppercase tracking-[0.14em] text-[#565A5E]">
            Confían en nosotros
          </p>
          <div className="grid grid-cols-3 gap-2.5">
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
        <section className="px-5 py-[52px]">
          <Eyebrow>Qué construimos</Eyebrow>
          <h2 className="font-display mt-2 text-[31px] font-bold uppercase leading-[0.95]">
            Una pista para cada proyecto
          </h2>
          <div className="mt-4 flex flex-col gap-4">
            {CARDS.map((c) => (
              <div key={c.t} className="overflow-hidden rounded-[10px] border border-[#E5E2D9] bg-white">
                <div className="relative aspect-4/3 bg-[#E7E4DC]" />
                <div className="flex flex-col gap-2.5 p-4 pb-[18px]">
                  <h3 className="font-display m-0 text-[23px] font-bold uppercase leading-none">
                    {c.t}
                  </h3>
                  <p className="m-0 text-sm leading-[1.5] text-[#565A5E]">{c.d}</p>
                  <div className="flex items-baseline justify-between gap-2 border-t border-[#EEEBE3] pt-[11px]">
                    <span className="font-bold text-base">{c.p}</span>
                    <span className="flex items-center gap-1.5 text-sm font-semibold text-[var(--accd)]">
                      Ver detalles <ChevronRight className="size-4" />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Proyectos destacados */}
        <section className="bg-[#17191B] px-5 py-[52px] text-white">
          <Eyebrow>Proyectos destacados</Eyebrow>
          <h2 className="font-display mt-2 text-[31px] font-bold uppercase leading-[0.95]">
            Obra real, resultados reales
          </h2>
          <div className="mt-4 -mx-5 flex snap-x snap-mandatory gap-3.5 overflow-x-auto px-5 pb-2">
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
          <Button variant="outline" className="mt-4 w-full border-white/30">
            Ver todos los proyectos <ChevronRight className="size-[17px]" />
          </Button>
        </section>

        {/* Proceso */}
        <section className="px-5 py-[52px]">
          <Eyebrow>Cómo trabajamos</Eyebrow>
          <h2 className="font-display mt-2 text-[31px] font-bold uppercase leading-[0.95]">
            De la visita a la entrega, en 4 pasos
          </h2>
          <div className="mt-2">
            {PASOS.map((s) => (
              <div key={s.n} className="flex gap-4 border-b border-[#E2DFD6] py-5">
                <span className="font-display w-[50px] shrink-0 text-[40px] font-bold leading-[0.9] text-[var(--accd)]">
                  {s.n}
                </span>
                <s.icon className="mt-[3px] size-5 shrink-0 text-[var(--accd)]" />
                <div>
                  <h3 className="font-display m-0 mb-1 text-xl font-bold uppercase leading-none">
                    {s.t}
                  </h3>
                  <p className="m-0 text-sm leading-[1.5] text-[#565A5E]">{s.d}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Cifras */}
        <section ref={statsRef} className="bg-[#17191B] px-5 py-[52px] text-white">
          <div className="grid grid-cols-2 gap-x-4 gap-y-7">
            <Stat value={`${c0}+`} label="años de experiencia" />
            <Stat value={`+${c1}`} label="proyectos entregados" />
            <Stat value={`${c2}`} label="años de garantía" />
            <Stat value={`${c3}`} label="países en Europa" />
          </div>
        </section>

        {/* Testimonios */}
        <section className="px-5 py-[52px]">
          <Eyebrow>Testimonios</Eyebrow>
          <h2 className="font-display mt-2 text-[31px] font-bold uppercase leading-[0.95]">
            Lo que dicen nuestros clientes
          </h2>
          <div className="mt-4 -mx-5 flex snap-x snap-mandatory gap-3.5 overflow-x-auto px-5 pb-2">
            {TESTIS.map((t) => (
              <div
                key={t.n + t.q.slice(0, 8)}
                className="flex w-[300px] shrink-0 snap-start flex-col gap-3 rounded-[10px] border border-[#E5E2D9] bg-white p-5"
              >
                <div className="flex gap-[3px] text-[#EFB810]">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="size-[17px] fill-current stroke-none" />
                  ))}
                </div>
                <p className="m-0 text-[14.5px] leading-[1.55] text-[#2A2D30]">{t.q}</p>
                <div className="mt-auto flex items-center gap-2.5">
                  <span className="font-display flex size-[42px] shrink-0 items-center justify-center rounded-full bg-[#17191B] text-[15px] font-bold text-white">
                    {t.ini}
                  </span>
                  <div>
                    <p className="m-0 text-[13.5px] font-bold">{t.n}</p>
                    <p className="m-0 text-xs text-[#7A7E82]">{t.r}</p>
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
              <p className="m-0 text-xs text-[#7A7E82]">Nota media en Google Reviews</p>
            </div>
          </div>
        </section>

        {/* Por qué nosotros */}
        <section className="px-5 pt-0 pb-[52px]">
          <Eyebrow>Por qué nosotros</Eyebrow>
          <h2 className="font-display mt-2 text-[31px] font-bold uppercase leading-[0.95]">
            Construcción seria, sin letra pequeña
          </h2>
          <div>
            {WHYS.map((w) => (
              <div key={w.t} className="flex flex-col gap-2.5 border-b border-[#E2DFD6] py-[22px]">
                <span className="flex size-11 items-center justify-center rounded-lg bg-[var(--acc)]/[.13] text-[var(--accd)]">
                  <w.icon className="size-5" />
                </span>
                <h3 className="font-display m-0 text-xl font-bold uppercase leading-none">
                  {w.t}
                </h3>
                <p className="m-0 text-sm leading-[1.5] text-[#565A5E]">{w.d}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Vídeo */}
        <section className="bg-[#17191B] px-5 py-[52px] text-white">
          <Eyebrow>La obra, en movimiento</Eyebrow>
          <h2 className="font-display mt-2 text-[31px] font-bold uppercase leading-[0.95]">
            Así se construye una pista
          </h2>
          <VideoThumb />
          <p className="m-0 mt-3 text-center text-[13px] text-[#A2A7AB]">
            Vídeo real de obra
          </p>
        </section>

        {/* FAQ */}
        <section className="px-5 py-[52px]">
          <Eyebrow>Preguntas frecuentes</Eyebrow>
          <h2 className="font-display mt-2 text-[31px] font-bold uppercase leading-[0.95]">
            Resolvemos tus dudas
          </h2>
          <Accordion type="single" collapsible className="mt-2">
            {FAQS.map((f, i) => (
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
          <div className="relative flex flex-col gap-3.5 px-5 py-14 text-white">
            <Eyebrow>Presupuesto gratis</Eyebrow>
            <h2 className="font-display text-[34px] font-bold uppercase leading-[0.95] text-white">
              ¿Hablamos de tu proyecto?
            </h2>
            <p className="m-0 text-[15px] leading-[1.5] text-[#C9CDD0]">
              Presupuesto gratis y sin compromiso en 48 h. Sin letra pequeña.
            </p>
            <Button variant="whatsapp" asChild>
              <a href={waHref}>
                <WhatsappIcon className="size-5" />
                WhatsApp directo
              </a>
            </Button>
            <Button variant="outline" asChild>
              <a href={`tel:${TEL}`}>
                <Phone className="size-5" />
                Llamar · {TEL_LABEL}
              </a>
            </Button>
            <div className="my-1 flex items-center gap-3 text-xs font-semibold uppercase tracking-wide text-[#7A7E82] before:h-px before:flex-1 before:bg-[#2B3034] after:h-px after:flex-1 after:bg-[#2B3034]">
              o déjanos tus datos
            </div>
            {!sent ? (
              <form
                className="flex flex-col gap-3"
                onSubmit={(e) => {
                  e.preventDefault();
                  setSent(true);
                }}
              >
                <Field id="f-nom" label="Nombre" placeholder="Tu nombre" />
                <Field id="f-tel" label="Teléfono" placeholder="+34 600 000 000" type="tel" />
                <div>
                  <label htmlFor="f-tipo" className="mb-1.5 block text-[11.5px] font-semibold uppercase tracking-wide text-[#9FA4A8]">
                    Tipo de proyecto
                  </label>
                  <select
                    id="f-tipo"
                    className="h-[50px] w-full rounded-lg border-[1.5px] border-[#3A3F44] bg-[#212428] px-3.5 text-[15px] font-medium text-white"
                  >
                    <option>Pista de pádel</option>
                    <option>Pádel panorámica</option>
                    <option>Pickleball</option>
                    <option>Cubierta / cerramiento</option>
                    <option>Reforma</option>
                    <option>Otro</option>
                  </select>
                </div>
                <Button type="submit" className="w-full">
                  Recibir presupuesto gratis
                </Button>
                <p className="m-0 text-[11.5px] leading-[1.5] text-[#7A7E82]">
                  Al enviar aceptas la política de privacidad. Respuesta en menos de 24 h laborables.
                </p>
              </form>
            ) : (
              <div className="flex flex-col gap-3 rounded-[10px] border-[1.5px] border-[var(--acc)]/40 bg-[var(--acc)]/[.12] p-5">
                <h3 className="font-display m-0 text-xl font-bold uppercase leading-none text-white">
                  Recibido. Te contactamos en menos de 24 h laborables.
                </h3>
                <p className="m-0 text-[15px] text-[#C9CDD0]">
                  ¿Prisa? Escríbenos ahora por WhatsApp:
                </p>
                <Button variant="whatsapp" asChild>
                  <a href={waHref}>
                    <WhatsappIcon className="size-5" />
                    Abrir WhatsApp
                  </a>
                </Button>
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#0F1113] px-5 pt-12 pb-[58px] text-[#A9ADB0]">
        <span className="inline-block rounded-lg bg-[#F4F2EE] px-3.5 py-2.5">
          <Image src="/logo.webp" alt="Pádel & Pickleball Albufera" width={140} height={34} style={{ height: 34, width: "auto" }} />
        </span>
        <p className="mt-3 text-sm font-semibold leading-[1.8] text-[#D8D6CF]">
          Construcción de pistas de pádel y pickleball en España, Francia, Alemania y Bélgica
        </p>
        <p className="text-sm leading-[1.8]">
          Pavimentos Albufera S.L.
          <br />
          CIF B-00000000
          <br />
          C/ Dirección física, 00 · 46000 Valencia
        </p>
        <Divider />
        <FootHeading>Navegación</FootHeading>
        <p className="text-sm leading-[1.8]">
          Inicio · Pistas de pádel · Pistas de pickleball
          <br />
          Proyectos · Proceso · Sobre nosotros · Contacto
        </p>
        <Divider />
        <FootHeading>Contacto</FootHeading>
        <p className="text-sm leading-[1.8]">
          <a href={`tel:${TEL}`} className="text-[#D8D6CF]">
            {TEL_LABEL}
          </a>
          <br />
          <a href={waHref} className="text-[#D8D6CF]">
            WhatsApp · respuesta &lt; 1 h laborable
          </a>
          <br />
          info@padelalbufera.com
          <br />
          L–V · 8:00–18:00
        </p>
        <Divider />
        <FootHeading>Zonas de servicio</FootHeading>
        <p className="text-sm leading-[1.8]">
          Comunitat Valenciana
          <br />
          Resto de España
          <br />
          Francia · Alemania · Bélgica
        </p>
        <Divider />
        <div className="flex flex-col gap-2">
          <span className="flex items-center gap-2 rounded-md border border-[#2B3034] px-2.5 py-2 text-[12.5px] font-semibold text-[#D8D6CF]">
            <ShieldCheck className="size-5 text-[var(--acc)]" /> Garantía 10 años
          </span>
          <span className="flex items-center gap-2 rounded-md border border-[#2B3034] px-2.5 py-2 text-[12.5px] font-semibold text-[#D8D6CF]">
            <Clock className="size-5 text-[var(--acc)]" /> 17+ años de experiencia
          </span>
        </div>
        <Divider />
        <p className="text-xs leading-[2] text-[#6A6E72]">
          © 2026 Pavimentos Albufera · Política de privacidad · Aviso legal · Cookies
        </p>
      </footer>

      {/* Sticky bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 z-45 flex shadow-[0_-4px_18px_rgba(0,0,0,0.16)]">
        <a
          href={waHref}
          className="flex h-[58px] flex-1 items-center justify-center gap-2 bg-[#25D366] text-[15.5px] font-bold text-[#062B14]"
        >
          <WhatsappIcon className="size-5" /> WhatsApp
        </a>
        <a
          href={`tel:${TEL}`}
          className="flex h-[58px] flex-1 items-center justify-center gap-2 bg-[var(--acc)] text-[15.5px] font-bold text-[#07130C]"
        >
          <Phone className="size-5" /> Llamar
        </a>
      </div>
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
      <div className="font-display text-[62px] font-bold leading-[0.9] text-[var(--acc)]">
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

function Divider() {
  return <div className="my-6 h-px bg-[#22262A]" />;
}

function FootHeading({ children }: { children: React.ReactNode }) {
  return (
    <h4 className="font-display m-0 mb-3 text-[17px] font-bold uppercase tracking-wide text-white">
      {children}
    </h4>
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

function WhatsappIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
    </svg>
  );
}
