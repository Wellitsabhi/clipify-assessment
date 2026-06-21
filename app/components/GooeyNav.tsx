"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export interface GooeyNavItem {
  label: string;
  href: string;
}

/**
 * GooeyNav (reactbits, adapted to Next routing). Active item gets a pill; on
 * click a gooey particle burst fires and the pill morphs to the new item.
 * Active state is derived from the current pathname.
 */
export function GooeyNav({
  items,
  animationTime = 600,
  particleCount = 15,
  particleDistances = [90, 10],
  particleR = 100,
  timeVariance = 300,
}: {
  items: GooeyNavItem[];
  animationTime?: number;
  particleCount?: number;
  particleDistances?: [number, number];
  particleR?: number;
  timeVariance?: number;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLUListElement>(null);
  const filterRef = useRef<HTMLSpanElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);

  const activeIndex = Math.max(
    0,
    items.findIndex((it) => pathname === it.href || pathname.startsWith(it.href + "/"))
  );

  const noise = (n = 1) => n / 2 - Math.random() * n;
  const getXY = (distance: number, pointIndex: number, totalPoints: number): [number, number] => {
    const angle = ((360 + noise(8)) / totalPoints) * pointIndex * (Math.PI / 180);
    return [distance * Math.cos(angle), distance * Math.sin(angle)];
  };

  function makeParticles(element: HTMLElement) {
    const d = particleDistances;
    const r = particleR;
    const bubbleTime = animationTime * 2 + timeVariance;
    element.style.setProperty("--time", `${bubbleTime}ms`);
    for (let i = 0; i < particleCount; i++) {
      const t = animationTime * 2 + noise(timeVariance * 2);
      const rotate = noise(r / 10);
      const start = getXY(d[0], particleCount - i, particleCount);
      const end = getXY(d[1] + noise(7), particleCount - i, particleCount);
      const scale = 1 + noise(0.2);
      const color = (Math.floor(Math.random() * 4) + 1) as number;
      element.classList.remove("active");
      setTimeout(() => {
        const particle = document.createElement("span");
        const point = document.createElement("span");
        particle.classList.add("particle");
        particle.style.setProperty("--start-x", `${start[0]}px`);
        particle.style.setProperty("--start-y", `${start[1]}px`);
        particle.style.setProperty("--end-x", `${end[0]}px`);
        particle.style.setProperty("--end-y", `${end[1]}px`);
        particle.style.setProperty("--time", `${t}ms`);
        particle.style.setProperty("--scale", `${scale}`);
        particle.style.setProperty("--color", `var(--color-${color}, white)`);
        particle.style.setProperty("--rotate", `${rotate > 0 ? (rotate + r / 20) * 10 : (rotate - r / 20) * 10}deg`);
        point.classList.add("point");
        particle.appendChild(point);
        element.appendChild(particle);
        requestAnimationFrame(() => element.classList.add("active"));
        setTimeout(() => {
          try {
            element.removeChild(particle);
          } catch {}
        }, t);
      }, 30);
    }
  }

  function updateEffectPosition(el: HTMLElement) {
    if (!containerRef.current || !filterRef.current || !textRef.current) return;
    const c = containerRef.current.getBoundingClientRect();
    const pos = el.getBoundingClientRect();
    const styles = {
      left: `${pos.x - c.x}px`,
      top: `${pos.y - c.y}px`,
      width: `${pos.width}px`,
      height: `${pos.height}px`,
    };
    Object.assign(filterRef.current.style, styles);
    Object.assign(textRef.current.style, styles);
    textRef.current.innerText = el.innerText;
  }

  // Position the pill/text on mount and whenever the active route changes.
  useEffect(() => {
    const li = navRef.current?.querySelectorAll("li")[activeIndex] as HTMLElement | undefined;
    if (li) updateEffectPosition(li);
    const onResize = () => {
      const cur = navRef.current?.querySelectorAll("li")[activeIndex] as HTMLElement | undefined;
      if (cur) updateEffectPosition(cur);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex, pathname]);

  function handleClick(e: React.MouseEvent, index: number, href: string) {
    const li = (e.currentTarget as HTMLElement).closest("li") as HTMLElement;
    if (index !== activeIndex && li) {
      updateEffectPosition(li);
      if (filterRef.current) {
        filterRef.current.querySelectorAll(".particle").forEach((p) => p.remove());
        makeParticles(filterRef.current);
      }
      if (textRef.current) {
        textRef.current.classList.remove("active");
        void textRef.current.offsetWidth;
        textRef.current.classList.add("active");
      }
    }
    router.push(href);
  }

  return (
    <div className="gooey-nav" ref={containerRef}>
      <nav>
        <ul ref={navRef}>
          {items.map((item, i) => (
            <li key={item.href} className={i === activeIndex ? "active" : ""}>
              <Link href={item.href} onClick={(e) => { e.preventDefault(); handleClick(e, i, item.href); }}>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <span className="effect filter" ref={filterRef} aria-hidden />
      <span className="effect text" ref={textRef} aria-hidden />
    </div>
  );
}
