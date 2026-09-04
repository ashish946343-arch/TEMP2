import https from 'https';

const testUrls = [
  "https://wayback.maptiles.arcgis.com/arcgis/rest/services/World_Imagery/MapServer/tile/16/26889/46734",
  "https://wayback.maptiles.arcgis.com/arcgis/rest/services/World_Imagery/MapServer/tile/16/26889/46734",
  "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/16/26889/46734",
  "https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/16/26889/46734",
  "https://server.arcgisonline.com/ArcGIS/rest/services/World-[#2014]/MapServer/tile/16/26889/46734"
];

testUrls.forEach(url => {
  https.get(url, res => {
    console.log(`${res.statusCode} : ${url}`);
  });
});
