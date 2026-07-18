"use client";

import { useEffect, useRef, useState } from "react";

function useCountUp(active: boolean, targets: number[]) {
  const [vals, setVals] = useState(targets.map(() => 0));
  const ran = useRef(false);

  useEffect(() => {
    if (!active || ran.current) return;
    ran.current = true;
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  return vals;
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <div className="font-display text-[56px] font-bold leading-[0.85] text-[var(--acc)]">{value}</div>
      <div className="mt-1.5 text-xs font-semibold uppercase tracking-wide text-[#9FA4A8]">{label}</div>
    </div>
  );
}

export function AboutStatsCounter({ labels }: { labels: string[] }) {
  const [statsInView, setStatsInView] = useState(false);
  const statsRef = useRef<HTMLDivElement>(null);
  const [c0, c1, c2, c3] = useCountUp(statsInView, [17, 120, 4, 12]);

  useEffect(() => {
    const el = statsRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setStatsInView(true)),
      { threshold: 0.3 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={statsRef} className="mt-6 grid grid-cols-2 gap-x-4 gap-y-6 min-[900px]:max-w-[1000px] min-[900px]:grid-cols-4">
      <Stat value={`${c0}+`} label={labels[0]} />
      <Stat value={`+${c1}`} label={labels[1]} />
      <Stat value={`${c2}`} label={labels[2]} />
      <Stat value={`${c3}`} label={labels[3]} />
    </div>
  );
}
