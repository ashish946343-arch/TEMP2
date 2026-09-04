import React from 'react';
import BeforeAfter from '../components/BeforeAfter';
import ChangeMask from '../components/ChangeMask';
import ConfidenceScore from '../components/ConfidenceScore';
import MetadataPanel from '../components/MetadataPanel';
import EvidencePanel from '../components/EvidencePanel';
import Provenance from '../components/Provenance';
import { ArrowLeft, AlertTriangle } from 'lucide-react';

export default function Analysis({ scene, changeData, onBack, isLoading, error }) {
  if (isLoading) {
    return (
      <div className="bg-[#070a12] border border-slate-800 rounded-lg p-12 text-center font-mono space-y-4 my-8 shadow-2xl">
        <div className="w-10 h-10 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <div className="text-base font-bold text-slate-200 uppercase tracking-wider">
          RUNNING TEMPORAL CHANGE DETECTION...
        </div>
        <p className="text-xs text-slate-400">
          Comparing baseline 2024 Sentinel-2 tile against 2026 imagery
        </p>
      </div>
    );
  }

  if (error || !changeData) {
    return (
      <div className="bg-rose-950/40 border border-rose-800 rounded-lg p-8 font-mono text-center space-y-4 my-8">
        <AlertTriangle className="w-10 h-10 text-rose-400 mx-auto" />
        <div className="text-lg font-bold text-rose-300">Analysis could not be completed</div>
        <p className="text-xs text-slate-400">Please try selecting another scene or returning to search.</p>
        <button
          onClick={onBack}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs uppercase font-bold"
        >
          Back to Search
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 font-mono">
      
      {/* Navigation & Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <button
            onClick={onBack}
            className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded bg-[#070a12] hover:bg-slate-800 border border-slate-700 text-cyan-400 text-xs font-bold transition mb-2 shadow"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>← BACK TO SEARCH</span>
          </button>

          <div className="flex items-center space-x-3">
            <h2 className="text-xl font-extrabold text-slate-100 uppercase tracking-wider">
              TEMPORAL CHANGE ANALYSIS
            </h2>
            <span className="bg-cyan-950 text-cyan-400 border border-cyan-500/40 text-xs px-2.5 py-0.5 rounded font-bold">
              {scene?.image_id ? scene.image_id.toUpperCase() : "SCENE_001"}
            </span>
          </div>
        </div>

        {/* Highlighted Result summary badge */}
        <div className="bg-[#070a12] border border-slate-800 p-3 rounded-lg flex items-center space-x-4 shadow-lg">
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-bold block">CHANGE DETECTED</span>
            <span className="text-sm font-extrabold text-rose-400">CONSTRUCTION</span>
          </div>
          <div className="h-8 w-px bg-slate-800"></div>
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-bold block">CONFIDENCE</span>
            <span className="text-sm font-extrabold text-emerald-400">91%</span>
          </div>
          <div className="h-8 w-px bg-slate-800"></div>
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-bold block">CHANGE AREA</span>
            <span className="text-sm font-extrabold text-cyan-400">1,240 m²</span>
          </div>
        </div>
      </div>

      {/* Main Analysis Section: Side-by-side Comparison */}
      <BeforeAfter beforeData={changeData.before} afterData={changeData.after} />

      {/* Grid: Evidence Panel, Change Mask, Confidence, Metadata */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <EvidencePanel changeData={changeData} />
        <ChangeMask changeData={changeData} />
        <ConfidenceScore confidence={changeData.confidence} />
        <MetadataPanel metadata={changeData.metadata} />
      </div>

      {/* Processing Provenance Audit Trail */}
      <Provenance />

    </div>
  );
}
