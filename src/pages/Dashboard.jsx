import React from 'react';
import SearchBar from '../components/SearchBar';
import SearchResults from '../components/SearchResults';
import MapView from '../components/MapView';

export default function Dashboard({
  results,
  selectedScene,
  onSelectScene,
  onAnalyzeScene,
  onSearch,
  isLoading,
  error
}) {
  return (
    <div className="space-y-6">
      {/* Search Input Section */}
      <SearchBar onSearch={onSearch} isLoading={isLoading} />

      {/* Main Grid Layout: Results Sidebar + Leaflet Map */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side: Search Results (4 cols) */}
        <div className="lg:col-span-4">
          <SearchResults
            results={results}
            selectedScene={selectedScene}
            onSelectScene={onSelectScene}
            onAnalyzeScene={onAnalyzeScene}
            isLoading={isLoading}
            error={error}
          />
        </div>

        {/* Right Side: Map View (8 cols) */}
        <div className="lg:col-span-8">
          <MapView
            results={results}
            selectedScene={selectedScene}
            onSelectScene={onSelectScene}
            onAnalyzeScene={onAnalyzeScene}
          />
        </div>

      </div>
    </div>
  );
}
