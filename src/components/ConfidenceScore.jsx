import React from 'react';
import { ShieldCheck, Activity } from 'lucide-react';

export default function ConfidenceScore({ confidence = 0.91 }) {
  const percentage = Math.round(confidence * 100);

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-4 font-mono space-y-3">
      {/* Title */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <div className="flex items-center space-x-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">
            CONFIDENCE EVALUATION
          </span>
        </div>
        <span className="text-[11px] text-emerald-400 font-bold">HIGH VERIFIED</span>
      </div>

      {/* Main Score Display */}
      <div className="flex items-end justify-between">
        <div>
          <div className="text-[10px] text-slate-500 uppercase tracking-wider">Model Confidence Score</div>
          <div className="text-3xl font-extrabold text-emerald-400 tracking-tight flex items-baseline gap-1">
            {percentage}%
            <span className="text-xs font-normal text-slate-400">/ 100%</span>
          </div>
        </div>

        <div className="text-right">
          <div className="px-2.5 py-1 bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 font-bold text-xs rounded inline-block">
            HIGH CONFIDENCE
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-800 p-0.5">
        <div
          className="bg-gradient-to-r from-emerald-500 to-cyan-400 h-full rounded-full transition-all duration-700 shadow-[0_0_10px_#10b981]"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>

      {/* Sub-Metrics Breakdown */}
      <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-400 pt-1">
        <div className="flex justify-between bg-slate-950 p-2 rounded border border-slate-800/60">
          <span>False Positive Risk:</span>
          <span className="text-emerald-400 font-bold">&lt; 3.2%</span>
        </div>
        <div className="flex justify-between bg-slate-950 p-2 rounded border border-slate-800/60">
          <span>Alignment Error:</span>
          <span className="text-emerald-400 font-bold">&lt; 0.4 px</span>
        </div>
      </div>
    </div>
  );
}
