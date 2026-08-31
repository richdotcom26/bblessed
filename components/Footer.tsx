import Link from "next/link";
import { kontakt } from "@/lib/content";

export function Footer() {
  return (
    <footer className="mt-20 border-t border-[var(--color-border)] bg-[var(--color-bg-alt)]">
      <div className="mx-auto max-w-5xl px-4 py-12 text-sm text-[var(--color-fg-muted)]">
        <span
          className="logo-mark h-6 w-auto text-[var(--color-fg-muted)]"
          role="img"
          aria-label="BBLESSED"
        />
        <p className="mt-3 font-display-upper tracking-[0.15em]">
          worship band · Witten-Herbede · seit 2004
        </p>
        <p className="mt-4">
          Christen, die Musik machen.{" "}
          <Link href="/kontakt" className="underline underline-offset-2 hover:text-[var(--color-accent)]">
            Kontakt &amp; Impressum
          </Link>
        </p>
        <p className="mt-2">
          <a
            href={`mailto:${kontakt.email}`}
            className="underline underline-offset-2 hover:text-[var(--color-accent)]"
          >
            {kontakt.email}
          </a>
        </p>
      </div>
    </footer>
  );
}
