import type { Metadata } from "next";
import { about } from "@/lib/content";

export const metadata: Metadata = { title: "Über uns" };

export default function UeberUnsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="font-display text-4xl font-semibold text-[var(--color-accent)] sm:text-5xl">
        Über uns
      </h1>

      <p className="mt-8 text-lg leading-relaxed">{about.intro}</p>

      <blockquote className="my-10 border-l-4 border-[var(--color-accent)] pl-5 font-display text-2xl italic text-[var(--color-fg)]">
        {about.quote}
      </blockquote>

      <p className="text-lg leading-relaxed">{about.outro}</p>

      <p className="mt-6 text-[var(--color-fg-muted)]">Bis bald!</p>

      <h2 className="mt-16 font-display text-3xl font-semibold text-[var(--color-fg)]">Die Band</h2>
      <div className="mt-8 grid gap-8 sm:grid-cols-2 md:grid-cols-3">
        {about.members.map((m) => (
          <figure key={m.name} className="text-center">
            {m.photo && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={m.photo}
                alt={m.name}
                loading="lazy"
                style={{ objectPosition: m.position }}
                className="mx-auto aspect-[3/4] w-full max-w-[16rem] rounded-lg object-cover shadow-sm ring-1 ring-[var(--color-border)]"
              />
            )}
            <figcaption className="mt-3">
              <span className="block font-display text-lg font-medium">{m.name}</span>
              <span className="block text-sm text-[var(--color-fg-muted)]">{m.role}</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}
