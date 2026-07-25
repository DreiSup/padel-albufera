"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { useConsent } from "./consent-provider";
import { ConsentSwitch } from "./consent-switch";

const OPCIONALES = ["analitica", "marketing"] as const;

export function PreferencesModal() {
  const t = useTranslations("consent");
  const { consent, preferencesOpen, closePreferences, savePreferences, acceptAll } =
    useConsent();
  const tituloId = useId();
  const panelRef = useRef<HTMLDivElement>(null);

  // Sin casillas premarcadas: si aún no hay decisión, todo arranca en false.
  // El componente se monta de nuevo cada vez que se abre el panel, así que el
  // inicializador ya refleja el estado actual: no hace falta sincronizarlo.
  const [prefs, setPrefs] = useState({
    analitica: consent?.analitica ?? false,
    marketing: consent?.marketing ?? false,
  });

  // Foco al abrir, Esc para cerrar y trampa de foco dentro del panel.
  useEffect(() => {
    if (!preferencesOpen) return;
    const panel = panelRef.current;
    if (!panel) return;

    const previo = document.activeElement as HTMLElement | null;
    const focusables = () =>
      Array.from(
        panel.querySelectorAll<HTMLElement>(
          'button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])',
        ),
      );
    focusables()[0]?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        closePreferences();
        return;
      }
      if (e.key !== "Tab") return;
      const f = focusables();
      if (!f.length) return;
      const primero = f[0];
      const ultimo = f[f.length - 1];
      if (e.shiftKey && document.activeElement === primero) {
        e.preventDefault();
        ultimo.focus();
      } else if (!e.shiftKey && document.activeElement === ultimo) {
        e.preventDefault();
        primero.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      previo?.focus();
    };
  }, [preferencesOpen, closePreferences]);

  if (!preferencesOpen) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center bg-[#0A0C0E]/60 p-0 min-[640px]:items-center min-[640px]:p-5">
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={tituloId}
        className="max-h-[88vh] w-full max-w-[520px] overflow-y-auto rounded-t-2xl bg-[#F4F2EE] p-5 pb-[calc(20px+env(safe-area-inset-bottom,0px))] text-[#1A1C1E] min-[640px]:rounded-2xl min-[640px]:pb-5"
      >
        <h2
          id={tituloId}
          className="font-display m-0 text-[22px] font-bold uppercase leading-[1.05] tracking-[-0.01em]"
        >
          {t("panel.titulo")}
        </h2>
        <p className="mt-2 text-[14px] leading-[1.55] text-[#565A5E]">
          {t("panel.intro")}
        </p>

        <div className="mt-5 flex flex-col gap-3">
          {/* Necesarias: siempre activas y bloqueadas. */}
          <Fila
            id="cat-necesarias"
            nombre={t("cat.necesarias.nombre")}
            descripcion={t("cat.necesarias.desc")}
            checked
            disabled
            onChange={() => {}}
            nota={t("panel.siempreActiva")}
          />
          {OPCIONALES.map((cat) => (
            <Fila
              key={cat}
              id={`cat-${cat}`}
              nombre={t(`cat.${cat}.nombre`)}
              descripcion={t(`cat.${cat}.desc`)}
              checked={prefs[cat]}
              onChange={(v) => setPrefs((p) => ({ ...p, [cat]: v }))}
            />
          ))}
        </div>

        <div className="mt-6 flex flex-col gap-2.5 min-[480px]:flex-row">
          <Button
            variant="ghost"
            className="min-[480px]:flex-1"
            onClick={() => savePreferences(prefs)}
          >
            {t("panel.guardar")}
          </Button>
          <Button className="min-[480px]:flex-1" onClick={acceptAll}>
            {t("aceptar")}
          </Button>
        </div>
      </div>
    </div>
  );
}

function Fila({
  id,
  nombre,
  descripcion,
  checked,
  disabled,
  onChange,
  nota,
}: {
  id: string;
  nombre: string;
  descripcion: string;
  checked: boolean;
  disabled?: boolean;
  onChange: (v: boolean) => void;
  nota?: string;
}) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-xl border border-[#E2DFD6] bg-white p-4">
      <div className="min-w-0">
        <span id={id} className="block text-[15px] font-semibold">
          {nombre}
          {nota ? (
            <span className="ml-2 align-middle text-[11px] font-medium uppercase tracking-wide text-[var(--accd)]">
              {nota}
            </span>
          ) : null}
        </span>
        <p className="mt-1 text-[13px] leading-[1.5] text-[#565A5E]">{descripcion}</p>
      </div>
      <ConsentSwitch
        checked={checked}
        disabled={disabled}
        onCheckedChange={onChange}
        aria-labelledby={id}
      />
    </div>
  );
}
