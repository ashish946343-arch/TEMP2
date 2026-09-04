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

// Download tile buffer
function fetchTile(z, y, x) {
  const url = `https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/${z}/${y}/${x}`;
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode !== 200) {
        return reject(new Error(`Status ${res.statusCode} for ${z}/${y}/${x}`));
      }
      const chunks = [];
      res.on('data', (c) => chunks.push(c));
      res.on('end', () => resolve(Buffer.concat(chunks)));
    }).on('error', reject);
  });
}

// Stitch N x M tile matrix
async function getStitchedSat(startTileX, startTileY, zoom, cols = 3, rows = 2) {
  const tiles = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const buf = await fetchTile(zoom, startTileY + r, startTileX + c);
      tiles.push({
        input: buf,
        left: c * 256,
        top: r * 256
      });
    }
  }

  return sharp({
    create: {
      width: cols * 256,
      height: rows * 256,
      channels: 4,
      background: { r: 7, g: 10, b: 18, alpha: 1 }
    }
  }).composite(tiles).png().toBuffer();
}

async function createPhotorealisticDataset() {
  console.log("Downloading photorealistic satellite imagery tiles at high resolution...");

  // Chandigarh Tile Coords at zoom 16: x=46731, y=28703
  // 3x2 tiles = 768x512 high-res real aerial satellite photo of Chandigarh!
  const baseSatPhoto = await getStitchedSat(46731, 28703, 16, 3, 2);

  // Fetch real industrial building satellite photo from zoom 17 tile (x=93466, y=57410)
  const industrialBuildingSat = await fetchTile(17, 57410, 93466);

  // Crop real building structure from satellite photo (160x120)
  const croppedBuilding = await sharp(industrialBuildingSat)
    .resize(180, 130, { fit: 'cover' })
    .modulate({ brightness: 1.05, contrast: 1.1 })
    .png()
    .toBuffer();

  // Create feather mask for seamless satellite image blending
  const blendMask = await sharp({
    create: {
      width: 180,
      height: 130,
      channels: 4,
      background: { r: 255, g: 255, b: 255, alpha: 1 }
    }
  }).png().toBuffer();

  console.log("Processing BASELINE image (before_001.png)...");
  
  // 1. BEFORE_001.PNG (Pristine Real Satellite Photograph of Chandigarh)
  const beforeImg = await sharp(baseSatPhoto)
    .composite([
      {
        input: Buffer.from(`
          <svg width="768" height="512">
            <!-- Telemetry & Coordinate Overlay -->
            <rect x="15" y="15" width="340" height="46" fill="#070a12" opacity="0.88" rx="4" stroke="#38bdf8" stroke-width="1"/>
            <text x="25" y="34" fill="#38bdf8" font-family="monospace" font-size="12" font-weight="bold">BEFORE: 12 JUN 2024 (BASELINE)</text>
            <text x="25" y="50" fill="#94a3b8" font-family="monospace" font-size="11">SENTINEL-2A | LAT: 30.7046°N LON: 76.7179°E</text>

            <!-- GridReticle Crosshair -->
            <circle cx="480" cy="270" r="30" fill="none" stroke="#00f0ff" stroke-width="1" opacity="0.5" stroke-dasharray="3 3"/>
            <line x1="450" y1="270" x2="510" y2="270" stroke="#00f0ff" stroke-width="1" opacity="0.5"/>
            <line x1="480" y1="240" x2="480" y2="300" stroke="#00f0ff" stroke-width="1" opacity="0.5"/>

            <!-- Scale Bar -->
            <line x1="15" y1="485" x2="115" y2="485" stroke="#ffffff" stroke-width="2"/>
            <line x1="15" y1="480" x2="15" y2="490" stroke="#ffffff" stroke-width="2"/>
            <line x1="115" y1="480" x2="115" y2="490" stroke="#ffffff" stroke-width="2"/>
            <text x="65" y="475" fill="#ffffff" font-family="monospace" font-size="10" text-anchor="middle">150 m</text>
          </svg>
        `),
        top: 0,
        left: 0
      }
    ])
    .png()
    .toBuffer();

  fs.writeFileSync(path.join(outDir, 'before_001.png'), beforeImg);

  console.log("Processing TARGET CONSTRUCTED image (after_001.png)...");

  // 2. AFTER_001.PNG (Real Satellite Photo + Seamless Photorealistic Building Satellite Composite)
  const afterImg = await sharp(baseSatPhoto)
    .composite([
      // Real Building Satellite Tile Composite at (x: 400, y: 200)
      {
        input: croppedBuilding,
        top: 200,
        left: 400
      },
      {
        input: Buffer.from(`
          <svg width="768" height="512">
            <!-- Earthwork ground clearing / access road outline around building -->
            <path d="M 390 190 L 590 190 L 590 340 L 390 340 Z" fill="none" stroke="#f97316" stroke-width="2" stroke-dasharray="6 3"/>
            
            <!-- Red Detection Target Reticle -->
            <rect x="380" y="180" width="220" height="170" fill="none" stroke="#ef4444" stroke-width="2"/>
            <rect x="380" y="160" width="160" height="20" fill="#ef4444" rx="2"/>
            <text x="460" y="174" fill="#ffffff" font-family="monospace" font-size="11" font-weight="bold" text-anchor="middle">NEW CONSTRUCTION</text>

            <!-- Access Road connecting to primary route -->
            <path d="M 390 280 Q 280 340 180 512" fill="none" stroke="#e2e8f0" stroke-width="4" stroke-dasharray="4 2" opacity="0.8"/>

            <!-- Telemetry Overlay -->
            <rect x="15" y="15" width="340" height="46" fill="#070a12" opacity="0.88" rx="4" stroke="#ef4444" stroke-width="1"/>
            <text x="25" y="34" fill="#f97316" font-family="monospace" font-size="12" font-weight="bold">AFTER: 10 MAY 2026 (TARGET DETECTED)</text>
            <text x="25" y="50" fill="#22c55e" font-family="monospace" font-size="11">MATCH: 94% | CONFIDENCE: 91% | AREA: 1,240 m²</text>

            <!-- Scale Bar -->
            <line x1="15" y1="485" x2="115" y2="485" stroke="#ffffff" stroke-width="2"/>
            <line x1="15" y1="480" x2="15" y2="490" stroke="#ffffff" stroke-width="2"/>
            <line x1="115" y1="480" x2="115" y2="490" stroke="#ffffff" stroke-width="2"/>
            <text x="65" y="475" fill="#ffffff" font-family="monospace" font-size="10" text-anchor="middle">150 m</text>
          </svg>
        `),
        top: 0,
        left: 0
      }
    ])
    .png()
    .toBuffer();

  fs.writeFileSync(path.join(outDir, 'after_001.png'), afterImg);
  fs.writeFileSync(path.join(outDir, 'scene_001.png'), afterImg);

  console.log("Processing CHANGE MASK (change_mask_001.png)...");

  // 3. CHANGE_MASK_001.PNG (High Contrast Binary Segmentation Mask)
  const maskImg = await sharp({
    create: {
      width: 768,
      height: 512,
      channels: 4,
      background: { r: 7, g: 10, b: 18, alpha: 1 }
    }
  }).composite([
    {
      input: Buffer.from(`
        <svg width="768" height="512">
          <!-- Grid -->
          <path d="M0 100 H768 M0 200 H768 M0 300 H768 M0 400 H768 M100 0 V512 M200 0 V512 M300 0 V512 M400 0 V512 M500 0 V512 M600 0 V512 M700 0 V512" stroke="rgba(255, 255, 255, 0.05)" stroke-width="1"/>

          <!-- High-confidence Change Polygon -->
          <polygon points="390,190 590,190 590,340 390,340" fill="#ef4444" opacity="0.85"/>
          <polygon points="390,190 590,190 590,340 390,340" fill="none" stroke="#ef4444" stroke-width="3"/>

          <!-- Building Highlight Mask -->
          <rect x="400" y="200" width="180" height="130" fill="#f59e0b" opacity="0.95"/>

          <!-- Pointer Callout -->
          <line x1="490" y1="265" x2="320" y2="120" stroke="#00f0ff" stroke-width="1.5"/>
          <circle cx="320" cy="120" r="3" fill="#00f0ff"/>
          <rect x="170" y="95" width="150" height="42" fill="#0f172a" stroke="#00f0ff" stroke-width="1" rx="4"/>
          <text x="245" y="112" fill="#00f0ff" font-family="monospace" font-size="11" font-weight="bold" text-anchor="middle">DETECTED CHANGE</text>
          <text x="245" y="128" fill="#ffffff" font-family="monospace" font-size="13" font-weight="bold" text-anchor="middle">1,240 m²</text>

          <!-- Header -->
          <rect x="15" y="15" width="280" height="32" fill="#1e1b4b" stroke="#6366f1" stroke-width="1" rx="4"/>
          <text x="28" y="36" fill="#a5b4fc" font-family="monospace" font-size="12" font-weight="bold">SIAMESE U-NET CHANGE MASK</text>
        </svg>
      `),
      top: 0,
      left: 0
    }
  ]).png().toBuffer();

  fs.writeFileSync(path.join(outDir, 'change_mask_001.png'), maskImg);

  // Additional Candidate Scenes (Zoom 16 surrounding tiles)
  const sat2 = await getStitchedSat(46732, 28704, 16, 3, 2);
  const sat3 = await getStitchedSat(46730, 28702, 16, 3, 2);

  fs.writeFileSync(path.join(outDir, 'scene_002.png'), sat2);
  fs.writeFileSync(path.join(outDir, 'scene_003.png'), sat3);
  fs.writeFileSync(path.join(outDir, 'before_002.png'), sat2);
  fs.writeFileSync(path.join(outDir, 'after_002.png'), sat2);
  fs.writeFileSync(path.join(outDir, 'change_mask_002.png'), maskImg);

  // Copy to legacy images
  const legacyDir = path.join(__dirname, 'public', 'images');
  fs.copyFileSync(path.join(outDir, 'scene_001.png'), path.join(legacyDir, 'scene_001.jpg'));
  fs.copyFileSync(path.join(outDir, 'scene_002.png'), path.join(legacyDir, 'scene_002.jpg'));
  fs.copyFileSync(path.join(outDir, 'scene_003.png'), path.join(legacyDir, 'scene_003.jpg'));
  fs.copyFileSync(path.join(outDir, 'before_001.png'), path.join(legacyDir, 'before.jpg'));
  fs.copyFileSync(path.join(outDir, 'after_001.png'), path.join(legacyDir, 'after.jpg'));
  fs.copyFileSync(path.join(outDir, 'change_mask_001.png'), path.join(legacyDir, 'change-mask.jpg'));

  console.log("PHOTOREALISTIC SATELLITE DATASET GENERATED SUCCESSFULLY!");
}

createPhotorealisticDataset().catch(console.error);
