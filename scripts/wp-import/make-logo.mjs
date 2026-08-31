// Erzeugt public/images/logo-mask.png aus dem offiziellen Bandlogo.
//
// Das Logo liegt als BMP vor (BeBlessedBig.bmp, schwarze Grafik auf Weiss).
// sharp/libvips kann BMP nicht lesen -> vorher einmalig nach PNG wandeln:
//
//   powershell -NoProfile -Command "Add-Type -AssemblyName System.Drawing; \
//     \$b=[System.Drawing.Bitmap]::FromFile('...\BeBlessedBig.bmp'); \
//     \$b.Save('scripts/wp-import/data/logo-src.png', \
//       [System.Drawing.Imaging.ImageFormat]::Png)"
//
// Dieses Skript macht daraus eine Alpha-Maske (weisse Form auf transparent),
// die im CSS per `mask-image` + `background-color: var(--color-accent)`
// eingefaerbt wird - so folgt das Logo automatisch der Schriftfarbe.
//
//   node scripts/wp-import/make-logo.mjs

import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const SRC = path.join(import.meta.dirname, "data", "logo-src.png");
const OUT = path.resolve(import.meta.dirname, "..", "..", "public", "images", "logo-mask.png");

if (!fs.existsSync(SRC)) {
  console.error("Fehlt:", SRC, "\n(BMP zuerst nach PNG wandeln, siehe Kommentar oben.)");
  process.exit(1);
}

const { data, info } = await sharp(SRC)
  .flatten({ background: "#ffffff" })
  .greyscale()
  .raw()
  .toBuffer({ resolveWithObject: true });

const px = info.width * info.height;
const rgba = Buffer.alloc(px * 4);
for (let i = 0; i < px; i++) {
  const lum = data[i * info.channels]; // 0 = schwarz (Logo), 255 = weiss (Hintergrund)
  rgba[i * 4] = 255;
  rgba[i * 4 + 1] = 255;
  rgba[i * 4 + 2] = 255;
  rgba[i * 4 + 3] = 255 - lum; // dunkle Logoflaeche -> deckend
}

fs.mkdirSync(path.dirname(OUT), { recursive: true });
await sharp(rgba, { raw: { width: info.width, height: info.height, channels: 4 } })
  .trim()
  .png()
  .toFile(OUT);

const m = await sharp(OUT).metadata();
console.log("geschrieben:", OUT, `${m.width}x${m.height}`);
