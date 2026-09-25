import React, { useState } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  SkipBack,
  Shuffle,
  SlidersHorizontal,
  ArrowUpDown,
  Edit3,
  Network,
  BarChart2,
  Split,
  Check,
  AlertCircle
} from 'lucide-react';
import { AlgorithmId } from '../types/sorting';
import { ALGORITHMS } from '../algorithms';
import { ArrayPresetType, parseCustomArrayInput } from '../utils/arrayGenerators';

interface VisualizerControlsProps {
  selectedAlgorithm: AlgorithmId;
  onSelectAlgorithm: (id: AlgorithmId) => void;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onStepForward: () => void;
  onStepBackward: () => void;
  onReset: () => void;
  arraySize: number;
  onChangeArraySize: (size: number) => void;
  speed: number;
  onChangeSpeed: (speed: number) => void;
  order: 'asc' | 'desc';
  onToggleOrder: () => void;
  onGeneratePreset: (type: ArrayPresetType) => void;
  onApplyCustomArray: (numbers: number[]) => void;
  heapViewMode: 'bars' | 'tree';
  onToggleHeapViewMode: () => void;
  mergeViewMode: 'tree' | 'bars';
  onToggleMergeViewMode: () => void;
  canStepForward: boolean;
  canStepBackward: boolean;
  isComplete: boolean;
}

