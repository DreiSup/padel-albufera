// Ficha técnica en vivo + mensaje de WhatsApp, derivados del estado.
//
// La ficha es el ancla racional; el mensaje es la conversión. Los dos salen
// de la misma fuente para que lo que ve el visitante y lo que recibe la
// empresa coincidan al detalle. Todo el texto pasa por el traductor: no hay
// castellano incrustado, así Francia es un cambio de `messages`, no de código.

import type { Estado } from "./estado";

/** Traductor con el prefijo `configurator` ya aplicado (next-intl `t`). */
export type Tr = (key: string, values?: Record<string, string | number>) => string;

export interface FilaFicha {
  label: string;
  value: string;
  /** La última fila (la solera) se destaca siempre. */
  destaca?: boolean;
}

const nombreDe = (t: Tr, clave: string, id: string) =>
  t(`cat.${clave}.options.${id}.name`);

/** Referencia corta para cruzar el lead en la hoja de cálculo. */
export function referencia(e: Estado): string {
  return `${e.version.slice(0, 3)}-${e.modalidad.slice(0, 3)}-${e.ral}`.toUpperCase();
}

export function medida(t: Tr, e: Estado): string {
  return t(e.modalidad === "dobles" ? "ficha.val.medidaDobles" : "ficha.val.medidaIndividual");
}

export function construirFicha(t: Tr, e: Estado): FilaFicha[] {
  const bajo = (s: string) => s.toLocaleLowerCase();

  const cesped = `${nombreDe(t, "cespedColor", e.cespedColor)} · ${bajo(
    nombreDe(t, "cespedFibra", e.cespedFibra),
  )} · ${e.cespedAltura} mm`;

  const estructura =
    e.ral === "otro"
      ? t("ficha.val.estructuraOtro")
      : t("ficha.val.estructura", {
          codigo: e.ral,
          color: bajo(nombreDe(t, "ral", e.ral)),
        });

  const iluminacion =
    e.iluminacion === "no"
      ? t("ficha.val.sinLuz")
      : t("ficha.val.conLuz", {
          w: e.potencia,
          tipo: bajo(nombreDe(t, "tipoLuz", e.tipoLuz)),
        });

  const extras = e.extras.length
    ? e.extras.map((x) => nombreDe(t, "extras", x)).join(", ")
    : t("ficha.val.sinExtras");

  return [
    { label: t("ficha.labels.version"), value: nombreDe(t, "version", e.version) },
    {
      label: t("ficha.labels.modalidad"),
      value: `${nombreDe(t, "modalidad", e.modalidad)} · ${medida(t, e)}`,
    },
    { label: t("ficha.labels.ubicacion"), value: nombreDe(t, "entorno", e.entorno) },
    { label: t("ficha.labels.cesped"), value: cesped },
    { label: t("ficha.labels.cristal"), value: t("ficha.val.cristal", { mm: e.cristal }) },
    { label: t("ficha.labels.estructura"), value: estructura },
    { label: t("ficha.labels.iluminacion"), value: iluminacion },
    { label: t("ficha.labels.extras"), value: extras },
    { label: t("ficha.labels.base"), value: t("ficha.val.base"), destaca: true },
  ];
}

/** Mensaje que abre WhatsApp: lista legible + referencia, editable por el usuario. */
export function construirMensaje(t: Tr, e: Estado): string {
  const filas = construirFicha(t, e);
  return (
    `${t("wa.intro")}\n\n` +
    filas.map((f) => `• ${f.label}: ${f.value}`).join("\n") +
    `\n\n${t("wa.ref", { ref: referencia(e) })}\n\n${t("wa.cierre")}`
  );
}
