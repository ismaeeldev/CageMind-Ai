import sharp from "sharp";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const inputPath = path.resolve(__dirname, "../../public/favicon.png");
const outputDir = path.resolve(__dirname, "../../public/icons");

const sizes = [72, 96, 128, 144, 152, 180, 192, 384, 512];

async function generateIcons() {
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  console.log(`Generating PWA icons from: ${inputPath}`);

  for (const size of sizes) {
    const outputPath = path.join(outputDir, `icon-${size}x${size}.png`);
    await sharp(inputPath)
      .resize(size, size, { fit: "contain", background: { r: 10, g: 9, b: 6, alpha: 1 } })
      .png()
      .toFile(outputPath);
    console.log(`✓ Generated ${size}x${size} → ${outputPath}`);
  }

  // Also generate apple-touch-icon (180x180)
  const appleIconPath = path.join(outputDir, "apple-touch-icon.png");
  await sharp(inputPath)
    .resize(180, 180, { fit: "contain", background: { r: 10, g: 9, b: 6, alpha: 1 } })
    .png()
    .toFile(appleIconPath);
  console.log(`✓ Generated apple-touch-icon → ${appleIconPath}`);

  console.log("\n✅ All PWA icons generated successfully!");
}

generateIcons().catch(console.error);
