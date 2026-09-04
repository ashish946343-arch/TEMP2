import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const imgDir = path.join(__dirname, 'public', 'images');
if (!fs.existsSync(imgDir)) {
  fs.mkdirSync(imgDir, { recursive: true });
}

function createScene1() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="800" height="600">
  <defs>
    <linearGradient id="waterGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0c2340"/>
      <stop offset="50%" stop-color="#11355c"/>
      <stop offset="100%" stop-color="#0a192f"/>
    </linearGradient>
    <linearGradient id="landGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#172a25"/>
      <stop offset="50%" stop-color="#0f1d19"/>
      <stop offset="100%" stop-color="#1a2e26"/>
    </linearGradient>
    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(0, 240, 255, 0.08)" stroke-width="1"/>
    </pattern>
  </defs>
  <rect width="800" height="600" fill="url(#landGrad)"/>
  <rect width="800" height="600" fill="url(#grid)"/>
  <path d="M -50 450 Q 200 380 350 250 T 850 100 L 850 -50 L -50 -50 Z" fill="url(#waterGrad)" opacity="0.9"/>
  <path d="M -50 450 Q 200 380 350 250 T 850 100" fill="none" stroke="#00f0ff" stroke-width="2" opacity="0.4"/>
  <polygon points="100,100 240,120 220,250 80,220" fill="#1e3a2b" opacity="0.6"/>
  <polygon points="260,130 420,150 400,280 250,260" fill="#2d4a36" opacity="0.5"/>
  <polygon points="450,300 620,280 650,450 480,470" fill="#243d2c" opacity="0.7"/>

  <g transform="translate(380, 290)">
    <rect x="-40" y="-30" width="110" height="80" fill="none" stroke="#ff3b30" stroke-width="2" stroke-dasharray="4 2"/>
    <rect x="-25" y="-15" width="45" height="30" fill="#e65100" opacity="0.85"/>
    <rect x="25" y="-15" width="30" height="50" fill="#bf360c" opacity="0.9"/>
    <circle cx="15" cy="10" r="45" fill="none" stroke="#ff9500" stroke-width="1" opacity="0.6"/>
    <line x1="-50" y1="10" x2="80" y2="10" stroke="#ff9500" stroke-width="0.8" stroke-dasharray="2 2" opacity="0.5"/>
    <line x1="15" y1="-50" x2="15" y2="70" stroke="#ff9500" stroke-width="0.8" stroke-dasharray="2 2" opacity="0.5"/>
    <rect x="-40" y="-50" width="110" height="18" fill="#1c1917" opacity="0.8" rx="2"/>
    <text x="15" y="-37" fill="#ff9500" font-family="monospace" font-size="11" font-weight="bold" text-anchor="middle">TARGET: NEW STRUCT</text>
  </g>

  <text x="20" y="30" fill="#00f0ff" font-family="monospace" font-size="12" font-weight="bold">SENTINEL-2A | MSI L2A | B8-B4-B3</text>
  <text x="20" y="48" fill="#94a3b8" font-family="monospace" font-size="11">LAT: 30.7046° N  LON: 76.7179° E</text>
  <text x="780" y="30" fill="#00f0ff" font-family="monospace" font-size="12" text-anchor="end">2026-05-10 05:42:19 UTC</text>
  <text x="780" y="48" fill="#22c55e" font-family="monospace" font-size="11" text-anchor="end">SIMILARITY SCORE: 94%</text>

  <line x1="20" y1="560" x2="120" y2="560" stroke="#ffffff" stroke-width="2"/>
  <line x1="20" y1="555" x2="20" y2="565" stroke="#ffffff" stroke-width="2"/>
  <line x1="120" y1="555" x2="120" y2="565" stroke="#ffffff" stroke-width="2"/>
  <text x="70" y="550" fill="#ffffff" font-family="monospace" font-size="10" text-anchor="middle">100 m</text>
