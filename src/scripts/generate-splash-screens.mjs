/**
 * Generates all required PWA splash screen images for iOS devices.
 * Run with: node src/scripts/generate-splash-screens.mjs
 */
import sharp from "sharp";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const iconPath = path.resolve(__dirname, "../../public/favicon.png");
const outputDir = path.resolve(__dirname, "../../public/icons/splash");

// All required iOS splash screen sizes
const splashSizes = [
  { width: 640,  height: 1136, name: "splash-640x1136.png" },   // iPhone SE
  { width: 750,  height: 1334, name: "splash-750x1334.png" },   // iPhone 8
  { width: 1242, height: 2208, name: "splash-1242x2208.png" },  // iPhone 8 Plus
  { width: 1125, height: 2436, name: "splash-1125x2436.png" },  // iPhone X/XS
  { width: 1242, height: 2688, name: "splash-1242x2688.png" },  // iPhone XS Max
  { width: 828,  height: 1792, name: "splash-828x1792.png" },   // iPhone XR
  { width: 1170, height: 2532, name: "splash-1170x2532.png" },  // iPhone 12/13/14
  { width: 1179, height: 2556, name: "splash-1179x2556.png" },  // iPhone 14 Pro/15
  { width: 1290, height: 2796, name: "splash-1290x2796.png" },  // iPhone 14 Pro Max
  { width: 1284, height: 2778, name: "splash-1284x2778.png" },  // iPhone 15 Plus
  { width: 1536, height: 2048, name: "splash-1536x2048.png" },  // iPad Mini
  { width: 1668, height: 2224, name: "splash-1668x2224.png" },  // iPad Air
  { width: 1668, height: 2388, name: "splash-1668x2388.png" },  // iPad Pro 11"
  { width: 2048, height: 2732, name: "splash-2048x2732.png" },  // iPad Pro 12.9"
];

// Brand colors
const BG_COLOR = { r: 10, g: 9, b: 6, alpha: 1 };       // #0a0906
const GOLD = { r: 201, g: 162, b: 39, alpha: 0.15 };    // #c9a227 subtle

async function createSplashScreen(width, height, outputPath) {
  // Icon size: ~18% of the shorter dimension
  const iconSize = Math.round(Math.min(width, height) * 0.18);
  const iconX = Math.round((width - iconSize) / 2);
  const iconY = Math.round((height - iconSize) / 2) - Math.round(height * 0.05);

  // Resize the icon
  const resizedIcon = await sharp(iconPath)
    .resize(iconSize, iconSize, { fit: "contain", background: BG_COLOR })
    .png()
    .toBuffer();

  // Create base background with gradient simulation using a dark overlay
  const background = await sharp({
    create: {
      width,
      height,
      channels: 4,
      background: BG_COLOR,
    },
  })
    .png()
    .toBuffer();

  // Composite icon onto background
  await sharp(background)
    .composite([
      {
        input: resizedIcon,
        top: iconY,
        left: iconX,
      },
    ])
    .png()
    .toFile(outputPath);
}

async function main() {
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  console.log("Generating iOS splash screens...\n");

  for (const { width, height, name } of splashSizes) {
    const outputPath = path.join(outputDir, name);
    await createSplashScreen(width, height, outputPath);
    console.log(`✓ ${name} (${width}×${height})`);
  }

  console.log("\n✅ All splash screens generated!");
}

main().catch(console.error);
