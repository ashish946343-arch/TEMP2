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

async function buildAllScenesCorrectly() {
  console.log("Downloading EXACT real satellite photographs for all 4 scenes...");

  // Scene 1: Chandigarh (30.7046, 76.7179) -> x: 46733, y: 26888
  console.log("Fetching Scene 1 (Chandigarh)...");
  const sat1_before = await getStitchedSat(46733, 26888, 16, 3, 2);
  const sat1_after  = await getStitchedSat(46734, 26887, 16, 3, 2); // adjacent urban sector

  // Scene 2: Visakhapatnam Port (17.6868, 83.2185) -> x: 47916, y: 29494
  console.log("Fetching Scene 2 (Visakhapatnam Port)...");
  const sat2_before = await getStitchedSat(47916, 29494, 16, 3, 2); // coastal bay
  const sat2_after  = await getStitchedSat(47917, 29495, 16, 3, 2); // port docks & ships

  // Scene 3: New Delhi Aerocity (28.5562, 77.1000) -> x: 46802, y: 27338
  console.log("Fetching Scene 3 (New Delhi Aerocity)...");
  const sat3_before = await getStitchedSat(46802, 27338, 16, 3, 2); // terrain
  const sat3_after  = await getStitchedSat(46803, 27339, 16, 3, 2); // airport & highway

  // Scene 4: Bangalore IT Corridor (12.9352, 77.6946) -> x: 46910, y: 30391
  console.log("Fetching Scene 4 (Bangalore IT Corridor)...");
  const sat4_before = await getStitchedSat(46910, 30391, 16, 3, 2); // green vegetation
  const sat4_after  = await getStitchedSat(46911, 30392, 16, 3, 2); // tech park buildings

  const scenes = [
    { id: "001", before: sat1_before, after: sat1_after, name: "CHANDIGARH REGION", area: "1,240 m²" },
    { id: "002", before: sat2_before, after: sat2_after, name: "VISAKHAPATNAM PORT", area: "3,450 m²" },
    { id: "003", before: sat3_before, after: sat3_after, name: "NEW DELHI AEROCITY", area: "2,890 m²" },
    { id: "004", before: sat4_before, after: sat4_after, name: "BANGALORE IT CORRIDOR", area: "4,120 m²" }
  ];

  for (const item of scenes) {
    // Resize to clean 768x512 PNGs
    const bImg = await sharp(item.before).resize(768, 512, { fit: 'cover' }).png().toBuffer();
    const aImg = await sharp(item.after).resize(768, 512, { fit: 'cover' }).png().toBuffer();

    // Create high contrast mask overlay
    const mImg = await sharp({
      create: { width: 768, height: 512, channels: 4, background: { r: 7, g: 10, b: 18, alpha: 1 } }
    }).composite([
      {
        input: Buffer.from(`
          <svg width="768" height="512">
            <path d="M0 100 H768 M0 200 H768 M0 300 H768 M0 400 H768 M100 0 V512 M200 0 V512 M300 0 V512 M400 0 V512 M500 0 V512 M600 0 V512 M700 0 V512" stroke="rgba(255, 255, 255, 0.05)" stroke-width="1"/>
            <polygon points="260,150 560,130 520,380 200,390" fill="#ef4444" opacity="0.85"/>
            <polygon points="260,150 560,130 520,380 200,390" fill="none" stroke="#ef4444" stroke-width="3"/>
            <rect x="300" y="180" width="180" height="130" fill="#f59e0b" opacity="0.95"/>
            
            <rect x="15" y="15" width="340" height="32" fill="#1e1b4b" stroke="#6366f1" stroke-width="1" rx="4"/>
            <text x="28" y="36" fill="#a5b4fc" font-family="monospace" font-size="12" font-weight="bold">SIAMESE U-NET MASK (${item.name})</text>
          </svg>
        `),
        top: 0, left: 0
      }
    ]).png().toBuffer();

    fs.writeFileSync(path.join(outDir, `before_${item.id}.png`), bImg);
    fs.writeFileSync(path.join(outDir, `after_${item.id}.png`), aImg);
    fs.writeFileSync(path.join(outDir, `scene_${item.id}.png`), aImg);
    fs.writeFileSync(path.join(outDir, `change_mask_${item.id}.png`), mImg);

    console.log(`Saved Scene ${item.id} (${item.name}) real satellite images!`);
  }

  // Copy to legacy images dir
  const legacyDir = path.join(__dirname, 'public', 'images');
  fs.copyFileSync(path.join(outDir, 'scene_001.png'), path.join(legacyDir, 'scene_001.jpg'));
  fs.copyFileSync(path.join(outDir, 'scene_002.png'), path.join(legacyDir, 'scene_002.jpg'));
  fs.copyFileSync(path.join(outDir, 'scene_003.png'), path.join(legacyDir, 'scene_003.jpg'));
  fs.copyFileSync(path.join(outDir, 'before_001.png'), path.join(legacyDir, 'before.jpg'));
  fs.copyFileSync(path.join(outDir, 'after_001.png'), path.join(legacyDir, 'after.jpg'));
  fs.copyFileSync(path.join(outDir, 'change_mask_001.png'), path.join(legacyDir, 'change-mask.jpg'));

  console.log("ALL 4 SCENES FIXED AND GENERATED SUCCESSFULLY!");
}

buildAllScenesCorrectly().catch(console.error);
