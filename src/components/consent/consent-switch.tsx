"use client";

// Switch accesible sin dependencias: el Switch de shadcn arrastraría
// @radix-ui/react-switch, y el objetivo de esta capa es cero paquetes nuevos.
// role="switch" + aria-checked le da a un lector de pantalla exactamente la
// misma semántica, y un <button> ya es operable con teclado de serie.

interface ConsentSwitchProps {
  checked: boolean;
  onCheckedChange: (v: boolean) => void;
  disabled?: boolean;
  "aria-labelledby": string;
}

export function ConsentSwitch({
  checked,
  onCheckedChange,
  disabled = false,
  "aria-labelledby": labelledBy,
}: ConsentSwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-labelledby={labelledBy}
      disabled={disabled}
      onClick={() => onCheckedChange(!checked)}
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accd)] disabled:cursor-not-allowed disabled:opacity-60 ${
        checked ? "bg-[var(--accd)]" : "bg-[#C9C5BA]"
      }`}
    >
      <span
        className={`pointer-events-none block size-5 rounded-full bg-white shadow transition-transform ${
          checked ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  );
}
