"use client";

import { useState, type FormEvent } from "react";
import { Phone } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { WhatsappIcon } from "@/components/icons";
import { waHref } from "@/lib/contact";
import { pushEvento } from "@/lib/analytics";
import { useAttribution } from "@/lib/attribution/use-attribution";
import { PhoneNumber } from "@/components/conversion/phone-number";
import { WhatsAppLink } from "@/components/conversion/whatsapp-link";
import { PhoneLink } from "@/components/conversion/phone-link";

// Formulario de captación único, parametrizado. Sustituye a los dos que había
// (home y service), que eran casi idénticos.
//
// IMPORTANTE — por qué el envío abre WhatsApp:
// Este formulario NO tiene backend, y antes fingía tenerlo: al pulsar enviar
// mostraba "te contactamos en 24 h" sin mandar nada a ninguna parte. El lead se
// perdía y el usuario se quedaba esperando una llamada que no iba a llegar.
// Como la conversión real del negocio es WhatsApp, el formulario ahora compone
// el mensaje con los datos y abre la conversación: el lead llega de verdad y ya
// cualificado. Si algún día hay endpoint de correo o CRM, este es el punto
// donde engancharlo.

interface LeadFormProps {
  /** Namespace de traducción para el título y el subtítulo. */
  titulo: string;
  subtitulo: string;
  eyebrow: string;
  /** Mensaje del botón directo de WhatsApp (sin pasar por el formulario). */
  waBaseMessage: string;
  /** Opciones del desplegable "tipo de proyecto". */
  opciones: string[];
  idPrefix: string;
  /** Para saber desde qué página se convirtió. */
  origen: string;
}

function Campo({
  id,
  label,
  placeholder,
  type = "text",
  value,
  onChange,
  required,
}: {
  id: string;
  label: string;
  placeholder: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-1.5 block text-[11.5px] font-semibold uppercase tracking-wide text-[#9FA4A8]"
      >
        {label}
        {required && <span className="text-[var(--acc)]"> *</span>}
      </label>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="h-[50px] w-full rounded-lg border-[1.5px] border-[#3A3F44] bg-[#212428] px-3.5 text-[15px] font-medium text-white placeholder:text-[#565A5E]"
      />
    </div>
  );
}

export function LeadForm({
  titulo,
  subtitulo,
  eyebrow,
  waBaseMessage,
  opciones,
  idPrefix,
  origen,
}: LeadFormProps) {
  const t = useTranslations();
  const locale = useLocale();
  const attr = useAttribution();
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [email, setEmail] = useState("");
  const [tipo, setTipo] = useState(opciones[0] ?? "");

  function medir(evento: string) {
    pushEvento({
      event: evento,
      ref_code: attr?.ref ?? "",
      placement: "formulario",
      page_path: typeof window !== "undefined" ? window.location.pathname : "",
      locale,
      origen,
      tipo_proyecto: tipo,
    });
  }

  function enviar(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const lineas = [
      t("lead.msgIntro"),
      "",
      `• ${t("cta.nameLabel")}: ${nombre}`,
      `• ${t("cta.phoneLabel")}: ${telefono}`,
      email ? `• ${t("cta.emailLabel")}: ${email}` : null,
      `• ${t("cta.typeLabel")}: ${tipo}`,
      // El código de referencia es lo que cruza este lead con su campaña.
      attr?.ref ? `\n${t("conversion.refLinea", { ref: attr.ref })}` : null,
    ].filter(Boolean);

    medir("formulario_whatsapp");
    window.location.assign(waHref(locale, lineas.join("\n")));
  }

  return (
    <section className="relative overflow-hidden bg-[#17191B]">
      <div className="absolute inset-0 bg-[#0F1113]/88" />
      <div className="relative flex flex-col gap-3.5 px-5 py-14 text-white min-[900px]:mx-auto min-[900px]:max-w-[1200px] min-[900px]:items-start min-[900px]:px-10">
        <span className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--accd)] before:h-[3px] before:w-4 before:bg-[var(--acc)]">
          {eyebrow}
        </span>
        <h2 className="font-display text-[34px] font-bold uppercase leading-[0.95] text-white">
          {titulo}
        </h2>
        <p className="m-0 text-[15px] leading-[1.5] text-[#C9CDD0]">{subtitulo}</p>

        <Button variant="whatsapp" asChild>
          <WhatsAppLink placement="formulario" mensaje={waBaseMessage}>
            <WhatsappIcon className="size-5" />
            {t("common.whatsappDirect")}
          </WhatsAppLink>
        </Button>
        <Button variant="outline" asChild>
          <PhoneLink placement="formulario">
            <Phone className="size-5" />
            {t("common.call")} · <PhoneNumber />
          </PhoneLink>
        </Button>

        <div className="my-1 flex items-center gap-3 text-xs font-semibold uppercase tracking-wide text-[#7A7E82] before:h-px before:flex-1 before:bg-[#2B3034] after:h-px after:flex-1 after:bg-[#2B3034]">
          {t("lead.or")}
        </div>

        <form className="flex w-full flex-col gap-3" onSubmit={enviar}>
          <Campo
            id={`${idPrefix}-nom`}
            label={t("cta.nameLabel")}
            placeholder={t("cta.namePh")}
            value={nombre}
            onChange={setNombre}
            required
          />
          <Campo
            id={`${idPrefix}-tel`}
            label={t("cta.phoneLabel")}
            placeholder="+34 600 000 000"
            type="tel"
            value={telefono}
            onChange={setTelefono}
            required
          />
          <Campo
            id={`${idPrefix}-email`}
            label={`${t("cta.emailLabel")} ${t("lead.opcional")}`}
            placeholder={t("cta.emailPh")}
            type="email"
            value={email}
            onChange={setEmail}
          />
          <div>
            <label
              htmlFor={`${idPrefix}-tipo`}
              className="mb-1.5 block text-[11.5px] font-semibold uppercase tracking-wide text-[#9FA4A8]"
            >
              {t("cta.typeLabel")}
            </label>
            <select
              id={`${idPrefix}-tipo`}
              value={tipo}
              onChange={(e) => setTipo(e.target.value)}
              className="h-[50px] w-full rounded-lg border-[1.5px] border-[#3A3F44] bg-[#212428] px-3.5 text-[15px] font-medium text-white"
            >
              {opciones.map((opt) => (
                <option key={opt}>{opt}</option>
              ))}
            </select>
          </div>

          <Button type="submit" variant="whatsapp" className="w-full">
            <WhatsappIcon className="size-5" />
            {t("lead.submit")}
          </Button>
          {/* Se dice exactamente lo que va a pasar: se abre WhatsApp con el
              mensaje escrito y el usuario decide si lo envía. */}
          <p className="m-0 text-[11.5px] leading-[1.5] text-[#7A7E82]">
            {t("lead.aviso")}
          </p>
        </form>
      </div>
    </section>
  );
}
