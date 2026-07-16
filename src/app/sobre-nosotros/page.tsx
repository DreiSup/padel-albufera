"use client";

import { useEffect, useRef, useState } from "react";
import { Heart, MapPin, Phone, ShieldCheck, Users, Wrench } from "lucide-react";

import { Button } from "@/components/ui/button";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { StickyCta } from "@/components/sticky-cta";
import { WhatsappIcon } from "@/components/icons";
import { TEL, TEL_LABEL, waHref } from "@/lib/site";

const MILESTONES = [
  { y: "2009", t: "Arrancamos pavimentando pistas deportivas en la Comunitat Valenciana." },
  { y: "2014", t: "Damos el salto a la construcción llave en mano de pistas de pádel." },
  { y: "2018", t: "Primeros proyectos fuera de España: empezamos a construir en Francia." },
  { y: "2022", t: "Incorporamos el pickleball y las cubiertas a nuestro catálogo." },
  { y: "2025", t: "Superamos los 120 proyectos y ampliamos a Alemania y Bélgica." },
];

const VALUES = [
  { icon: Wrench, t: "Equipo propio", d: "Pisamos cada obra nosotros. Sin cadenas de subcontratas que diluyen la responsabilidad." },
  { icon: ShieldCheck, t: "La palabra por delante", d: "Presupuesto y plazo cerrados por escrito. Lo que decimos, lo firmamos." },
  { icon: Heart, t: "Trato de tú a tú", d: "Un único interlocutor de principio a fin, hables el idioma que hables." },
  { icon: Users, t: "Relación a largo plazo", d: "La mayoría de clientes repiten o nos recomiendan. Ese es nuestro mejor comercial." },
];

const TEAM = [
  { n: "Nombre Apellido", r: "Fundador · Dirección de obra" },
  { n: "Nombre Apellido", r: "Jefe de obra" },
  { n: "Nombre Apellido", r: "Proyectos y presupuestos" },
  { n: "Nombre Apellido", r: "Atención al cliente" },
];

const ZONES = ["Comunitat Valenciana", "Resto de España", "Francia", "Alemania", "Bélgica"];

const CERTS = ["CERT 01", "CERT 02", "CERT 03", "SEGURO RC", "HOMOLOG.", "ISO ····"];

