import React, { useState, useEffect, useRef } from 'react';
import { AlgorithmId, SortStep } from '../types/sorting';
import { ALGORITHMS, getStepsForAlgorithm } from '../algorithms';
import { Play, Pause, RotateCcw, Award, CheckCircle2, SlidersHorizontal, Shuffle } from 'lucide-react';
import { generateArrayPreset } from '../utils/arrayGenerators';

interface ComparisonViewProps {
  initialArray: number[];
  order: 'asc' | 'desc';
}

interface AlgoRunnerState {
  id: AlgorithmId;
  name: string;
  steps: SortStep[];
  currentStepIndex: number;
  isFinished: boolean;
  timeMs: number;
  finishRank?: number;
}

export const ComparisonView: React.FC<ComparisonViewProps> = ({ initialArray, order }) => {
  const [selectedAlgoIds, setSelectedAlgoIds] = useState<AlgorithmId[]>([
    'bubble',
    'insertion',
    'merge',
    'quick'
  ]);
  const [testArray, setTestArray] = useState<number[]>([...initialArray]);
  const [runners, setRunners] = useState<AlgoRunnerState[]>([]);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(50); // ms per step

  const animationTimerRef = useRef<NodeJS.Timeout | null>(null);
  const finishOrderRef = useRef<number>(1);
  const startTimeRef = useRef<number>(0);

  // Initialize runner states
  const initRunners = (arr: number[], algoList: AlgorithmId[]) => {
    finishOrderRef.current = 1;
    const initialRunners: AlgoRunnerState[] = algoList.map((id) => {
      const algoInfo = ALGORITHMS.find((a) => a.id === id);
      const steps = getStepsForAlgorithm(id, [...arr], order);
      return {
        id,
        name: algoInfo ? algoInfo.name : id,
        steps,
        currentStepIndex: 0,
        isFinished: false,
        timeMs: 0
      };
    });
    setRunners(initialRunners);
    setIsPlaying(false);
    if (animationTimerRef.current) clearInterval(animationTimerRef.current);
  };

  useEffect(() => {
    setTestArray([...initialArray]);
    initRunners([...initialArray], selectedAlgoIds);
  }, [initialArray, selectedAlgoIds, order]);

  // Clean timer on unmount
  useEffect(() => {
    return () => {
      if (animationTimerRef.current) clearInterval(animationTimerRef.current);
    };
  }, []);

  const handleToggleAlgo = (id: AlgorithmId) => {
    if (selectedAlgoIds.includes(id)) {
      if (selectedAlgoIds.length <= 2) return; // Keep at least 2
      setSelectedAlgoIds(selectedAlgoIds.filter((x) => x !== id));
    } else {
      if (selectedAlgoIds.length >= 6) return;
      setSelectedAlgoIds([...selectedAlgoIds, id]);
    }
  };

  const handleSelectAll = () => {
    setSelectedAlgoIds(ALGORITHMS.map((a) => a.id));
  };

  const handleReset = () => {
    setIsPlaying(false);
    if (animationTimerRef.current) clearInterval(animationTimerRef.current);
    initRunners(testArray, selectedAlgoIds);
  };

  const handleNewRandom = () => {
    const fresh = generateArrayPreset('random', Math.min(24, testArray.length || 20), 10, 100);
    setTestArray(fresh);
    initRunners(fresh, selectedAlgoIds);
  };

  const togglePlay = () => {
    if (isPlaying) {
      setIsPlaying(false);
      if (animationTimerRef.current) clearInterval(animationTimerRef.current);
    } else {
      // Check if all finished
      const allDone = runners.every((r) => r.isFinished);
      if (allDone) {
        initRunners(testArray, selectedAlgoIds);
      }
      startTimeRef.current = performance.now();
      setIsPlaying(true);
    }
  };

  // Main synchronized tick loop
  useEffect(() => {
    if (!isPlaying) return;

    animationTimerRef.current = setInterval(() => {
      setRunners((prevRunners) => {
        let allCompleted = true;
        const now = performance.now();

        const updated = prevRunners.map((runner) => {
          if (runner.isFinished) return runner;

          const nextStepIdx = runner.currentStepIndex + 1;
          const isNowFinished = nextStepIdx >= runner.steps.length - 1;

          if (!isNowFinished) {
            allCompleted = false;
          }

          let rank = runner.finishRank;
          let time = runner.timeMs;

          if (isNowFinished && !runner.isFinished) {
            rank = finishOrderRef.current++;
            time = Math.round(now - startTimeRef.current);
          }

          return {
            ...runner,
            currentStepIndex: Math.min(nextStepIdx, runner.steps.length - 1),
            isFinished: isNowFinished,
            finishRank: rank,
            timeMs: time
          };
        });

        if (allCompleted) {
          setIsPlaying(false);
          if (animationTimerRef.current) clearInterval(animationTimerRef.current);
        }

        return updated;
      });
    }, speed);

    return () => {
      if (animationTimerRef.current) clearInterval(animationTimerRef.current);
    };
  }, [isPlaying, speed]);

  const allFinished = runners.length > 0 && runners.every((r) => r.isFinished);
  const maxValue = Math.max(...testArray, 1);

  return (
    <div className="flex flex-col gap-6">
      {/* Control bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Select Algorithms to Compare (2–6):
            </span>
            <button
              onClick={handleSelectAll}
              className="text-xs text-cyan-400 hover:text-cyan-300 underline font-medium"
            >
              Select All 6
            </button>
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            {ALGORITHMS.map((algo) => {
              const active = selectedAlgoIds.includes(algo.id);
              return (
                <button
                  key={algo.id}
                  onClick={() => handleToggleAlgo(algo.id)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors border ${
                    active
                      ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 shadow-sm'
                      : 'bg-slate-800/60 text-slate-400 border-slate-700/60 hover:text-slate-200'
                  }`}
                >
                  {algo.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Playback & Speed */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={togglePlay}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl text-slate-950 transition-colors shadow-lg ${
              isPlaying
                ? 'bg-amber-400 hover:bg-amber-300 shadow-amber-500/20'
                : allFinished
                ? 'bg-emerald-500 hover:bg-emerald-400 text-white shadow-emerald-500/20'
                : 'bg-cyan-400 hover:bg-cyan-300 shadow-cyan-400/20'
            }`}
          >
            {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
            <span>{isPlaying ? 'Pause Race' : allFinished ? 'Restart Race' : 'Start Race'}</span>
          </button>

          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 border border-slate-700"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>

          <button
            onClick={handleNewRandom}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 border border-slate-700"
          >
            <Shuffle className="w-3.5 h-3.5 text-cyan-400" />
            <span>New Array</span>
          </button>

          {/* Speed slider */}
          <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
            <input
              type="range"
              min={10}
              max={250}
              step={10}
              value={260 - speed}
              onChange={(e) => setSpeed(260 - Number(e.target.value))}
              className="w-24 accent-cyan-400"
              title="Race Speed"
            />
          </div>
        </div>
      </div>

      {/* Grid of Visualizers */}
      <div
        className={`grid gap-4 ${
          runners.length <= 2
            ? 'grid-cols-1 md:grid-cols-2'
            : runners.length <= 4
            ? 'grid-cols-1 md:grid-cols-2'
            : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
        }`}
      >
        {runners.map((runner) => {
          const currentStep = runner.steps[runner.currentStepIndex] || runner.steps[0];
          const progressPercent = Math.min(
            100,
            Math.round((runner.currentStepIndex / (runner.steps.length - 1 || 1)) * 100)
          );

          return (
            <div
              key={runner.id}
              className={`flex flex-col rounded-2xl bg-slate-900/80 border p-4 transition-all duration-200 ${
                runner.isFinished
                  ? 'border-emerald-500/50 shadow-lg shadow-emerald-950/30'
                  : 'border-slate-800'
              }`}
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-2 border-b border-slate-800/80 mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-white">{runner.name}</span>
                  {runner.finishRank && (
                    <span className="flex items-center gap-1 text-[11px] font-mono font-bold text-amber-400 bg-amber-950/60 border border-amber-800/60 px-1.5 py-0.2 rounded">
                      <Award className="w-3 h-3" />
                      #{runner.finishRank}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {runner.isFinished ? (
                    <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-semibold">
                      <CheckCircle2 className="w-3 h-3" /> Done
                    </span>
                  ) : (
                    <span className="text-[11px] font-mono text-cyan-400 tabular-nums">
                      {progressPercent}%
                    </span>
                  )}
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden mb-3">
                <div
                  className={`h-full transition-all duration-100 ${
                    runner.isFinished ? 'bg-emerald-500' : 'bg-cyan-500'
                  }`}
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              {/* Mini Bar Chart */}
              <div className="relative h-32 w-full flex items-end justify-center gap-1 bg-slate-950/70 rounded-xl p-2 border border-slate-850 overflow-hidden mb-3">
                {currentStep.array.map((val, idx) => {
                  const state = currentStep.indices[idx];
                  const heightPercent = Math.max(8, Math.round((val / maxValue) * 100));

                  let bgClass = 'bg-slate-700';
                  if (state === 'comparing') bgClass = 'bg-amber-400';
                  else if (state === 'swapping') bgClass = 'bg-rose-500';
                  else if (state === 'sorted') bgClass = 'bg-emerald-500';
                  else if (state === 'pivot') bgClass = 'bg-cyan-400';
                  else if (state === 'selected') bgClass = 'bg-purple-500';
                  else if (state === 'heap-parent') bgClass = 'bg-indigo-500';

                  return (
                    <div
                      key={idx}
                      style={{ height: `${heightPercent}%` }}
                      className={`flex-1 rounded-t-sm transition-all duration-100 ${bgClass}`}
                    />
                  );
                })}
              </div>

              {/* Live metrics for this runner */}
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-850">
                  <div className="text-slate-400 text-[10px]">Comparisons</div>
                  <div className="font-mono font-bold text-amber-300 tabular-nums">
                    {currentStep.comparisons}
                  </div>
                </div>

                <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-850">
                  <div className="text-slate-400 text-[10px]">Swaps/Writes</div>
                  <div className="font-mono font-bold text-rose-300 tabular-nums">
                    {currentStep.swaps}
                  </div>
                </div>

                <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-850">
                  <div className="text-slate-400 text-[10px]">Accesses</div>
                  <div className="font-mono font-bold text-indigo-300 tabular-nums">
                    {currentStep.accesses}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Performance Comparison Summary Table (Always available, highlighted when all finish) */}
      <div className="flex flex-col rounded-2xl bg-slate-900/90 border border-slate-800 p-5 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-800 mb-4 gap-2">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Award className="w-4 h-4 text-cyan-400" />
              <span>Performance Comparison</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Metrics calculated on the same initial input of {testArray.length} items ({order.toUpperCase()} order)
            </p>
          </div>
          {allFinished && (
            <span className="text-xs font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-800/80 px-2.5 py-1 rounded-full">
              Race Completed
            </span>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider font-mono">
                <th className="py-2.5 px-3">Rank</th>
                <th className="py-2.5 px-3">Algorithm</th>
                <th className="py-2.5 px-3 text-right">Comparisons</th>
                <th className="py-2.5 px-3 text-right">Swaps / Writes</th>
                <th className="py-2.5 px-3 text-right">Array Accesses</th>
                <th className="py-2.5 px-3 text-right">Simulated Steps</th>
                <th className="py-2.5 px-3 text-right">Race Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {[...runners]
                .sort((a, b) => {
                  if (a.finishRank && b.finishRank) return a.finishRank - b.finishRank;
                  if (a.finishRank) return -1;
                  if (b.finishRank) return 1;
                  return a.steps.length - b.steps.length;
                })
                .map((runner, idx) => {
                  const lastStep = runner.steps[runner.steps.length - 1];
                  const rank = runner.finishRank || idx + 1;
                  return (
                    <tr
                      key={runner.id}
                      className="hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="py-2.5 px-3 font-bold text-cyan-400">
                        {runner.isFinished ? `#${rank}` : '-'}
                      </td>
                      <td className="py-2.5 px-3 font-sans font-semibold text-white">
                        {runner.name}
                      </td>
                      <td className="py-2.5 px-3 text-right text-amber-300 tabular-nums">
                        {lastStep.comparisons.toLocaleString()}
                      </td>
                      <td className="py-2.5 px-3 text-right text-rose-300 tabular-nums">
                        {lastStep.swaps.toLocaleString()}
                      </td>
                      <td className="py-2.5 px-3 text-right text-indigo-300 tabular-nums">
                        {lastStep.accesses.toLocaleString()}
                      </td>
                      <td className="py-2.5 px-3 text-right text-slate-300 tabular-nums">
                        {runner.steps.length}
                      </td>
                      <td className="py-2.5 px-3 text-right text-emerald-300 font-bold tabular-nums">
                        {runner.timeMs ? `${runner.timeMs}ms` : '–'}
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