</svg>`;
}

function createScene2() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="800" height="600">
  <rect width="800" height="600" fill="#121e1a"/>
  <path d="M0 100 H800 M0 200 H800 M0 300 H800 M0 400 H800 M0 500 H800 M100 0 V600 M200 0 V600 M300 0 V600 M400 0 V600 M500 0 V600 M600 0 V600 M700 0 V600" stroke="rgba(0, 240, 255, 0.06)" stroke-width="1"/>
  <polygon points="150,150 500,100 550,450 100,500" fill="#1a2f26"/>
  <path d="M -20 300 L 820 280" stroke="#334155" stroke-width="8"/>
  <path d="M 400 -20 L 420 620" stroke="#334155" stroke-width="6"/>
  <circle cx="410" cy="290" r="60" fill="#d97706" opacity="0.3"/>
  <rect x="370" y="260" width="80" height="60" fill="none" stroke="#f59e0b" stroke-width="2"/>
  
  <text x="20" y="30" fill="#00f0ff" font-family="monospace" font-size="12" font-weight="bold">SENTINEL-2B | SCENE_002</text>
  <text x="20" y="48" fill="#94a3b8" font-family="monospace" font-size="11">LAT: 30.7100° N  LON: 76.7200° E</text>
  <text x="780" y="30" fill="#00f0ff" font-family="monospace" font-size="12" text-anchor="end">2026-04-18 UTC</text>
  <text x="780" y="48" fill="#38bdf8" font-family="monospace" font-size="11" text-anchor="end">SIMILARITY SCORE: 89%</text>
</svg>`;
}

function createScene3() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="800" height="600">
  <rect width="800" height="600" fill="#141c24"/>
  <path d="M 50 100 Q 300 200 750 150 T 800 550" fill="none" stroke="#1e293b" stroke-width="30"/>
  <polygon points="200,200 600,180 580,480 180,450" fill="#1b2a38"/>
  <circle cx="380" cy="320" r="45" fill="#a855f7" opacity="0.2"/>
  <rect x="340" y="280" width="80" height="80" fill="none" stroke="#c084fc" stroke-width="1.5" stroke-dasharray="3 3"/>

  <text x="20" y="30" fill="#00f0ff" font-family="monospace" font-size="12" font-weight="bold">SENTINEL-2A | SCENE_003</text>
  <text x="20" y="48" fill="#94a3b8" font-family="monospace" font-size="11">LAT: 30.6990° N  LON: 76.7250° E</text>
  <text x="780" y="30" fill="#00f0ff" font-family="monospace" font-size="12" text-anchor="end">2026-03-22 UTC</text>
  <text x="780" y="48" fill="#a855f7" font-family="monospace" font-size="11" text-anchor="end">SIMILARITY SCORE: 84%</text>
</svg>`;
}

function createBefore() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="800" height="600">
  <defs>
    <linearGradient id="wGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0a2540"/>
      <stop offset="100%" stop-color="#0d1b2a"/>
    </linearGradient>
  </defs>
  <rect width="800" height="600" fill="#0f1f1a"/>
  <path d="M -50 450 Q 200 380 350 250 T 850 100 L 850 -50 L -50 -50 Z" fill="url(#wGrad)"/>
  <polygon points="120,320 280,300 300,480 140,500" fill="#183827"/>
  <polygon points="320,290 520,270 540,460 340,480" fill="#143022"/>
  <polygon points="360,260 480,240 460,350 350,360" fill="#242c22"/>

  <rect x="20" y="20" width="220" height="32" fill="#0f172a" opacity="0.85" rx="4"/>
  <text x="30" y="41" fill="#38bdf8" font-family="monospace" font-size="13" font-weight="bold">BEFORE: 12 JUN 2024</text>
  <text x="20" y="575" fill="#64748b" font-family="monospace" font-size="11">BASELINE SENTINEL-2 IMAGERY (PRE-CONSTRUCTION)</text>
</svg>`;
}

