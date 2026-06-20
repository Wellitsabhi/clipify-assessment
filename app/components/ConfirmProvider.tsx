"use client";

import { AnimatePresence, motion } from "motion/react";
import { createContext, useCallback, useContext, useRef, useState } from "react";
import { Button } from "@/app/components/ui";
import { EASE_OUT } from "@/app/components/motion";

interface ConfirmOptions {
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  tone?: "default" | "danger";
}

type ConfirmFn = (opts: ConfirmOptions) => Promise<boolean>;

const ConfirmContext = createContext<ConfirmFn | null>(null);

export function useConfirm(): ConfirmFn {
  const ctx = useContext(ConfirmContext);
  if (!ctx) throw new Error("useConfirm must be used within ConfirmProvider");
  return ctx;
}

/**
 * App-level confirm dialog: a centered modal (transform-origin center, per Emil)
 * that scales from 0.96 + opacity, with a blurred backdrop. Replaces window.confirm.
 */
export function ConfirmProvider({ children }: { children: React.ReactNode }) {
  const [opts, setOpts] = useState<ConfirmOptions | null>(null);
  const resolver = useRef<(v: boolean) => void>(null);

  const confirm = useCallback<ConfirmFn>((o) => {
    setOpts(o);
    return new Promise<boolean>((resolve) => {
      resolver.current = resolve;
    });
  }, []);

  function close(result: boolean) {
    resolver.current?.(result);
    resolver.current = null;
    setOpts(null);
  }

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      <AnimatePresence>
        {opts && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              className="absolute inset-0 bg-foreground/40 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.15 } }}
              onClick={() => close(false)}
            />
            <motion.div
              role="alertdialog"
              aria-modal="true"
              className="relative w-full max-w-sm rounded-2xl border border-border bg-surface p-6 shadow-(--shadow-lg)"
              initial={{ opacity: 0, scale: 0.96, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: 4, transition: { duration: 0.14, ease: EASE_OUT } }}
              transition={{ duration: 0.22, ease: EASE_OUT }}
            >
              <h2 className="font-display text-lg font-semibold text-foreground">{opts.title}</h2>
              {opts.description && (
                <p className="mt-2 text-sm leading-relaxed text-muted">{opts.description}</p>
              )}
              <div className="mt-6 flex justify-end gap-2">
                <Button variant="secondary" onClick={() => close(false)}>
                  {opts.cancelLabel ?? "Cancel"}
                </Button>
                <Button
                  variant={opts.tone === "danger" ? "danger" : "primary"}
                  onClick={() => close(true)}
                  autoFocus
                >
                  {opts.confirmLabel ?? "Confirm"}
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </ConfirmContext.Provider>
  );
}
