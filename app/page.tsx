import Link from "next/link";
import { about, gigs, formatGigDate } from "@/lib/content";

const HIGHLIGHT_SLUGS = [
  "anlassen-nuerburgring-2010",
  "konficamp-hamm-2008",
  "kirchentag-koeln-2007",
];

export default function HomePage() {
  const highlights = HIGHLIGHT_SLUGS.map((s) => gigs.find((g) => g.slug === s)).filter(
    (g): g is NonNullable<typeof g> => Boolean(g)
  );
  const recent = gigs.slice(0, 4);

  return (
    <div>
      {/* Hero */}
      <section className="border-b border-[var(--color-border)] bg-[var(--color-bg-alt)]">
        <div className="mx-auto max-w-3xl px-4 py-20 text-center sm:py-28">
          <p className="text-xs uppercase tracking-[0.35em] text-[var(--color-accent-2)]">
            worship band · seit 2004
          </p>
          <h1 className="mt-6 flex justify-center">
            <span className="sr-only">BBLESSED</span>
            <span
              className="logo-mark h-16 w-auto text-[var(--color-accent)] sm:h-24"
              role="img"
              aria-hidden="true"
            />
          </h1>
          <p className="mx-auto mt-6 max-w-xl font-display text-xl italic text-[var(--color-fg)] sm:text-2xl">
            „Wir sind nicht nur Musiker, die christliche Musik machen, sondern Christen, die Musik
            machen.“
          </p>
          <p className="mx-auto mt-6 max-w-lg text-[var(--color-fg-muted)]">
            Aus Witten-Herbede im Ruhrpott. Zwischen Rock, Pop und Folk – bei Gottesdiensten,
            Kirchentagen, Bikergottesdiensten und Konzerten.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/chronik"
              className="rounded-full bg-[var(--color-accent)] px-6 py-2.5 text-sm font-medium text-white transition hover:bg-[var(--color-accent-2)]"
            >
              Zur Chronik
            </Link>
            <Link
              href="/medien"
              className="rounded-full border border-[var(--color-accent)] px-6 py-2.5 text-sm font-medium text-[var(--color-accent)] transition hover:bg-[var(--color-accent)] hover:text-white"
            >
              Musik hören
            </Link>
          </div>
        </div>
      </section>

      {/* Intro */}
      <section className="mx-auto max-w-2xl px-4 py-16">
        <p className="text-lg leading-relaxed">{about.intro}</p>
        <Link
          href="/ueber-uns"
          className="mt-6 inline-block text-sm font-medium text-[var(--color-accent)] hover:text-[var(--color-accent-2)]"
        >
          Mehr über die Band →
        </Link>
      </section>

      {/* Highlights */}
      <section className="border-t border-[var(--color-border)] bg-[var(--color-bg-alt)]">
        <div className="mx-auto max-w-5xl px-4 py-16">
          <h2 className="font-display text-3xl font-semibold text-[var(--color-fg)]">Highlights</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            {highlights.map((g) => (
              <Link
                key={g.slug}
                href={`/chronik/${g.slug}`}
                className="group block overflow-hidden rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-card)] shadow-sm transition hover:shadow-md"
              >
                {g.poster && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={g.poster.thumb}
                    alt={g.poster.alt}
                    loading="lazy"
                    className="aspect-[4/3] w-full object-cover transition group-hover:brightness-95"
                  />
                )}
                <div className="p-4">
                  <p className="text-xs text-[var(--color-fg-muted)]">{g.year}</p>
                  <p className="font-display text-lg font-medium">{g.title}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Zuletzt */}
      <section className="mx-auto max-w-5xl px-4 py-16">
        <div className="flex items-baseline justify-between">
          <h2 className="font-display text-3xl font-semibold text-[var(--color-fg)]">Zuletzt</h2>
          <Link
            href="/chronik"
            className="text-sm font-medium text-[var(--color-accent)] hover:text-[var(--color-accent-2)]"
          >
            alle Einträge →
          </Link>
        </div>
        <ul className="mt-6 divide-y divide-[var(--color-border)]">
          {recent.map((g) => (
            <li key={g.slug}>
              <Link
                href={`/chronik/${g.slug}`}
                className="flex items-center gap-4 py-4 transition hover:text-[var(--color-accent)]"
              >
                {g.poster && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={g.poster.thumb}
                    alt=""
                    loading="lazy"
                    className="h-14 w-14 flex-shrink-0 rounded object-cover ring-1 ring-[var(--color-border)]"
                  />
                )}
                <span>
                  <span className="block text-xs text-[var(--color-fg-muted)]">
                    {formatGigDate(g.date)}
                  </span>
                  <span className="font-display text-lg font-medium">{g.title}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
