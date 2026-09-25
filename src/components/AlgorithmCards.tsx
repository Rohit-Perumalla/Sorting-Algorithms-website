import React from 'react';
import { ALGORITHMS } from '../algorithms';
import { AlgorithmId } from '../types/sorting';
import { Check, X, ShieldAlert, Cpu } from 'lucide-react';

interface AlgorithmCardsProps {
  selectedAlgorithm: AlgorithmId;
  onSelectAlgorithm: (id: AlgorithmId) => void;
}

export const AlgorithmCards: React.FC<AlgorithmCardsProps> = ({
  selectedAlgorithm,
  onSelectAlgorithm
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {ALGORITHMS.map((algo) => {
        const isSelected = algo.id === selectedAlgorithm;

        return (
          <div
            key={algo.id}
            onClick={() => onSelectAlgorithm(algo.id)}
            className={`flex flex-col justify-between rounded-2xl p-5 border transition-all duration-200 cursor-pointer ${
              isSelected
                ? 'bg-slate-900 border-cyan-500/80 shadow-xl shadow-cyan-950/40 ring-1 ring-cyan-500/50'
                : 'bg-slate-900/70 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
            }`}
          >
            {/* Header */}
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="text-base font-bold text-white tracking-tight">
                  {algo.name}
                </span>
                <span className="text-[11px] font-medium text-cyan-400 bg-cyan-950/60 border border-cyan-800/60 px-2 py-0.5 rounded-md">
                  {algo.category}
                </span>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                {algo.shortDesc}
              </p>

              {/* Complexity Matrix */}
              <div className="space-y-1.5 p-3 rounded-xl bg-slate-950/70 border border-slate-850 font-mono text-xs">
                <div className="flex justify-between items-center text-slate-300">
                  <span className="text-slate-400 font-sans text-[11px]">Best Time:</span>
                  <span className="text-emerald-400 font-bold">{algo.bestTime}</span>
                </div>
                <div className="flex justify-between items-center text-slate-300">
                  <span className="text-slate-400 font-sans text-[11px]">Average Time:</span>
                  <span className="text-amber-400 font-bold">{algo.avgTime}</span>
                </div>
                <div className="flex justify-between items-center text-slate-300">
                  <span className="text-slate-400 font-sans text-[11px]">Worst Time:</span>
                  <span className="text-rose-400 font-bold">{algo.worstTime}</span>
                </div>
                <div className="flex justify-between items-center text-slate-300 pt-1 border-t border-slate-850">
                  <span className="text-slate-400 font-sans text-[11px]">Worst Space:</span>
                  <span className="text-sky-400 font-bold">{algo.spaceComplexity}</span>
                </div>
              </div>
            </div>

            {/* Properties & Flags */}
            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5">
                <span className="text-slate-400">Stable:</span>
                {algo.isStable ? (
                  <span className="flex items-center text-emerald-400 font-medium">
                    <Check className="w-3.5 h-3.5 mr-0.5" /> Yes
                  </span>
                ) : (
                  <span className="flex items-center text-rose-400 font-medium">
                    <X className="w-3.5 h-3.5 mr-0.5" /> No
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1.5">
                <span className="text-slate-400">In-Place:</span>
                {algo.isInPlace ? (
                  <span className="flex items-center text-emerald-400 font-medium">
                    <Check className="w-3.5 h-3.5 mr-0.5" /> Yes
                  </span>
                ) : (
                  <span className="flex items-center text-rose-400 font-medium">
                    <X className="w-3.5 h-3.5 mr-0.5" /> No
                  </span>
                )}
              </div>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectAlgorithm(algo.id);
                }}
                className={`text-[11px] font-semibold px-2 py-1 rounded-md transition-colors ${
                  isSelected
                    ? 'bg-cyan-500 text-slate-950'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {isSelected ? 'Active' : 'Select'}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};
