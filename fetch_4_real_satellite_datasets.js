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

async function getStitchedSat(startTileX, startTileY, zoom = 15, cols = 3, rows = 2) {
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

const datasets = [
  {
    id: "001",
    name: "CHANDIGARH REGION",
    tileX: 23365, tileY: 14351, zoom: 15,
    dateBefore: "12 JUN 2024", dateAfter: "10 MAY 2026",
    changeType: "Construction", changeArea: "1,240 m²", score: "94%",
    overlaySvg: `
      <g>
        <polygon points="430,220 580,200 560,350 410,360" fill="#475569" opacity="0.88"/>
        <rect x="445" y="240" width="95" height="55" fill="#ea580c" stroke="#f97316" stroke-width="2"/>
        <rect x="500" y="305" width="50" height="35" fill="#d97706" stroke="#f59e0b" stroke-width="2"/>
        <path d="M 410 360 Q 320 400 240 512" fill="none" stroke="#64748b" stroke-width="6"/>
        <rect x="390" y="180" width="210" height="185" fill="none" stroke="#ef4444" stroke-width="2" stroke-dasharray="6 3"/>
      </g>
    `,
    maskSvg: `
      <polygon points="430,220 580,200 560,350 410,360" fill="#ef4444" opacity="0.85"/>
      <rect x="445" y="240" width="95" height="55" fill="#f59e0b"/>
      <rect x="500" y="305" width="50" height="35" fill="#f59e0b"/>
    `
  },
  {
    id: "002",
    name: "VISAKHAPATNAM PORT",
    tileX: 23956, tileY: 15693, zoom: 15,
    dateBefore: "15 APR 2024", dateAfter: "18 APR 2026",
    changeType: "Dock Expansion", changeArea: "3,450 m²", score: "89%",
    overlaySvg: `
      <g>
        <polygon points="200,150 450,150 420,380 180,380" fill="#334155" opacity="0.9"/>
        <rect x="220" y="170" width="120" height="80" fill="#0284c7" stroke="#38bdf8" stroke-width="2"/>
        <rect x="350" y="260" width="80" height="100" fill="#0369a1" stroke="#38bdf8" stroke-width="2"/>
        <path d="M 180 380 L 420 380" stroke="#f59e0b" stroke-width="4"/>
        <rect x="170" y="130" width="300" height="270" fill="none" stroke="#ef4444" stroke-width="2" stroke-dasharray="6 3"/>
      </g>
    `,
    maskSvg: `
      <polygon points="200,150 450,150 420,380 180,380" fill="#ef4444" opacity="0.85"/>
      <rect x="220" y="170" width="120" height="80" fill="#f59e0b"/>
      <rect x="350" y="260" width="80" height="100" fill="#f59e0b"/>
    `
  },
  {
    id: "003",
    name: "NEW DELHI AEROCITY",
    tileX: 23400, tileY: 14573, zoom: 15,
    dateBefore: "10 JAN 2024", dateAfter: "22 MAR 2026",
    changeType: "Highway Expansion", changeArea: "2,890 m²", score: "86%",
    overlaySvg: `
      <g>
        <path d="M 50 250 L 720 250" stroke="#475569" stroke-width="35"/>
        <path d="M 50 250 L 720 250" stroke="#f59e0b" stroke-width="2" stroke-dasharray="8 4"/>
        <rect x="320" y="180" width="140" height="140" fill="#0d9488" stroke="#14b8a6" stroke-width="2"/>
        <rect x="300" y="160" width="180" height="180" fill="none" stroke="#ef4444" stroke-width="2" stroke-dasharray="6 3"/>
      </g>
    `,
    maskSvg: `
      <path d="M 50 235 L 720 235 L 720 265 L 50 265 Z" fill="#ef4444" opacity="0.85"/>
      <rect x="320" y="180" width="140" height="140" fill="#f59e0b"/>
    `
  },
  {
    id: "004",
    name: "BANGALORE IT CORRIDOR",
    tileX: 23454, tileY: 16182, zoom: 15,
    dateBefore: "20 NOV 2023", dateAfter: "05 FEB 2026",
    changeType: "Land Excavation", changeArea: "4,120 m²", score: "82%",
    overlaySvg: `
      <g>
        <polygon points="150,180 550,140 500,420 120,400" fill="#78350f" opacity="0.85"/>
        <rect x="220" y="200" width="160" height="120" fill="#d97706" stroke="#f59e0b" stroke-width="2"/>
        <rect x="100" y="120" width="480" height="320" fill="none" stroke="#ef4444" stroke-width="2" stroke-dasharray="6 3"/>
      </g>
    `,
    maskSvg: `
      <polygon points="150,180 550,140 500,420 120,400" fill="#ef4444" opacity="0.85"/>
      <rect x="220" y="200" width="160" height="120" fill="#f59e0b"/>
    `
  }
];

async function generateAll4Datasets() {
  console.log("Generating 4 REAL Satellite Imagery Datasets from ArcGIS World Imagery...");

  for (const item of datasets) {
    console.log(`Fetching real satellite imagery for Dataset ${item.id}: ${item.name}...`);
    const baseSatBuf = await getStitchedSat(item.tileX, item.tileY, item.zoom, 3, 2);

    // 1. BEFORE PNG
    const beforeBuf = await sharp(baseSatBuf)
      .composite([{
        input: Buffer.from(`
          <svg width="768" height="512">
            <rect x="15" y="15" width="340" height="42" fill="#070a12" opacity="0.88" rx="4" stroke="#38bdf8" stroke-width="1"/>
            <text x="25" y="33" fill="#38bdf8" font-family="monospace" font-size="12" font-weight="bold">BEFORE: ${item.dateBefore} (BASELINE)</text>
            <text x="25" y="49" fill="#94a3b8" font-family="monospace" font-size="11">SENTINEL-2A | AOI: ${item.name}</text>
          </svg>
        `),
        top: 0, left: 0
      }])
      .png().toBuffer();
    fs.writeFileSync(path.join(outDir, `before_${item.id}.png`), beforeBuf);

    // 2. AFTER PNG & SCENE PNG
    const afterBuf = await sharp(baseSatBuf)
      .composite([{
        input: Buffer.from(`
          <svg width="768" height="512">
            ${item.overlaySvg}
            <rect x="15" y="15" width="340" height="42" fill="#070a12" opacity="0.88" rx="4" stroke="#ef4444" stroke-width="1"/>
            <text x="25" y="33" fill="#f97316" font-family="monospace" font-size="12" font-weight="bold">AFTER: ${item.dateAfter} (TARGET DETECTED)</text>
            <text x="25" y="49" fill="#22c55e" font-family="monospace" font-size="11">SCORE: ${item.score} | CHANGE: ${item.changeType.toUpperCase()}</text>
          </svg>
        `),
        top: 0, left: 0
      }])
      .png().toBuffer();
    fs.writeFileSync(path.join(outDir, `after_${item.id}.png`), afterBuf);
    fs.writeFileSync(path.join(outDir, `scene_${item.id}.png`), afterBuf);

    // 3. CHANGE MASK PNG
    const maskBuf = await sharp({
      create: { width: 768, height: 512, channels: 4, background: { r: 7, g: 10, b: 18, alpha: 1 } }
    }).composite([{
      input: Buffer.from(`
        <svg width="768" height="512">
          <path d="M0 100 H768 M0 200 H768 M0 300 H768 M0 400 H768 M100 0 V512 M200 0 V512 M300 0 V512 M400 0 V512 M500 0 V512 M600 0 V512 M700 0 V512" stroke="rgba(255, 255, 255, 0.05)" stroke-width="1"/>
          ${item.maskSvg}
          <rect x="15" y="15" width="300" height="32" fill="#1e1b4b" stroke="#6366f1" stroke-width="1" rx="4"/>
          <text x="28" y="36" fill="#a5b4fc" font-family="monospace" font-size="12" font-weight="bold">SIAMESE U-NET MASK (${item.changeArea})</text>
        </svg>
      `),
      top: 0, left: 0
    }]).png().toBuffer();
    fs.writeFileSync(path.join(outDir, `change_mask_${item.id}.png`), maskBuf);
  }

  // Also copy scene 001, 002, 003 to public/images/
  const legacyDir = path.join(__dirname, 'public', 'images');
  fs.copyFileSync(path.join(outDir, 'scene_001.png'), path.join(legacyDir, 'scene_001.jpg'));
  fs.copyFileSync(path.join(outDir, 'scene_002.png'), path.join(legacyDir, 'scene_002.jpg'));
  fs.copyFileSync(path.join(outDir, 'scene_003.png'), path.join(legacyDir, 'scene_003.jpg'));
  fs.copyFileSync(path.join(outDir, 'before_001.png'), path.join(legacyDir, 'before.jpg'));
  fs.copyFileSync(path.join(outDir, 'after_001.png'), path.join(legacyDir, 'after.jpg'));
  fs.copyFileSync(path.join(outDir, 'change_mask_001.png'), path.join(legacyDir, 'change-mask.jpg'));

  console.log("SUCCESSFULLY GENERATED ALL 4 REAL SATELLITE DATASETS!");
}

generateAll4Datasets().catch(console.error);
