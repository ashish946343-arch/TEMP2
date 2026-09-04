import React from 'react';
import { Calendar, MapPin, Layers, ArrowRight, Crosshair } from 'lucide-react';

export default function ResultCard({ scene, isSelected, onSelect, onAnalyze }) {
  const percentage = Math.round(scene.score * 100);

  return (
    <div
      onClick={() => onSelect(scene)}
      className={`relative rounded-lg p-3.5 border transition-all cursor-pointer ${
        isSelected
          ? 'bg-[#0f172a] border-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.3)]'
          : 'bg-[#070a12]/80 border-slate-800 hover:border-slate-700 hover:bg-[#0f172a]/70'
      }`}
    >
      <div className="flex gap-3.5">
        {/* Satellite Raster Image Thumbnail */}
        <div className="relative w-28 h-28 rounded border border-slate-700 overflow-hidden bg-slate-950 flex-shrink-0">
          <img
            src={scene.thumbnail}
            alt={scene.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#070a12]/90 via-transparent to-transparent"></div>
          <span className="absolute bottom-1 right-1 text-[10px] font-mono font-bold bg-[#070a12]/90 text-cyan-400 px-1.5 py-0.5 rounded border border-slate-800">
            {scene.resolution}
          </span>
        </div>

        {/* Scene Info */}
        <div className="flex-1 min-w-0 font-mono text-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              {scene.image_id.toUpperCase()}
            </span>
            <div className="flex items-center space-x-1 text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/40">
              <span className="font-extrabold">{percentage}%</span>
              <span className="text-[10px] text-emerald-400">REL</span>
            </div>
          </div>

          <h3 className="text-sm font-extrabold text-slate-100 truncate">
            {scene.title}
          </h3>

          <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[11px] text-slate-400 pt-1 border-t border-slate-800/80">
            <div className="flex items-center space-x-1">
              <MapPin className="w-3 h-3 text-cyan-400 flex-shrink-0" />
              <span className="truncate">{scene.location.lat.toFixed(4)}, {scene.location.lng.toFixed(4)}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Calendar className="w-3 h-3 text-slate-500 flex-shrink-0" />
              <span>{scene.date}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Layers className="w-3 h-3 text-slate-500 flex-shrink-0" />
              <span>{scene.sensor}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Crosshair className="w-3 h-3 text-cyan-400 flex-shrink-0" />
              <span>{scene.resolution}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="mt-3 pt-2.5 border-t border-slate-800/90 flex items-center justify-between">
        <span className="text-[11px] font-mono text-slate-400">
          {isSelected ? "● SELECTED ON MAP" : "Click to select on map"}
        </span>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onAnalyze(scene);
          }}
          className="px-3.5 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white font-mono font-bold text-xs rounded transition flex items-center space-x-1.5 shadow-[0_0_10px_rgba(6,182,212,0.3)]"
        >
          <span>ANALYZE</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
