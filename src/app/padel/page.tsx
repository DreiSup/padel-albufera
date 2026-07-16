import { ServicePage } from "@/components/service-page";

const MODELS = [
  {
    tab: "Estándar",
    name: "Pista estándar",
    cta: "Presupuesto pista estándar",
    desc: "La pista reglamentaria de referencia: robusta, rentable y pensada para uso intensivo en clubes y comunidades.",
    price: "desde 18.900 €",
    specs: [
      { k: "Dimensiones", v: "20 × 10 m (reglamentaria)" },
      { k: "Estructura", v: "Acero galvanizado lacado" },
      { k: "Vidrio", v: "Templado 10 mm" },
      { k: "Césped", v: "Monofilamento 12 mm" },
      { k: "Iluminación", v: "8 proyectores LED 200 W" },
    ],
    ideal: ["Club", "Comunidad"],
  },
  {
    tab: "Panorámica",
    name: "Pista panorámica",
    cta: "Presupuesto pista panorámica",
    desc: "Vidrio autoportante sin postes intermedios: visibilidad total y la estética que diferencia una instalación premium.",
    price: "desde 24.900 €",
    specs: [
      { k: "Dimensiones", v: "20 × 10 m (reglamentaria)" },
      { k: "Estructura", v: "Pilares esquineros reforzados" },
      { k: "Vidrio", v: "Templado 12 mm autoportante" },
      { k: "Césped", v: "Monofilamento 12 mm" },
      { k: "Iluminación", v: "8 proyectores LED 200 W" },
    ],
    ideal: ["Club premium", "Promotor", "Particular"],
  },
  {
    tab: "Competición",
    name: "Pista de competición",
    cta: "Presupuesto pista de competición",
    desc: "Preparada para torneos: iluminación de nivel federativo, césped de competición y espacio para grada y realización.",
    price: "desde 29.900 €",
    specs: [
      { k: "Dimensiones", v: "20 × 10 m + perímetro técnico" },
      { k: "Estructura", v: "Panorámica reforzada" },
      { k: "Vidrio", v: "Templado 12 mm autoportante" },
      { k: "Césped", v: "Fibra de competición homologada" },
      { k: "Iluminación", v: "LED ≥ 500 lx uniformes" },
    ],
    ideal: ["Club", "Federación", "Municipio"],
  },
];

const MATERIALS = [
  { t: "Césped", d: "Fibra de competición con base drenante y arena de sílice calibrada." },
  { t: "Vidrio templado", d: "10–12 mm certificado, anclajes de seguridad y cantos pulidos." },
  { t: "Estructura", d: "Acero galvanizado en caliente y lacado al horno. Sin óxido, sin mantenimiento." },
  { t: "Iluminación LED", d: "Proyectores de bajo consumo con óptica antideslumbramiento." },
];

const FAQS = [
  {
    q: "¿Estándar o panorámica: cuál me conviene?",
    a: "Si buscas rentabilidad y uso intensivo, estándar. Si tu instalación compite por socios o vendes exclusividad, la panorámica se amortiza en imagen. Te lo cuantificamos en la visita gratuita.",
  },
  {
    q: "¿Cuánto espacio necesito?",
    a: "La pista mide 20 × 10 m; recomendamos una parcela mínima de 22 × 12 m para circulación y cimentación. Hacemos replanteo en la visita.",
  },
  {
    q: "¿Necesito licencia de obra?",
    a: "Normalmente sí. Preparamos la memoria técnica y la documentación para tu ayuntamiento como parte del llave en mano.",
  },
  {
    q: "¿Qué mantenimiento requiere el césped?",
    a: "Cepillado y redistribución de arena 1–2 veces al año. Lo ofrecemos como servicio postventa con la garantía.",
  },
  {
    q: "¿Podéis cubrir una pista ya existente?",
    a: "Sí. Instalamos cubiertas y cerramientos sobre pistas ya construidas, aunque no las hayamos hecho nosotros.",
  },
];

export default function PadelPage() {
  return (
    <ServicePage
      idPrefix="pd"
      heroEyebrow="Llave en mano · ES · FR · DE · BE"
      heroTitle="Construcción de pistas de pádel"
      heroSubtitle="Estándar, panorámica o competición. Presupuesto cerrado y garantía de 10 años."
      models={MODELS}
      materials={MATERIALS}
      faqTitle="Dudas sobre pistas de pádel"
      faqs={FAQS}
      ctaProjectOptions={[
        "Pista estándar",
        "Pista panorámica",
        "Pista de competición",
        "Cubierta / cerramiento",
        "Aún no lo sé",
      ]}
      waBaseMessage="Hola, quiero un presupuesto para construir una pista de pádel."
    />
  );
}
