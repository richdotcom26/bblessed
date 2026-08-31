// Erzeugt app/icon.png und app/apple-icon.png (einfaches Monogramm).
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const APP = path.resolve(import.meta.dirname, "..", "..", "app");

const svg = (size) => `
<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 512 512">
  <rect width="512" height="512" rx="96" fill="#b0592f"/>
  <text x="50%" y="52%" dominant-baseline="central" text-anchor="middle"
        font-family="Georgia, 'Times New Roman', serif" font-size="300" font-weight="600" fill="#faf6ef">B</text>
</svg>`;

for (const [name, size] of [["icon.png", 512], ["apple-icon.png", 180]]) {
  await sharp(Buffer.from(svg(size))).resize(size, size).png().toFile(path.join(APP, name));
  console.log("geschrieben:", name);
}
