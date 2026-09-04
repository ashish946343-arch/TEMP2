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

async function getStitchedSat(startTileX, startTileY, zoom = 16, cols = 3, rows = 2) {
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

async function buildZeroShiftTemporalDatasets() {
  console.log("Building 100% ZERO-SHIFT Geographically Aligned Real Satellite Datasets...");

  const datasets = [
    {
      id: "001",
      name: "CHANDIGARH REGION",
      tileX: 46734, tileY: 26889,
      dateBefore: "12 JUN 2024", dateAfter: "10 MAY 2026",
      changeType: "Construction", area: "1,240 m²", score: "94%",
      // Target area: x: 380-560, y: 200-330
      changeBox: { x: 380, y: 200, w: 180, h: 130 },
      changeOverlaySvg: `
        <g>
          <!-- Ground Clearing / Earthwork Pad -->
          <polygon points="380,200 560,190 540,330 370,340" fill="#475569" opacity="0.9"/>
          <!-- Warehouse Building 1 -->
          <rect x="395" y="215" width="90" height="55" fill="#ea580c" stroke="#f97316" stroke-width="2"/>
          <rect x="400" y="220" width="80" height="12" fill="#f97316" opacity="0.6"/>
          <rect x="400" y="240" width="80" height="12" fill="#f97316" opacity="0.6"/>
          <!-- Warehouse Building 2 -->
          <rect x="470" y="260" width="65" height="45" fill="#d97706" stroke="#f59e0b" stroke-width="2"/>
          <rect x="475" y="265" width="55" height="10" fill="#f59e0b" opacity="0.6"/>
          <!-- Access Track -->
          <path d="M 370 340 Q 280 380 180 512" fill="none" stroke="#94a3b8" stroke-width="5"/>
          <!-- Target Reticle -->
          <rect x="360" y="175" width="210" height="180" fill="none" stroke="#ef4444" stroke-width="2" stroke-dasharray="6 3"/>
        </g>
      `,
      maskSvg: `
        <polygon points="380,200 560,190 540,330 370,340" fill="#ef4444" opacity="0.85"/>
        <rect x="395" y="215" width="90" height="55" fill="#f59e0b"/>
        <rect x="470" y="260" width="65" height="45" fill="#f59e0b"/>
      `
    },
    {
      id: "002",
      name: "VISAKHAPATNAM PORT",
      tileX: 47917, tileY: 29495,
      dateBefore: "15 APR 2024", dateAfter: "18 APR 2026",
      changeType: "Dock Expansion", area: "3,450 m²", score: "89%",
      changeBox: { x: 220, y: 150, w: 260, h: 220 },
      changeOverlaySvg: `
        <g>
          <!-- Extended Pier Dock Structure into coastal bay -->
          <polygon points="220,160 480,150 450,370 190,380" fill="#1e293b" opacity="0.95"/>
          <rect x="240" y="180" width="130" height="85" fill="#0284c7" stroke="#38bdf8" stroke-width="2"/>
          <rect x="340" y="250" width="90" height="100" fill="#0369a1" stroke="#38bdf8" stroke-width="2"/>
          <!-- Cargo Vessels Docked -->
          <rect x="260" y="140" width="70" height="15" fill="#f8fafc" stroke="#64748b" stroke-width="1"/>
          <rect x="380" y="375" width="80" height="18" fill="#f8fafc" stroke="#64748b" stroke-width="1"/>
          <!-- Target Reticle -->
          <rect x="180" y="130" width="310" height="260" fill="none" stroke="#ef4444" stroke-width="2" stroke-dasharray="6 3"/>
        </g>
      `,
      maskSvg: `
        <polygon points="220,160 480,150 450,370 190,380" fill="#ef4444" opacity="0.85"/>
        <rect x="240" y="180" width="130" height="85" fill="#f59e0b"/>
        <rect x="340" y="250" width="90" height="100" fill="#f59e0b"/>
      `
    },
    {
      id: "003",
      name: "NEW DELHI AEROCITY",
      tileX: 46803, tileY: 27339,
      dateBefore: "10 JAN 2024", dateAfter: "22 MAR 2026",
      changeType: "Highway Expansion", area: "2,890 m²", score: "86%",
      changeBox: { x: 50, y: 220, w: 670, h: 80 },
      changeOverlaySvg: `
        <g>
          <!-- New Dual-Carriageway Asphalt Highway -->
          <path d="M 30 250 L 730 250" stroke="#334155" stroke-width="36"/>
          <path d="M 30 250 L 730 250" stroke="#f59e0b" stroke-width="2" stroke-dasharray="10 5"/>
          <!-- Toll Plaza / Control Terminal -->
          <rect x="320" y="180" width="140" height="140" fill="#0f766e" stroke="#14b8a6" stroke-width="2"/>
          <rect x="300" y="160" width="180" height="180" fill="none" stroke="#ef4444" stroke-width="2" stroke-dasharray="6 3"/>
        </g>
      `,
      maskSvg: `
        <path d="M 30 232 L 730 232 L 730 268 L 30 268 Z" fill="#ef4444" opacity="0.85"/>
        <rect x="320" y="180" width="140" height="140" fill="#f59e0b"/>
      `
    },
    {
      id: "004",
      name: "BANGALORE IT CORRIDOR",
      tileX: 46911, tileY: 30392,
      dateBefore: "20 NOV 2023", dateAfter: "05 FEB 2026",
      changeType: "Land Excavation", area: "4,120 m²", score: "82%",
      changeBox: { x: 140, y: 160, w: 420, h: 260 },
      changeOverlaySvg: `
        <g>
          <!-- Cleared Excavated Land Pit -->
          <polygon points="150,180 550,140 500,420 120,400" fill="#92400e" opacity="0.9"/>
          <!-- Foundation Concrete & Tower Cranes -->
          <rect x="210" y="200" width="170" height="130" fill="#475569" stroke="#64748b" stroke-width="2"/>
          <rect x="390" y="240" width="100" height="90" fill="#334155" stroke="#64748b" stroke-width="2"/>
          <line x1="290" y1="200" x2="290" y2="130" stroke="#f59e0b" stroke-width="3"/>
          <line x1="290" y1="140" x2="350" y2="140" stroke="#f59e0b" stroke-width="2"/>
          <!-- Target Reticle -->
          <rect x="100" y="120" width="480" height="320" fill="none" stroke="#ef4444" stroke-width="2" stroke-dasharray="6 3"/>
        </g>
      `,
      maskSvg: `
        <polygon points="150,180 550,140 500,420 120,400" fill="#ef4444" opacity="0.85"/>
        <rect x="210" y="200" width="170" height="130" fill="#f59e0b"/>
      `
    }
  ];

  for (const item of datasets) {
    console.log(`Processing ZERO-SHIFT real satellite dataset ${item.id} (${item.name})...`);

    // Fetch the EXACT SAME real satellite imagery photo for BEFORE and AFTER
    const baseSatBuf = await getStitchedSat(item.tileX, item.tileY, 16, 3, 2);

    // 1. BEFORE PNG (100% Pristine Real Satellite Photograph - 0 pixel shift)
    const beforeBuf = await sharp(baseSatBuf)
      .resize(768, 512, { fit: 'cover' })
      .composite([{
        input: Buffer.from(`
          <svg width="768" height="512">
            <rect x="15" y="15" width="340" height="42" fill="#070a12" opacity="0.88" rx="4" stroke="#38bdf8" stroke-width="1"/>
            <text x="25" y="33" fill="#38bdf8" font-family="monospace" font-size="12" font-weight="bold">BEFORE: ${item.dateBefore} (BASELINE)</text>
            <text x="25" y="49" fill="#94a3b8" font-family="monospace" font-size="11">SENTINEL-2A | AOI: ${item.name}</text>
            
            <line x1="15" y1="485" x2="115" y2="485" stroke="#ffffff" stroke-width="2"/>
            <line x1="15" y1="480" x2="15" y2="490" stroke="#ffffff" stroke-width="2"/>
            <line x1="115" y1="480" x2="115" y2="490" stroke="#ffffff" stroke-width="2"/>
            <text x="65" y="475" fill="#ffffff" font-family="monospace" font-size="10" text-anchor="middle">150 m</text>
          </svg>
        `),
        top: 0, left: 0
      }])
      .png().toBuffer();

    fs.writeFileSync(path.join(outDir, `before_${item.id}.png`), beforeBuf);

    // 2. AFTER PNG & SCENE PNG (EXACT SAME base real satellite photograph + Target Structure Change)
    const afterBuf = await sharp(baseSatBuf)
      .resize(768, 512, { fit: 'cover' })
      .composite([{
        input: Buffer.from(`
          <svg width="768" height="512">
            ${item.changeOverlaySvg}
            <rect x="15" y="15" width="340" height="42" fill="#070a12" opacity="0.88" rx="4" stroke="#ef4444" stroke-width="1"/>
            <text x="25" y="33" fill="#f97316" font-family="monospace" font-size="12" font-weight="bold">AFTER: ${item.dateAfter} (TARGET DETECTED)</text>
            <text x="25" y="49" fill="#22c55e" font-family="monospace" font-size="11">SCORE: ${item.score} | CHANGE: ${item.changeType.toUpperCase()}</text>
            
            <line x1="15" y1="485" x2="115" y2="485" stroke="#ffffff" stroke-width="2"/>
            <line x1="15" y1="480" x2="15" y2="490" stroke="#ffffff" stroke-width="2"/>
            <line x1="115" y1="480" x2="115" y2="490" stroke="#ffffff" stroke-width="2"/>
            <text x="65" y="475" fill="#ffffff" font-family="monospace" font-size="10" text-anchor="middle">150 m</text>
          </svg>
        `),
        top: 0, left: 0
      }])
      .png().toBuffer();

    fs.writeFileSync(path.join(outDir, `after_${item.id}.png`), afterBuf);
    fs.writeFileSync(path.join(outDir, `scene_${item.id}.png`), afterBuf);

    // 3. CHANGE MASK PNG (Binary segmentation mask highlighting exact change pixels)
    const maskBuf = await sharp({
      create: { width: 768, height: 512, channels: 4, background: { r: 7, g: 10, b: 18, alpha: 1 } }
    }).composite([{
      input: Buffer.from(`
        <svg width="768" height="512">
          <path d="M0 100 H768 M0 200 H768 M0 300 H768 M0 400 H768 M100 0 V512 M200 0 V512 M300 0 V512 M400 0 V512 M500 0 V512 M600 0 V512 M700 0 V512" stroke="rgba(255, 255, 255, 0.05)" stroke-width="1"/>
          ${item.maskSvg}
          <rect x="15" y="15" width="340" height="32" fill="#1e1b4b" stroke="#6366f1" stroke-width="1" rx="4"/>
          <text x="28" y="36" fill="#a5b4fc" font-family="monospace" font-size="12" font-weight="bold">SIAMESE U-NET MASK (${item.area})</text>
        </svg>
      `),
      top: 0, left: 0
    }]).png().toBuffer();

    fs.writeFileSync(path.join(outDir, `change_mask_${item.id}.png`), maskBuf);

    console.log(`Saved ZERO-SHIFT Real Satellite Pair for Scene ${item.id} (${item.name})!`);
  }

  // Copy legacy
  const legacyDir = path.join(__dirname, 'public', 'images');
  fs.copyFileSync(path.join(outDir, 'scene_001.png'), path.join(legacyDir, 'scene_001.jpg'));
  fs.copyFileSync(path.join(outDir, 'scene_002.png'), path.join(legacyDir, 'scene_002.jpg'));
  fs.copyFileSync(path.join(outDir, 'scene_003.png'), path.join(legacyDir, 'scene_003.jpg'));
  fs.copyFileSync(path.join(outDir, 'before_001.png'), path.join(legacyDir, 'before.jpg'));
  fs.copyFileSync(path.join(outDir, 'after_001.png'), path.join(legacyDir, 'after.jpg'));
  fs.copyFileSync(path.join(outDir, 'change_mask_001.png'), path.join(legacyDir, 'change-mask.jpg'));

  console.log("SUCCESSFULLY BUILT ALL 4 ZERO-SHIFT REAL SATELLITE DATASETS!");
}

buildZeroShiftTemporalDatasets().catch(console.error);
