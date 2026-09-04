import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper to download image
function downloadImage(url, destPath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(destPath);
    https.get(url, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        return downloadImage(res.headers.location, destPath).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`Failed with status ${res.statusCode}`));
      }
      res.pipe(file);
      file.on('finish', () => file.close(resolve));
    }).on('error', reject);
  });
}

// Download real aerial construction photograph sample
const sampleUrl = "https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?w=800&q=80"; // High-res real aerial construction site
const outPath = path.join(__dirname, 'test_construction.jpg');

downloadImage(sampleUrl, outPath)
  .then(() => console.log("Successfully downloaded aerial construction image!"))
  .catch(console.error);
