import fs from 'fs';
import path from 'path';
import https from 'https';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function latLngToTile(lat, lng, zoom) {
  const n = Math.pow(2, zoom);
  const x = Math.floor(((lng + 180) / 360) * n);
  const latRad = (lat * Math.PI) / 180;
  const y = Math.floor(((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2) * n);
  return { x, y, zoom };
}

// 1. Visakhapatnam Port (17.6868, 83.2185)
const vizag = latLngToTile(17.6868, 83.2185, 16);
console.log("Visakhapatnam Tile Coords:", vizag);

// 2. Bangalore IT Corridor (12.9352, 77.6946)
const blr = latLngToTile(12.9352, 77.6946, 16);
console.log("Bangalore Tile Coords:", blr);

// 3. New Delhi Aerocity (28.5562, 77.1000)
const delhi = latLngToTile(28.5562, 77.1000, 16);
console.log("Delhi Tile Coords:", delhi);

// 4. Chandigarh (30.7046, 76.7179)
const chd = latLngToTile(30.7046, 76.7179, 16);
console.log("Chandigarh Tile Coords:", chd);
