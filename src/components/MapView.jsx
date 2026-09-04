import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Rectangle, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Target, Layers } from 'lucide-react';

// Custom Marker Reticles for Defence Intelligence
const createCustomMarkerIcon = (isSelected, score) => {
  const percentage = Math.round(score * 100);
  const color = isSelected ? '#00f0ff' : '#10b981';
  const size = isSelected ? 46 : 38;

  const svgHtml = `
    <div style="position: relative; width: ${size}px; height: ${size}px; display: flex; align-items: center; justify-content: center;">
      <svg width="${size}" height="${size}" viewBox="0 0 40 40">
        <circle cx="20" cy="20" r="16" fill="#070a12" stroke="${color}" stroke-width="2.5" opacity="0.95"/>
        <circle cx="20" cy="20" r="7" fill="${color}"/>
        <line x1="20" y1="0" x2="20" y2="40" stroke="${color}" stroke-width="1.2" stroke-dasharray="2 2"/>
        <line x1="0" y1="20" x2="40" y2="20" stroke="${color}" stroke-width="1.2" stroke-dasharray="2 2"/>
      </svg>
      <div style="position: absolute; bottom: -20px; left: 50%; transform: translateX(-50%); background: #070a12; color: ${color}; font-family: monospace; font-size: 10px; font-weight: bold; padding: 1px 5px; border: 1px solid ${color}; border-radius: 3px; white-space: nowrap; box-shadow: 0 0 10px rgba(0,0,0,0.8);">
        ${percentage}%
      </div>
    </div>
  `;

  return L.divIcon({
    html: svgHtml,
    className: 'custom-sat-marker',
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
};

function MapController({ selectedScene }) {
  const map = useMap();

  useEffect(() => {
    if (selectedScene?.location) {
      map.setView([selectedScene.location.lat, selectedScene.location.lng], 14, {
        animate: true,
      });
    }
  }, [selectedScene, map]);

  return null;
}

export default function MapView({ results = [], selectedScene, onSelectScene, onAnalyzeScene }) {
  const defaultCenter = selectedScene?.location
    ? [selectedScene.location.lat, selectedScene.location.lng]
    : [30.7046, 76.7179];

  // Rectangular AOI Bounds around Chandigarh Region
  const aoiBounds = [
    [30.6920, 76.7020],
    [30.7180, 76.7320]
  ];

  return (
    <div className="relative w-full h-[620px] rounded-lg overflow-hidden border border-slate-800 bg-[#070a12] shadow-2xl">
      
      {/* Top Banner: TARGET AOI Header */}
      <div className="absolute top-3 left-3 z-[1000] bg-[#070a12]/95 border border-cyan-500/50 backdrop-blur px-3.5 py-2 rounded font-mono text-xs text-slate-200 flex items-center space-x-3 shadow-xl">
        <div className="flex items-center space-x-2 text-cyan-400">
          <Target className="w-4 h-4" />
          <span className="font-extrabold tracking-wider uppercase">AOI — CHANDIGARH REGION</span>
        </div>
        <span className="text-slate-700">|</span>
        <span className="text-slate-300 font-bold">
          30.7046° N, 76.7179° E
        </span>
      </div>

      {/* Map Legend Overlay */}
      <div className="absolute bottom-3 left-3 z-[1000] bg-[#070a12]/95 border border-slate-800 backdrop-blur p-3 rounded font-mono text-[11px] text-slate-300 space-y-1.5 shadow-xl">
        <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">LEGEND</div>
        <div className="flex items-center space-x-2">
          <span className="w-3 h-3 rounded-full bg-cyan-400 ring-2 ring-cyan-500/50"></span>
          <span className="font-bold text-slate-100">SELECTED SCENE</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="w-3 h-3 rounded-full bg-emerald-400"></span>
          <span>SCENE RESULT</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="w-4 h-2.5 border border-amber-400 bg-amber-500/20 rounded-sm"></span>
          <span className="text-amber-300">AOI BOUNDARY</span>
        </div>
      </div>

      {/* Leaflet Map with REAL SATELLITE IMAGERY BASE MAP */}
      <MapContainer
        center={defaultCenter}
        zoom={14}
        scrollWheelZoom={true}
        style={{ width: '100%', height: '100%' }}
      >
        {/* Esri World Imagery (Real High-Resolution Satellite Base Layer) */}
        <TileLayer
          attribution='&copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          maxZoom={19}
        />

        <MapController selectedScene={selectedScene} />

        {/* AOI Rectangular Boundary Box */}
        <Rectangle
          bounds={aoiBounds}
          pathOptions={{
            color: '#f59e0b',
            weight: 2.5,
            dashArray: '6, 6',
            fillColor: '#f59e0b',
            fillOpacity: 0.12
          }}
        />

        {/* Scene Markers */}
        {results.map((scene) => {
          const isSelected = selectedScene?.image_id === scene.image_id;
          const markerIcon = createCustomMarkerIcon(isSelected, scene.score);

          return (
            <Marker
              key={scene.image_id}
              position={[scene.location.lat, scene.location.lng]}
              icon={markerIcon}
              eventHandlers={{
                click: () => onSelectScene(scene),
              }}
            >
              <Popup>
                <div className="font-mono text-xs space-y-2 p-1.5 min-w-[210px] bg-[#070a12] text-slate-100">
                  <div className="flex items-center justify-between border-b border-slate-700 pb-1">
                    <span className="font-bold text-cyan-400">{scene.image_id.toUpperCase()}</span>
                    <span className="text-emerald-400 font-bold">{Math.round(scene.score * 100)}% MATCH</span>
                  </div>
                  
                  <p className="text-slate-200 font-semibold">{scene.title}</p>
                  
                  <div className="text-[11px] text-slate-400 space-y-0.5 border-y border-slate-800 py-1">
                    <div>Acquisition: {scene.date}</div>
                    <div>Sensor: {scene.sensor} · {scene.resolution}</div>
                    <div>Coordinates: {scene.location.lat.toFixed(4)}° N, {scene.location.lng.toFixed(4)}° E</div>
                  </div>

                  <button
                    onClick={() => onAnalyzeScene(scene)}
                    className="w-full mt-1 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs rounded transition uppercase tracking-wider shadow"
                  >
                    ANALYZE SCENE
                  </button>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
