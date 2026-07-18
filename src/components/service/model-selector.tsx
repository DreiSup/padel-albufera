"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { WhatsappIcon } from "@/components/icons";
import { waHref } from "@/lib/site";
import { specLabel } from "@/lib/spec-labels";
import { BLUR } from "@/lib/image-blur";
import type { Locale } from "@/i18n/routing";

interface ServiceModel {
  name: string;
  cta: string;
  desc: string;
  price: string;
  specs: Record<string, string>;
  ideal: string[];
}

type Gallery = [{ src: string; alt: string }, { src: string; alt: string }, { src: string; alt: string }];

export function ModelSelector({
  ns,
  items,
  gallery,
  locale,
  waBaseMessage,
}: {
  ns: "padel" | "pickleball";
  items: ServiceModel[];
  gallery: [Gallery, Gallery, Gallery];
  locale: Locale;
  waBaseMessage: string;
}) {
  const t = useTranslations(ns);
  const [model, setModel] = useState(0);

  const tabs = t.raw("models.tabs") as string[];
  const m = items[model];
  const g = gallery[model];

  return (
    <>
      <div className="sticky top-16 z-30 mt-2 flex gap-2 bg-[#F4F2EE] py-3 min-[1100px]:top-[74px] min-[900px]:mx-auto min-[900px]:max-w-[1120px]">
        {tabs.map((tab, i) => (
          <button
            key={tab}
            onClick={() => setModel(i)}
            className={`font-display h-11 flex-1 rounded-lg border-[1.5px] text-[17px] font-semibold uppercase tracking-wide ${
              model === i
                ? "border-[#17191B] bg-[#17191B] text-white"
                : "border-[#D8D4C9] bg-white text-[#565A5E]"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="mt-2 grid grid-cols-2 gap-2.5 min-[900px]:mx-auto min-[900px]:max-w-[820px]">
        <div key={`${model}-0`} className="relative col-span-2 aspect-4/3 overflow-hidden rounded-[10px] bg-[#E7E4DC] min-[900px]:aspect-[16/10]">
          <Image
            src={g[0].src}
            alt={g[0].alt}
            fill
            sizes="(max-width: 900px) 100vw, 820px"
            quality={70}
            placeholder="blur"
            blurDataURL={BLUR[g[0].src]}
            className="object-cover"
          />
        </div>
        <div key={`${model}-1`} className="relative aspect-3/4 overflow-hidden rounded-[10px] bg-[#E7E4DC]">
          <Image
            src={g[1].src}
            alt={g[1].alt}
            fill
            sizes="(max-width: 900px) 50vw, 400px"
            quality={70}
            placeholder="blur"
            blurDataURL={BLUR[g[1].src]}
            className="object-cover"
          />
        </div>
        <div key={`${model}-2`} className="relative aspect-3/4 overflow-hidden rounded-[10px] bg-[#E7E4DC]">
          <Image
            src={g[2].src}
            alt={g[2].alt}
            fill
            sizes="(max-width: 900px) 50vw, 400px"
            quality={70}
            placeholder="blur"
            blurDataURL={BLUR[g[2].src]}
            className="object-cover"
          />
        </div>
      </div>

      <p className="mut m-0 mt-3 text-[15px] leading-[1.55] text-[#565A5E]">{m.desc}</p>

      <div className="mt-3">
        {Object.entries(m.specs).map(([k, v]) => (
          <div key={k} className="flex justify-between gap-3.5 border-b border-[#E5E2D9] py-[11px] text-sm">
            <span className="shrink-0 text-[#7A7E82]">{specLabel(locale, k)}</span>
            <span className="text-right font-semibold">{v}</span>
          </div>
        ))}
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span className="self-center text-xs font-semibold uppercase tracking-wide text-[#565A5E]">
          {t("models.idealFor")}
        </span>
        {m.ideal.map((ic) => (
          <span key={ic} className="rounded-md border-[1.5px] border-[#D8D4C9] bg-white px-2.5 py-1.5 text-xs font-semibold text-[#2A2D30]">
            {ic}
          </span>
        ))}
      </div>

      <div className="mt-1 flex items-baseline justify-between gap-2">
        <span className="text-lg font-bold">{m.price}</span>
      </div>

      <Button asChild className="mt-3 w-full">
        <a href={waHref(`${waBaseMessage} (${m.name}).`)}>
          <WhatsappIcon className="size-5" />
          {m.cta}
        </a>
      </Button>
    </>
  );
}
