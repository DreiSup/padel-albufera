export const WA_NUMBER = "34614207633";
export const WA_MESSAGE_DEFAULT =
  "Hola, quiero un presupuesto para construir una pista.";
export const TEL = "+34614207633";
export const TEL_LABEL = "+34 614 20 76 33";

export function waHref(message: string = WA_MESSAGE_DEFAULT) {
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message)}`;
}

export const NAV_ROUTES: { key: "home" | "padel" | "pickleball" | "projects" | "process" | "about" | "contact"; href: string }[] = [
  { key: "home", href: "/" },
  { key: "padel", href: "/padel" },
  { key: "pickleball", href: "/pickleball" },
  { key: "projects", href: "/proyectos" },
  { key: "process", href: "/proceso" },
  { key: "about", href: "/sobre-nosotros" },
  { key: "contact", href: "/contacto" },
];

export const LANGS: { code: "es" | "fr" | "en" | "de" | "nl"; label: string }[] = [
  { code: "es", label: "ES" },
  { code: "fr", label: "FR" },
  { code: "en", label: "EN" },
  { code: "de", label: "DE" },
  { code: "nl", label: "NL" },
];
