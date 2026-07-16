"use client";

import { useState } from "react";
import { Phone, Star, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { StickyCta } from "@/components/sticky-cta";
import { WhatsappIcon } from "@/components/icons";
import { TEL, TEL_LABEL, waHref } from "@/lib/site";

interface Project {
  id: string;
  t: string;
  tipo: string;
  tags: string[];
  loc: string;
  year: string;
  aspect: "4/3" | "3/4";
  plazo: string;
  alcance: string;
  quote: string;
}

const PROJECTS: Project[] = [
  { id: "pr1", t: "Club deportivo — nombre", tipo: "Panorámica", tags: ["padel", "pano", "es"], loc: "Valencia, España", year: "2025", aspect: "3/4", plazo: "6 semanas", alcance: "Pista llave en mano + iluminación", quote: "«Cumplieron plazo y presupuesto al céntimo.»" },
  { id: "pr2", t: "Polideportivo municipal", tipo: "Pádel ×3", tags: ["padel", "es"], loc: "Alicante, España", year: "2024", aspect: "4/3", plazo: "9 semanas", alcance: "3 pistas + obra civil completa", quote: "«Licitación exigente y ejecución impecable.»" },
  { id: "pr3", t: "Résidence privada", tipo: "Pickleball", tags: ["pkb", "fr"], loc: "Toulouse, Francia", year: "2025", aspect: "4/3", plazo: "4 semanas", alcance: "Pista + cerramiento perimetral", quote: "«Équipe sérieuse, chantier propre.»" },
  { id: "pr4", t: "Comunidad de propietarios", tipo: "Pádel", tags: ["padel", "es"], loc: "Castellón, España", year: "2024", aspect: "3/4", plazo: "5 semanas", alcance: "Pista estándar + drenaje", quote: "«La comunidad votó repetir para una segunda pista.»" },
  { id: "pr5", t: "Club — nombre", tipo: "Panorámica", tags: ["padel", "pano", "fr"], loc: "Lyon, Francia", year: "2025", aspect: "4/3", plazo: "6 semanas", alcance: "2 pistas panorámicas", quote: "«Résultat premium, délai tenu.»" },
  { id: "pr6", t: "Hotel resort", tipo: "Pickleball", tags: ["pkb", "es"], loc: "Mallorca, España", year: "2024", aspect: "3/4", plazo: "5 semanas", alcance: "2 pistas + zona de sombra", quote: "«Nuestros huéspedes las usan a diario.»" },
  { id: "pr7", t: "Club deportivo — nombre", tipo: "Cubierta", tags: ["cub", "es"], loc: "Valencia, España", year: "2023", aspect: "4/3", plazo: "3 semanas", alcance: "Cubierta sobre pista existente", quote: "«Ahora jugamos también en enero.»" },
  { id: "pr8", t: "Complejo municipal", tipo: "Pádel + cubierta", tags: ["padel", "cub", "fr"], loc: "Burdeos, Francia", year: "2024", aspect: "3/4", plazo: "10 semanas", alcance: "2 pistas cubiertas llave en mano", quote: "«Un seul interlocuteur du début à la fin.»" },
];

const FILTERS = [
  { k: "all", label: "Todos" },
  { k: "padel", label: "Pádel" },
  { k: "pano", label: "Panorámica" },
  { k: "pkb", label: "Pickleball" },
  { k: "cub", label: "Cubiertas" },
  { k: "es", label: "España" },
  { k: "fr", label: "Francia" },
];

export default function ProyectosPage() {
  const [filter, setFilter] = useState("all");
  const [openId, setOpenId] = useState<string | null>(null);

  const visible = PROJECTS.filter((p) => filter === "all" || p.tags.includes(filter));
  const open = openId ? PROJECTS.find((p) => p.id === openId) ?? null : null;

  return (
    <div className="bg-[#F4F2EE] text-[#1A1C1E]">
      <SiteHeader />

      <main className="pt-16 pb-[58px] min-[900px]:pt-[74px] min-[900px]:pb-0">
        {/* Hero */}
        <section className="relative flex min-h-[340px] bg-[#17191B] min-[900px]:min-h-[420px]">
          <div className="absolute inset-0 flex items-center justify-center bg-[#26292D]">
            <span className="font-mono text-[11px] tracking-wide text-[#8A8E92]">
              FOTO REAL OBRA — hero proyectos
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
              Portfolio · 4 países
            </span>
            <h1 className="font-display text-[38px] leading-[0.95] font-bold uppercase text-white min-[900px]:text-[58px]">
              Proyectos construidos
            </h1>
            <p className="m-0 text-[15px] leading-[1.5] text-[#D9D7D1]">
              Pádel, pickleball y cubiertas entregados por nuestro equipo. Todo lo que ves aquí existe.
            </p>
          </div>
        </section>

        {/* Filtros */}
        <div className="sticky top-16 z-30 flex gap-2 overflow-x-auto border-b border-[#E2DFD6] bg-[#F4F2EE] px-5 py-3.5 min-[900px]:top-[74px] min-[900px]:mx-auto min-[900px]:max-w-[1200px] min-[900px]:px-10">
          {FILTERS.map((f) => (
            <button
              key={f.k}
              onClick={() => setFilter(f.k)}
              className={`h-[38px] shrink-0 rounded-full border-[1.5px] px-[15px] text-[13.5px] font-semibold ${
                filter === f.k
                  ? "border-[#17191B] bg-[#17191B] text-white"
                  : "border-[#D8D4C9] bg-white text-[#565A5E]"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Masonry */}
        <div className="columns-2 gap-3 p-5 min-[900px]:columns-4 min-[900px]:gap-4 min-[900px]:px-10 min-[900px]:py-12 min-[900px]:mx-auto min-[900px]:max-w-[1200px]">
          {visible.map((p) => (
            <div key={p.id} className="mb-3 break-inside-avoid overflow-hidden rounded-[10px] border border-[#E5E2D9] bg-white">
              <div
                className="bg-[#E7E4DC]"
                style={{ aspectRatio: p.aspect }}
              />
              <button onClick={() => setOpenId(p.id)} className="block w-full cursor-pointer bg-white px-3 pt-2.5 pb-3 text-left">
                <span className="mb-1.5 inline-flex rounded bg-[var(--acc)]/[.14] px-1.5 py-0.5 text-[9.5px] font-bold uppercase tracking-wide text-[var(--accd)]">
                  {p.tipo}
                </span>
                <h3 className="font-display m-0 text-[17px] font-bold uppercase leading-[1.05]">{p.t}</h3>
                <p className="m-0 mt-1 text-[11.5px] text-[#7A7E82]">
                  {p.loc} · {p.year}
                </p>
              </button>
            </div>
          ))}
        </div>

        {/* CTA final */}
        <section className="bg-[#17191B] text-white">
          <div className="flex flex-col items-start gap-3.5 px-5 py-14 min-[900px]:mx-auto min-[900px]:max-w-[1200px] min-[900px]:px-10">
            <span className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--acc)] before:h-[3px] before:w-4 before:bg-[var(--acc)]">
              El siguiente puede ser el tuyo
            </span>
            <h2 className="font-display text-[34px] font-bold uppercase leading-[0.95] text-white">
              ¿Quieres algo así en tu instalación?
            </h2>
            <p className="m-0 text-[15px] leading-[1.5] text-[#C9CDD0]">
              Cuéntanos qué proyecto tienes en mente y te enviamos presupuesto cerrado en 48 h.
            </p>
            <Button variant="whatsapp" asChild>
              <a href={waHref("Hola, he visto vuestros proyectos y quiero un presupuesto.")}>
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

      {open && (
        <div className="fixed inset-0 z-70 bg-[#0A0C0E]/60" onClick={() => setOpenId(null)}>
          <div
            className="absolute top-14 right-0 bottom-0 left-0 overflow-auto rounded-t-2xl bg-[#F4F2EE] p-5 pb-24"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-3.5 flex items-start justify-between gap-3">
              <div>
                <span className="mb-1.5 inline-flex rounded bg-[var(--acc)]/[.14] px-1.5 py-0.5 text-[9.5px] font-bold uppercase tracking-wide text-[var(--accd)]">
                  {open.tipo}
                </span>
                <h2 className="font-display m-0 text-[28px] font-bold uppercase leading-none">{open.t}</h2>
                <p className="m-0 mt-1 text-[11.5px] text-[#7A7E82]">
                  {open.loc} · {open.year}
                </p>
              </div>
              <button
                onClick={() => setOpenId(null)}
                aria-label="Cerrar"
                className="flex size-11 shrink-0 items-center justify-center rounded-lg border-[1.5px] border-[#E0DDD3] bg-white text-[#1A1C1E]"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div className="col-span-2 aspect-4/3 rounded-[10px] bg-[#E7E4DC]" />
              <div className="aspect-3/4 rounded-[10px] bg-[#E7E4DC]" />
              <div className="aspect-3/4 rounded-[10px] bg-[#E7E4DC]" />
            </div>

            <div className="mt-4">
              {[
                { k: "Cliente", v: open.t },
                { k: "Ubicación", v: open.loc },
                { k: "Tipo", v: open.tipo },
                { k: "Plazo", v: open.plazo },
                { k: "Alcance", v: open.alcance },
              ].map((r) => (
                <div key={r.k} className="flex justify-between gap-3.5 border-b border-[#E5E2D9] py-[11px] text-sm">
                  <span className="shrink-0 text-[#7A7E82]">{r.k}</span>
                  <span className="text-right font-semibold">{r.v}</span>
                </div>
              ))}
            </div>

            <div className="mt-4 flex flex-col gap-2.5 rounded-[10px] border border-[#E5E2D9] bg-white p-[18px]">
              <div className="flex gap-[3px] text-[#EFB810]">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="size-4 fill-current stroke-none" />
                ))}
              </div>
              <p className="m-0 text-[14.5px] leading-[1.55] text-[#2A2D30]">{open.quote}</p>
              <p className="m-0 text-[11.5px] text-[#7A7E82]">Nombre Apellido · cargo, entidad</p>
            </div>

            <Button asChild className="mt-4 w-full">
              <a href={waHref(`Hola, quiero un proyecto como el de ${open.loc} (${open.tipo}).`)}>
                <WhatsappIcon className="size-5" />
                Quiero algo así
              </a>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
