import type { Metadata } from "next";
import { media } from "@/lib/content";
import { YouTube } from "@/components/YouTube";

export const metadata: Metadata = {
  title: "Medien",
  description:
    "Musik von BBLESSED: Audio-Ausschnitte aus Gottesdiensten und Konzerten sowie das Imagevideo der worship band aus Witten-Herbede.",
  alternates: { canonical: "/medien" },
};

export default function MedienPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="font-display-upper text-4xl text-[var(--color-fg)] sm:text-6xl">
        <span className="text-[var(--color-accent)]">/</span> Medien
      </h1>

      <section className="mt-12">
        <h2 className="font-display text-2xl font-semibold text-[var(--color-fg)]">
          Audio-Samples
        </h2>
        <p className="mt-2 text-sm text-[var(--color-fg-muted)]">
          Ausschnitte aus Gottesdiensten und Konzerten.
        </p>
        <ul className="mt-6 space-y-5">
          {media.tracks.map((t) => (
            <li
              key={t.url}
              className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-card)] p-4 shadow-sm"
            >
              <p className="font-display text-lg font-medium">{t.title}</p>
              <p className="text-sm text-[var(--color-fg-muted)]">{t.artist}</p>
              <audio controls preload="none" className="mt-3 w-full">
                <source src={t.url} type="audio/mpeg" />
              </audio>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-16">
        <h2 className="font-display text-2xl font-semibold text-[var(--color-fg)]">Imagevideo</h2>
        <p className="mt-2 text-sm text-[var(--color-fg-muted)]">BBLESSED, wie es früher klang.</p>
        <div className="mt-6">
          <YouTube id={media.imageVideoYoutube} title="BBLESSED – Imagevideo" />
        </div>
      </section>
    </div>
  );
}
