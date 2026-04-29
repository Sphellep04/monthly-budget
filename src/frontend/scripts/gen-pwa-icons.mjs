/**
 * Generates PWA icon PNGs from BudgetWise-Logo.png using sharp.
 * Run: node scripts/gen-pwa-icons.mjs
 */
import sharp from "sharp";
import { mkdirSync } from "node:fs";

const SRC = "./public/BudgetWise-Logo.png";

mkdirSync("./public/icons", { recursive: true });

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

for (const s of sizes) {
  await sharp(SRC)
    .resize(s, s, { fit: "contain", background: { r: 255, g: 255, b: 255, alpha: 1 } })
    .png()
    .toFile(`./public/icons/pwa-${s}x${s}.png`);
  console.log(`✓ public/icons/pwa-${s}x${s}.png`);
}

// apple-touch-icon: 180x180 with small padding so it looks good on iOS
await sharp(SRC)
  .resize(152, 152, { fit: "contain", background: { r: 255, g: 255, b: 255, alpha: 1 } })
  .extend({ top: 14, bottom: 14, left: 14, right: 14, background: { r: 255, g: 255, b: 255, alpha: 1 } })
  .png()
  .toFile("./public/apple-touch-icon.png");
console.log("✓ public/apple-touch-icon.png");

// favicon.ico-sized PNG for completeness
await sharp(SRC)
  .resize(32, 32, { fit: "contain", background: { r: 255, g: 255, b: 255, alpha: 1 } })
  .png()
  .toFile("./public/favicon-32.png");
console.log("✓ public/favicon-32.png");

console.log("\nAll icons generated from BudgetWise-Logo.png");
