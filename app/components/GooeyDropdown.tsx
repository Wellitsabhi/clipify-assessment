"use client";

import { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { EASE_OUT } from "@/app/components/motion";

export interface GooeyOption {
  value: string;
  label: string;
}

/**
 * Custom dropdown with a gooey/blob reveal (SVG goo filter + staggered items).
 * Origin-aware (scales from the top, where the trigger is), strong ease-out
 * enter, faster exit (Emil). Click-outside + Escape aware.
 */
export function GooeyDropdown({
  value,
  options,
  onChange,
  ariaLabel,
}: {
  value: string;
  options: GooeyOption[];
  onChange: (value: string) => void;
  ariaLabel?: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const filterId = useId().replace(/:/g, "");
  const selected = options.find((o) => o.value === value);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <div ref={ref} className="relative">
      <svg className="pointer-events-none absolute h-0 w-0" aria-hidden>
        <defs>
          <filter id={filterId}>
            <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -9"
              result="goo"
            />
            <feBlend in="SourceGraphic" in2="goo" />
          </filter>
        </defs>
      </svg>

      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={ariaLabel}
        onClick={() => setOpen((o) => !o)}
        className="press flex w-full items-center justify-between gap-2 rounded-lg border border-(--border-strong) bg-surface px-3.5 py-2.5 text-left text-sm text-foreground transition-colors hover:bg-surface-2 focus:outline-none focus:border-foreground/30"
      >
        <span className="truncate">{selected?.label ?? "Select…"}</span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2, ease: EASE_OUT }}
          className="text-subtle"
        >
          ▾
        </motion.span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="absolute left-0 right-0 top-full z-40 mt-2 origin-top"
            style={{ filter: `url(#${filterId})`, transformOrigin: "top center" }}
            initial={{ opacity: 0, y: -6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97, transition: { duration: 0.13, ease: EASE_OUT } }}
            transition={{ duration: 0.22, ease: EASE_OUT }}
          >
            <motion.ul
              role="listbox"
              className="max-h-64 overflow-auto rounded-xl bg-accent p-1.5 shadow-(--shadow-lg)"
              initial="closed"
              animate="open"
              exit="closed"
              variants={{
                open: { transition: { staggerChildren: 0.03 } },
                closed: { transition: { staggerChildren: 0.015, staggerDirection: -1 } },
              }}
            >
              {options.map((opt) => (
                <motion.li
                  key={opt.value}
                  role="option"
                  aria-selected={opt.value === value}
                  variants={{
                    open: { opacity: 1, y: 0, scale: 1 },
                    closed: { opacity: 0, y: -12, scale: 0.7 },
                  }}
                  transition={{ type: "spring", duration: 0.4, bounce: 0.25 }}
                  onClick={() => {
                    onChange(opt.value);
                    setOpen(false);
                  }}
                  className={`cursor-pointer select-none rounded-lg px-3 py-2 text-sm transition-colors ${
                    opt.value === value
                      ? "bg-white font-medium text-accent-hover"
                      : "text-white hover:bg-white/15"
                  }`}
                >
                  {opt.label}
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
