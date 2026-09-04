import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Target asset directories
const oscdSourceDir = path.join(__dirname, 'oscd_data');
const oscdPublicDir = path.join(__dirname, 'public', 'demo', 'oscd');
const satelliteDir  = path.join(__dirname, 'public', 'demo', 'satellite');

if (!fs.existsSync(oscdPublicDir)) fs.mkdirSync(oscdPublicDir, { recursive: true });
if (!fs.existsSync(satelliteDir)) fs.mkdirSync(satelliteDir, { recursive: true });

async function processOSCD() {
  console.log("Checking for OSCD dataset in oscd_data/ or public/demo/oscd/...");

  const searchPath = fs.existsSync(oscdSourceDir) ? oscdSourceDir : oscdPublicDir;
  
  if (!fs.existsSync(searchPath)) {
    console.log(`
========================================================================
📁 WHERE TO PUT YOUR OSCD DATASET:

Extract your downloaded OSCD zip folder into:
d:\\project\\hhh\\oscd_data\\  (or d:\\project\\hhh\\public\\demo\\oscd\\)

Supported structure inside oscd_data:
oscd_data/
  ├── train/ or test/ or pair_folders/
  │   ├── berlin/ (or any scene folder)
  │   │   ├── imgs_1/  (Before Sentinel-2 images or RGB.tif)
  │   │   ├── imgs_2/  (After Sentinel-2 images or RGB.tif)
  │   │   └── cm/      (cm.png or change mask)
========================================================================
`);
    return;
  }

  // Scan directory for subfolders or images
  const entries = fs.readdirSync(searchPath, { withFileTypes: true });
  console.log(`Found entries in ${searchPath}:`, entries.map(e => e.name));

  // If user placed PNG/TIF files or pair folders directly
  let sceneIndex = 1;
  for (const entry of entries) {
    if (entry.isDirectory()) {
      const sceneDir = path.join(searchPath, entry.name);
      console.log(`Processing OSCD scene folder: ${entry.name}...`);

      const imgs1 = path.join(sceneDir, 'imgs_1');
      const imgs2 = path.join(sceneDir, 'imgs_2');
      const cm    = path.join(sceneDir, 'cm');

      // Check for Before / After / Mask files
      let bPath = findImageFile(imgs1) || findImageFile(sceneDir, 'before');
      let aPath = findImageFile(imgs2) || findImageFile(sceneDir, 'after');
      let mPath = findImageFile(cm)    || findImageFile(sceneDir, 'cm') || findImageFile(sceneDir, 'mask');

      if (bPath && aPath) {
        console.log(`Converting ${entry.name} to scene_00${sceneIndex}.png...`);
        await convertToPng(bPath, path.join(satelliteDir, `before_00${sceneIndex}.png`));
        await convertToPng(aPath, path.join(satelliteDir, `after_00${sceneIndex}.png`));
        await convertToPng(aPath, path.join(satelliteDir, `scene_00${sceneIndex}.png`));

        if (mPath) {
          await convertToPng(mPath, path.join(satelliteDir, `change_mask_00${sceneIndex}.png`));
        }
        sceneIndex++;
      }
    }
  }

  console.log("OSCD Dataset Processing Complete!");
}

function findImageFile(dirPath, key = '') {
  if (!fs.existsSync(dirPath)) return null;
  const files = fs.readdirSync(dirPath);
  for (const f of files) {
    if (f.endsWith('.png') || f.endsWith('.jpg') || f.endsWith('.tif') || f.endsWith('.tiff')) {
      if (!key || f.toLowerCase().includes(key.toLowerCase())) {
        return path.join(dirPath, f);
      }
    }
  }
  return null;
}

async function convertToPng(srcPath, destPath) {
  try {
    await sharp(srcPath)
      .resize(768, 512, { fit: 'cover' })
      .png()
      .toFile(destPath);
    console.log(`Saved ${destPath}`);
  } catch (err) {
    console.error(`Failed to convert ${srcPath}:`, err.message);
  }
}

processOSCD().catch(console.error);
