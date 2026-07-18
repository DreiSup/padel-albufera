"use client";

import { useEffect, useState } from "react";
import { Play, X } from "lucide-react";

export function VideoThumb() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <div className="relative mt-4 aspect-video overflow-hidden rounded-[10px] bg-[#0F1113]">
      <div className="absolute inset-0 bg-black/35" />
      <button
        onClick={() => setOpen(true)}
        aria-label="Ver vídeo"
        className="absolute inset-0 m-auto flex size-[66px] items-center justify-center rounded-full bg-[var(--acc)] text-[#07130C] shadow-[0_10px_34px_rgba(0,0,0,0.45)]"
      >
        <Play className="ml-[3px] size-[26px] fill-current" />
      </button>
      {open && (
        <div
          className="fixed inset-0 z-70 flex items-center justify-center bg-[#0A0C0E]/85 p-5"
          onClick={() => setOpen(false)}
        >
          <div
            className="relative flex aspect-video max-h-full w-full items-center justify-center rounded-[10px] bg-black"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setOpen(false)}
              aria-label="Cerrar vídeo"
              className="absolute top-3 right-3 z-10 flex size-10 items-center justify-center rounded-lg border-[1.5px] border-white/35 bg-black/50 text-white hover:bg-black/70"
            >
              <X className="size-5" />
            </button>
            <span className="font-mono text-xs text-[#9FA4A8]">VÍDEO OBRA</span>
          </div>
        </div>
      )}
    </div>
  );
}
