import React from 'react';
import { Radio, RotateCcw } from 'lucide-react';

export default function Header({ currentView, setCurrentView, onTriggerDemoMode }) {
  return (
    <header className="border-b border-slate-800 bg-[#070a12] backdrop-blur sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Title */}
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setCurrentView('dashboard')}>
          <div className="p-2 bg-cyan-950/90 border border-cyan-500/50 rounded text-cyan-400">
            <Radio className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-mono font-extrabold tracking-widest text-slate-100 uppercase">
                SATELLITE INTELLIGENCE
              </h1>
              <span className="bg-slate-900 text-slate-400 text-[10px] px-2 py-0.5 rounded font-mono border border-slate-700">
                WORKSTATION
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-mono">
              Semantic Retrieval · Multi-Temporal Change Analysis
            </p>
          </div>
        </div>

        {/* Nav Controls */}
        <div className="flex items-center space-x-3 font-mono text-xs">
          
          <button
            onClick={() => setCurrentView('dashboard')}
            className={`px-3 py-1.5 rounded border text-xs font-bold tracking-wide transition ${
              currentView === 'dashboard'
                ? 'bg-cyan-950/80 border-cyan-500/50 text-cyan-300'
                : 'bg-transparent border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
            }`}
          >
            SEARCH
          </button>

          <button
            onClick={onTriggerDemoMode}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold tracking-wide border border-slate-700 transition"
            title="Reset to primary scenario"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>RESET</span>
          </button>

        </div>

      </div>
    </header>
  );
}
