import https from 'https';

// Esri Wayback Historical Releases (e.g. 2014 vs 2024)
const waybackUrls = [
  "https://wayback.maptiles.arcgis.com/arcgis/rest/services/World_Imagery/WMTS/1.0.0/default/default/GoogleMapsCompatible/16/26889/46734",
  "https://wayback.maptiles.arcgis.com/arcgis/rest/services/WB_2014_R01/MapServer/tile/16/26889/46734",
  "https://wayback.maptiles.arcgis.com/arcgis/rest/services/WB_2018_R01/MapServer/tile/16/26889/46734",
  "https://wayback.maptiles.arcgis.com/arcgis/rest/services/WB_2021_R01/MapServer/tile/16/26889/46734",
  "https://wayback.maptiles.arcgis.com/arcgis/rest/services/WB_2014_R01/MapServer/tile/16/26889/46734"
];

waybackUrls.forEach(url => {
  https.get(url, (res) => {
    console.log(`${res.statusCode} : ${url}`);
  });
});
