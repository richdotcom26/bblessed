import Link from "next/link";
import { kontakt } from "@/lib/content";

export function Footer() {
  return (
    <footer className="mt-20 border-t border-[var(--color-border)] bg-[var(--color-bg-alt)]">
      <div className="mx-auto max-w-5xl px-4 py-10 text-sm text-[var(--color-fg-muted)]">
        <p className="font-display text-xl font-semibold text-[var(--color-accent)]">BBLESSED</p>
        <p className="mt-1">worship band · Witten-Herbede · seit 2004</p>
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
