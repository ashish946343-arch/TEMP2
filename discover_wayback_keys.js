import https from 'https';

const url = "https://wayback.maptiles.arcgis.com/arcgis/rest/services/World_Imagery/MapServer?f=json";

https.get(url, (res) => {
  let body = '';
  res.on('data', c => body += c);
  res.on('end', () => {
    try {
      const data = JSON.parse(body);
      console.log("Wayback Service Name:", data.name || data.serviceDescription || "OK");
      if (data.layers) console.log("Layers:", data.layers.slice(0, 5));
    } catch (e) {
      console.log("Raw response start:", body.substring(0, 300));
    }
  });
});
