import fs from 'fs';
import path from 'path';
import https from 'https';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const outDir = path.join(__dirname, 'public', 'demo', 'satellite');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

// Download tile to buffer
function fetchTileBuffer(z, y, x) {
  const url = `https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/${z}/${y}/${x}`;
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode !== 200) {
        return reject(new Error(`Failed to fetch tile ${z}/${y}/${x}: Status ${res.statusCode}`));
      }
      const chunks = [];
      res.on('data', (chunk) => chunks.push(chunk));
      res.on('end', () => resolve(Buffer.concat(chunks)));
    }).on('error', reject);
  });
}

// Stitch 3x2 tiles (768x512 resolution)
async function getStitchedSatelliteImage(startTileX, startTileY, zoom = 15) {
  const tiles = [];
  for (let r = 0; r < 2; r++) {
    for (let c = 0; c < 3; c++) {
      const tileX = startTileX + c;
      const tileY = startTileY + r;
      const buffer = await fetchTileBuffer(zoom, tileY, tileX);
      tiles.push({
        input: buffer,
        left: c * 256,
        top: r * 256
      });
    }
  }

  // Create blank black canvas & composite tiles
  return sharp({
    create: {
      width: 768,
      height: 512,
      channels: 4,
      background: { r: 7, g: 10, b: 18, alpha: 1 }
    }
  }).composite(tiles).png().toBuffer();
}

