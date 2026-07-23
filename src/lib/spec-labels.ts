import type { Locale } from "@/i18n/routing";

// Keyed by string (not Locale) so the de/nl maps stay ready for when those
// locales are re-enabled in src/i18n/routing.ts without causing a type error.
export const SPEC_LABELS: Record<string, Record<string, string>> = {
  es: {
    dimensiones: "Dimensiones",
    estructura: "Estructura",
    vidrio: "Vidrio",
    cesped: "Césped",
    iluminacion: "Iluminación",
    superficie: "Superficie",
    base: "Base",
    red: "Red y postes",
    cerramiento: "Cerramiento",
    accesos: "Accesos",
    extras: "Extras",
  },
  en: {
    dimensions: "Dimensions",
    structure: "Structure",
    glass: "Glass",
    turf: "Turf",
    lighting: "Lighting",
    surface: "Surface",
    base: "Base",
    net: "Net & posts",
    fence: "Fencing",
    access: "Access",
    extras: "Extras",
  },
  fr: {
    dimensions: "Dimensions",
    structure: "Structure",
    verre: "Verre",
    gazon: "Gazon",
    eclairage: "Éclairage",
    surface: "Surface",
    base: "Base",
    filet: "Filet et poteaux",
    cloture: "Clôture",
    acces: "Accès",
    extras: "Extras",
  },
  de: {
    abmessungen: "Abmessungen",
    struktur: "Struktur",
    glas: "Glas",
    rasen: "Rasen",
    beleuchtung: "Beleuchtung",
    oberflaeche: "Oberfläche",
    basis: "Basis",
    netz: "Netz und Pfosten",
    zaun: "Einzäunung",
    zugang: "Zugang",
    extras: "Extras",
  },
  nl: {
    afmetingen: "Afmetingen",
    structuur: "Structuur",
    glas: "Glas",
    gras: "Gras",
    verlichting: "Verlichting",
    oppervlak: "Oppervlak",
    basis: "Basis",
    net: "Net en palen",
    omheining: "Omheining",
    toegang: "Toegang",
    extras: "Extras",
  },
};

export function specLabel(locale: Locale, key: string): string {
  return SPEC_LABELS[locale]?.[key] ?? key;
}
