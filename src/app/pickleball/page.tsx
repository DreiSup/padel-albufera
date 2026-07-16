import { ServicePage } from "@/components/service-page";

const MODELS = [
  {
    tab: "Estándar",
    name: "Pista estándar",
    cta: "Presupuesto pista estándar",
    desc: "La pista reglamentaria de pickleball: superficie acrílica de alto agarre sobre solera de hormigón armado.",
    price: "desde 15.900 €",
    specs: [
      { k: "Dimensiones", v: "13,4 × 6,1 m (reglamentaria)" },
      { k: "Superficie", v: "Acrílico multicapa antideslizante" },
      { k: "Base", v: "Solera de hormigón armado" },
      { k: "Red y postes", v: "Aluminio con tensor" },
      { k: "Iluminación", v: "4 proyectores LED 200 W" },
    ],
    ideal: ["Club", "Comunidad"],
  },
  {
    tab: "Recinto",
    name: "Recinto completo",
    cta: "Presupuesto recinto completo",
    desc: "Pista con cerramiento perimetral de 3 m: la pelota siempre en juego y el entorno protegido.",
    price: "desde 19.900 €",
    specs: [
      { k: "Dimensiones", v: "Parcela mín. 15,2 × 9,1 m" },
      { k: "Superficie", v: "Acrílico multicapa antideslizante" },
      { k: "Cerramiento", v: "Malla galvanizada de 3 m" },
      { k: "Accesos", v: "Puerta + zona de descanso" },
      { k: "Iluminación", v: "4 proyectores LED 200 W" },
    ],
    ideal: ["Comunidad", "Hotel / resort"],
  },
  {
    tab: "Multipista",
    name: "Complejo multipista",
    cta: "Presupuesto complejo multipista",
    desc: "Dos o más pistas compartiendo cimentación, iluminación y accesos: baja el coste por pista y se simplifica la operación.",
    price: "proyecto a medida",
    specs: [
      { k: "Dimensiones", v: "Modular · 2+ pistas" },
      { k: "Superficie", v: "Acrílico multicapa antideslizante" },
      { k: "Cerramiento", v: "Perimetral compartido" },
      { k: "Extras", v: "Grada y zona común opcionales" },
      { k: "Iluminación", v: "Proyecto lumínico a medida" },
    ],
    ideal: ["Club", "Municipio", "Promotor"],
  },
];

const MATERIALS = [
  { t: "Pavimento acrílico", d: "Sistema multicapa con amortiguación sobre hormigón: agarre y confort articular." },
  { t: "Líneas de juego", d: "Pintura de poliuretano de alta visibilidad, medidas reglamentarias." },
  { t: "Cerramiento", d: "Malla galvanizada plastificada de 3 m con puertas integradas." },
  { t: "Iluminación LED", d: "Proyectores de bajo consumo con óptica antideslumbramiento." },
];

const FAQS = [
  {
    q: "¿Cuánto espacio necesita una pista de pickleball?",
    a: "La pista mide 13,4 × 6,1 m; con zonas de seguridad recomendamos 15,2 × 9,1 m. Cabe en la mitad del espacio de una de pádel.",
  },
  {
    q: "¿Puedo convertir una pista de tenis o un frontón?",
    a: "Sí: en una pista de tenis caben hasta 4 de pickleball. La reconversión es más rápida y económica que la obra nueva.",
  },
  {
    q: "¿Qué superficie es mejor?",
    a: "Acrílico multicapa sobre hormigón: es el estándar internacional, drena bien y mantiene el bote uniforme durante años.",
  },
  {
    q: "¿Se puede jugar de noche?",
    a: "Sí. Con 4 proyectores LED por pista se alcanza nivel de juego nocturno sin deslumbrar al entorno.",
  },
  {
    q: "¿Podéis cubrir la pista?",
    a: "Sí. Instalamos cubiertas y cerramientos sobre pistas nuevas o existentes.",
  },
];

export default function PickleballPage() {
  return (
    <ServicePage
      idPrefix="pk"
      heroEyebrow="Llave en mano · ES · FR · DE · BE"
      heroTitle="Construcción de pistas de pickleball"
      heroSubtitle="Estándar, recinto completo o multipista. Presupuesto cerrado y garantía de 10 años."
      models={MODELS}
      materials={MATERIALS}
      faqTitle="Dudas sobre pistas de pickleball"
      faqs={FAQS}
      ctaProjectOptions={[
        "Pista estándar",
        "Recinto completo",
        "Complejo multipista",
        "Reconversión de tenis",
        "Aún no lo sé",
      ]}
      waBaseMessage="Hola, quiero un presupuesto para construir una pista de pickleball."
    />
  );
}
