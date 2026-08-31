"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const links = [
  { href: "/", label: "Start" },
  { href: "/ueber-uns", label: "Über uns" },
  { href: "/chronik", label: "Chronik" },
  { href: "/medien", label: "Medien" },
  { href: "/kontakt", label: "Kontakt" },
];

export function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--color-border)] bg-[var(--color-bg)]">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link href="/" className="group flex items-baseline gap-2" onClick={() => setOpen(false)}>
          <span className="font-display text-2xl font-semibold tracking-wide text-[var(--color-accent)]">
            BBLESSED
          </span>
          <span className="hidden text-xs uppercase tracking-[0.2em] text-[var(--color-fg-muted)] sm:inline">
            worship band
          </span>
        </Link>

        <nav className="hidden gap-6 md:flex">
          {links.map((l) => {
            const active = l.href === "/" ? pathname === "/" : pathname.startsWith(l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`text-sm font-medium transition-colors ${
                  active
                    ? "text-[var(--color-accent)]"
                    : "text-[var(--color-fg)] hover:text-[var(--color-accent)]"
                }`}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>

        <button
          onClick={() => setOpen((v) => !v)}
          className="text-2xl leading-none text-[var(--color-fg)] md:hidden"
          aria-label="Menü"
        >
          {open ? "×" : "☰"}
        </button>
      </div>

      {open && (
        <nav className="flex flex-col border-t border-[var(--color-border)] px-4 py-2 md:hidden">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="py-2 text-sm font-medium text-[var(--color-fg)]"
            >
              {l.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
