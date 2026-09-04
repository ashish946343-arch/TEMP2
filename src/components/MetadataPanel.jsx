import React from 'react';
import { Database, FileText, Globe, Layers, MapPin, Radio } from 'lucide-react';

export default function MetadataPanel({ metadata }) {
  const items = [
    { label: "Image ID", value: metadata.image_id, icon: FileText },
    { label: "Acquisition Date", value: "10 May 2026", icon: Database },
    { label: "Sensor", value: metadata.sensor, icon: Layers },
    { label: "Coordinates", value: "30.7046° N, 76.7179° E", icon: MapPin },
    { label: "Coordinate Ref (CRS)", value: metadata.crs, icon: Globe },
    { label: "Spatial Resolution", value: metadata.resolution, icon: Radio },
    { label: "Archive Source", value: metadata.source, icon: Database },
  ];

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-4 font-mono space-y-3">
      <div className="flex items-center space-x-2 border-b border-slate-800 pb-2">
        <FileText className="w-4 h-4 text-cyan-400" />
        <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">
          IMAGE INFORMATION &amp; METADATA
        </span>
      </div>

      <div className="divide-y divide-slate-800/80 text-xs">
        {items.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={idx} className="py-2 flex items-center justify-between">
              <span className="text-slate-400 flex items-center gap-1.5">
                <Icon className="w-3.5 h-3.5 text-slate-500" />
                {item.label}
              </span>
              <span className="font-bold text-slate-200">{item.value}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
