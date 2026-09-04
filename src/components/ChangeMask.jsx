import React from 'react';
import { Target } from 'lucide-react';

export default function ChangeMask({ changeData }) {
  return (
    <div className="bg-[#070a12] border border-slate-800 rounded-lg p-4 font-mono space-y-3 shadow-lg">
      {/* Title Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <div>
          <div className="flex items-center space-x-2">
            <Target className="w-4 h-4 text-rose-500 animate-pulse" />
            <h3 className="text-xs font-extrabold text-slate-100 uppercase tracking-wider">
              CHANGE MASK
            </h3>
          </div>
          <p className="text-[11px] text-slate-400">Detected construction region</p>
        </div>
        <span className="text-[10px] text-slate-400 bg-slate-900 border border-slate-800 px-2 py-0.5 rounded font-bold">
          SIAMESE U-NET
        </span>
      </div>

      {/* Mask Preview Image */}
      <div className="relative aspect-[4/3] bg-slate-950 rounded border border-slate-800 overflow-hidden">
        <img
          src={changeData.change_mask}
          alt="Detected Change Mask"
          className="w-full h-full object-cover"
          onError={(e) => { e.target.style.display = 'none'; }}
        />
        
        <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[11px]">
          <span className="bg-rose-950/90 border border-rose-500/60 text-rose-300 px-2 py-0.5 rounded font-bold">
            TYPE: CONSTRUCTION
          </span>
          <span className="bg-[#070a12]/90 border border-cyan-500/50 text-cyan-300 px-2 py-0.5 rounded font-bold">
            AREA: 1,240 m²
          </span>
        </div>
      </div>

      {/* Mask Legend */}
      <div className="flex items-center justify-around bg-slate-950 p-2 rounded border border-slate-800 text-[11px]">
        <div className="flex items-center space-x-2">
          <span className="w-3 h-3 bg-[#080d19] border border-slate-700 rounded-sm"></span>
          <span className="text-slate-400 font-bold">UNCHANGED</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="w-3 h-3 bg-rose-500 rounded-sm ring-2 ring-rose-500/30"></span>
          <span className="text-rose-400 font-bold">CHANGED AREA</span>
        </div>
      </div>
    </div>
  );
}
