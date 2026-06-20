"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

/**
 * Renders assistant markdown styled to the design system — headings, bold,
 * bullet/numbered lists, code, links. Keeps Chef Ferraro's replies structured
 * and legible instead of raw text.
 */
export function Markdown({ children }: { children: string }) {
  return (
    <div className="text-sm leading-relaxed text-foreground [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: (p) => <h3 className="mb-2 mt-4 font-display text-lg font-semibold text-foreground" {...p} />,
          h2: (p) => <h3 className="mb-2 mt-4 font-display text-base font-semibold text-foreground" {...p} />,
          h3: (p) => <h4 className="mb-1.5 mt-3 text-sm font-semibold text-foreground" {...p} />,
          p: (p) => <p className="my-2" {...p} />,
          ul: (p) => <ul className="my-2 ml-1 space-y-1" {...p} />,
          ol: (p) => <ol className="my-2 ml-1 list-decimal space-y-1 pl-4 marker:text-subtle" {...p} />,
          li: ({ children, ...p }) => (
            <li className="flex gap-2 [ol_&]:list-item [ol_&]:gap-0" {...p}>
              <span className="mt-[7px] hidden h-1 w-1 shrink-0 rounded-full bg-accent [ul_&]:block" aria-hidden />
              <span className="[ul_&]:flex-1">{children}</span>
            </li>
          ),
          strong: (p) => <strong className="font-semibold text-foreground" {...p} />,
          em: (p) => <em className="italic" {...p} />,
          a: (p) => <a className="text-accent-hover underline underline-offset-2" {...p} />,
          code: (p) => (
            <code className="rounded bg-surface-2 px-1.5 py-0.5 font-mono text-[0.85em] text-accent-hover" {...p} />
          ),
          blockquote: (p) => (
            <blockquote className="my-2 border-l-2 border-accent/40 pl-3 italic text-muted" {...p} />
          ),
          hr: () => <hr className="my-4 border-border" />,
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
