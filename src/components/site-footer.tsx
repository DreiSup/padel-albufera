import Image from "next/image";
import { Clock, ShieldCheck } from "lucide-react";
import { useTranslations } from "next-intl";

import { Link } from "@/i18n/navigation";
import { TEL, TEL_LABEL, NAV_ROUTES, waHref } from "@/lib/site";

function Divider() {
  return <div className="my-6 h-px bg-[#22262A]" />;
}

function FootHeading({ children }: { children: React.ReactNode }) {
  return (
    <h4 className="font-display m-0 mb-3 text-[17px] font-bold uppercase tracking-wide text-white">
      {children}
    </h4>
  );
}

export function SiteFooter() {
  const t = useTranslations();

  return (
    <footer className="bg-[#0F1113] text-[#A9ADB0]">
      <div className="px-5 pt-12 pb-[58px] min-[900px]:mx-auto min-[900px]:max-w-[1200px] min-[900px]:px-10">
        <span className="inline-block rounded-lg bg-[#F4F2EE] px-3.5 py-2.5">
          <Image src="/logo.webp" alt="Pádel & Pickleball Albufera" width={140} height={34} style={{ height: 34, width: "auto" }} />
        </span>
        <p className="mt-3 text-sm font-semibold leading-[1.8] text-[#D8D6CF]">
          {t("footer.tagline")}
        </p>
        <p className="text-sm leading-[1.8]">
          Pavimentos Albufera S.L.
          <br />
          CIF B-00000000
          <br />
          C/ Dirección física, 00 · 46000 Valencia
        </p>
        <Divider />
        <FootHeading>{t("footer.navTitle")}</FootHeading>
        <p className="text-sm leading-[1.8]">
          {NAV_ROUTES.map((link, i) => (
            <span key={link.key}>
              <Link href={link.href} className="text-[#A9ADB0]">
                {t(`nav.${link.key}`)}
              </Link>
              {i < NAV_ROUTES.length - 1 ? " · " : ""}
              {i === 3 ? <br /> : null}
            </span>
          ))}
        </p>
        <Divider />
        <FootHeading>{t("footer.contactTitle")}</FootHeading>
        <p className="text-sm leading-[1.8]">
          <a href={`tel:${TEL}`} className="text-[#D8D6CF]">
            {TEL_LABEL}
          </a>
          <br />
          <a href={waHref(t("common.waMessage"))} className="text-[#D8D6CF]">
            {t("footer.responseNote")}
          </a>
          <br />
          info@padelalbufera.com
          <br />
          {t("footer.hours")}
        </p>
        <Divider />
        <FootHeading>{t("footer.zonesTitle")}</FootHeading>
        <p className="text-sm leading-[1.8]">
          {t.raw("footer.zones").map((z: string, i: number, arr: string[]) => (
            <span key={z}>
              {z}
              {i < arr.length - 1 ? <br /> : null}
            </span>
          ))}
        </p>
        <Divider />
        <div className="flex flex-col gap-2">
          <span className="flex items-center gap-2 rounded-md border border-[#2B3034] px-2.5 py-2 text-[12.5px] font-semibold text-[#D8D6CF]">
            <ShieldCheck className="size-5 text-[var(--acc)]" /> {t("footer.badgeWarranty")}
          </span>
          <span className="flex items-center gap-2 rounded-md border border-[#2B3034] px-2.5 py-2 text-[12.5px] font-semibold text-[#D8D6CF]">
            <Clock className="size-5 text-[var(--acc)]" /> {t("footer.badgeYears")}
          </span>
        </div>
        <Divider />
        <p className="text-xs leading-[2] text-[#6A6E72]">{t("footer.legal")}</p>
      </div>
    </footer>
  );
}
