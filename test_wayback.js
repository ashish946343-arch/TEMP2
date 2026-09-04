import https from 'https';

// ArcGIS Wayback Tile Services: Historical Satellite Imagery (2014 vs 2024/2026)
// Release IDs for Wayback:
// 2014-02-19 release: WB_2014_R01
// Current release: World_Imagery

const wayback2014Url = "https://wayback.maptiles.arcgis.com/arcgis/rest/services/World_Imagery/WMTS/1.0.0/default/default/GoogleMapsCompatible/16/26889/46734";
const currentUrl = "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/16/26889/46734";

function checkUrl(url) {
  return new Promise((resolve) => {
    https.get(url, (res) => {
      console.log(`Status ${res.statusCode} for ${url}`);
      resolve(res.statusCode);
    });
  });
}

async function test() {
  await checkUrl(wayback2014Url);
  await checkUrl(currentUrl);
}

test();