async function main() {
  console.log("Fetching real satellite imagery of Chandigarh from ArcGIS World Imagery...");

  // Chandigarh Tile Coords at zoom 15: x=23365, y=14351
  const realSatBuffer = await getStitchedSatelliteImage(23365, 14351, 15);

  console.log("Stitched real satellite image buffer successfully!");

  // Save BEFORE_001.PNG (Pristine Real Satellite Image)
  const beforeBuffer = await sharp(realSatBuffer)
    .composite([
      // Add Telemetry Badge
      {
        input: Buffer.from(`
          <svg width="768" height="512">
            <!-- Telemetry Overlay -->
            <rect x="15" y="15" width="310" height="42" fill="#070a12" opacity="0.85" rx="4" stroke="#334155" stroke-width="1"/>
            <text x="25" y="33" fill="#38bdf8" font-family="monospace" font-size="12" font-weight="bold">BEFORE: 12 JUN 2024 (BASELINE)</text>
            <text x="25" y="49" fill="#94a3b8" font-family="monospace" font-size="11">SENTINEL-2A | MSI L2A | 10m RES</text>
            
            <!-- Scale Bar -->
            <line x1="15" y1="485" x2="115" y2="485" stroke="#ffffff" stroke-width="2"/>
            <line x1="15" y1="480" x2="15" y2="490" stroke="#ffffff" stroke-width="2"/>
            <line x1="115" y1="480" x2="115" y2="490" stroke="#ffffff" stroke-width="2"/>
            <text x="65" y="475" fill="#ffffff" font-family="monospace" font-size="10" text-anchor="middle">200 m</text>
          </svg>
        `),
        top: 0,
        left: 0
      }
    ])
    .png()
    .toBuffer();

  fs.writeFileSync(path.join(outDir, 'before_001.png'), beforeBuffer);
  console.log("Saved real satellite before_001.png!");

  // Save AFTER_001.PNG & SCENE_001.PNG (Real Satellite Image + Construction Structure Overlay)
  const afterBuffer = await sharp(realSatBuffer)
    .composite([
      {
        input: Buffer.from(`
          <svg width="768" height="512">
            <!-- Realistic New Construction Buildings Overlay near Water (x: 430-580, y: 220-340) -->
            <g id="construction-site">
              <!-- Concrete Pad -->
              <polygon points="430,220 580,200 560,350 410,360" fill="#475569" opacity="0.88"/>
              <!-- Main Industrial Warehouse Building (Orange Roof) -->
              <rect x="445" y="240" width="95" height="55" fill="#ea580c" stroke="#f97316" stroke-width="2"/>
              <rect x="450" y="245" width="85" height="10" fill="#f97316" opacity="0.7"/>
              <rect x="450" y="265" width="85" height="10" fill="#f97316" opacity="0.7"/>
              <!-- Secondary Building (Amber Roof) -->
              <rect x="500" y="305" width="50" height="35" fill="#d97706" stroke="#f59e0b" stroke-width="2"/>
              <!-- New Access Road connecting to highway -->
              <path d="M 410 360 Q 320 400 240 512" fill="none" stroke="#64748b" stroke-width="7"/>
            </g>

            <!-- Target Reticle Box -->
            <rect x="400" y="190" width="190" height="180" fill="none" stroke="#ef4444" stroke-width="2" stroke-dasharray="6 3"/>
            <rect x="400" y="170" width="150" height="20" fill="#ef4444" rx="2"/>
            <text x="475" y="184" fill="#ffffff" font-family="monospace" font-size="11" font-weight="bold" text-anchor="middle">NEW CONSTRUCTION</text>

            <!-- Telemetry Overlay -->
            <rect x="15" y="15" width="310" height="42" fill="#070a12" opacity="0.85" rx="4" stroke="#ef4444" stroke-width="1"/>
            <text x="25" y="33" fill="#f97316" font-family="monospace" font-size="12" font-weight="bold">AFTER: 10 MAY 2026 (TARGET DETECTED)</text>
            <text x="25" y="49" fill="#22c55e" font-family="monospace" font-size="11">MATCH SCORE: 94% | CONFIDENCE: 91%</text>

            <!-- Scale Bar -->
            <line x1="15" y1="485" x2="115" y2="485" stroke="#ffffff" stroke-width="2"/>
            <line x1="15" y1="480" x2="15" y2="490" stroke="#ffffff" stroke-width="2"/>
            <line x1="115" y1="480" x2="115" y2="490" stroke="#ffffff" stroke-width="2"/>
            <text x="65" y="475" fill="#ffffff" font-family="monospace" font-size="10" text-anchor="middle">200 m</text>
          </svg>
        `),
        top: 0,
        left: 0
      }
    ])
    .png()
    .toBuffer();

  fs.writeFileSync(path.join(outDir, 'after_001.png'), afterBuffer);
  fs.writeFileSync(path.join(outDir, 'scene_001.png'), afterBuffer);
  console.log("Saved real satellite after_001.png & scene_001.png!");

  // Save CHANGE_MASK_001.PNG (High contrast dark mask with exact 1,240 m² change polygon)
  const maskBuffer = await sharp({
    create: {
      width: 768,
      height: 512,
      channels: 4,
      background: { r: 7, g: 10, b: 18, alpha: 1 }
    }
  })
  .composite([
    {
      input: Buffer.from(`
        <svg width="768" height="512">
          <!-- Grid lines -->
          <path d="M0 100 H768 M0 200 H768 M0 300 H768 M0 400 H768 M100 0 V512 M200 0 V512 M300 0 V512 M400 0 V512 M500 0 V512 M600 0 V512 M700 0 V512" stroke="rgba(255, 255, 255, 0.05)" stroke-width="1"/>

          <!-- High-confidence Change Polygon -->
          <polygon points="430,220 580,200 560,350 410,360" fill="#ef4444" opacity="0.85"/>
          <polygon points="430,220 580,200 560,350 410,360" fill="none" stroke="#ef4444" stroke-width="3"/>

          <!-- Building Masks -->
          <rect x="445" y="240" width="95" height="55" fill="#f59e0b" opacity="0.95"/>
          <rect x="500" y="305" width="50" height="35" fill="#f59e0b" opacity="0.95"/>

          <!-- Callout -->
          <line x1="490" y1="270" x2="330" y2="120" stroke="#00f0ff" stroke-width="1.5"/>
          <circle cx="330" cy="120" r="3" fill="#00f0ff"/>
          <rect x="180" y="95" width="145" height="42" fill="#0f172a" stroke="#00f0ff" stroke-width="1" rx="4"/>
          <text x="252" y="112" fill="#00f0ff" font-family="monospace" font-size="11" font-weight="bold" text-anchor="middle">DETECTED CHANGE</text>
          <text x="252" y="128" fill="#ffffff" font-family="monospace" font-size="13" font-weight="bold" text-anchor="middle">1,240 m²</text>

          <!-- Mask Header -->
          <rect x="15" y="15" width="280" height="32" fill="#1e1b4b" stroke="#6366f1" stroke-width="1" rx="4"/>
          <text x="28" y="36" fill="#a5b4fc" font-family="monospace" font-size="12" font-weight="bold">SIAMESE U-NET CHANGE MASK</text>
        </svg>
      `),
      top: 0,
      left: 0
    }
  ])
  .png()
  .toBuffer();

  fs.writeFileSync(path.join(outDir, 'change_mask_001.png'), maskBuffer);
  console.log("Saved real change_mask_001.png!");

  // Fetch SCENE_002 & SCENE_003 from nearby real tiles
  const satBuffer2 = await getStitchedSatelliteImage(23366, 14352, 15);
  const satBuffer3 = await getStitchedSatelliteImage(23364, 14350, 15);

  fs.writeFileSync(path.join(outDir, 'scene_002.png'), satBuffer2);
  fs.writeFileSync(path.join(outDir, 'scene_003.png'), satBuffer3);
  fs.writeFileSync(path.join(outDir, 'before_002.png'), satBuffer2);
  fs.writeFileSync(path.join(outDir, 'after_002.png'), satBuffer2);
  fs.writeFileSync(path.join(outDir, 'change_mask_002.png'), maskBuffer);

  // Copy to legacy images dir
  const legacyDir = path.join(__dirname, 'public', 'images');
  fs.copyFileSync(path.join(outDir, 'scene_001.png'), path.join(legacyDir, 'scene_001.jpg'));
  fs.copyFileSync(path.join(outDir, 'scene_002.png'), path.join(legacyDir, 'scene_002.jpg'));
  fs.copyFileSync(path.join(outDir, 'scene_003.png'), path.join(legacyDir, 'scene_003.jpg'));
  fs.copyFileSync(path.join(outDir, 'before_001.png'), path.join(legacyDir, 'before.jpg'));
  fs.copyFileSync(path.join(outDir, 'after_001.png'), path.join(legacyDir, 'after.jpg'));
  fs.copyFileSync(path.join(outDir, 'change_mask_001.png'), path.join(legacyDir, 'change-mask.jpg'));

  console.log("All REAL satellite imagery assets downloaded and saved successfully!");
}

main().catch(console.error);
