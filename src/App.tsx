/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';
import confetti from 'canvas-confetti';
import { TopBar } from './components/TopBar';
import { LegendBar } from './components/LegendBar';
import { VisualizerControls } from './components/VisualizerControls';
import { BarVisualizer } from './components/BarVisualizer';
import { HeapTreeVisualizer } from './components/HeapTreeVisualizer';
import { MergeTreeVisualizer } from './components/MergeTreeVisualizer';
import { StatsPanel } from './components/StatsPanel';
import { ComparisonView } from './components/ComparisonView';
import { AnalysisCharts } from './components/AnalysisCharts';
import { AlgorithmCards } from './components/AlgorithmCards';
import { EducationalSection } from './components/EducationalSection';
import { Footer } from './components/Footer';

import { AlgorithmId, SortStep } from './types/sorting';
import { getStepsForAlgorithm, ALGORITHMS } from './algorithms';
import { generateArrayPreset, ArrayPresetType } from './utils/arrayGenerators';
import { BarChart3, GitCompare, Layers, BookOpen, Sparkles, Terminal } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'visualizer' | 'compare' | 'analysis' | 'cards' | 'education'>('visualizer');
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<AlgorithmId>('bubble');
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [arraySize, setArraySize] = useState<number>(18);
  const [speed, setSpeed] = useState<number>(80); // ms per step
  const [heapViewMode, setHeapViewMode] = useState<'bars' | 'tree'>('bars');
  const [mergeViewMode, setMergeViewMode] = useState<'tree' | 'bars'>('tree');

  // Initial array state
  const [initialArray, setInitialArray] = useState<number[]>(() =>
    generateArrayPreset('random', 18, 12, 100)
  );

  // Precomputed steps for current configuration
  const steps: SortStep[] = useMemo(() => {
    return getStepsForAlgorithm(selectedAlgorithm, [...initialArray], order);
  }, [selectedAlgorithm, initialArray, order]);

  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [elapsedTimeMs, setElapsedTimeMs] = useState<number>(0);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);
  const accumulatedTimeRef = useRef<number>(0);

  const isComplete = currentStepIndex >= steps.length - 1;
  const currentStep = steps[currentStepIndex] || steps[0];

  // Stop playback when completed or switched
  useEffect(() => {
    setCurrentStepIndex(0);
    setIsPlaying(false);
    setElapsedTimeMs(0);
    accumulatedTimeRef.current = 0;
    if (timerRef.current) clearInterval(timerRef.current);
  }, [selectedAlgorithm, initialArray, order]);

  // Main playback timer loop
  useEffect(() => {
    if (!isPlaying) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    startTimeRef.current = performance.now();

    timerRef.current = setInterval(() => {
      setCurrentStepIndex((prev) => {
        if (prev >= steps.length - 1) {
          setIsPlaying(false);
          // Trigger confetti celebration on completion
          try {
            confetti({
              particleCount: 45,
              spread: 60,
              origin: { y: 0.8 },
              colors: ['#06b6d4', '#10b981', '#f59e0b', '#8b5cf6']
            });
          } catch {
            // Ignore if canvas is not ready
          }
          return prev;
        }

        const now = performance.now();
        const delta = Math.round(now - startTimeRef.current);
        setElapsedTimeMs(accumulatedTimeRef.current + delta);

        return prev + 1;
      });
    }, speed);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      accumulatedTimeRef.current = elapsedTimeMs;
    };
  }, [isPlaying, speed, steps.length, elapsedTimeMs]);

  // Controls Handlers
  const handleTogglePlay = () => {
    if (isPlaying) {
      setIsPlaying(false);
    } else {
      if (isComplete) {
        setCurrentStepIndex(0);
        setElapsedTimeMs(0);
        accumulatedTimeRef.current = 0;
      }
      startTimeRef.current = performance.now();
      setIsPlaying(true);
    }
  };

  const handleStepForward = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    }
  };

  const handleStepBackward = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStepIndex(0);
    setElapsedTimeMs(0);
    accumulatedTimeRef.current = 0;
  };

  const handleGeneratePreset = (type: ArrayPresetType) => {
    setIsPlaying(false);
    const newArr = generateArrayPreset(type, arraySize, 12, 100);
    setInitialArray(newArr);
  };

  const handleApplyCustomArray = (numbers: number[]) => {
    setIsPlaying(false);
    setArraySize(numbers.length);
    setInitialArray(numbers);
  };

  const handleChangeArraySize = (size: number) => {
    setIsPlaying(false);
    setArraySize(size);
    setInitialArray(generateArrayPreset('random', size, 12, 100));
  };

  const handleToggleOrder = () => {
    setIsPlaying(false);
    setOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
  };

  const handleQuickDemo = () => {
    setActiveTab('visualizer');
    handleReset();
    setTimeout(() => {
      setIsPlaying(true);
    }, 150);
  };

  // Calculate sorted representation for histogram comparisons
  const sortedArray = useMemo(() => {
    return [...initialArray].sort((a, b) => (order === 'asc' ? a - b : b - a));
  }, [initialArray, order]);

  const activeAlgoInfo = ALGORITHMS.find((a) => a.id === selectedAlgorithm) || ALGORITHMS[0];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Fixed/Sticky Top Navigation Bar */}
      <TopBar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onQuickDemo={handleQuickDemo}
      />

      {/* Main Content Area */}
      <main className="flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">
        {/* Dashboard Title & Short Description Header */}
        <section className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-slate-850">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400 mb-1">
              <Terminal className="w-3.5 h-3.5" />
              <span>COMPUTER SCIENCE INTERACTIVE LAB</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
              Interactive Visualization of Sorting Algorithms
            </h1>
            <p className="mt-2 text-sm text-slate-400 max-w-3xl leading-relaxed">
              Explore how elementary and logarithmic sorting algorithms rearrange data elements.
              Inspect live comparisons, swaps, partition boundaries, and heap structures in real time.
            </p>
          </div>

          {/* Quick tab switcher pill bar on desktop */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-900 rounded-xl border border-slate-800 self-start md:self-auto shrink-0">
            <button
              onClick={() => setActiveTab('visualizer')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                activeTab === 'visualizer'
                  ? 'bg-cyan-500 text-slate-950 font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Visualizer</span>
            </button>
            <button
              onClick={() => setActiveTab('compare')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                activeTab === 'compare'
                  ? 'bg-cyan-500 text-slate-950 font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <GitCompare className="w-3.5 h-3.5" />
              <span>Multi-Compare</span>
            </button>
            <button
              onClick={() => setActiveTab('analysis')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                activeTab === 'analysis'
                  ? 'bg-cyan-500 text-slate-950 font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Analysis & Graphs</span>
            </button>
            <button
              onClick={() => setActiveTab('education')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                activeTab === 'education'
                  ? 'bg-cyan-500 text-slate-950 font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Theory Guide</span>
            </button>
          </div>
        </section>

        {/* Tab 1: Primary Sorting Visualizer */}
        {activeTab === 'visualizer' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Control Deck */}
            <VisualizerControls
              selectedAlgorithm={selectedAlgorithm}
              onSelectAlgorithm={setSelectedAlgorithm}
              isPlaying={isPlaying}
              onTogglePlay={handleTogglePlay}
              onStepForward={handleStepForward}
              onStepBackward={handleStepBackward}
              onReset={handleReset}
              arraySize={arraySize}
              onChangeArraySize={handleChangeArraySize}
              speed={speed}
              onChangeSpeed={setSpeed}
              order={order}
              onToggleOrder={handleToggleOrder}
              onGeneratePreset={handleGeneratePreset}
              onApplyCustomArray={handleApplyCustomArray}
              heapViewMode={heapViewMode}
              onToggleHeapViewMode={() =>
                setHeapViewMode((prev) => (prev === 'bars' ? 'tree' : 'bars'))
              }
              mergeViewMode={mergeViewMode}
              onToggleMergeViewMode={() =>
                setMergeViewMode((prev) => (prev === 'tree' ? 'bars' : 'tree'))
              }
              canStepForward={!isComplete}
              canStepBackward={currentStepIndex > 0}
              isComplete={isComplete}
            />

            {/* Color Legend Bar */}
            <LegendBar />

            {/* Primary Interactive Stage: Merge Tree vs Heap Tree vs Bar Chart */}
            <div className="space-y-4">
              {selectedAlgorithm === 'merge' && mergeViewMode === 'tree' ? (
                <MergeTreeVisualizer step={currentStep} height={460} />
              ) : selectedAlgorithm === 'heap' && heapViewMode === 'tree' ? (
                <HeapTreeVisualizer step={currentStep} height={420} />
              ) : (
                <BarVisualizer
                  step={currentStep}
                  algorithmId={selectedAlgorithm}
                  height={380}
                />
              )}
            </div>

            {/* Live Statistics & Narrative Panel */}
            <StatsPanel
              step={currentStep}
              currentStepIndex={currentStepIndex}
              totalSteps={steps.length}
              algorithmId={selectedAlgorithm}
              elapsedTimeMs={elapsedTimeMs}
              isComplete={isComplete}
            />

            {/* Quick Algorithm Info Card */}
            <div className="mt-8 pt-6 border-t border-slate-850">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  <span>All 6 Sorting Algorithm Reference Cards</span>
                </h3>
                <span className="text-xs text-slate-400">Click any card to load algorithm</span>
              </div>
              <AlgorithmCards
                selectedAlgorithm={selectedAlgorithm}
                onSelectAlgorithm={setSelectedAlgorithm}
              />
            </div>
          </div>
        )}

        {/* Tab 2: Comparison Mode */}
        {activeTab === 'compare' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <ComparisonView initialArray={initialArray} order={order} />
          </div>
        )}

        {/* Tab 3: Algorithm Analysis & Interactive Graphs */}
        {activeTab === 'analysis' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <AnalysisCharts
              currentArray={initialArray}
              currentSortedArray={sortedArray}
            />
          </div>
        )}

        {/* Tab 4: Algorithm Cards Standalone View */}
        {activeTab === 'cards' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <AlgorithmCards
              selectedAlgorithm={selectedAlgorithm}
              onSelectAlgorithm={(id) => {
                setSelectedAlgorithm(id);
                setActiveTab('visualizer');
              }}
            />
          </div>
        )}

        {/* Tab 5: Educational "How It Works" Section */}
        {activeTab === 'education' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <EducationalSection
              selectedAlgorithm={selectedAlgorithm}
              onSelectAlgorithm={setSelectedAlgorithm}
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
