"use client";

import { forwardRef } from "react";
import type {
  ButtonHTMLAttributes,
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
} from "react";

function cx(...parts: (string | false | null | undefined)[]) {
  return parts.filter(Boolean).join(" ");
}

/* -------------------------------------------------------------------------- */
/* Button                                                                     */
/* -------------------------------------------------------------------------- */

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
};

const BTN_BASE =
  "group/btn inline-flex items-center justify-center gap-2 font-medium rounded-lg whitespace-nowrap " +
  "transition-[transform,background-color,box-shadow,color] duration-200 [transition-timing-function:var(--ease-out-soft)] " +
  "active:scale-[0.97] disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100";

const BTN_VARIANT: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary: "bg-accent text-white shadow-(--shadow-sm) hover:bg-accent-hover hover:shadow-(--shadow-md)",
  secondary:
    "bg-surface text-foreground border border-(--border-strong) hover:bg-surface-2",
  ghost: "text-muted hover:text-foreground hover:bg-black/5",
  danger: "bg-(--danger-soft) text-danger border border-(--danger)/15 hover:bg-(--danger)/10",
};

const BTN_SIZE: Record<NonNullable<ButtonProps["size"]>, string> = {
  sm: "text-sm px-3 py-1.5",
  md: "text-sm px-4 py-2.5",
  lg: "text-base px-6 py-3",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = "primary", size = "md", className, ...props },
  ref
) {
  return (
    <button
      ref={ref}
      className={cx(BTN_BASE, BTN_VARIANT[variant], BTN_SIZE[size], className)}
      {...props}
    />
  );
});

/* -------------------------------------------------------------------------- */
/* IconButton — icon-only action with an accessible tooltip                   */
/* -------------------------------------------------------------------------- */

type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  label: string; // required: accessible name + tooltip text
  tone?: "default" | "danger";
};

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  { label, tone = "default", className, children, ...props },
  ref
) {
  return (
    <span className="group/ib relative inline-flex">
      <button
        ref={ref}
        aria-label={label}
        title={label}
        className={cx(
          "inline-flex h-9 w-9 items-center justify-center rounded-lg transition-[transform,background-color,color] duration-200 [transition-timing-function:var(--ease-out-soft)] active:scale-90",
          tone === "danger"
            ? "text-subtle hover:bg-(--danger-soft) hover:text-danger"
            : "text-subtle hover:bg-black/[0.05] hover:text-foreground",
          className
        )}
        {...props}
      >
        {children}
      </button>
      {/* CSS tooltip — appears on hover/focus, no JS. */}
      <span
        role="tooltip"
        className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 translate-y-1 scale-95 whitespace-nowrap rounded-md bg-foreground px-2 py-1 text-xs font-medium text-white opacity-0 shadow-(--shadow-md) transition-all duration-150 group-hover/ib:translate-y-0 group-hover/ib:scale-100 group-hover/ib:opacity-100"
      >
        {label}
      </span>
    </span>
  );
});

/* -------------------------------------------------------------------------- */
/* Input / Select                                                             */
/* -------------------------------------------------------------------------- */

const FIELD =
  "w-full rounded-lg border border-(--border-strong) bg-surface px-3.5 py-2.5 text-sm text-foreground placeholder:text-subtle transition-shadow focus:outline-none focus:border-accent focus:ring-2 focus:ring-(--accent-ring)/50";

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  function Input({ className, ...props }, ref) {
    return <input ref={ref} className={cx(FIELD, className)} {...props} />;
  }
);

export const Select = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement>>(
  function Select({ className, ...props }, ref) {
    return <select ref={ref} className={cx(FIELD, "cursor-pointer", className)} {...props} />;
  }
);

export function Label({ children, htmlFor }: { children: ReactNode; htmlFor?: string }) {
  return (
    <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-medium text-foreground">
      {children}
    </label>
  );
}

/* -------------------------------------------------------------------------- */
/* Card / Badge / misc                                                        */
/* -------------------------------------------------------------------------- */

export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cx(
        "rounded-(--radius-card) border border-border bg-surface shadow-(--shadow-sm)",
        className
      )}
    >
      {children}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Skeletons                                                                  */
/* -------------------------------------------------------------------------- */

export function Skeleton({ className }: { className?: string }) {
  return <div className={cx("skeleton rounded-md", className)} aria-hidden />;
}

export function RecipeGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="overflow-hidden rounded-(--radius-card) border border-border bg-surface"
        >
          <Skeleton className="h-44 w-full rounded-none" />
          <div className="space-y-3 p-5">
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-4/5" />
            <div className="flex gap-3 pt-2">
              <Skeleton className="h-3 w-12" />
              <Skeleton className="h-3 w-10" />
              <Skeleton className="h-3 w-12" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function CardListSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-(--radius-card) border border-border bg-surface p-6">
          <Skeleton className="h-5 w-1/2" />
          <Skeleton className="mt-3 h-3 w-1/3" />
          <Skeleton className="mt-6 h-1.5 w-full" />
        </div>
      ))}
    </div>
  );
}

export function Badge({
  children,
  tone = "neutral",
}: {
  children: ReactNode;
  tone?: "neutral" | "accent";
}) {
  return (
    <span
      className={cx(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        tone === "accent" ? "bg-accent-soft text-accent-hover" : "bg-stone-100 text-stone-600"
      )}
    >
      {children}
    </span>
  );
}

export function Spinner({ className }: { className?: string }) {
  return (
    <span
      className={cx(
        "inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent",
        className
      )}
      aria-hidden
    />
  );
}

export function PageLoader() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center text-subtle">
      <Spinner className="h-6 w-6" />
    </div>
  );
}

export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-(--radius-card) border border-dashed border-(--border-strong) bg-surface px-6 py-16 text-center">
      {icon && <div className="mb-4 text-4xl opacity-80">{icon}</div>}
      <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      {description && <p className="mt-1 max-w-sm text-sm text-muted">{description}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
