import React from 'react';
import { Search, Database, MapPin, GitCompare, Eye, FileCheck, CheckCircle2 } from 'lucide-react';

export default function Workflow({ activeStage = 'RELEVANT SCENE' }) {
  const stages = [
    { id: 'QUERY', label: 'QUERY', icon: Search },
    { id: 'SEMANTIC SEARCH', label: 'SEMANTIC SEARCH', icon: Database },
    { id: 'RELEVANT SCENE', label: 'RELEVANT SCENE', icon: MapPin },
    { id: 'TEMPORAL COMPARISON', label: 'TEMPORAL COMPARISON', icon: GitCompare },
    { id: 'CHANGE DETECTION', label: 'CHANGE DETECTION', icon: Eye },
    { id: 'EVIDENCE', label: 'EVIDENCE', icon: FileCheck },
    { id: 'FINAL RESULT', label: 'FINAL RESULT', icon: CheckCircle2 }
  ];

  const getStageStatus = (stageId) => {
    const order = ['QUERY', 'SEMANTIC SEARCH', 'RELEVANT SCENE', 'TEMPORAL COMPARISON', 'CHANGE DETECTION', 'EVIDENCE', 'FINAL RESULT'];
    const activeIndex = order.indexOf(activeStage);
    const currentIndex = order.indexOf(stageId);

    if (currentIndex < activeIndex) return 'completed';
    if (currentIndex === activeIndex) return 'active';
    return 'upcoming';
  };

  return (
    <div className="w-full bg-[#070a12] border-y border-slate-800 py-2.5 px-4 overflow-x-auto">
      <div className="max-w-7xl mx-auto flex items-center justify-between min-w-[800px] gap-2">
        {stages.map((stage, idx) => {
          const Icon = stage.icon;
          const status = getStageStatus(stage.id);

          let style = "bg-slate-950 border-slate-800 text-slate-500";
          if (status === 'active') {
            style = "bg-cyan-950/90 border-cyan-500/60 text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.3)] animate-pulse font-bold";
          } else if (status === 'completed') {
            style = "bg-slate-900 border-emerald-500/40 text-emerald-400 font-bold";
          }

          return (
            <React.Fragment key={stage.id}>
              <div className={`flex items-center space-x-1.5 px-3 py-1.5 rounded border text-[11px] font-mono tracking-wide transition-all ${style}`}>
                <Icon className="w-3.5 h-3.5" />
                <span className="whitespace-nowrap">{stage.label}</span>
              </div>
              {idx < stages.length - 1 && (
                <span className="text-slate-700 text-xs font-mono">↓</span>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
