// Typisierter Zugriff auf die von scripts/wp-import/import.mjs erzeugten
// Content-JSONs. Kuenftige Textaenderungen: direkt in content/*.json.

import aboutData from "@/content/about.json";
import gigsData from "@/content/gigs.json";
import mediaData from "@/content/media.json";
import kontaktData from "@/content/kontakt.json";

export type Image = { src: string; thumb: string; alt: string; w?: number; h?: number };

export type Member = {
  name: string;
  role: string;
  photo: string | null;
  position: string;
};

export type About = {
  intro: string;
  quote: string;
  outro: string;
  members: Member[];
};

export type Gig = {
  slug: string;
  title: string;
  date: string;
  year: number;
  bodyHtml: string;
  poster: Image | null;
  posterOnly: boolean;
  images: Image[];
  youtube: string | null;
  pdf: { url: string; label: string } | null;
};

export type Track = { title: string; artist: string; url: string };
export type Media = { tracks: Track[]; imageVideoYoutube: string };

export type Kontakt = {
  email: string;
  impressum: { name: string; address: string };
};

export const about = aboutData as About;
export const media = mediaData as Media;
export const kontakt = kontaktData as Kontakt;

// Chronik: neueste zuerst
export const gigs = (gigsData as Gig[])
  .slice()
  .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));

export function gigBySlug(slug: string) {
  return gigs.find((g) => g.slug === slug);
}

export function formatGigDate(iso: string) {
  const d = new Date(iso + "T12:00:00");
  return d.toLocaleDateString("de-DE", { year: "numeric", month: "long", day: "2-digit" });
}

export function gigsByYear() {
  const map = new Map<number, Gig[]>();
  for (const g of gigs) {
    if (!map.has(g.year)) map.set(g.year, []);
    map.get(g.year)!.push(g);
  }
  return [...map.entries()].sort((a, b) => b[0] - a[0]);
}
