"use client";

import { useEffect, useState } from "react";
import type { Termin } from "@/lib/content";

const MONTHS_SHORT = [
  "Jan",
  "Feb",
  "März",
  "Apr",
  "Mai",
  "Juni",
  "Juli",
  "Aug",
  "Sept",
  "Okt",
  "Nov",
  "Dez",
];
const WEEKDAYS = ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"];

function parts(iso: string) {
  const d = new Date(`${iso}T12:00:00`);
  return {
    weekday: WEEKDAYS[d.getDay()],
    day: d.getDate(),
    month: MONTHS_SHORT[d.getMonth()],
    year: d.getFullYear(),
  };
}

export function UpcomingDates({ termine }: { termine: Termin[] }) {
  // Serverseitig die zum Build-Zeitpunkt zukünftigen Termine; nach dem Mounten
  // nochmal gegen das echte Datum filtern, damit nichts Vergangenes stehen bleibt.
  const [today, setToday] = useState<string | null>(null);
  useEffect(() => setToday(new Date().toISOString().slice(0, 10)), []);
  const list = today ? termine.filter((t) => t.date >= today) : termine;

  return (
    <section className="border-y border-[var(--color-border)] bg-[var(--color-bg-alt)]">
      <div className="mx-auto max-w-5xl px-4 py-14">
        <h2 className="font-display-upper text-2xl text-[var(--color-fg)] sm:text-3xl">
          <span className="text-[var(--color-accent)]">/</span> Anstehende Termine
        </h2>

        {list.length === 0 ? (
          <p className="mt-5 text-[var(--color-fg-muted)]">
            Zurzeit keine öffentlichen Termine angekündigt – ein Blick in die{" "}
            <a href="/chronik" className="text-[var(--color-accent)] underline underline-offset-2">
              Chronik
            </a>{" "}
            lohnt sich trotzdem.
          </p>
        ) : (
          <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((t) => {
              const p = parts(t.date);
              return (
                <li
                  key={t.slug}
                  className="flex overflow-hidden rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-card)] shadow-sm"
                >
                  {/* Kalenderblatt */}
                  <div className="flex w-20 flex-shrink-0 flex-col items-center justify-center bg-[var(--color-accent)] py-3 text-center text-white">
                    <span className="text-[0.65rem] font-semibold uppercase tracking-[0.15em]">
                      {p.month}
                    </span>
                    <span className="font-display text-3xl leading-none">{p.day}</span>
                    <span className="mt-0.5 text-[0.65rem] uppercase tracking-wide opacity-80">
                      {p.weekday} · {p.year}
                    </span>
                  </div>
                  {/* Details */}
                  <div className="flex flex-col justify-center px-4 py-3">
                    <p className="font-display text-lg leading-tight text-[var(--color-fg)]">
                      {t.title}
                    </p>
                    <p className="mt-1 text-sm text-[var(--color-fg-muted)]">{t.location}</p>
                    {t.note && (
                      <p className="mt-1 text-sm text-[var(--color-fg-muted)]">{t.note}</p>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
}
