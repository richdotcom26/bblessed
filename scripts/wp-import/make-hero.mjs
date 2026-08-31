// Erzeugt public/images/hero-worship.jpg aus scripts/wp-import/data/hero-src.jpg
// (Unsplash, Vitalii Onyshchuk). Das Originalbild ist tuerkis/kalt – hier wird
// es in einen warmen Duoton (Rost/Bernstein) umgesetzt und im Kontrast
// angehoben, damit der Hero sich farblich vom sonst dunkelgrauen Rest der
// Seite absetzt.
//
//   node scripts/wp-import/make-hero.mjs

import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const SRC = path.join(import.meta.dirname, "data", "hero-src.jpg");
const OUT = path.resolve(import.meta.dirname, "..", "..", "public", "images", "hero-worship.jpg");

if (!fs.existsSync(SRC)) {
  console.error("Fehlt:", SRC);
  process.exit(1);
}

// 1) entsättigen (kein greyscale-Colourspace, damit Farbe erhalten bleibt),
// 2) Kontrast rauf, 3) warmer Duoton per tint (Bernstein/Rost).
const { data: base, info } = await sharp(SRC)
  .rotate()
  .resize({ width: 2200 })
  .modulate({ saturation: 0 })
  .linear(1.2, -16)
  .gamma(1.06)
  .tint({ r: 224, g: 148, b: 92 })
  .toColourspace("srgb")
  .raw()
  .toBuffer({ resolveWithObject: true });

// Zusätzlich ein warmer Farbschleier per Multiply für sattere, wärmere Tiefen.
await sharp(base, { raw: { width: info.width, height: info.height, channels: info.channels } })
  .composite([
    {
      input: {
        create: {
          width: info.width,
          height: info.height,
          channels: 3,
          background: { r: 178, g: 96, b: 52 },
        },
      },
      blend: "multiply",
    },
  ])
  .modulate({ saturation: 1.15, brightness: 1.06 })
  .jpeg({ quality: 80, mozjpeg: true })
  .toFile(OUT);
const m = await sharp(OUT).metadata();
const kb = Math.round(fs.statSync(OUT).size / 1024);
console.log("geschrieben:", OUT, `${m.width}x${m.height}`, kb + " KB");
