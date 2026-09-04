import fs from 'fs';
import path from 'path';
import https from 'https';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const outDir = path.join(__dirname, 'public', 'demo', 'satellite');

function downloadUrl(url, destPath) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } }, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        return downloadUrl(res.headers.location, destPath).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`Failed ${res.statusCode} for ${url}`));
      }
      const file = fs.createWriteStream(destPath);
      res.pipe(file);
      file.on('finish', () => file.close(resolve));
    }).on('error', reject);
  });
}

// Download real satellite photography pairs from NASA / Wikimedia Public Domain
// Real Satellite Pair 1: Real Urban Construction / Land Development (NASA Earth Observatory)
const urlBefore1 = "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Dubai_1984.jpg/800px-Dubai_1984.jpg"; // Baseline real satellite photo
const urlAfter1  = "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Dubai_2017.jpg/800px-Dubai_2017.jpg"; // Real satellite photo with built structures

async function testFetch() {
  console.log("Testing fetch of genuine real satellite photographs...");
  try {
    await downloadUrl(urlBefore1, path.join(outDir, 'test_before.jpg'));
    await downloadUrl(urlAfter1, path.join(outDir, 'test_after.jpg'));
    console.log("SUCCESS! Downloaded genuine real satellite photography pair!");
  } catch (err) {
    console.error("Fetch failed:", err);
  }
}

testFetch();
