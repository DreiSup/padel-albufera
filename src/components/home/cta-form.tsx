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
  value,
  onChange,
  required,
}: {
  id: string;
  label: string;
  placeholder: string;
  type?: string;
  value?: string;
  onChange?: (value: string) => void;
  required?: boolean;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-[11.5px] font-semibold uppercase tracking-wide text-[#9FA4A8]">
        {label}
        {required && <span className="text-[var(--acc)]"> *</span>}
      </label>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange ? (e) => onChange(e.target.value) : undefined}
        required={required}
        className="h-[50px] w-full rounded-lg border-[1.5px] border-[#3A3F44] bg-[#212428] px-3.5 text-[15px] font-medium text-white placeholder:text-[#565A5E]"
      />
    </div>
  );
}

export function HomeCtaForm() {
  const t = useTranslations();
  const [sent, setSent] = useState(false);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const canSubmit = email.trim() !== "" && /\S+@\S+\.\S+/.test(email) && phone.trim() !== "";

  return (
    <section className="relative overflow-hidden bg-[#17191B]">
      <div className="absolute inset-0 bg-[#0F1113]/88" />
      <div className="relative flex flex-col gap-3.5 px-5 py-14 text-white min-[900px]:mx-auto min-[900px]:max-w-[1200px] min-[900px]:items-start min-[900px]:px-10">
        <Eyebrow>{t("cta.eyebrow")}</Eyebrow>
        <h2 className="font-display text-[34px] font-bold uppercase leading-[0.95] text-white">
          {t("cta.title")}
        </h2>
        <p className="m-0 text-[15px] leading-[1.5] text-[#C9CDD0]">
          {t("cta.sub")}
        </p>
        <Button variant="whatsapp" asChild>
          <a href={waHref(t("common.waMessage"))}>
            <WhatsappIcon className="size-5" />
            {t("common.whatsappDirect")}
          </a>
        </Button>
        <Button variant="outline" asChild>
          <a href={`tel:${TEL}`}>
            <Phone className="size-5" />
            {t("common.call")} · {TEL_LABEL}
          </a>
        </Button>
        <div className="my-1 flex items-center gap-3 text-xs font-semibold uppercase tracking-wide text-[#7A7E82] before:h-px before:flex-1 before:bg-[#2B3034] after:h-px after:flex-1 after:bg-[#2B3034]">
          {t("cta.or")}
        </div>
        {!sent ? (
          <form
            className="flex flex-col gap-3"
            onSubmit={(e) => {
              e.preventDefault();
              setSent(true);
            }}
          >
            <Field id="f-nom" label={t("cta.nameLabel")} placeholder={t("cta.namePh")} />
            <Field
              id="f-tel"
              label={t("cta.phoneLabel")}
              placeholder="+34 600 000 000"
              type="tel"
              value={phone}
              onChange={setPhone}
              required
            />
            <Field
              id="f-email"
              label={t("cta.emailLabel")}
              placeholder={t("cta.emailPh")}
              type="email"
              value={email}
              onChange={setEmail}
              required
            />
            <div>
              <label htmlFor="f-tipo" className="mb-1.5 block text-[11.5px] font-semibold uppercase tracking-wide text-[#9FA4A8]">
                {t("cta.typeLabel")}
              </label>
              <select
                id="f-tipo"
                className="h-[50px] w-full rounded-lg border-[1.5px] border-[#3A3F44] bg-[#212428] px-3.5 text-[15px] font-medium text-white"
              >
                {(t.raw("cta.typeOptions") as string[]).map((opt) => (
                  <option key={opt}>{opt}</option>
                ))}
              </select>
            </div>
            <Button type="submit" className="w-full" disabled={!canSubmit}>
              {t("cta.submit")}
            </Button>
            <p className="m-0 text-[11.5px] leading-[1.5] text-[#7A7E82]">
              {t("cta.privacy")}
            </p>
          </form>
        ) : (
          <div className="flex flex-col gap-3 rounded-[10px] border-[1.5px] border-[var(--acc)]/40 bg-[var(--acc)]/[.12] p-5">
            <h3 className="font-display m-0 text-xl font-bold uppercase leading-none text-white">
              {t("cta.successTitle")}
            </h3>
            <p className="m-0 text-[15px] text-[#C9CDD0]">
              {t("cta.successSub")}
            </p>
            <Button variant="whatsapp" asChild>
              <a href={waHref(t("common.waMessage"))}>
                <WhatsappIcon className="size-5" />
                {t("cta.openWhatsApp")}
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
