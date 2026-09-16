/**
 * Generates PWA icon PNGs (+ apple-touch-icon, favicon-32, favicon.ico)
 * from BudgetWise-Logo.png using sharp. The source is a full-bleed square
 * mark (no transparent margins), so every output here is a plain resize -
 * no padding/background compositing needed.
 * Run: node scripts/gen-pwa-icons.mjs
 */
import { mkdirSync, writeFileSync } from "node:fs";
import sharp from "sharp";

const SRC = "./public/BudgetWise-Logo.png";

mkdirSync("./public/icons", { recursive: true });

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

for (const s of sizes) {
  await sharp(SRC).resize(s, s).png().toFile(`./public/icons/pwa-${s}x${s}.png`);
  console.log(`✓ public/icons/pwa-${s}x${s}.png`);
}

await sharp(SRC).resize(180, 180).png().toFile("./public/apple-touch-icon.png");
console.log("✓ public/apple-touch-icon.png");

await sharp(SRC).resize(32, 32).png().toFile("./public/favicon-32.png");
console.log("✓ public/favicon-32.png");

// Minimal multi-frame ICO writer - embeds PNG-format frames, which every
// modern browser/OS supports directly (no legacy BMP DIB encoding needed).
function buildIco(pngBuffers, iconSizes) {
  const count = pngBuffers.length;
  let offset = 6 + 16 * count;
  const header = Buffer.alloc(6);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(count, 4);

  const dirEntries = pngBuffers.map((buf, i) => {
    const size = iconSizes[i];
    const entry = Buffer.alloc(16);
    entry.writeUInt8(size >= 256 ? 0 : size, 0);
    entry.writeUInt8(size >= 256 ? 0 : size, 1);
    entry.writeUInt16LE(1, 4);
    entry.writeUInt16LE(32, 6);
    entry.writeUInt32LE(buf.length, 8);
    entry.writeUInt32LE(offset, 12);
    offset += buf.length;
    return entry;
  });
  return Buffer.concat([header, ...dirEntries, ...pngBuffers]);
}

const icoSizes = [16, 32];
const icoBuffers = await Promise.all(
  icoSizes.map((s) => sharp(SRC).resize(s, s).png().toBuffer()),
);
writeFileSync("./public/favicon.ico", buildIco(icoBuffers, icoSizes));
console.log("✓ public/favicon.ico");

console.log("\nAll icons generated from BudgetWise-Logo.png");
