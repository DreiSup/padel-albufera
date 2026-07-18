"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";

import { Link } from "@/i18n/navigation";
import { MORE_NAV_ROUTES } from "@/lib/site";
import { cn } from "@/lib/utils";

export function NavMoreMenu({ className }: { className?: string }) {
  const [open, setOpen] = useState(false);
  const t = useTranslations();
  const rootRef = useRef<HTMLDivElement>(null);
  const openRef = useRef(open);

  useEffect(() => {
    openRef.current = open;
  }, [open]);

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!openRef.current) return;
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("click", onDocClick);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("click", onDocClick);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  return (
    <div ref={rootRef} className={cn("relative", className)}>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setOpen((v) => !v);
        }}
        aria-haspopup="menu"
        aria-expanded={open}
        className="flex shrink-0 cursor-pointer items-center gap-1 text-sm font-semibold whitespace-nowrap text-[#1A1C1E] hover:text-[var(--accd)]"
      >
        {t("nav.more")}
        <ChevronDown className={cn("size-3.5 transition-transform", open && "rotate-180")} />
      </button>

      {open && (
        <ul
          role="menu"
          className="absolute left-0 top-[calc(100%+14px)] z-50 min-w-[180px] overflow-hidden rounded-lg border border-[#E2DFD6] bg-white py-1 shadow-[0_10px_30px_rgba(0,0,0,0.14)]"
        >
          {MORE_NAV_ROUTES.map((link) => (
            <li key={link.key}>
              <Link
                href={link.href}
                onClick={() => setOpen(false)}
                role="menuitem"
                className="block cursor-pointer px-3.5 py-2.5 text-sm font-semibold text-[#33363A] hover:bg-[#F8F7F3] hover:text-[var(--accd)]"
              >
                {t(`nav.${link.key}`)}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
