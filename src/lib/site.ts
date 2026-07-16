export const WA_NUMBER = "34614207633";
export const WA_MESSAGE_DEFAULT =
  "Hola, quiero un presupuesto para construir una pista.";
export const TEL = "+34614207633";
export const TEL_LABEL = "+34 614 20 76 33";

export function waHref(message: string = WA_MESSAGE_DEFAULT) {
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message)}`;
}

export const NAV_LINKS: { label: string; shortLabel: string; href: string | null }[] = [
  { label: "Inicio", shortLabel: "Inicio", href: "/" },
  { label: "Pistas de pádel", shortLabel: "Pádel", href: "/padel" },
  { label: "Pistas de pickleball", shortLabel: "Pickleball", href: "/pickleball" },
  { label: "Proyectos", shortLabel: "Proyectos", href: "/proyectos" },
  { label: "Proceso", shortLabel: "Proceso", href: "/proceso" },
  { label: "Sobre nosotros", shortLabel: "Nosotros", href: "/sobre-nosotros" },
  { label: "Contacto", shortLabel: "Contacto", href: "/contacto" },
];

export const LANGS = ["ES", "FR", "EN", "DE", "NL"];
