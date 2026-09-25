import React from 'react';
import { SortStep, ElementState, AlgorithmId } from '../types/sorting';

interface BarVisualizerProps {
  step: SortStep;
  algorithmId: AlgorithmId;
  height?: number;
}

export const BarVisualizer: React.FC<BarVisualizerProps> = ({
  step,
  algorithmId,
  height = 360
}) => {
  const { array, indices, meta } = step;
  const n = array.length;
  const maxValue = Math.max(...array, 1);

  // Compute bar color & styles based on state
  const getBarStyles = (state: ElementState | undefined) => {
    switch (state) {
      case 'comparing':
        return {
          bg: 'bg-amber-400',
          border: 'border-amber-300',
          glow: 'shadow-lg shadow-amber-500/30 z-10',
          text: 'text-amber-300'
        };
      case 'swapping':
        return {
          bg: 'bg-rose-500',
          border: 'border-rose-300',
          glow: 'shadow-xl shadow-rose-500/40 ring-2 ring-rose-400 z-20 scale-[1.02]',
          text: 'text-rose-300'
        };
      case 'selected':
        return {
          bg: 'bg-purple-500',
          border: 'border-purple-300',
          glow: 'shadow-md shadow-purple-500/30 z-10',
          text: 'text-purple-300'
        };
      case 'pivot':
        return {
          bg: 'bg-cyan-400',
          border: 'border-cyan-200',
          glow: 'shadow-xl shadow-cyan-400/40 ring-2 ring-cyan-300 z-20',
          text: 'text-cyan-300'
        };
      case 'sorted':
        return {
          bg: 'bg-emerald-500',
          border: 'border-emerald-400',
          glow: 'shadow-sm shadow-emerald-500/20',
          text: 'text-emerald-300'
        };
      case 'heap-parent':
        return {
          bg: 'bg-indigo-500',
          border: 'border-indigo-400',
          glow: 'shadow-md shadow-indigo-500/30 z-10',
          text: 'text-indigo-300'
        };
      case 'heap-child':
        return {
          bg: 'bg-sky-400',
          border: 'border-sky-300',
          glow: 'shadow-md shadow-sky-400/25',
          text: 'text-sky-300'
        };
      case 'merging':
        return {
          bg: 'bg-fuchsia-500',
          border: 'border-fuchsia-300',
          glow: 'shadow-lg shadow-fuchsia-500/30 z-10',
          text: 'text-fuchsia-300'
        };
      case 'default':
      default:
        return {
          bg: 'bg-slate-700',
          border: 'border-slate-600',
          glow: 'hover:bg-slate-650',
          text: 'text-slate-400'
        };
    }
  };

  // Determine top badge annotation
  const getBadgeAnnotation = (index: number) => {
    if (algorithmId === 'quick' && meta?.pivotIndex === index) {
      return { text: 'PIVOT', color: 'bg-cyan-400 text-slate-950 font-bold' };
    }
    if (algorithmId === 'selection' && meta?.minIndex === index) {
      return { text: 'MIN', color: 'bg-purple-400 text-slate-950 font-bold' };
    }
    if (algorithmId === 'insertion' && meta?.keyIndex === index) {
      return { text: 'KEY', color: 'bg-purple-400 text-slate-950 font-bold' };
    }
    if (algorithmId === 'heap') {
      if (meta?.parentIndex === index) {
        return { text: 'PARENT', color: 'bg-indigo-400 text-slate-950 font-bold' };
      }
      if (meta?.childIndex === index) {
        return { text: 'CHILD', color: 'bg-sky-400 text-slate-950 font-bold' };
      }
    }
    return null;
  };

  const isBarWide = n <= 24;
  const isUltraCompact = n > 45;

  return (
    <div className="relative w-full rounded-2xl bg-slate-950/80 border border-slate-800 p-4 sm:p-6 overflow-hidden flex flex-col justify-end">
      {/* Background Grid Lines for Scale */}
      <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-6 opacity-10">
        <div className="border-b border-white w-full" />
        <div className="border-b border-white w-full" />
        <div className="border-b border-white w-full" />
        <div className="border-b border-white w-full" />
      </div>

      {/* Merge Sort Subarray Bracket Guides (if active) */}
      {meta?.mergeSubarrays && (
        <div className="relative z-10 mb-2 flex items-center justify-between text-xs px-2 py-1 bg-slate-900/80 rounded-lg border border-slate-800">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-indigo-500" />
            <span className="text-slate-300">
              Left Subarray: [{meta.mergeSubarrays.leftStart}..{meta.mergeSubarrays.leftEnd}]
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-sky-400" />
            <span className="text-slate-300">
              Right Subarray: [{meta.mergeSubarrays.rightStart}..{meta.mergeSubarrays.rightEnd}]
            </span>
          </div>
        </div>
      )}

      {/* Quick Sort Partition Range (if active) */}
      {meta?.partitionRange && (
        <div className="relative z-10 mb-2 flex items-center justify-between text-xs px-2 py-1 bg-slate-900/80 rounded-lg border border-slate-800">
          <span className="text-slate-400">
            Active Partition: [{meta.partitionRange.low} .. {meta.partitionRange.high}]
          </span>
          <span className="text-cyan-400 font-mono">
            Pivot: arr[{meta.pivotIndex}]
          </span>
        </div>
      )}

      {/* Bars Container */}
      <div
        style={{ height: `${height}px` }}
        className="relative z-10 flex items-end justify-center gap-1 sm:gap-1.5 w-full pt-10"
      >
        {array.map((value, index) => {
          const state = indices[index] || 'default';
          const styles = getBarStyles(state);
          const badge = getBadgeAnnotation(index);
          const heightPercent = Math.max(8, Math.round((value / maxValue) * 100));

          return (
            <div
              key={index}
              className="group relative flex-1 flex flex-col items-center justify-end h-full max-w-[48px] transition-all duration-150"
            >
              {/* Optional Top Badge Annotation */}
              {badge && (
                <div
                  className={`absolute -top-7 px-1.5 py-0.5 rounded text-[10px] font-mono tracking-tight shadow-md whitespace-nowrap animate-bounce ${badge.color}`}
                >
                  {badge.text}
                </div>
              )}

              {/* Number Label Above Bar (Visible when bar is reasonably wide) */}
              {!isUltraCompact && (
                <span
                  className={`mb-1 font-mono text-[10px] sm:text-xs font-semibold tabular-nums select-none transition-colors ${
                    state !== 'default' ? styles.text : 'text-slate-400'
                  }`}
                >
                  {value}
                </span>
              )}

              {/* The Vertical Bar */}
              <div
                style={{ height: `${heightPercent}%` }}
                className={`w-full rounded-t-md border-t-2 border-x transition-all duration-150 relative overflow-hidden ${styles.bg} ${styles.border} ${styles.glow}`}
              >
                {/* Subtle highlight gradient reflection */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-white/20 pointer-events-none" />

                {/* If bar is very tall and wide, also show value inside bottom */}
                {isBarWide && heightPercent > 35 && (
                  <div className="absolute inset-x-0 bottom-2 text-center text-[10px] font-mono font-bold text-slate-950/70 select-none">
                    {value}
                  </div>
                )}
              </div>

              {/* Array Index Below Bar */}
              {!isUltraCompact && (
                <span className="mt-1.5 font-mono text-[9px] sm:text-[10px] text-slate-400 select-none">
                  {index}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
