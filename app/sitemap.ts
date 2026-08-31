import type { MetadataRoute } from "next";
import { gigs } from "@/lib/content";

export const dynamic = "force-static";

const BASE = "https://www.bblessed.de";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const pages: MetadataRoute.Sitemap = [
    { url: `${BASE}/`, lastModified: now, changeFrequency: "monthly", priority: 1 },
    { url: `${BASE}/ueber-uns`, lastModified: now, changeFrequency: "yearly", priority: 0.8 },
    { url: `${BASE}/chronik`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/medien`, lastModified: now, changeFrequency: "yearly", priority: 0.6 },
    { url: `${BASE}/kontakt`, lastModified: now, changeFrequency: "yearly", priority: 0.5 },
  ];
  const gigPages: MetadataRoute.Sitemap = gigs.map((g) => ({
    url: `${BASE}/chronik/${g.slug}`,
    lastModified: new Date(`${g.date}T12:00:00`),
    changeFrequency: "yearly",
    priority: 0.4,
  }));
  return [...pages, ...gigPages];
}
