import Image from "next/image";
import Link from "next/link";
import { Clock, ShieldCheck } from "lucide-react";

import { TEL, TEL_LABEL, waHref } from "@/lib/site";

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
  return (
    <footer className="bg-[#0F1113] text-[#A9ADB0]">
      <div className="px-5 pt-12 pb-[58px] min-[900px]:mx-auto min-[900px]:max-w-[1200px] min-[900px]:px-10">
        <span className="inline-block rounded-lg bg-[#F4F2EE] px-3.5 py-2.5">
          <Image src="/logo.webp" alt="Pádel & Pickleball Albufera" width={140} height={34} style={{ height: 34, width: "auto" }} />
        </span>
        <p className="mt-3 text-sm font-semibold leading-[1.8] text-[#D8D6CF]">
          Construcción de pistas de pádel y pickleball en España, Francia, Alemania y Bélgica
        </p>
        <p className="text-sm leading-[1.8]">
          Pavimentos Albufera S.L.
          <br />
          CIF B-00000000
          <br />
          C/ Dirección física, 00 · 46000 Valencia
        </p>
        <Divider />
        <FootHeading>Navegación</FootHeading>
        <p className="text-sm leading-[1.8]">
          <Link href="/" className="text-[#A9ADB0]">
            Inicio
          </Link>{" "}
          ·{" "}
          <Link href="/padel" className="text-[#A9ADB0]">
            Pistas de pádel
          </Link>{" "}
          ·{" "}
          <Link href="/pickleball" className="text-[#A9ADB0]">
            Pistas de pickleball
          </Link>
          <br />
          Proyectos · Proceso · Sobre nosotros ·{" "}
          <Link href="/contacto" className="text-[#A9ADB0]">
            Contacto
          </Link>
        </p>
        <Divider />
        <FootHeading>Contacto</FootHeading>
        <p className="text-sm leading-[1.8]">
          <a href={`tel:${TEL}`} className="text-[#D8D6CF]">
            {TEL_LABEL}
          </a>
          <br />
          <a href={waHref()} className="text-[#D8D6CF]">
            WhatsApp · respuesta &lt; 1 h laborable
          </a>
          <br />
          info@padelalbufera.com
          <br />
          L–V · 8:00–18:00
        </p>
        <Divider />
        <FootHeading>Zonas de servicio</FootHeading>
        <p className="text-sm leading-[1.8]">
          Comunitat Valenciana
          <br />
          Resto de España
          <br />
          Francia · Alemania · Bélgica
        </p>
        <Divider />
        <div className="flex flex-col gap-2">
          <span className="flex items-center gap-2 rounded-md border border-[#2B3034] px-2.5 py-2 text-[12.5px] font-semibold text-[#D8D6CF]">
            <ShieldCheck className="size-5 text-[var(--acc)]" /> Garantía 10 años
          </span>
          <span className="flex items-center gap-2 rounded-md border border-[#2B3034] px-2.5 py-2 text-[12.5px] font-semibold text-[#D8D6CF]">
            <Clock className="size-5 text-[var(--acc)]" /> 17+ años de experiencia
          </span>
        </div>
        <Divider />
        <p className="text-xs leading-[2] text-[#6A6E72]">
          © 2026 Pavimentos Albufera · Política de privacidad · Aviso legal · Cookies
        </p>
      </div>
    </footer>
  );
}
