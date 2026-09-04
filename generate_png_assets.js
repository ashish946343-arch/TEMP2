import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { PNG } from 'pngjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const outDir = path.join(__dirname, 'public', 'demo', 'satellite');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

// Helper to draw a pixel with optional alpha
function setPixel(png, x, y, r, g, b, a = 255) {
  if (x < 0 || x >= png.width || y < 0 || y >= png.height) return;
  const idx = (png.width * Math.floor(y) + Math.floor(x)) << 2;
  png.data[idx] = r;
  png.data[idx + 1] = g;
  png.data[idx + 2] = b;
  png.data[idx + 3] = a;
}

// Procedural texture generators for satellite imagery
function generateSatelliteImage(type, width = 800, height = 600) {
  const png = new PNG({ width, height });

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      // Base land texture with subtle noise & contours
      const noise = (Math.sin(x * 0.05) * Math.cos(y * 0.05) * 15) + (Math.sin(x * 0.01 + y * 0.01) * 20);
      let r = 25 + noise * 0.2;
      let g = 45 + noise * 0.3;
      let b = 32 + noise * 0.2;

      // River Curve: diagonal winding water body
      const riverCenter = 400 + Math.sin(x * 0.008) * 120 - (x * 0.3);
      const distToRiver = Math.abs(y - riverCenter);

      if (distToRiver < 45) {
        // Deep water
        const waterNoise = Math.sin(x * 0.1) * 10;
        r = 10 + waterNoise;
        g = 35 + waterNoise;
        b = 65 + waterNoise * 2;
      } else if (distToRiver < 55) {
        // Shoreline / wet soil
        r = 30;
        g = 40;
        b = 40;
      }

      // Agricultural field boundaries (rectangular grid pattern)
      const fieldX = Math.floor(x / 120);
      const fieldY = Math.floor(y / 100);
      const isBoundary = (x % 120 < 3) || (y % 100 < 3);

      if (isBoundary && distToRiver >= 55) {
        r = Math.max(0, r - 10);
        g = Math.max(0, g - 15);
        b = Math.max(0, b - 10);
      } else if ((fieldX + fieldY) % 3 === 0 && distToRiver >= 55) {
        // Darker forest crop
        g += 15;
      } else if ((fieldX + fieldY) % 3 === 1 && distToRiver >= 55) {
        // Dry soil plot
        r += 15;
        g += 10;
      }

      // Main Road Network
      const isRoad1 = Math.abs(y - (180 + x * 0.15)) < 6;
      const isRoad2 = Math.abs(x - 520) < 5;
      if (isRoad1 || isRoad2) {
        r = 55;
        g = 65;
        b = 75;
      }

      // SPECIAL OVERLAYS FOR AFTER & CHANGE MASK
      if (type === 'after_001' || type === 'scene_001') {
        // Construction Zone (Target area near river bank at x: 420-560, y: 220-330)
        if (x >= 420 && x <= 560 && y >= 220 && y <= 330) {
          // Concrete pad
          r = 90;
          g = 100;
          b = 110;

          // Main Building 1 (Industrial Warehouse)
          if (x >= 440 && x <= 510 && y >= 240 && y <= 285) {
            r = 234; g = 88; b = 12; // Bright Orange Roof
          }
          // Building 2
          if (x >= 490 && x <= 545 && y >= 290 && y <= 320) {
            r = 217; g = 119; b = 6; // Yellow Amber Roof
          }
          // New Access Road to main road
          if (Math.abs(y - (280 + (x - 420) * 0.5)) < 4 && x < 520) {
            r = 100; g = 116; b = 139;
          }
        }
      }

      if (type === 'change_mask_001') {
        // Black background for Change Mask
        r = 8; g = 13; b = 25;

        // Change Mask Polygon (Highlight exact change area)
        if (x >= 420 && x <= 560 && y >= 220 && y <= 330) {
          r = 239; g = 68; b = 68; // Neon Red for changed area
          if (x >= 440 && x <= 510 && y >= 240 && y <= 285) {
            r = 245; g = 158; b = 11; // Neon Amber for high confidence structure
          }
        }
      }

      // Alternate scene variations
      if (type === 'scene_002' || type === 'before_002' || type === 'after_002') {
        if (isRoad2) { r = 80; g = 90; b = 100; }
        if (type === 'after_002' && x >= 300 && x <= 420 && y >= 380 && y <= 460) {
          r = 220; g = 100; b = 30;
        }
      }

      if (type === 'change_mask_002') {
        r = 8; g = 13; b = 25;
        if (x >= 300 && x <= 420 && y >= 380 && y <= 460) {
          r = 239; g = 68; b = 68;
        }
      }

      // Grid line reticles overlay for satellite look
      if (x % 160 === 0 || y % 120 === 0) {
        if (type !== 'change_mask_001' && type !== 'change_mask_002') {
          r = Math.min(255, r + 20);
          g = Math.min(255, g + 25);
          b = Math.min(255, b + 30);
        } else {
          r = Math.min(255, r + 15);
          g = Math.min(255, g + 20);
          b = Math.min(255, b + 25);
        }
      }

      setPixel(png, x, y, Math.floor(r), Math.floor(g), Math.floor(b));
    }
  }

  // Draw overlay reticles, labels & telemetry on the images
  drawTelemetry(png, type);

  return png;
}

