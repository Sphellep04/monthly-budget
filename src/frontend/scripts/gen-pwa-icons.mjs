/**
 * Generates PWA PNG icons from scratch using pure Node.js (no native deps).
 * Produces solid-color rounded squares as placeholder icons until
 * a real logo is ready.
 */
import { deflateSync } from "node:zlib";
import { writeFileSync, mkdirSync } from "node:fs";

// BudgetWise brand primary: oklch(0.52 0.15 250) ≈ rgb(75, 96, 196)
const BRAND = { r: 75, g: 96, b: 196 };

// ── PNG helpers ───────────────────────────────────────────────────────────────

const CRC_TABLE = (() => {
  const t = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let j = 0; j < 8; j++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[i] = c;
  }
  return t;
})();

function crc32(buf) {
  let c = 0xffffffff;
  for (const b of buf) c = (c >>> 8) ^ CRC_TABLE[(c ^ b) & 0xff];
  return (c ^ 0xffffffff) >>> 0;
}

function u32(n) {
  const b = Buffer.alloc(4);
  b.writeUInt32BE(n, 0);
  return b;
}

function pngChunk(type, data) {
  const t = Buffer.from(type, "ascii");
  return Buffer.concat([u32(data.length), t, data, u32(crc32(Buffer.concat([t, data])))]);
}

function makeSolidPNG(size, r, g, b) {
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = pngChunk(
    "IHDR",
    Buffer.concat([u32(size), u32(size), Buffer.from([8, 2, 0, 0, 0])]),
  );
  // Build raw scanlines: filter(1) + RGB(3) per pixel
  const raw = Buffer.alloc(size * (1 + size * 3));
  for (let y = 0; y < size; y++) {
    const row = y * (1 + size * 3);
    raw[row] = 0; // filter: None
    for (let x = 0; x < size; x++) {
      raw[row + 1 + x * 3] = r;
      raw[row + 1 + x * 3 + 1] = g;
      raw[row + 1 + x * 3 + 2] = b;
    }
  }
  const idat = pngChunk("IDAT", deflateSync(raw));
  const iend = pngChunk("IEND", Buffer.alloc(0));
  return Buffer.concat([sig, ihdr, idat, iend]);
}

// ── Generate icons ────────────────────────────────────────────────────────────

mkdirSync("./public/icons", { recursive: true });

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
for (const s of sizes) {
  const file = `./public/icons/pwa-${s}x${s}.png`;
  writeFileSync(file, makeSolidPNG(s, BRAND.r, BRAND.g, BRAND.b));
  console.log(`✓ ${file}`);
}

writeFileSync(
  "./public/apple-touch-icon.png",
  makeSolidPNG(180, BRAND.r, BRAND.g, BRAND.b),
);
console.log("✓ ./public/apple-touch-icon.png");
console.log("\nDone. Replace with real logo icons when ready.");