function createAfter() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="800" height="600">
  <defs>
    <linearGradient id="wGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0a2540"/>
      <stop offset="100%" stop-color="#0d1b2a"/>
    </linearGradient>
  </defs>
  <rect width="800" height="600" fill="#0f1f1a"/>
  <path d="M -50 450 Q 200 380 350 250 T 850 100 L 850 -50 L -50 -50 Z" fill="url(#wGrad)"/>
  <polygon points="120,320 280,300 300,480 140,500" fill="#183827"/>
  <polygon points="320,290 520,270 540,460 340,480" fill="#143022"/>
  
  <g id="new-structures">
    <polygon points="350,250 510,230 490,380 330,400" fill="#475569"/>
    <rect x="360" y="270" width="90" height="55" fill="#f97316" stroke="#ea580c" stroke-width="2"/>
    <rect x="420" y="340" width="55" height="35" fill="#eab308" stroke="#ca8a04" stroke-width="2"/>
    <path d="M 330 380 Q 250 420 180 580" fill="none" stroke="#64748b" stroke-width="6"/>
  </g>

  <rect x="320" y="235" width="200" height="175" fill="none" stroke="#ef4444" stroke-width="2" stroke-dasharray="6 3"/>
  <rect x="320" y="215" width="140" height="20" fill="#ef4444" rx="2"/>
  <text x="390" y="229" fill="#ffffff" font-family="monospace" font-size="11" font-weight="bold" text-anchor="middle">NEW CONSTRUCTION</text>

  <rect x="20" y="20" width="210" height="32" fill="#0f172a" opacity="0.85" rx="4"/>
  <text x="30" y="41" fill="#f97316" font-family="monospace" font-size="13" font-weight="bold">AFTER: 10 MAY 2026</text>
  <text x="20" y="575" fill="#22c55e" font-family="monospace" font-size="11">CURRENT SENTINEL-2 IMAGERY (TARGET DETECTED)</text>
</svg>`;
}

function createChangeMask() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="800" height="600">
  <rect width="800" height="600" fill="#050811"/>
  <path d="M0 100 H800 M0 200 H800 M0 300 H800 M0 400 H800 M0 500 H800 M100 0 V600 M200 0 V600 M300 0 V600 M400 0 V600 M500 0 V600 M600 0 V600 M700 0 V600" stroke="rgba(255, 255, 255, 0.04)" stroke-width="1"/>

  <g transform="translate(320, 230)">
    <polygon points="10,20 170,0 150,150 0,170" fill="#ff0055" opacity="0.85"/>
    <polygon points="10,20 170,0 150,150 0,170" fill="none" stroke="#ff0055" stroke-width="3"/>
    
    <rect x="25" y="30" width="100" height="60" fill="#ffcc00" opacity="0.9"/>
    <rect x="90" y="100" width="60" height="40" fill="#ffcc00" opacity="0.9"/>

    <path d="M -10 -10 L 190 -10 L 170 190 L -10 190 Z" fill="none" stroke="#ff0055" stroke-width="1" stroke-dasharray="4 4" opacity="0.7"/>

    <line x1="85" y1="75" x2="220" y2="-20" stroke="#00f0ff" stroke-width="1.5"/>
    <circle cx="220" cy="-20" r="3" fill="#00f0ff"/>
    <rect x="225" y="-35" width="140" height="30" fill="#0f172a" stroke="#00f0ff" stroke-width="1" rx="4"/>
    <text x="295" y="-22" fill="#00f0ff" font-family="monospace" font-size="11" font-weight="bold" text-anchor="middle">CHANGE AREA</text>
    <text x="295" y="-8" fill="#ffffff" font-family="monospace" font-size="12" font-weight="bold" text-anchor="middle">1,240 m²</text>
  </g>

  <rect x="20" y="20" width="280" height="36" fill="#1e1b4b" stroke="#6366f1" stroke-width="1" rx="4"/>
  <text x="35" y="43" fill="#a5b4fc" font-family="monospace" font-size="13" font-weight="bold">SIAMESE U-NET CHANGE MASK</text>

  <g transform="translate(560, 500)">
    <rect x="0" y="0" width="220" height="75" fill="#0f172a" stroke="#334155" stroke-width="1" rx="4"/>
    <rect x="15" y="15" width="16" height="16" fill="#ff0055"/>
    <text x="40" y="28" fill="#cbd5e1" font-family="monospace" font-size="11">New Structure (High)</text>
    <rect x="15" y="42" width="16" height="16" fill="#ffcc00"/>
    <text x="40" y="55" fill="#cbd5e1" font-family="monospace" font-size="11">Ground Modification</text>
  </g>
</svg>`;
}

const files = {
  'scene_001.jpg': createScene1(),
  'scene_002.jpg': createScene2(),
  'scene_003.jpg': createScene3(),
  'before.jpg': createBefore(),
  'after.jpg': createAfter(),
  'change-mask.jpg': createChangeMask()
};

for (const [filename, content] of Object.entries(files)) {
  const filePath = path.join(imgDir, filename);
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Created ${filePath}`);
}
