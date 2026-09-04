import React, { useState } from 'react';
import { Search, Upload, Filter, Sparkles, Image as ImageIcon, Check } from 'lucide-react';
import { routeQuery } from '../router/queryRouter';

export default function SearchBar({ onSearch, isLoading }) {
  const [query, setQuery] = useState('Find newly built structures near water');
  const [filters, setFilters] = useState({ date: 'ANY', sensor: 'Sentinel-2', aoi: 'ALL' });
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const activeRoute = routeQuery(query);

  const quickQueries = [
    "Find newly built structures near water",
    "Find similar locations",
    "What changed here?"
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query, filters, selectedImage);
    }
  };

  const handleQuickQuery = (q) => {
    setQuery(q);
    onSearch(q, filters, selectedImage);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(URL.createObjectURL(file));
      setQuery("Visual similarity search for uploaded image");
    }
  };

  return (
    <div className="w-full bg-slate-900/90 border border-slate-800 rounded-lg p-4 shadow-xl">
      <form onSubmit={handleSubmit} className="space-y-4">
        
        {/* Search Bar Input */}
        <div className="relative flex items-center">
          <div className="absolute left-3.5 text-cyan-400">
            <Search className="w-5 h-5" />
          </div>

          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search satellite archive using natural language or coordinates..."
            className="w-full pl-11 pr-32 py-3 bg-slate-950 border border-slate-700 rounded-md text-slate-100 placeholder-slate-500 font-mono text-sm focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
          />

          <div className="absolute right-2 flex items-center space-x-2">
            <button
              type="button"
              onClick={() => setShowImageUpload(!showImageUpload)}
              className={`p-2 rounded font-mono text-xs flex items-center gap-1 border transition-all ${
                selectedImage 
                  ? 'bg-cyan-950 border-cyan-500 text-cyan-300' 
                  : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
              }`}
              title="Image-to-Image Search"
            >
              <Upload className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Image</span>
            </button>

            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-mono font-bold text-xs uppercase rounded transition-all flex items-center gap-1.5 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Searching...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Search</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Quick Queries & Router Badge */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-slate-500">Quick Queries:</span>
            {quickQueries.map((q, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleQuickQuery(q)}
                className={`px-2.5 py-1 rounded border transition-all ${
                  query === q
                    ? 'bg-slate-800 border-cyan-500/60 text-cyan-300'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                }`}
              >
                [{q}]
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-500">Query Mode:</span>
            <span className="px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-500/30 text-cyan-400 text-[11px]">
              {activeRoute}
            </span>
          </div>
        </div>

        {/* Image Upload Drawer */}
        {showImageUpload && (
          <div className="p-3 bg-slate-950 border border-slate-800 rounded flex items-center justify-between gap-4 font-mono text-xs">
            <div className="flex items-center space-x-3">
              <ImageIcon className="w-5 h-5 text-cyan-400" />
              <div>
                <div className="text-slate-200 font-semibold">IMAGE-TO-IMAGE SEARCH</div>
                <div className="text-slate-400">Upload satellite tile to retrieve visually similar scenes</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {selectedImage && (
                <div className="flex items-center space-x-2 text-emerald-400 bg-emerald-950/40 px-2 py-1 rounded border border-emerald-500/30">
                  <Check className="w-3.5 h-3.5" />
                  <span>Image Loaded</span>
                </div>
              )}
              <label className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 rounded cursor-pointer transition">
                <span>Select Image</span>
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>
            </div>
          </div>
        )}

        {/* Filters Bar */}
        <div className="flex flex-wrap items-center gap-4 pt-2 border-t border-slate-800/60 text-xs font-mono">
          <div className="flex items-center space-x-1.5 text-slate-400">
            <Filter className="w-3.5 h-3.5 text-slate-500" />
            <span>Filters:</span>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-slate-500">Date:</span>
            <select
              value={filters.date}
              onChange={(e) => setFilters({ ...filters, date: e.target.value })}
              className="bg-slate-950 border border-slate-800 text-slate-300 rounded px-2 py-1 focus:outline-none focus:border-cyan-500"
            >
              <option value="ANY">Any Date</option>
              <option value="2026">2026 Archive</option>
              <option value="2025">2025 Archive</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-slate-500">Sensor:</span>
            <select
              value={filters.sensor}
              onChange={(e) => setFilters({ ...filters, sensor: e.target.value })}
              className="bg-slate-950 border border-slate-800 text-slate-300 rounded px-2 py-1 focus:outline-none focus:border-cyan-500"
            >
              <option value="Sentinel-2">Sentinel-2</option>
              <option value="ALL">All Sensors</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-slate-500">AOI:</span>
            <select
              value={filters.aoi}
              onChange={(e) => setFilters({ ...filters, aoi: e.target.value })}
              className="bg-slate-950 border border-slate-800 text-slate-300 rounded px-2 py-1 focus:outline-none focus:border-cyan-500"
            >
              <option value="ALL">All Regions</option>
              <option value="NORTH">Sector North</option>
            </select>
          </div>
        </div>

      </form>
    </div>
  );
}