function useCountUp(active: boolean, targets: number[]) {
  const [vals, setVals] = useState(targets.map(() => 0));
  const ran = useRef(false);

  useEffect(() => {
    if (!active || ran.current) return;
    ran.current = true;
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  return vals;
}

export default function SobreNosotrosPage() {
  const [statsInView, setStatsInView] = useState(false);
  const statsRef = useRef<HTMLDivElement>(null);
  const [c0, c1, c2, c3] = useCountUp(statsInView, [17, 120, 4, 12]);

  useEffect(() => {
    const el = statsRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setStatsInView(true)),
      { threshold: 0.3 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div className="bg-[#F4F2EE] text-[#1A1C1E]">
      <SiteHeader />

      <main className="pt-16 pb-[58px] min-[900px]:pt-[74px] min-[900px]:pb-0">
        {/* Hero */}
        <section className="relative flex min-h-[380px] bg-[#17191B] min-[900px]:min-h-[460px]">
          <div className="absolute inset-0 flex items-center justify-center bg-[#26292D]">
            <span className="font-mono text-[11px] tracking-wide text-[#8A8E92]">
              FOTO REAL — equipo / obra
            </span>
          </div>
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, rgba(13,15,16,.4), rgba(13,15,16,.2) 30%, rgba(13,15,16,.9) 74%)",
            }}
          />
          <div className="relative mt-auto flex w-full flex-col gap-3 px-5 pb-6 min-[900px]:mx-auto min-[900px]:max-w-[1200px] min-[900px]:px-10">
            <span className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--acc)] before:h-[3px] before:w-4 before:bg-[var(--acc)]">
              Quiénes somos
            </span>
            <h1 className="font-display text-[38px] leading-[0.95] font-bold uppercase text-white min-[900px]:text-[58px]">
              17 años construyendo donde se juega
            </h1>
            <p className="m-0 text-[15px] leading-[1.5] text-[#D9D7D1]">
              Un equipo propio de obra deportiva. Sin intermediarios, sin subcontratas encadenadas.
            </p>
          </div>
        </section>

        {/* Historia */}
        <section className="px-5 py-[52px] min-[900px]:mx-auto min-[900px]:max-w-[1200px] min-[900px]:px-10 min-[900px]:py-[88px]">
          <Eyebrow>Nuestra historia</Eyebrow>
          <h2 className="font-display mt-2 text-[31px] font-bold uppercase leading-[0.95]">
            De un taller local a 4 países
          </h2>
          <p className="m-0 mt-3 text-[17px] leading-[1.6] text-[#33363A]">
            Empezamos pavimentando pistas en la Comunitat Valenciana. Hoy construimos pádel, pickleball y
            cubiertas por toda España y en Francia, Alemania y Bélgica, con el mismo equipo y la misma forma
            de trabajar: <strong>de tú a tú y con la palabra por delante.</strong>
          </p>
          <div className="mt-4 aspect-4/3 rounded-[10px] bg-[#E7E4DC] min-[900px]:max-w-[1000px]" />
          <div ref={statsRef} className="mt-6 grid grid-cols-2 gap-x-4 gap-y-6 min-[900px]:max-w-[1000px] min-[900px]:grid-cols-4">
            <Stat value={`${c0}+`} label="años de experiencia" />
            <Stat value={`+${c1}`} label="proyectos entregados" />
            <Stat value={`${c2}`} label="países en Europa" />
            <Stat value={`${c3}`} label="personas en el equipo" />
          </div>
        </section>

        {/* Hitos */}
        <section className="bg-[#17191B] text-white">
          <div className="px-5 py-[52px] min-[900px]:mx-auto min-[900px]:max-w-[1200px] min-[900px]:px-10 min-[900px]:py-[88px]">
            <Eyebrow>Nuestra trayectoria</Eyebrow>
            <h2 className="font-display mt-2 text-[31px] font-bold uppercase leading-[0.95] text-white">
              Los hitos que nos trajeron aquí
            </h2>
            <div className="relative mt-4 pl-[46px] before:absolute before:top-1.5 before:bottom-1.5 before:left-2 before:w-0.5 before:bg-[#2B3034] min-[900px]:max-w-[760px]">
              {MILESTONES.map((m) => (
                <div key={m.y} className="relative pb-[22px] before:absolute before:-left-[42px] before:top-1 before:size-3.5 before:rounded-full before:bg-[var(--acc)] before:shadow-[0_0_0_4px_#17191B]">
                  <div className="font-display text-[22px] font-bold leading-none text-[var(--acc)]">{m.y}</div>
                  <p className="m-0 mt-1 text-[14.5px] leading-[1.5] text-[#C9CDD0]">{m.t}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Valores */}
        <section className="px-5 py-[52px] min-[900px]:mx-auto min-[900px]:max-w-[1200px] min-[900px]:px-10 min-[900px]:py-[88px]">
          <Eyebrow>Cómo trabajamos</Eyebrow>
          <h2 className="font-display mt-2 text-[31px] font-bold uppercase leading-[0.95]">
            Cuatro cosas que no negociamos
          </h2>
          <div className="mt-4 flex flex-col gap-3">
            {VALUES.map((v) => (
              <div key={v.t} className="flex items-start gap-3.5 rounded-[10px] border border-[#E5E2D9] bg-white p-[18px]">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-[10px] bg-[var(--acc)]/[.14] text-[var(--accd)]">
                  <v.icon className="size-5" />
                </span>
                <div>
                  <h3 className="font-display m-0 mb-1 text-lg font-bold uppercase leading-none">{v.t}</h3>
                  <p className="m-0 text-[13.5px] leading-[1.5] text-[#565A5E]">{v.d}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Equipo */}
        <section className="px-5 pt-0 pb-[52px] min-[900px]:mx-auto min-[900px]:max-w-[1200px] min-[900px]:px-10 min-[900px]:pb-[88px]">
          <Eyebrow>El equipo</Eyebrow>
          <h2 className="font-display mt-2 text-[31px] font-bold uppercase leading-[0.95]">
            Las personas que pisan tu obra
          </h2>
          <p className="m-0 mt-2 text-[15px] leading-[1.55] text-[#565A5E]">
            Nombres, cargos y fotos reales — pendientes de facilitar.
          </p>
          <div className="mt-4 grid grid-cols-2 gap-3.5 min-[900px]:grid-cols-4">
            {TEAM.map((t) => (
              <div key={t.r} className="overflow-hidden rounded-[10px] border border-[#E5E2D9] bg-white">
                <div className="aspect-square bg-[#E7E4DC]" />
                <div className="px-[13px] pt-3 pb-3.5">
                  <h3 className="font-display m-0 text-[17px] font-bold uppercase leading-none">{t.n}</h3>
                  <p className="m-0 mt-0.5 text-xs text-[#7A7E82]">{t.r}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Cobertura */}
        <section className="bg-[#17191B] text-white">
          <div className="px-5 py-[52px] min-[900px]:mx-auto min-[900px]:max-w-[1200px] min-[900px]:px-10 min-[900px]:py-[88px]">
            <Eyebrow>Dónde trabajamos</Eyebrow>
            <h2 className="font-display mt-2 text-[31px] font-bold uppercase leading-[0.95] text-white">
              España, Francia, Alemania y Bélgica
            </h2>
            <div className="mt-4 aspect-[16/10] rounded-[10px] bg-[#26292D] min-[900px]:max-w-[1000px]" />
            <div className="mt-3.5 flex flex-wrap gap-2">
              {ZONES.map((z) => (
                <span key={z} className="flex items-center gap-1.5 rounded-md border border-[#2B3034] bg-[#212428] px-2.5 py-1.5 text-[12.5px] font-semibold text-[#E4E2DC]">
                  <MapPin className="size-3.5 text-[var(--acc)]" />
                  {z}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Certificaciones */}
        <section className="px-5 py-[52px] min-[900px]:mx-auto min-[900px]:max-w-[1200px] min-[900px]:px-10 min-[900px]:py-[88px]">
          <Eyebrow>Garantías y certificaciones</Eyebrow>
          <h2 className="font-display mt-2 text-[31px] font-bold uppercase leading-[0.95]">
            Respaldo que puedes comprobar
          </h2>
          <p className="m-0 mt-2 text-[15px] leading-[1.55] text-[#565A5E]">
            Logos de certificaciones, seguros y homologaciones — pendientes de facilitar.
          </p>
          <div className="mt-4 grid grid-cols-3 gap-2.5 min-[900px]:grid-cols-6">
            {CERTS.map((c) => (
              <span
                key={c}
                className="flex h-16 items-center justify-center rounded-lg border border-[#E5E2D9] bg-white p-1 text-center font-mono text-[9px] font-semibold text-[#A7A399]"
              >
                {c}
              </span>
            ))}
          </div>
        </section>

        {/* CTA final */}
        <section className="bg-[#17191B] text-white">
          <div className="flex flex-col items-start gap-3.5 px-5 py-14 min-[900px]:mx-auto min-[900px]:max-w-[1200px] min-[900px]:px-10">
            <Eyebrow>Hablamos de tú a tú</Eyebrow>
            <h2 className="font-display text-[34px] font-bold uppercase leading-[0.95] text-white">
              Conócenos con una visita
            </h2>
            <p className="m-0 text-[15px] leading-[1.5] text-[#C9CDD0]">
              Ven a ver una obra terminada o te visitamos a ti. Gratis y sin compromiso.
            </p>
            <Button variant="whatsapp" asChild>
              <a href={waHref("Hola, quiero conocer vuestro trabajo y pedir una visita.")}>
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
      <div className="font-display text-[56px] font-bold leading-[0.85] text-[var(--acc)]">{value}</div>
      <div className="mt-1.5 text-xs font-semibold uppercase tracking-wide text-[#9FA4A8]">{label}</div>
    </div>
  );
}
