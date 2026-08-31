// Typisierter Zugriff auf die von scripts/wp-import/import.mjs erzeugten
// Content-JSONs. Kuenftige Textaenderungen: direkt in content/*.json.

import aboutData from "@/content/about.json";
import gigsData from "@/content/gigs.json";
import mediaData from "@/content/media.json";
import kontaktData from "@/content/kontakt.json";
import termineData from "@/content/termine.json";

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

export type Termin = {
  slug: string;
  date: string; // ISO YYYY-MM-DD
  title: string;
  location: string;
  note?: string;
};

export type Kontakt = {
  email: string;
  impressum: { name: string; address: string };
};

export const about = aboutData as About;
export const media = mediaData as Media;
export const kontakt = kontaktData as Kontakt;

// ---- Termine -------------------------------------------------------------
// content/termine.json ist die Quelle für anstehende Termine. Sobald das
// Datum eines Termins (zum Build-Zeitpunkt) vergangen ist, wird daraus ein
// vollwertiger Chronik-Eintrag – ohne Fotos, die kann Rainer später ergänzen,
// indem er den Eintrag ins GIGS-Array von import.mjs übernimmt.
const TODAY_ISO = new Date().toISOString().slice(0, 10);

export const termine = (termineData as Termin[])
  .slice()
  .sort((a, b) => (a.date < b.date ? -1 : 1));

// Für die Startseiten-Kachel: alles ab heute (Client filtert nochmal nach,
// falls der letzte Build ein paar Tage alt ist).
export const upcomingTermine = termine.filter((t) => t.date >= TODAY_ISO);

const terminGigs: Gig[] = termine
  .filter((t) => t.date < TODAY_ISO)
  .map((t) => ({
    slug: t.slug,
    title: t.title,
    date: t.date,
    year: Number(t.date.slice(0, 4)),
    bodyHtml: `<p>${t.location}.</p>${t.note ? `<p>${t.note}</p>` : ""}`,
    poster: null,
    posterOnly: false,
    images: [],
    youtube: null,
    pdf: null,
  }));

// Chronik: WP-/kuratierte Einträge + vergangene Termine, neueste zuerst.
const gigSlugs = new Set((gigsData as Gig[]).map((g) => g.slug));
export const gigs = [...(gigsData as Gig[]), ...terminGigs.filter((g) => !gigSlugs.has(g.slug))]
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
