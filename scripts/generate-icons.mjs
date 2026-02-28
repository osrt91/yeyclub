import sharp from "sharp";
import pngToIco from "png-to-ico";
import { readFileSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = join(__dirname, "..", "public");
const appDir = join(__dirname, "..", "app");
const svg = readFileSync(join(publicDir, "icon.svg"));

const sizes = [192, 512];

for (const size of sizes) {
  await sharp(svg, { density: 300 })
    .resize(size, size)
    .png()
    .toFile(join(publicDir, `icon-${size}.png`));
  console.log(`Generated icon-${size}.png (${size}x${size})`);
}

const faviconPngPath = join(publicDir, "favicon.png");
await sharp(svg, { density: 300 })
  .resize(48, 48)
  .png()
  .toFile(faviconPngPath);
console.log("Generated favicon.png (48x48)");

const ico = await pngToIco(faviconPngPath);
writeFileSync(join(appDir, "favicon.ico"), ico);
console.log("Generated app/favicon.ico");

console.log("\nAll icons generated successfully!");
