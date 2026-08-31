import Link from "next/link";
import type { Metadata } from "next";
import { gigs, gigsByYear, formatGigDate } from "@/lib/content";

export const metadata: Metadata = {
  title: "Chronik",
  description:
    "Die Chronik von BBLESSED: Gottesdienste, Kirchentage in Köln, Bremen, Dresden, Berlin und Dortmund, Bikergottesdienste und die „Happy Birthday Jesus“-Konzerte – von der Gründung 2004 bis heute.",
  alternates: { canonical: "/chronik" },
};

export default function ChronikPage() {
  const years = gigsByYear();

  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      <h1 className="font-display-upper text-4xl text-[var(--color-fg)] sm:text-6xl">
        <span className="text-[var(--color-accent)]">/</span> Chronik
      </h1>
      <p className="mt-4 max-w-xl text-[var(--color-fg-muted)]">
        Von der Gründung 2004 bis zu den Happy-Birthday-Jesus-Livestreams – {gigs.length} Einträge aus
        Gottesdiensten, Kirchentagen und Konzerten. Ein Teil des Archivs ging beim Spam-Angriff auf
        die alte Seite verloren.
      </p>

      <div className="mt-12 space-y-12">
        {years.map(([year, list]) => (
          <section key={year}>
            <h2 className="font-display-upper text-2xl text-[var(--color-accent-2)] sm:text-3xl">{year}</h2>
            <ol className="mt-4 space-y-4 border-l border-[var(--color-border)] pl-5">
              {list.map((g) => (
                <li key={g.slug} className="relative">
                  <span className="absolute -left-[23px] top-2 h-2.5 w-2.5 rounded-full bg-[var(--color-accent)]" />
                  <Link
                    href={`/chronik/${g.slug}`}
                    className="group flex gap-4 sm:items-start"
                  >
                    {g.poster && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={g.poster.thumb}
                        alt=""
                        loading="lazy"
                        width={g.poster.w}
                        height={g.poster.h}
                        className="h-auto w-20 max-h-52 flex-shrink-0 rounded object-contain bg-[var(--color-bg-alt)] ring-1 ring-[var(--color-border)] sm:w-28"
                      />
                    )}
                    <span>
                      <span className="block text-xs text-[var(--color-fg-muted)]">
                        {formatGigDate(g.date)}
                      </span>
                      <span className="font-display text-lg font-medium text-[var(--color-fg)] group-hover:text-[var(--color-accent)]">
                        {g.title}
                      </span>
                      {g.images.length > 0 && (
                        <span className="mt-0.5 block text-xs text-[var(--color-fg-muted)]">
                          {g.images.length} {g.images.length === 1 ? "Foto" : "Fotos"}
                        </span>
                      )}
                    </span>
                  </Link>
                </li>
              ))}
            </ol>
          </section>
        ))}
      </div>
    </div>
  );
}
