// Estado del configurador: un único objeto. Nada más.
//
// Se serializa al query string desde el cliente con history.replaceState
// (ver el island), para que un lead pueda mandar su pista por WhatsApp y
// recuperarla al volver. Nunca se lee en un Server Component: la ruta
// tiene que seguir siendo estática.

export interface Estado {
  version: "estandar" | "semipanoramica" | "fullpanoramica";
  modalidad: "dobles" | "individual";
  entorno: "exterior" | "cubierta" | "interior";
  cespedColor: "verde" | "azul" | "teja" | "purpura" | "negro";
  cespedFibra: "monofilamento" | "fibrilado" | "hibrido";
  cespedAltura: "10" | "12" | "15";
  cristal: "10" | "12";
  ral: "9005" | "7016" | "9010" | "6005" | "5011" | "otro";
  iluminacion: "si" | "no";
  tipoLuz: "postes" | "integrada";
  potencia: "100" | "150" | "200";
  extras: Array<"puertas" | "gradas" | "rotulacion" | "marcador">;
  // No forman parte del presupuesto, solo del visor:
  hora: "dia" | "noche";
}

export const ESTADO_INICIAL: Estado = {
  version: "semipanoramica",
  modalidad: "dobles",
  entorno: "exterior",
  cespedColor: "verde",
  cespedFibra: "monofilamento",
  cespedAltura: "12",
  cristal: "12",
  ral: "9005",
  iluminacion: "si",
  tipoLuz: "postes",
  potencia: "150",
  extras: ["puertas"],
  hora: "dia",
};

// Valores válidos por clave, para sanear lo que venga de la URL.
const VALIDOS: Record<string, readonly string[]> = {
  version: ["estandar", "semipanoramica", "fullpanoramica"],
  modalidad: ["dobles", "individual"],
  entorno: ["exterior", "cubierta", "interior"],
  cespedColor: ["verde", "azul", "teja", "purpura", "negro"],
  cespedFibra: ["monofilamento", "fibrilado", "hibrido"],
  cespedAltura: ["10", "12", "15"],
  cristal: ["10", "12"],
  ral: ["9005", "7016", "9010", "6005", "5011", "otro"],
  iluminacion: ["si", "no"],
  tipoLuz: ["postes", "integrada"],
  potencia: ["100", "150", "200"],
  hora: ["dia", "noche"],
};
const EXTRAS_VALIDOS = ["puertas", "gradas", "rotulacion", "marcador"] as const;

/** Serializa a query string, omitiendo lo que coincide con el inicial. */
export function estadoAQuery(e: Estado): string {
  const p = new URLSearchParams();
  for (const clave of Object.keys(VALIDOS) as Array<keyof Estado>) {
    if (e[clave] !== ESTADO_INICIAL[clave]) p.set(clave, String(e[clave]));
  }
  const extras = [...e.extras].sort().join(",");
  if (extras !== [...ESTADO_INICIAL.extras].sort().join(",")) {
    p.set("extras", extras || "-");
  }
  return p.toString();
}

/** Reconstruye un estado saneado desde la query string. */
export function queryAEstado(qs: string): Estado {
  const p = new URLSearchParams(qs);
  const e: Estado = { ...ESTADO_INICIAL, extras: [...ESTADO_INICIAL.extras] };
  for (const clave of Object.keys(VALIDOS) as Array<keyof Estado>) {
    const v = p.get(clave);
    if (v && VALIDOS[clave].includes(v)) {
      // @ts-expect-error unión validada arriba
      e[clave] = v;
    }
  }
  if (p.has("extras")) {
    const raw = p.get("extras") ?? "";
    e.extras = raw
      .split(",")
      .filter((x): x is Estado["extras"][number] =>
        (EXTRAS_VALIDOS as readonly string[]).includes(x),
      );
  }
  return e;
}
