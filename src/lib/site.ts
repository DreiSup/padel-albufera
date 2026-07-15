export const WA_NUMBER = "34614207633";
export const WA_MESSAGE_DEFAULT =
  "Hola, quiero un presupuesto para construir una pista.";
export const TEL = "+34614207633";
export const TEL_LABEL = "+34 614 20 76 33";

export function waHref(message: string = WA_MESSAGE_DEFAULT) {
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message)}`;
}

export const NAV_LINKS: { label: string; href: string | null }[] = [
  { label: "Inicio", href: "/" },
  { label: "Pistas de pádel", href: null },
  { label: "Pistas de pickleball", href: null },
  { label: "Proyectos", href: null },
  { label: "Proceso", href: null },
  { label: "Sobre nosotros", href: null },
  { label: "Contacto", href: "/contacto" },
];

export const LANGS = ["ES", "FR", "EN", "DE", "NL"];
