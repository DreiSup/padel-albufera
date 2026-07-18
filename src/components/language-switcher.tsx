"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { useLocale } from "next-intl";

import { Link, usePathname } from "@/i18n/navigation";
import { LANGS } from "@/lib/site";
import { cn } from "@/lib/utils";

export function LanguageSwitcher({ className }: { className?: string }) {
  const [open, setOpen] = useState(false);
  const locale = useLocale();
  const pathname = usePathname();
  const rootRef = useRef<HTMLDivElement>(null);
  const openRef = useRef(open);
  const current = LANGS.find((l) => l.code === locale) ?? LANGS[0];

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
        aria-haspopup="listbox"
        aria-expanded={open}
        className="flex h-9 cursor-pointer items-center gap-1.5 rounded-md border-[1.5px] border-[#D8D4C9] bg-white px-2.5 text-xs font-bold text-[#1A1C1E]"
      >
        <span className="text-sm leading-none">{current.flag}</span>
        {current.label}
        <ChevronDown className={cn("size-3.5 transition-transform", open && "rotate-180")} />
      </button>

      {open && (
        <ul
          role="listbox"
          className="absolute right-0 top-[calc(100%+6px)] z-50 min-w-[150px] overflow-hidden rounded-lg border border-[#E2DFD6] bg-white py-1 shadow-[0_10px_30px_rgba(0,0,0,0.14)]"
        >
          {LANGS.map((l) => (
            <li key={l.code}>
              <Link
                href={pathname}
                locale={l.code}
                onClick={() => setOpen(false)}
                role="option"
                aria-selected={locale === l.code}
                className={cn(
                  "flex cursor-pointer items-center gap-2.5 px-3 py-2.5 text-sm font-semibold",
                  locale === l.code
                    ? "bg-[#F4F2EE] text-[#1A1C1E]"
                    : "text-[#565A5E] hover:bg-[#F8F7F3]"
                )}
              >
                <span className="text-base leading-none">{l.flag}</span>
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
