"use client";

import { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

export interface GooeyOption {
  value: string;
  label: string;
}

/**
 * A custom dropdown with a gooey/blob reveal (SVG goo filter + staggered spring
 * items), inspired by Aceternity's gooey dropdown. Keyboard + click-outside
 * aware. Drop-in replacement for a styled <select>.
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
      {/* goo filter */}
      <svg className="pointer-events-none absolute h-0 w-0" aria-hidden>
        <defs>
          <filter id={filterId}>
            <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -10"
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
        className="flex w-full items-center justify-between gap-2 rounded-lg border border-(--border-strong) bg-surface px-3.5 py-2.5 text-left text-sm text-foreground transition-colors hover:bg-surface-2 focus:outline-none focus:ring-2 focus:ring-(--accent-ring)/50"
      >
        <span className="truncate">{selected?.label ?? "Select…"}</span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="text-subtle"
        >
          ▾
        </motion.span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="absolute z-40 mt-2 w-full"
            style={{ filter: `url(#${filterId})` }}
            initial="closed"
            animate="open"
            exit="closed"
          >
            <motion.ul
              role="listbox"
              className="max-h-64 overflow-auto rounded-xl bg-accent p-1.5"
              variants={{
                open: { transition: { staggerChildren: 0.035 } },
                closed: { transition: { staggerChildren: 0.02, staggerDirection: -1 } },
              }}
            >
              {options.map((opt) => (
                <motion.li
                  key={opt.value}
                  role="option"
                  aria-selected={opt.value === value}
                  variants={{
                    open: { opacity: 1, y: 0, scale: 1 },
                    closed: { opacity: 0, y: -14, scale: 0.6 },
                  }}
                  transition={{ type: "spring", stiffness: 400, damping: 26 }}
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
