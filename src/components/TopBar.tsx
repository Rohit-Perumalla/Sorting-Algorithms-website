import React from 'react';
import { Play, Sparkles, BarChart3, Layers, BookOpen, GitCompare } from 'lucide-react';

interface TopBarProps {
  activeTab: 'visualizer' | 'compare' | 'analysis' | 'cards' | 'education';
  onSelectTab: (tab: 'visualizer' | 'compare' | 'analysis' | 'cards' | 'education') => void;
  onQuickDemo: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({ activeTab, onSelectTab, onQuickDemo }) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-3">
          <a
            href="#visualizer"
            onClick={(e) => {
              e.preventDefault();
              onSelectTab('visualizer');
            }}
            className="flex items-center gap-2.5 text-lg font-bold tracking-tight text-white hover:text-cyan-400 transition-colors"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 text-slate-950 shadow-sm shadow-cyan-500/20">
              <BarChart3 className="h-5 w-5 text-white" />
            </div>
            <span>SortVision</span>
          </a>
          <span className="hidden sm:inline-block text-xs font-medium text-slate-400 border-l border-slate-800 pl-3">
            Algorithm Visualizer
          </span>
        </div>

        {/* Zone 2: 4-6 clean text navigation links */}
        <nav className="hidden md:flex items-center gap-1 sm:gap-2">
          <button
            onClick={() => onSelectTab('visualizer')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              activeTab === 'visualizer'
                ? 'bg-slate-800 text-cyan-400 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <BarChart3 className="h-3.5 w-3.5" />
            <span>Visualizer</span>
          </button>

          <button
            onClick={() => onSelectTab('compare')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              activeTab === 'compare'
                ? 'bg-slate-800 text-cyan-400 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <GitCompare className="h-3.5 w-3.5" />
            <span>Comparison Mode</span>
          </button>

          <button
            onClick={() => onSelectTab('analysis')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              activeTab === 'analysis'
                ? 'bg-slate-800 text-cyan-400 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Layers className="h-3.5 w-3.5" />
            <span>Algorithm Analysis</span>
          </button>

          <button
            onClick={() => onSelectTab('education')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              activeTab === 'education'
                ? 'bg-slate-800 text-cyan-400 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <BookOpen className="h-3.5 w-3.5" />
            <span>How It Works</span>
          </button>
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={onQuickDemo}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-colors shadow-sm shadow-cyan-500/20 active:scale-95"
            title="Start quick sorting animation with current algorithm"
          >
            <Play className="h-3.5 w-3.5 fill-current" />
            <span className="hidden sm:inline">Run Visualizer</span>
            <span className="sm:hidden">Run</span>
          </button>
        </div>
      </div>

      {/* Mobile nav bar */}
      <div className="flex md:hidden items-center justify-around border-t border-slate-850 px-2 py-1.5 bg-slate-950 text-xs overflow-x-auto">
        <button
          onClick={() => onSelectTab('visualizer')}
          className={`px-2.5 py-1 rounded whitespace-nowrap ${activeTab === 'visualizer' ? 'text-cyan-400 font-semibold' : 'text-slate-400'}`}
        >
          Visualizer
        </button>
        <button
          onClick={() => onSelectTab('compare')}
          className={`px-2.5 py-1 rounded whitespace-nowrap ${activeTab === 'compare' ? 'text-cyan-400 font-semibold' : 'text-slate-400'}`}
        >
          Compare
        </button>
        <button
          onClick={() => onSelectTab('analysis')}
          className={`px-2.5 py-1 rounded whitespace-nowrap ${activeTab === 'analysis' ? 'text-cyan-400 font-semibold' : 'text-slate-400'}`}
        >
          Analysis
        </button>
        <button
          onClick={() => onSelectTab('education')}
          className={`px-2.5 py-1 rounded whitespace-nowrap ${activeTab === 'education' ? 'text-cyan-400 font-semibold' : 'text-slate-400'}`}
        >
          Guide & Theory
        </button>
      </div>
    </header>
  );
};