function drawTelemetry(png, type) {
  // Draw bounding target reticle for after & scene_001
  if (type === 'after_001' || type === 'scene_001' || type === 'change_mask_001') {
    const x1 = 410, y1 = 210, x2 = 570, y2 = 340;
    const color = type === 'change_mask_001' ? [0, 240, 255] : [239, 68, 68];
    
    // Draw dashed box
    for (let x = x1; x <= x2; x += 6) {
      setPixel(png, x, y1, color[0], color[1], color[2]);
      setPixel(png, x, y2, color[0], color[1], color[2]);
    }
    for (let y = y1; y <= y2; y += 6) {
      setPixel(png, x1, y, color[0], color[1], color[2]);
      setPixel(png, x2, y, color[0], color[1], color[2]);
    }
  }
}

// Generate all required PNG demo images
const imageTypes = [
  'scene_001',
  'scene_002',
  'scene_003',
  'before_001',
  'after_001',
  'before_002',
  'after_002',
  'change_mask_001',
  'change_mask_002'
];

async function generateAll() {
  for (const type of imageTypes) {
    const png = generateSatelliteImage(type);
    const filePath = path.join(outDir, `${type}.png`);
    await new Promise((resolve) => {
      png.pack().pipe(fs.createWriteStream(filePath)).on('finish', () => {
        console.log(`Generated ${filePath}`);
        resolve();
      });
    });
  }
  
  // Also copy to public/images/ for backward compatibility if needed
  const legacyDir = path.join(__dirname, 'public', 'images');
  if (!fs.existsSync(legacyDir)) fs.mkdirSync(legacyDir, { recursive: true });
  
  fs.copyFileSync(path.join(outDir, 'scene_001.png'), path.join(legacyDir, 'scene_001.jpg'));
  fs.copyFileSync(path.join(outDir, 'scene_002.png'), path.join(legacyDir, 'scene_002.jpg'));
  fs.copyFileSync(path.join(outDir, 'scene_003.png'), path.join(legacyDir, 'scene_003.jpg'));
  fs.copyFileSync(path.join(outDir, 'before_001.png'), path.join(legacyDir, 'before.jpg'));
  fs.copyFileSync(path.join(outDir, 'after_001.png'), path.join(legacyDir, 'after.jpg'));
  fs.copyFileSync(path.join(outDir, 'change_mask_001.png'), path.join(legacyDir, 'change-mask.jpg'));
  
  console.log("Copied demo assets successfully!");
}

generateAll();
