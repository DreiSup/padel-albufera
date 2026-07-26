"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Phone, Menu, X } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { LanguageSwitcher } from "@/components/language-switcher";
import { NavMoreMenu } from "@/components/nav-more-menu";
import { WhatsappIcon } from "@/components/icons";
import { Link } from "@/i18n/navigation";
import { NAV_ROUTES, PRIMARY_NAV_ROUTES } from "@/lib/site";
import { WhatsAppLink } from "@/components/conversion/whatsapp-link";
import { PhoneLink } from "@/components/conversion/phone-link";

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [compact, setCompact] = useState(false);
  const t = useTranslations();

  useEffect(() => {
    const onScroll = () => setCompact(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 border-b border-[#E2DFD6] bg-[#F6F4EF]/95 backdrop-blur transition-[height] ${
        compact ? "h-[54px] min-[1100px]:h-16" : "h-16 min-[1100px]:h-[74px]"
      }`}
    >
      <div className="mx-auto flex h-full max-w-[1200px] items-center justify-between px-4 min-[1100px]:px-10">
        <Link href="/">
          <Image
            src="/logo.webp"
            alt="Pádel & Pickleball Albufera"
            width={140}
            height={34}
            sizes="140px"
            quality={70}
            className={`block w-auto transition-[height] ${compact ? "h-[29px]" : "h-[34px]"}`}
          />
        </Link>

        <nav className="hidden items-center gap-4 min-[1100px]:flex">
          {PRIMARY_NAV_ROUTES.map((link) => (
            <Link
              key={link.key}
              href={link.href}
              className="shrink-0 text-sm font-semibold whitespace-nowrap text-[#1A1C1E] hover:text-[var(--accd)]"
            >
              {t(`nav.${link.key}`)}
            </Link>
          ))}
          <NavMoreMenu className="shrink-0" />
          <LanguageSwitcher className="ml-1.5 shrink-0" />
          <WhatsAppLink placement="cabecera"
            mensaje={t("common.waMessage")}
            className="shrink-0 rounded-lg bg-[var(--acc)] px-[17px] py-[11px] text-sm font-bold whitespace-nowrap text-[#07130C] hover:brightness-95"
          >
            {t("common.requestQuote")}
          </WhatsAppLink>
        </nav>

        <div className="flex items-center gap-2 min-[1100px]:hidden">
          <PhoneLink placement="cabecera"
            aria-label={t("common.call")}
            className="flex size-11 items-center justify-center rounded-lg border-[1.5px] border-[#E0DDD3] bg-white text-[#1A1C1E]"
          >
            <Phone className="size-5" />
          </PhoneLink>
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
                <Image src="/logo.webp" alt="Pádel & Pickleball Albufera" width={120} height={30} sizes="120px" quality={70} style={{ height: 30, width: "auto" }} />
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
                {NAV_ROUTES.map((link) => (
                  <SheetClose asChild key={link.key}>
                    <Link
                      href={link.href}
                      className="font-display border-b border-[#E2DFD6] py-3 text-[19px] font-semibold uppercase tracking-wide text-[#1A1C1E]"
                    >
                      {t(`nav.${link.key}`)}
                    </Link>
                  </SheetClose>
                ))}
              </nav>
              <div className="mt-4">
                <LanguageSwitcher />
              </div>
              <div className="mt-4 flex flex-col gap-2.5">
                <Button variant="whatsapp" asChild>
                  <WhatsAppLink placement="menu_movil" mensaje={t("common.waMessage")}>
                    <WhatsappIcon className="size-5" />
                    {t("common.whatsappDirect")}
                  </WhatsAppLink>
                </Button>
                <Button asChild>
                  <PhoneLink placement="menu_movil">
                    <Phone className="size-5" />
                    {t("common.callNow")}
                  </PhoneLink>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
