import React from 'react';
import ResultCard from './ResultCard';
import { Layers, Loader2, AlertCircle } from 'lucide-react';

export default function SearchResults({ results, selectedScene, onSelectScene, onAnalyzeScene, isLoading, error }) {
  if (isLoading) {
    return (
      <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-6 font-mono text-center space-y-3">
        <Loader2 className="w-8 h-8 text-cyan-400 animate-spin mx-auto" />
        <div className="text-sm font-bold text-slate-200 uppercase tracking-wider">
          SEARCHING SATELLITE ARCHIVE...
        </div>
        <p className="text-xs text-slate-500">
          Embedding query &amp; querying index across Sentinel-2 scenes
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-rose-950/40 border border-rose-800/60 rounded-lg p-6 font-mono text-center space-y-2">
        <AlertCircle className="w-8 h-8 text-rose-400 mx-auto" />
        <div className="text-sm font-bold text-rose-300">Analysis could not be completed</div>
        <p className="text-xs text-slate-400">Please try again or change search parameters.</p>
      </div>
    );
  }

  if (!results || results.length === 0) {
    return (
      <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-6 font-mono text-center space-y-2">
        <Layers className="w-8 h-8 text-slate-600 mx-auto" />
        <div className="text-sm font-bold text-slate-400">No relevant satellite scenes found.</div>
        <p className="text-xs text-slate-500">Try changing your query or filters.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between font-mono text-xs text-slate-400 px-1">
        <div className="flex items-center space-x-2">
          <span className="font-bold text-slate-200">SEARCH RESULTS</span>
          <span className="bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded text-[11px]">
            {results.length} SCENES
          </span>
        </div>
        <span className="text-emerald-400 text-[11px]">LATENCY: ~42ms</span>
      </div>

      {/* Result Cards List */}
      <div className="space-y-3 overflow-y-auto max-h-[580px] pr-1">
        {results.map((scene) => (
          <ResultCard
            key={scene.image_id}
            scene={scene}
            isSelected={selectedScene?.image_id === scene.image_id}
            onSelect={onSelectScene}
            onAnalyze={onAnalyzeScene}
          />
        ))}
      </div>
    </div>
  );
}
