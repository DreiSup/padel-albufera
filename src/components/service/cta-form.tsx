"use client";

import { useState } from "react";
import { Phone } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { WhatsappIcon } from "@/components/icons";
import { TEL, TEL_LABEL, waHref } from "@/lib/site";

function Field({
  id,
  label,
  placeholder,
  type = "text",
}: {
  id: string;
  label: string;
  placeholder: string;
  type?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-[11.5px] font-semibold uppercase tracking-wide text-[#9FA4A8]">
        {label}
      </label>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        className="h-[50px] w-full rounded-lg border-[1.5px] border-[#3A3F44] bg-[#212428] px-3.5 text-[15px] font-medium text-white placeholder:text-[#565A5E]"
      />
    </div>
  );
}

export function ServiceCtaForm({
  ns,
  idPrefix,
  waBaseMessage,
  ctaProjectOptions,
}: {
  ns: "padel" | "pickleball";
  idPrefix: string;
  waBaseMessage: string;
  ctaProjectOptions: string[];
}) {
  const t = useTranslations(ns);
  const tc = useTranslations();
  const [sent, setSent] = useState(false);

  return (
    <section className="relative overflow-hidden bg-[#17191B]">
      <div className="absolute inset-0 bg-[#0F1113]/90" />
      <div className="relative flex flex-col gap-3.5 px-5 py-14 text-white min-[900px]:mx-auto min-[900px]:max-w-[1200px] min-[900px]:items-start min-[900px]:px-10">
        <Eyebrow>{tc("common.requestQuote")}</Eyebrow>
        <h2 className="font-display text-[34px] font-bold uppercase leading-[0.95] text-white">
          {t("cta.title")}
        </h2>
        <p className="m-0 text-[15px] leading-[1.5] text-[#C9CDD0]">
          {t("cta.sub")}
        </p>
        <Button variant="whatsapp" asChild>
          <a href={waHref(waBaseMessage)}>
            <WhatsappIcon className="size-5" />
            {tc("common.whatsappDirect")}
          </a>
        </Button>
        <Button variant="outline" asChild>
          <a href={`tel:${TEL}`}>
            <Phone className="size-5" />
            {tc("common.call")} · {TEL_LABEL}
          </a>
        </Button>
        <div className="my-1 flex items-center gap-3 text-xs font-semibold uppercase tracking-wide text-[#7A7E82] before:h-px before:flex-1 before:bg-[#2B3034] after:h-px after:flex-1 after:bg-[#2B3034]">
          {tc("cta.or")}
        </div>
        {!sent ? (
          <form
            className="flex flex-col gap-3"
            onSubmit={(e) => {
              e.preventDefault();
              setSent(true);
            }}
          >
            <Field id={`${idPrefix}-nom`} label={tc("cta.nameLabel")} placeholder={tc("cta.namePh")} />
            <Field id={`${idPrefix}-tel`} label={tc("cta.phoneLabel")} placeholder="+34 600 000 000" type="tel" />
            <div>
              <label htmlFor={`${idPrefix}-tipo`} className="mb-1.5 block text-[11.5px] font-semibold uppercase tracking-wide text-[#9FA4A8]">
                {t("models.title")}
              </label>
              <select
                id={`${idPrefix}-tipo`}
                className="h-[50px] w-full rounded-lg border-[1.5px] border-[#3A3F44] bg-[#212428] px-3.5 text-[15px] font-medium text-white"
              >
                {ctaProjectOptions.map((opt) => (
                  <option key={opt}>{opt}</option>
                ))}
              </select>
            </div>
            <Button type="submit" className="w-full">
              {tc("cta.submit")}
            </Button>
            <p className="m-0 text-[11.5px] leading-[1.5] text-[#7A7E82]">
              {tc("cta.privacy")}
            </p>
          </form>
        ) : (
          <div className="flex flex-col gap-3 rounded-[10px] border-[1.5px] border-[var(--acc)]/40 bg-[var(--acc)]/[.12] p-5">
            <h3 className="font-display m-0 text-xl font-bold uppercase leading-none text-white">
              {tc("cta.successTitle")}
            </h3>
            <p className="m-0 text-[15px] text-[#C9CDD0]">
              {tc("cta.successSub")}
            </p>
            <Button variant="whatsapp" asChild>
              <a href={waHref(tc("common.waMessage"))}>
                <WhatsappIcon className="size-5" />
                {tc("cta.openWhatsApp")}
              </a>
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--accd)] before:h-[3px] before:w-4 before:bg-[var(--acc)]">
      {children}
    </span>
  );
}
