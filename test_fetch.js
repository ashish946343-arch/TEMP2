import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const outDir = path.join(__dirname, 'public', 'demo', 'satellite');

// Helper to download image via HTTPS
function downloadFile(url, destPath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(destPath);
    https.get(url, (response) => {
      if (response.statusCode === 200) {
        response.pipe(file);
        file.on('finish', () => {
          file.close(resolve);
        });
      } else {
        file.close();
        fs.unlink(destPath, () => {});
        reject(new Error(`Server returned status code ${response.statusCode}`));
      }
    }).on('error', (err) => {
      fs.unlink(destPath, () => {});
      reject(err);
    });
  });
}

// Test fetching real satellite tile for Chandigarh (30.7046, 76.7179)
const tileUrl = "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/15/14352/23366";
const testPath = path.join(outDir, 'test_tile.jpg');

console.log("Testing fetch from ArcGIS World Imagery...");
downloadFile(tileUrl, testPath)
  .then(() => console.log("Successfully fetched real satellite tile!"))
  .catch((err) => console.error("Fetch failed:", err));
