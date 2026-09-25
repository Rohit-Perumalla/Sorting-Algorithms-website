import React from 'react';
import { SortStep, AlgorithmId } from '../types/sorting';
import { ALGORITHMS } from '../algorithms';
import { CheckCircle2, Clock, GitCommit, ArrowRightLeft, Database, Activity } from 'lucide-react';

interface StatsPanelProps {
  step: SortStep;
  currentStepIndex: number;
  totalSteps: number;
  algorithmId: AlgorithmId;
  elapsedTimeMs: number;
  isComplete: boolean;
}

export const StatsPanel: React.FC<StatsPanelProps> = ({
  step,
  currentStepIndex,
  totalSteps,
  algorithmId,
  elapsedTimeMs,
  isComplete
}) => {
  const algo = ALGORITHMS.find((a) => a.id === algorithmId);
  const progressPercent = totalSteps > 1 ? Math.min(100, Math.round((currentStepIndex / (totalSteps - 1)) * 100)) : 100;

  return (
    <div className="flex flex-col gap-3 rounded-2xl bg-slate-900/90 border border-slate-800 p-4 sm:p-5 shadow-lg">
      {/* Top Bar of Stats: Algorithm name, Phase, and Progress Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white text-sm sm:text-base">
              {algo?.name || algorithmId}
            </span>
            <span className="text-slate-400 font-mono text-xs">
              {step.phase ? `(${step.phase})` : ''}
            </span>
          </div>
          {isComplete && (
            <span className="flex items-center gap-1 text-xs font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-800/80 px-2 py-0.5 rounded-full">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Sorted</span>
            </span>
          )}
        </div>

        {/* Progress percent */}
        <div className="flex items-center gap-3">
          <div className="w-32 sm:w-48 h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
            <div
              className={`h-full transition-all duration-150 ${
                isComplete ? 'bg-emerald-500' : 'bg-gradient-to-r from-cyan-500 to-blue-500'
              }`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className="font-mono text-xs font-bold text-cyan-400 tabular-nums min-w-[3rem] text-right">
            {progressPercent}%
          </span>
        </div>
      </div>

      {/* Grid of Key Quantitative Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {/* Step Counter */}
        <div className="flex flex-col p-2.5 rounded-xl bg-slate-950/70 border border-slate-850">
          <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
            <GitCommit className="w-3.5 h-3.5 text-cyan-400" />
            <span>Step</span>
          </div>
          <div className="font-mono text-lg font-bold text-white tabular-nums">
            {currentStepIndex + 1}
            <span className="text-xs font-normal text-slate-500"> / {totalSteps}</span>
          </div>
        </div>

        {/* Comparisons */}
        <div className="flex flex-col p-2.5 rounded-xl bg-slate-950/70 border border-slate-850">
          <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
            <Activity className="w-3.5 h-3.5 text-amber-400" />
            <span>Comparisons</span>
          </div>
          <div className="font-mono text-lg font-bold text-amber-300 tabular-nums">
            {step.comparisons.toLocaleString()}
          </div>
        </div>

        {/* Swaps / Writes */}
        <div className="flex flex-col p-2.5 rounded-xl bg-slate-950/70 border border-slate-850">
          <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
            <ArrowRightLeft className="w-3.5 h-3.5 text-rose-400" />
            <span>Swaps / Writes</span>
          </div>
          <div className="font-mono text-lg font-bold text-rose-400 tabular-nums">
            {step.swaps.toLocaleString()}
          </div>
        </div>

        {/* Array Accesses */}
        <div className="flex flex-col p-2.5 rounded-xl bg-slate-950/70 border border-slate-850">
          <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
            <Database className="w-3.5 h-3.5 text-indigo-400" />
            <span>Array Accesses</span>
          </div>
          <div className="font-mono text-lg font-bold text-indigo-300 tabular-nums">
            {step.accesses.toLocaleString()}
          </div>
        </div>

        {/* Execution Time */}
        <div className="flex flex-col p-2.5 rounded-xl bg-slate-950/70 border border-slate-850 col-span-2 sm:col-span-1">
          <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
            <Clock className="w-3.5 h-3.5 text-emerald-400" />
            <span>Time Elapsed</span>
          </div>
          <div className="font-mono text-lg font-bold text-emerald-300 tabular-nums">
            {elapsedTimeMs >= 1000 ? `${(elapsedTimeMs / 1000).toFixed(2)}s` : `${elapsedTimeMs}ms`}
          </div>
        </div>
      </div>

      {/* Real-time Narrative Description Box */}
      <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs leading-relaxed">
        <div className="mt-0.5 w-2 h-2 rounded-full bg-cyan-400 shrink-0 animate-pulse" />
        <div className="flex-1">
          <span className="font-semibold text-slate-300">Action: </span>
          <span className="text-slate-300 font-mono">{step.description}</span>
        </div>
      </div>
    </div>
  );
};
