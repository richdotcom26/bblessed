"use client";

import { useState } from "react";

// Leichtgewichtiges YouTube-Embed: zeigt zuerst nur das Vorschaubild und laedt
// den iframe erst nach Klick (kein Third-Party-Script beim Seitenaufruf).
export function YouTube({ id, title = "YouTube-Video" }: { id: string; title?: string }) {
  const [play, setPlay] = useState(false);

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-black ring-1 ring-[var(--color-border)]">
      {play ? (
        <iframe
          className="absolute inset-0 h-full w-full"
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <button
          onClick={() => setPlay(true)}
          className="group absolute inset-0 flex items-center justify-center"
          aria-label={`${title} abspielen`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`}
            alt=""
            className="absolute inset-0 h-full w-full object-cover opacity-80 transition group-hover:opacity-100"
          />
          <span className="relative flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-accent)] text-white shadow-lg transition group-hover:scale-110">
            <svg viewBox="0 0 24 24" fill="currentColor" className="ml-1 h-7 w-7">
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
        </button>
      )}
    </div>
  );
}
