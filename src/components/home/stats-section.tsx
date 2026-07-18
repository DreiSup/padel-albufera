"use client";

import { useEffect, useRef, useState } from "react";

function useCountUp(active: boolean) {
  const [vals, setVals] = useState([0, 0, 0, 0]);
  const ran = useRef(false);

  useEffect(() => {
    if (!active || ran.current) return;
    ran.current = true;
    const targets = [17, 120, 10, 4];
    const duration = 1400;
    const t0 = performance.now();
    let raf: number;
    const step = (t: number) => {
      const p = Math.min(1, (t - t0) / duration);
      const e = 1 - Math.pow(1 - p, 3);
      setVals(targets.map((tg) => Math.round(tg * e)));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [active]);

  return vals;
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <div className="font-display text-[62px] font-bold leading-[0.9] text-[var(--acc)] min-[900px]:text-[78px]">
        {value}
      </div>
      <div className="mt-1.5 text-[12.5px] font-semibold uppercase tracking-wide text-[#9FA4A8]">
        {label}
      </div>
    </div>
  );
}

export function HomeStatsSection({ labels }: { labels: string[] }) {
  const [statsInView, setStatsInView] = useState(false);
  const statsRef = useRef<HTMLDivElement>(null);
  const [c0, c1, c2, c3] = useCountUp(statsInView);

  useEffect(() => {
    const el = statsRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setStatsInView(true);
        });
      },
      { threshold: 0.35 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section ref={statsRef} className="bg-[#17191B] px-5 py-[52px] text-white min-[900px]:py-[88px]">
      <div className="grid grid-cols-2 gap-x-4 gap-y-7 min-[900px]:mx-auto min-[900px]:max-w-[1000px] min-[900px]:grid-cols-4">
        <Stat value={`${c0}+`} label={labels[0]} />
        <Stat value={`+${c1}`} label={labels[1]} />
        <Stat value={`${c2}`} label={labels[2]} />
        <Stat value={`${c3}`} label={labels[3]} />
      </div>
    </section>
  );
}
