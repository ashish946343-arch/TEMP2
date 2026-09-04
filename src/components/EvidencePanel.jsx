import React from 'react';
import { ShieldCheck, FileCheck, CheckCircle2, MapPin } from 'lucide-react';

export default function EvidencePanel({ changeData }) {
  return (
    <div className="bg-[#070a12] border border-slate-800 rounded-lg p-4 font-mono space-y-3 shadow-lg">
      <div className="flex items-center space-x-2 border-b border-slate-800 pb-2">
        <FileCheck className="w-4 h-4 text-emerald-400" />
        <span className="text-xs font-extrabold text-slate-100 uppercase tracking-wider">
          DETECTION SUMMARY &amp; EVIDENCE
        </span>
      </div>

      <div className="divide-y divide-slate-800/80 text-xs">
        <div className="py-1.5 flex justify-between">
          <span className="text-slate-400">Change Type:</span>
          <span className="font-bold text-rose-400">CONSTRUCTION</span>
        </div>
        <div className="py-1.5 flex justify-between">
          <span className="text-slate-400">Confidence Score:</span>
          <span className="font-bold text-emerald-400">91% HIGH CONFIDENCE</span>
        </div>
        <div className="py-1.5 flex justify-between">
          <span className="text-slate-400">Surface Change Area:</span>
          <span className="font-bold text-cyan-400">1,240 m²</span>
        </div>
        <div className="py-1.5 flex justify-between">
          <span className="text-slate-400">Baseline Date:</span>
          <span className="font-bold text-slate-200">12 Jun 2024</span>
        </div>
        <div className="py-1.5 flex justify-between">
          <span className="text-slate-400">Target Date:</span>
          <span className="font-bold text-slate-200">10 May 2026</span>
        </div>
        <div className="py-1.5 flex justify-between">
          <span className="text-slate-400">Geographic Coordinates:</span>
          <span className="font-bold text-slate-200 flex items-center gap-1">
            <MapPin className="w-3 h-3 text-cyan-400" />
            30.7046° N, 76.7179° E
          </span>
        </div>
        <div className="py-1.5 flex justify-between">
          <span className="text-slate-400">Sensor &amp; Resolution:</span>
          <span className="font-bold text-slate-200">Sentinel-2 (10 m)</span>
        </div>
        <div className="py-1.5 flex justify-between">
          <span className="text-slate-400">Analysis Status:</span>
          <span className="font-bold text-emerald-400 bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-500/40 text-[10px]">
            COMPLETE
          </span>
        </div>
      </div>
    </div>
  );
}
