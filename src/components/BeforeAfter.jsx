import React, { useState } from 'react';
import { Calendar, Layers, Sliders } from 'lucide-react';

export default function BeforeAfter({ beforeData, afterData }) {
  const [sliderPos, setSliderPos] = useState(50);
  const [mode, setMode] = useState('side-by-side');

  return (
    <div className="space-y-3 font-mono">
      {/* Mode Switcher Header */}
      <div className="flex items-center justify-between bg-[#070a12] p-3 rounded border border-slate-800 text-xs">
        <div className="flex items-center space-x-2 text-slate-200">
          <Layers className="w-4 h-4 text-cyan-400" />
          <span className="font-bold uppercase tracking-wider">TEMPORAL SATELLITE COMPARISON</span>
        </div>

        <div className="flex items-center space-x-1 bg-slate-950 p-1 rounded border border-slate-800 text-[11px]">
          <button
            onClick={() => setMode('side-by-side')}
            className={`px-3 py-1 rounded transition font-bold ${
              mode === 'side-by-side'
                ? 'bg-cyan-950 text-cyan-400 border border-cyan-500/50 shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Side-By-Side
          </button>
          <button
            onClick={() => setMode('slider')}
            className={`px-3 py-1 rounded transition font-bold ${
              mode === 'slider'
                ? 'bg-cyan-950 text-cyan-400 border border-cyan-500/50 shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Interactive Swipe
          </button>
        </div>
      </div>

      {/* Side-By-Side Mode */}
      {mode === 'side-by-side' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* BEFORE IMAGE */}
          <div className="relative bg-[#070a12] border border-slate-800 rounded-lg overflow-hidden group">
            <div className="absolute top-3 left-3 z-10 bg-[#070a12]/90 border border-sky-500/40 px-3 py-1.5 rounded text-xs text-sky-400 flex items-center space-x-2 shadow-lg">
              <Calendar className="w-3.5 h-3.5" />
              <span className="font-bold">BEFORE: 12 JUN 2024</span>
            </div>
            
            <div className="relative aspect-[4/3] bg-slate-950">
              <img
                src={beforeData.image}
                alt="Baseline Satellite Imagery"
                className="w-full h-full object-cover"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            </div>

            <div className="p-3 bg-[#070a12] border-t border-slate-800 text-[11px] text-slate-400 flex justify-between font-bold">
              <span>Sentinel-2 Baseline Imagery</span>
              <span>10 m Resolution</span>
            </div>
          </div>

          {/* AFTER IMAGE */}
          <div className="relative bg-[#070a12] border border-slate-800 rounded-lg overflow-hidden group">
            <div className="absolute top-3 left-3 z-10 bg-[#070a12]/90 border border-orange-500/50 px-3 py-1.5 rounded text-xs text-orange-400 flex items-center space-x-2 shadow-lg">
              <Calendar className="w-3.5 h-3.5" />
              <span className="font-bold">AFTER: 10 MAY 2026</span>
            </div>

            <div className="relative aspect-[4/3] bg-slate-950">
              <img
                src={afterData.image}
                alt="Current Satellite Imagery"
                className="w-full h-full object-cover"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            </div>

            <div className="p-3 bg-[#070a12] border-t border-slate-800 text-[11px] text-slate-400 flex justify-between font-bold">
              <span className="text-orange-400 font-extrabold">NEW STRUCTURE DETECTED</span>
              <span>10 m Resolution</span>
            </div>
          </div>
        </div>
      )}

      {/* Interactive Swipe Slider Mode */}
      {mode === 'slider' && (
        <div className="relative aspect-[16/10] max-h-[480px] w-full bg-slate-950 rounded-lg overflow-hidden border border-slate-800 select-none shadow-2xl">
          <img
            src={afterData.image}
            alt="Current Satellite Imagery"
            className="absolute inset-0 w-full h-full object-cover"
            onError={(e) => { e.target.style.display = 'none'; }}
          />

          <div
            className="absolute inset-0 overflow-hidden"
            style={{ width: `${sliderPos}%` }}
          >
            <img
              src={beforeData.image}
              alt="Baseline Satellite Imagery"
              className="absolute inset-0 w-full h-full object-cover max-w-none"
              style={{ width: '100%', height: '100%' }}
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          </div>

          <div
            className="absolute top-0 bottom-0 w-1 bg-cyan-400 shadow-[0_0_15px_#00f0ff] cursor-ew-resize z-20"
            style={{ left: `${sliderPos}%` }}
          >
            <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-[#070a12] border-2 border-cyan-400 text-cyan-400 flex items-center justify-center text-xs font-bold shadow-xl">
              ↔
            </div>
          </div>

          <input
            type="range"
            min="0"
            max="100"
            value={sliderPos}
            onChange={(e) => setSliderPos(Number(e.target.value))}
            className="absolute inset-0 opacity-0 cursor-ew-resize w-full h-full z-30"
          />

          <div className="absolute top-3 left-3 z-10 bg-[#070a12]/90 border border-sky-500/40 px-3 py-1 rounded text-xs text-sky-400 font-bold">
            BEFORE (12 JUN 2024)
          </div>
          <div className="absolute top-3 right-3 z-10 bg-[#070a12]/90 border border-orange-500/50 px-3 py-1 rounded text-xs text-orange-400 font-bold">
            AFTER (10 MAY 2026)
          </div>
        </div>
      )}
    </div>
  );
}
