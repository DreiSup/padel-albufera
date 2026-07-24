// Catálogo comercial del configurador.
//
// Regla de oro: aquí NO vive ningún texto de interfaz. Solo la estructura
// (qué grupos hay, qué opciones, qué tipo de control, qué reconstruye cada
// cambio) y los datos que el motor 3D necesita de verdad: los hex de color.
//
// Todo el texto visible (títulos, ayudas, nombres de opción, subtítulos)
// se resuelve por i18n con la clave `configurator.cat.<grupo>.…`. Así el
// mercado francés se abre traduciendo `messages/fr.json`, sin tocar ni el
// catálogo ni el motor. Recortar oferta = borrar una línea de `opciones`.

import type { Estado } from "./estado";

/** Grupos que el motor sabe reconstruir de forma quirúrgica. */
export type Grupo =
  | "cesped"
  | "color"
  | "suelo"
  | "cerramiento"
  | "red"
  | "iluminacion"
  | "extras"
  | "entorno"
  | "techo";

export type Control = "tarjetas" | "chips" | "muestras" | "multi";

export interface Opcion {
  id: string;
  /** Solo para muestras de color (césped y RAL). */
  hex?: string;
  /** Solo RAL: el código se enseña como dato técnico. */
  codigo?: string;
}

export interface GrupoCatalogo {
  /** Clave de estado a la que escribe este grupo. */
  clave: keyof Estado;
  control: Control;
  /** Grupos del motor que invalida un cambio en este control. */
  afecta: Grupo[];
  /** Si se define, el control solo se muestra cuando devuelve true. */
  visible?: (e: Estado) => boolean;
  opciones: Opcion[];
}

export const CATALOGO: GrupoCatalogo[] = [
  {
    clave: "version",
    control: "tarjetas",
    afecta: ["cerramiento"],
    opciones: [
      { id: "estandar" },
      { id: "semipanoramica" },
      { id: "fullpanoramica" },
    ],
  },
  {
    clave: "modalidad",
    control: "chips",
    afecta: ["suelo", "cerramiento", "red", "iluminacion", "extras"],
    opciones: [{ id: "dobles" }, { id: "individual" }],
  },
  {
    clave: "entorno",
    control: "chips",
    afecta: ["entorno", "techo"],
    opciones: [{ id: "exterior" }, { id: "cubierta" }, { id: "interior" }],
  },
  {
    clave: "cespedColor",
    control: "muestras",
    afecta: ["cesped"],
    opciones: [
      { id: "verde", hex: "#4E7350" },
      { id: "azul", hex: "#2C5C82" },
      { id: "teja", hex: "#A9603C" },
      { id: "purpura", hex: "#5A4470" },
      { id: "negro", hex: "#2A2C2B" },
    ],
  },
  {
    clave: "cespedFibra",
    control: "chips",
    afecta: ["cesped"],
    opciones: [
      { id: "monofilamento" },
      { id: "fibrilado" },
      { id: "hibrido" },
    ],
  },
  {
    clave: "cespedAltura",
    control: "chips",
    afecta: ["cesped"],
    opciones: [{ id: "10" }, { id: "12" }, { id: "15" }],
  },
  {
    clave: "cristal",
    control: "chips",
    afecta: ["cerramiento"],
    opciones: [{ id: "10" }, { id: "12" }],
  },
  {
    clave: "ral",
    control: "muestras",
    afecta: ["color"],
    opciones: [
      { id: "9005", hex: "#141517", codigo: "9005" },
      { id: "7016", hex: "#383E42", codigo: "7016" },
      { id: "9010", hex: "#F1EDE4", codigo: "9010" },
      { id: "6005", hex: "#20372B", codigo: "6005" },
      { id: "5011", hex: "#1A2B3C", codigo: "5011" },
      { id: "otro", hex: "#B8B0A2" },
    ],
  },
  {
    clave: "iluminacion",
    control: "chips",
    afecta: ["iluminacion"],
    opciones: [{ id: "si" }, { id: "no" }],
  },
  {
    clave: "tipoLuz",
    control: "chips",
    afecta: ["iluminacion"],
    visible: (e) => e.iluminacion === "si",
    opciones: [{ id: "postes" }, { id: "integrada" }],
  },
  {
    clave: "potencia",
    control: "chips",
    afecta: ["iluminacion"],
    visible: (e) => e.iluminacion === "si",
    opciones: [{ id: "100" }, { id: "150" }, { id: "200" }],
  },
  {
    clave: "extras",
    control: "multi",
    afecta: ["extras", "cerramiento"],
    opciones: [
      { id: "puertas" },
      { id: "gradas" },
      { id: "rotulacion" },
      { id: "marcador" },
    ],
  },
];

/** Vistas de cámara. El texto de cada botón va por i18n (`configurator.vistas.*`). */
export const VISTAS = [
  "hero",
  "esquina",
  "lateral",
  "cenital",
  "pista",
] as const;
export type Vista = (typeof VISTAS)[number];

// --- Mapas de color que el motor consume directamente ---
const hexDe = (clave: string) =>
  Object.fromEntries(
    CATALOGO.find((g) => g.clave === clave)!.opciones.map((o) => [
      o.id,
      o.hex!,
    ]),
  ) as Record<string, string>;

export const CESPED_HEX = hexDe("cespedColor");
export const RAL_HEX = hexDe("ral");
