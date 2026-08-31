"use client";

import { useState, useCallback, useEffect } from "react";
import type { Image } from "@/lib/content";

export function Gallery({ images }: { images: Image[] }) {
  const [index, setIndex] = useState<number | null>(null);

  const close = useCallback(() => setIndex(null), []);
  const prev = useCallback(
    () => setIndex((i) => (i === null ? null : (i - 1 + images.length) % images.length)),
    [images.length]
  );
  const next = useCallback(
    () => setIndex((i) => (i === null ? null : (i + 1) % images.length)),
    [images.length]
  );

  useEffect(() => {
    if (index === null) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, close, prev, next]);

  if (images.length === 0) return null;

  return (
    <>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
        {images.map((img, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={img.src}
            src={img.thumb}
            alt={img.alt}
            loading="lazy"
            onClick={() => setIndex(i)}
            className="aspect-square w-full cursor-pointer rounded object-cover ring-1 ring-[var(--color-border)] transition hover:brightness-95"
          />
        ))}
      </div>

      {index !== null && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-4"
          onClick={close}
        >
          <button
            className="absolute right-4 top-4 text-4xl leading-none text-white/80 hover:text-white"
            onClick={close}
            aria-label="Schließen"
          >
            ×
          </button>
          <button
            className="absolute left-2 top-1/2 -translate-y-1/2 text-5xl text-white/60 hover:text-white sm:left-6"
            onClick={(e) => {
              e.stopPropagation();
              prev();
            }}
            aria-label="Vorheriges Bild"
          >
            ‹
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={images[index].src}
            alt={images[index].alt}
            onClick={(e) => e.stopPropagation()}
            className="max-h-[85vh] max-w-full rounded object-contain"
          />
          <button
            className="absolute right-2 top-1/2 -translate-y-1/2 text-5xl text-white/60 hover:text-white sm:right-6"
            onClick={(e) => {
              e.stopPropagation();
              next();
            }}
            aria-label="Nächstes Bild"
          >
            ›
          </button>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-sm text-white/60">
            {index + 1} / {images.length}
          </div>
        </div>
      )}
    </>
  );
}
