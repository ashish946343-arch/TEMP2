import React from 'react';
import { CheckCircle2, GitBranch } from 'lucide-react';

export default function Provenance() {
  const steps = [
    { name: "Sentinel-2 Data", desc: "Multi-temporal L2A surface reflectance tiles" },
    { name: "Preprocessing", desc: "Cloud masking, band alignment & tiling" },
    { name: "Semantic Retrieval", desc: "Text embedding & FAISS vector search match" },
    { name: "Relevant Location", desc: "Ranked coordinate target candidate selection" },
    { name: "Temporal Comparison", desc: "Pairwise image alignment (2024 vs 2026)" },
    { name: "Change Detection", desc: "Siamese U-Net segmentation mask generated" },
    { name: "Confidence Estimation", desc: "Bayesian uncertainty evaluation (91%)" },
    { name: "Evidence Generated", desc: "Verified provenance audit trail completed" },
  ];

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-4 font-mono space-y-3">
      <div className="flex items-center space-x-2 border-b border-slate-800 pb-2">
        <GitBranch className="w-4 h-4 text-emerald-400" />
        <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">
          PROCESSING &amp; PROVENANCE AUDIT LOG
        </span>
      </div>

      <div className="space-y-2 relative pl-3 border-l border-emerald-500/30">
        {steps.map((step, idx) => (
          <div key={idx} className="relative flex items-start space-x-2 text-xs">
            <div className="absolute -left-[17px] top-0.5 bg-slate-950 text-emerald-400 rounded-full">
              <CheckCircle2 className="w-3.5 h-3.5 fill-emerald-950" />
            </div>
            <div>
              <span className="font-bold text-slate-200">{step.name}</span>
              <span className="text-slate-500 text-[11px] block">{step.desc}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