export const VisualizerControls: React.FC<VisualizerControlsProps> = ({
  selectedAlgorithm,
  onSelectAlgorithm,
  isPlaying,
  onTogglePlay,
  onStepForward,
  onStepBackward,
  onReset,
  arraySize,
  onChangeArraySize,
  speed,
  onChangeSpeed,
  order,
  onToggleOrder,
  onGeneratePreset,
  onApplyCustomArray,
  heapViewMode,
  onToggleHeapViewMode,
  mergeViewMode,
  onToggleMergeViewMode,
  canStepForward,
  canStepBackward,
  isComplete
}) => {
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [customInputText, setCustomInputText] = useState('45, 12, 85, 32, 89, 3, 67, 24, 76, 18, 95, 50');
  const [customInputError, setCustomInputError] = useState<string | null>(null);

  const handleApplyCustom = () => {
    const result = parseCustomArrayInput(customInputText);
    if (!result.valid) {
      setCustomInputError(result.error || 'Invalid array values');
      return;
    }
    setCustomInputError(null);
    onApplyCustomArray(result.numbers);
    setShowCustomModal(false);
  };

  return (
    <div className="flex flex-col gap-4 rounded-2xl bg-slate-900/90 border border-slate-800/80 p-4 sm:p-5 shadow-xl">
      {/* Top Row: Algorithm Selection Cards & View Mode */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Algorithm:
          </span>
          <div className="flex items-center gap-1.5 overflow-x-auto py-1 max-w-full">
            {ALGORITHMS.map((algo) => {
              const isSelected = algo.id === selectedAlgorithm;
              return (
                <button
                  key={algo.id}
                  onClick={() => onSelectAlgorithm(algo.id)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-all duration-150 ${
                    isSelected
                      ? 'bg-cyan-500 text-slate-950 font-semibold shadow-md shadow-cyan-500/25 scale-[1.02]'
                      : 'bg-slate-800/80 text-slate-300 hover:bg-slate-750 hover:text-white border border-slate-700/60'
                  }`}
                >
                  {algo.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Algorithm Specific View Options for Merge Sort */}
        {selectedAlgorithm === 'merge' && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">View Mode:</span>
            <div className="inline-flex p-1 bg-slate-950 rounded-lg border border-slate-800">
              <button
                onClick={onToggleMergeViewMode}
                className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                  mergeViewMode === 'tree'
                    ? 'bg-slate-800 text-cyan-400 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Split className="w-3.5 h-3.5" />
                <span>Recursion Tree</span>
              </button>
              <button
                onClick={onToggleMergeViewMode}
                className={`flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                  mergeViewMode === 'bars'
                    ? 'bg-slate-800 text-cyan-400 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <BarChart2 className="w-3.5 h-3.5" />
                <span>Histogram</span>
              </button>
            </div>
          </div>
        )}

        {/* Algorithm Specific View Options (e.g. Heap Sort tree view) */}
        {selectedAlgorithm === 'heap' && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">View Mode:</span>
            <div className="inline-flex p-1 bg-slate-950 rounded-lg border border-slate-800">
              <button
                onClick={onToggleHeapViewMode}
                className={`flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                  heapViewMode === 'bars'
                    ? 'bg-slate-800 text-cyan-400 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <BarChart2 className="w-3.5 h-3.5" />
                <span>Histogram</span>
              </button>
              <button
                onClick={onToggleHeapViewMode}
                className={`flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                  heapViewMode === 'tree'
                    ? 'bg-slate-800 text-cyan-400 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Network className="w-3.5 h-3.5" />
                <span>Heap Tree</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Middle Row: Playback Control Panel */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Playback Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={onTogglePlay}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl shadow-lg transition-transform active:scale-95 ${
              isPlaying
                ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/20'
                : isComplete
                ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/20'
                : 'bg-cyan-400 hover:bg-cyan-300 text-slate-950 shadow-cyan-400/25'
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4 fill-current" />
                <span>Pause</span>
              </>
            ) : isComplete ? (
              <>
                <RotateCcw className="w-4 h-4" />
                <span>Restart</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>Start</span>
              </>
            )}
          </button>

          <button
            onClick={onStepBackward}
            disabled={!canStepBackward || isPlaying}
            title="Step Backward"
            className="flex items-center justify-center w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:pointer-events-none text-slate-200 border border-slate-700/60 transition-colors"
          >
            <SkipBack className="w-4 h-4" />
          </button>

          <button
            onClick={onStepForward}
            disabled={!canStepForward || isPlaying}
            title="Step Forward"
            className="flex items-center justify-center w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:pointer-events-none text-slate-200 border border-slate-700/60 transition-colors"
          >
            <SkipForward className="w-4 h-4" />
          </button>

          <button
            onClick={onReset}
            title="Reset to Initial State"
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700/60 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>

          {/* Ascending / Descending order toggle */}
          <button
            onClick={onToggleOrder}
            title={`Switch to ${order === 'asc' ? 'Descending' : 'Ascending'} order`}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700/60 transition-colors"
          >
            <ArrowUpDown className="w-3.5 h-3.5 text-cyan-400" />
            <span className="font-mono font-semibold uppercase">{order}</span>
          </button>
        </div>

        {/* Array Generation & Presets */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => onGeneratePreset('random')}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700/60 transition-colors"
          >
            <Shuffle className="w-3.5 h-3.5 text-cyan-400" />
            <span>Random Array</span>
          </button>

          {/* Preset options */}
          <div className="hidden sm:flex items-center gap-1 p-0.5 bg-slate-950 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => onGeneratePreset('nearly-sorted')}
              className="px-2.5 py-1 text-slate-400 hover:text-white rounded-lg transition-colors"
              title="Nearly sorted array"
            >
              Nearly Sorted
            </button>
            <button
              onClick={() => onGeneratePreset('reversed')}
              className="px-2.5 py-1 text-slate-400 hover:text-white rounded-lg transition-colors"
              title="Reverse sorted array"
            >
              Reversed
            </button>
            <button
              onClick={() => onGeneratePreset('few-unique')}
              className="px-2.5 py-1 text-slate-400 hover:text-white rounded-lg transition-colors"
              title="Array with duplicate values"
            >
              Duplicates
            </button>
          </div>

          {/* Custom Array Input Button */}
          <button
            onClick={() => setShowCustomModal(true)}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700/60 transition-colors"
          >
            <Edit3 className="w-3.5 h-3.5 text-cyan-400" />
            <span>Custom Array</span>
          </button>
        </div>
      </div>

      {/* Bottom Row: Sliders (Array Size & Animation Speed) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-800/60">
        {/* Array Size Slider */}
        <div className="flex items-center justify-between gap-3 bg-slate-950/60 px-3.5 py-2 rounded-xl border border-slate-850">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-medium text-slate-300">Array Size:</span>
            <span className="font-mono text-xs font-bold text-cyan-400 tabular-nums">
              {arraySize}
            </span>
          </div>
          <input
            type="range"
            min={5}
            max={60}
            value={arraySize}
            disabled={isPlaying}
            onChange={(e) => onChangeArraySize(Number(e.target.value))}
            className="w-36 sm:w-48 accent-cyan-400 cursor-pointer disabled:opacity-40"
          />
        </div>

        {/* Speed Slider */}
        <div className="flex items-center justify-between gap-3 bg-slate-950/60 px-3.5 py-2 rounded-xl border border-slate-850">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-slate-300">Speed:</span>
            <span className="font-mono text-xs font-bold text-cyan-400 tabular-nums">
              {speed <= 25 ? 'Ultra (15ms)' : speed <= 100 ? 'Fast' : speed <= 300 ? 'Normal' : 'Slow'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-slate-500">Slow</span>
            <input
              type="range"
              min={15}
              max={600}
              step={15}
              // Invert value so right is faster: 600 - speed + 15
              value={615 - speed}
              onChange={(e) => onChangeSpeed(615 - Number(e.target.value))}
              className="w-32 sm:w-44 accent-cyan-400 cursor-pointer"
            />
            <span className="text-[10px] text-slate-500">Fast</span>
          </div>
        </div>
      </div>

      {/* Custom Array Modal */}
      {showCustomModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-700 p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-cyan-400" />
                <span>Enter Custom Array</span>
              </h3>
              <button
                onClick={() => setShowCustomModal(false)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 space-y-3">
              <p className="text-xs text-slate-400">
                Enter comma-separated or space-separated positive integers (between 1 and 999, recommended 5 to 50 items):
              </p>
              <textarea
                value={customInputText}
                onChange={(e) => {
                  setCustomInputText(e.target.value);
                  setCustomInputError(null);
                }}
                rows={3}
                className="w-full rounded-xl bg-slate-950 border border-slate-700 p-3 font-mono text-sm text-cyan-300 focus:outline-none focus:border-cyan-500"
                placeholder="e.g. 23, 7, 45, 12, 89, 3, 56"
              />

              {customInputError && (
                <div className="flex items-center gap-2 text-xs text-rose-400">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{customInputError}</span>
                </div>
              )}

              {/* Sample presets */}
              <div className="flex items-center gap-2 pt-1 text-xs text-slate-400">
                <span>Presets:</span>
                <button
                  type="button"
                  onClick={() => setCustomInputText('12, 34, 5, 89, 45, 23, 67, 98, 1, 54, 76, 30')}
                  className="underline hover:text-cyan-400"
                >
                  Unsorted (12)
                </button>
                <span>·</span>
                <button
                  type="button"
                  onClick={() => setCustomInputText('90, 80, 70, 60, 50, 40, 30, 20, 10')}
                  className="underline hover:text-cyan-400"
                >
                  Worst Case (9)
                </button>
                <span>·</span>
                <button
                  type="button"
                  onClick={() => setCustomInputText('10, 20, 20, 50, 50, 80, 80, 90')}
                  className="underline hover:text-cyan-400"
                >
                  Duplicates (8)
                </button>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowCustomModal(false)}
                className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleApplyCustom}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition-colors"
              >
                <Check className="w-4 h-4" />
                <span>Apply Array</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
