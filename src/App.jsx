import React, { useState } from 'react';
import Header from './components/Header';
import Workflow from './components/Workflow';
import Dashboard from './pages/Dashboard';
import Analysis from './pages/Analysis';
import { searchSatelliteImages } from './services/searchApi';
import { analyzeChange } from './services/changeApi';
import { searchResults as initialMockResults } from './mock/searchData';
import { changeData as initialMockChange } from './mock/changeData';

export default function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [results, setResults] = useState(initialMockResults);
  const [selectedScene, setSelectedScene] = useState(initialMockResults[0]);
  const [changeData, setChangeData] = useState(initialMockChange);

  const [isSearching, setIsSearching] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [searchError, setSearchError] = useState(null);
  const [analysisError, setAnalysisError] = useState(null);

  // Active stage for workflow visualizer
  const activeWorkflowStage = currentView === 'analysis' ? 'EVIDENCE' : (isSearching ? 'SEMANTIC SEARCH' : 'RELEVANT SCENE');

  // Reset view to primary scenario
  const handleReset = () => {
    setCurrentView('dashboard');
    setResults(initialMockResults);
    setSelectedScene(initialMockResults[0]);
    setChangeData(initialMockChange);
  };

  // Handle Natural Language / Spatial Search
  const handleSearch = async (query, filters = {}, uploadedImage = null) => {
    setIsSearching(true);
    setSearchError(null);

    try {
      const data = await searchSatelliteImages(query, filters);
      setResults(data);
      if (data.length > 0) {
        setSelectedScene(data[0]);
      }
    } catch (err) {
      console.error("Search failed:", err);
      setSearchError("Failed to search satellite archive.");
    } finally {
      setIsSearching(false);
    }
  };

  // Handle Analyzing a specific satellite scene
  const handleAnalyzeScene = async (scene) => {
    setSelectedScene(scene);
    setIsAnalyzing(true);
    setAnalysisError(null);
    setCurrentView('analysis');

    try {
      const data = await analyzeChange(scene.image_id);
      setChangeData(data);
    } catch (err) {
      console.error("Analysis failed:", err);
      setAnalysisError("Failed to run temporal change analysis.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070a12] text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950">
      
      {/* Platform Header */}
      <Header
        currentView={currentView}
        setCurrentView={setCurrentView}
        onTriggerDemoMode={handleReset}
      />

      {/* System Workflow Pipeline Tracker */}
      <Workflow activeStage={activeWorkflowStage} />

      {/* Main Content View */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6">
        {currentView === 'dashboard' ? (
          <Dashboard
            results={results}
            selectedScene={selectedScene}
            onSelectScene={setSelectedScene}
            onAnalyzeScene={handleAnalyzeScene}
            onSearch={handleSearch}
            isLoading={isSearching}
            error={searchError}
          />
        ) : (
          <Analysis
            scene={selectedScene}
            changeData={changeData}
            onBack={() => setCurrentView('dashboard')}
            isLoading={isAnalyzing}
            error={analysisError}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-[#05070d] py-2.5 px-4 font-mono text-xs text-slate-600 flex flex-col sm:flex-row items-center justify-between gap-2 max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-2">
          <span className="text-slate-500">Satellite Intelligence Workstation</span>
          <span className="text-slate-700">·</span>
          <span>Semantic Retrieval &amp; Multi-Temporal Change Analysis</span>
        </div>
        <div className="text-[11px] text-slate-700">
          Sentinel-2 · EPSG:4326 · Siamese U-Net Change Detection
        </div>
      </footer>

    </div>
  );
}
