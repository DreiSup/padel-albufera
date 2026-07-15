"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Phone, Menu, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { WhatsappIcon } from "@/components/icons";
import { LANGS, NAV_LINKS, TEL, waHref } from "@/lib/site";

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [compact, setCompact] = useState(false);
  const [lang, setLang] = useState("ES");

  useEffect(() => {
    const onScroll = () => setCompact(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 border-b border-[#E2DFD6] bg-[#F6F4EF]/95 backdrop-blur transition-[height] ${
        compact ? "h-[54px] min-[900px]:h-16" : "h-16 min-[900px]:h-[74px]"
      }`}
    >
      <div className="mx-auto flex h-full max-w-[1200px] items-center justify-between px-4 min-[900px]:px-10">
        <Link href="/">
          <Image
            src="/logo.webp"
            alt="Pádel & Pickleball Albufera"
            width={140}
            height={34}
            className={`block w-auto transition-[height] ${compact ? "h-[29px]" : "h-[34px]"}`}
            priority
          />
        </Link>

        <nav className="hidden items-center gap-5 min-[900px]:flex">
          {NAV_LINKS.map((link) =>
            link.href ? (
              <Link key={link.label} href={link.href} className="text-sm font-semibold text-[#1A1C1E] hover:text-[var(--accd)]">
                {link.shortLabel}
              </Link>
            ) : (
              <span key={link.label} className="text-sm font-semibold text-[#A7A399]">
                {link.shortLabel}
              </span>
            )
          )}
          <span className="ml-1.5 rounded-md border border-[#D8D4C9] px-[9px] py-[5px] text-xs font-bold text-[#7A7E82]">
            ES
          </span>
          <a
            href={waHref()}
            className="rounded-lg bg-[var(--acc)] px-[17px] py-[11px] text-sm font-bold text-[#07130C] hover:brightness-95"
          >
            Presupuesto gratis
          </a>
        </nav>

        <div className="flex items-center gap-2 min-[900px]:hidden">
          <a
            href={`tel:${TEL}`}
            aria-label="Llamar"
            className="flex size-11 items-center justify-center rounded-lg border-[1.5px] border-[#E0DDD3] bg-white text-[#1A1C1E]"
          >
            <Phone className="size-5" />
          </a>
          <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
            <SheetTrigger asChild>
              <button
                aria-label="Menú"
                className="flex size-11 items-center justify-center rounded-lg border-[1.5px] border-[#E0DDD3] bg-white text-[#1A1C1E]"
              >
                <Menu className="size-5" />
              </button>
            </SheetTrigger>
            <SheetContent>
              <div className="mb-4 flex items-center justify-between">
                <Image src="/logo.webp" alt="" width={120} height={30} style={{ height: 30, width: "auto" }} />
                <SheetClose asChild>
                  <button
                    aria-label="Cerrar menú"
                    className="flex size-11 items-center justify-center rounded-lg border-[1.5px] border-[#E0DDD3] bg-white text-[#1A1C1E]"
                  >
                    <X className="size-5" />
                  </button>
                </SheetClose>
              </div>
              <nav className="flex flex-col">
                {NAV_LINKS.map((link) =>
                  link.href ? (
                    <SheetClose asChild key={link.label}>
                      <Link
                        href={link.href}
                        className="font-display border-b border-[#E2DFD6] py-3 text-[19px] font-semibold uppercase tracking-wide text-[#1A1C1E]"
                      >
                        {link.label}
                      </Link>
                    </SheetClose>
                  ) : (
                    <span
                      key={link.label}
                      className="font-display border-b border-[#E2DFD6] py-3 text-[19px] font-semibold uppercase tracking-wide text-[#A7A399]"
                    >
                      {link.label}
                    </span>
                  )
                )}
              </nav>
              <div className="mt-4 flex gap-2">
                {LANGS.map((l) => (
                  <button
                    key={l}
                    onClick={() => setLang(l)}
                    className={`rounded-md border-[1.5px] px-[13px] py-[7px] text-[12.5px] font-semibold ${
                      lang === l
                        ? "border-[#17191B] bg-[#17191B] text-white"
                        : "border-[#D8D4C9] bg-white text-[#565A5E]"
                    }`}
                  >
                    {l}
                  </button>
                ))}
              </div>
              <div className="mt-4 flex flex-col gap-2.5">
                <Button variant="whatsapp" asChild>
                  <a href={waHref()}>
                    <WhatsappIcon className="size-5" />
                    WhatsApp directo
                  </a>
                </Button>
                <Button asChild>
                  <a href={`tel:${TEL}`}>
                    <Phone className="size-5" />
                    Llamar ahora
                  </a>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
