"use client";

/**
 * The certificate's visual vocabulary, on the page: what makes the PDF easy
 * to read — numbered sections with a rule, key-value tables, boxed lists, a
 * cover with the commit in full, a conclusion in its own box. Small,
 * unopinionated pieces the report body composes in the PDF's order.
 *
 * `useHeaded` lets an older sub-component, which draws its own heading, drop
 * it when a numbered section already names it.
 */
import { createContext, useContext, type ReactNode } from "react";

const Headed = createContext(false);

/** True inside a numbered section: the heading is already drawn. */
export function useHeaded(): boolean {
  return useContext(Headed);
}

/** A running number for the sections actually rendered, in source order. */
export function sectionCounter() {
  let n = 0;
  return () => String(++n);
}

export function Section({ n, title, children }: { n: string; title: string; children: ReactNode }) {
  return (
    <Headed.Provider value={true}>
      <section className="mt-10">
        <div className="flex items-baseline gap-3 border-b-2 border-teal-600/50 pb-1.5">
          <span className="font-mono text-sm font-bold text-teal-700 dark:text-teal-400">{n}</span>
          <h2 className="text-sm font-bold uppercase tracking-wider">{title}</h2>
        </div>
        <div className="[&>h2.mt-10]:mt-4 [&>:first-child]:mt-4">{children}</div>
      </section>
    </Headed.Provider>
  );
}

export interface KvRow {
  label: string;
  value: ReactNode;
}

/** Two columns, a rule between rows, the label in small capitals. */
export function KvTable({ rows, labelWidth = "11rem" }: { rows: KvRow[]; labelWidth?: string }) {
  return (
    <dl className="mt-4 divide-y rounded-md border text-sm">
      {rows.map((r, i) => (
        <div
          key={`${r.label}-${i}`}
          className="grid gap-x-4 gap-y-1 px-4 py-2.5 sm:grid-cols-[var(--kv)_1fr] odd:bg-muted/30"
          style={{ "--kv": labelWidth } as React.CSSProperties}
        >
          <dt className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{r.label}</dt>
          <dd className="min-w-0 break-words">{r.value}</dd>
        </div>
      ))}
    </dl>
  );
}

/** A grey box with an optional lead and a dashed list. */
export function BoxedList({ lead, items, tone = "grey" }: { lead?: string; items: string[]; tone?: "grey" | "teal" }) {
  return (
    <div className={tone === "teal"
      ? "mt-4 rounded-md border border-teal-600/40 bg-teal-50/60 p-4 text-sm dark:bg-teal-950/20"
      : "mt-4 rounded-md border bg-muted/40 p-4 text-sm"}>
      {lead && <p>{lead}</p>}
      <ul className={lead ? "mt-2 space-y-1" : "space-y-1"}>
        {items.map((item) => (
          <li key={item} className="flex gap-2 text-muted-foreground">
            <span aria-hidden="true">&ndash;</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** A box with one paragraph, or several. */
export function BoxedText({ children, tone = "grey" }: { children: ReactNode; tone?: "grey" | "teal" }) {
  return (
    <div className={tone === "teal"
      ? "mt-4 space-y-3 rounded-md border-l-4 border-teal-600 bg-teal-50/60 p-4 text-sm dark:bg-teal-950/20"
      : "mt-4 space-y-3 rounded-md border bg-muted/40 p-4 text-sm"}>
      {children}
    </div>
  );
}

/** What the run established, item by item, in the certificate's box. */
export function ConclusionBox({ items }: { items: { title: string; body: string }[] }) {
  if (!items.length) return null;
  return (
    <div className="mt-4 space-y-4 rounded-md border border-teal-600/50 bg-teal-50/60 p-5 text-sm dark:bg-teal-950/20">
      {items.map((c) => (
        <div key={c.title}>
          <p className="font-semibold">
            <span className="mr-2 text-teal-700 dark:text-teal-400" aria-hidden="true">&#9670;</span>{c.title}
          </p>
          <p className="mt-1 pl-5 text-muted-foreground">{c.body}</p>
        </div>
      ))}
    </div>
  );
}
