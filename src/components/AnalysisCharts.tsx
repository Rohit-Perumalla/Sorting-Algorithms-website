import React, { useState } from 'react';
import { AlgorithmId, BenchmarkResult } from '../types/sorting';
import { ALGORITHMS } from '../algorithms';
import { runBenchmarkSuite } from '../utils/benchmark';
import { BarChart3, LineChart, TrendingUp, Play, Layers } from 'lucide-react';

interface AnalysisChartsProps {
  currentArray: number[];
  currentSortedArray: number[];
}

export const AnalysisCharts: React.FC<AnalysisChartsProps> = ({
  currentArray,
  currentSortedArray
}) => {
  // 1. Time Complexity Graph State
  const [complexityCase, setComplexityCase] = useState<'best' | 'avg' | 'worst'>('avg');
  const [activeComplexityAlgos, setActiveComplexityAlgos] = useState<AlgorithmId[]>([
    'bubble',
    'selection',
    'insertion',
    'merge',
    'quick',
    'heap'
  ]);

  // 2. Performance Benchmark State
  const [benchmarkResults, setBenchmarkResults] = useState<BenchmarkResult[]>(() =>
    runBenchmarkSuite(['bubble', 'selection', 'insertion', 'merge', 'quick', 'heap'], [10, 25, 50], 2)
  );
  const [isBenchmarking, setIsBenchmarking] = useState(false);
  const [selectedBenchmarkMetric, setSelectedBenchmarkMetric] = useState<'comparisons' | 'swaps' | 'timeMs'>('comparisons');

  // Complexity curve math for N = 10 to 100
  const nPoints = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];

  const getTheoreticalValue = (algoId: AlgorithmId, cCase: 'best' | 'avg' | 'worst', n: number): number => {
    switch (algoId) {
      case 'bubble':
        if (cCase === 'best') return n; // O(n)
        return (n * (n - 1)) / 2; // O(n^2)
      case 'selection':
        return (n * (n - 1)) / 2; // Always O(n^2)
      case 'insertion':
        if (cCase === 'best') return n; // O(n)
        if (cCase === 'avg') return (n * (n - 1)) / 4; // O(n^2)
        return (n * (n - 1)) / 2; // O(n^2)
      case 'merge':
        return n * Math.log2(n); // O(n log n)
      case 'quick':
        if (cCase === 'worst') return (n * (n - 1)) / 2; // O(n^2)
        return n * Math.log2(n); // O(n log n)
      case 'heap':
        return n * Math.log2(n); // O(n log n)
      default:
        return n;
    }
  };

  const algoColors: Record<AlgorithmId, string> = {
    bubble: '#f43f5e', // rose-500
    selection: '#a855f7', // purple-500
    insertion: '#eab308', // yellow-500
    merge: '#06b6d4', // cyan-500
    quick: '#3b82f6', // blue-500
    heap: '#10b981' // emerald-500
  };

  const handleToggleComplexityAlgo = (id: AlgorithmId) => {
    if (activeComplexityAlgos.includes(id)) {
      if (activeComplexityAlgos.length <= 1) return;
      setActiveComplexityAlgos(activeComplexityAlgos.filter((x) => x !== id));
    } else {
      setActiveComplexityAlgos([...activeComplexityAlgos, id]);
    }
  };

  const handleRunBenchmark = () => {
    setIsBenchmarking(true);
    setTimeout(() => {
      const results = runBenchmarkSuite(
        ['bubble', 'selection', 'insertion', 'merge', 'quick', 'heap'],
        [10, 25, 50, 75],
        3
      );
      setBenchmarkResults(results);
      setIsBenchmarking(false);
    }, 100);
  };

  // Histogram calculation for current array (buckets of 10)
  const calculateDistribution = (arr: number[]) => {
    const buckets = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    const bucketLabels = ['0-9', '10-19', '20-29', '30-39', '40-49', '50-59', '60-69', '70-79', '80-89', '90-99'];

    arr.forEach((val) => {
      const idx = Math.min(9, Math.max(0, Math.floor(val / 10)));
      buckets[idx]++;
    });

    return { buckets, bucketLabels };
  };

  const unsortedDist = calculateDistribution(currentArray);
  const maxBucketCount = Math.max(...unsortedDist.buckets, 1);

  // SVG Chart dimensions
  const chartWidth = 680;
  const chartHeight = 280;
  const padding = { top: 25, right: 30, bottom: 40, left: 60 };
  const innerWidth = chartWidth - padding.left - padding.right;
  const innerHeight = chartHeight - padding.top - padding.bottom;

  // Max value for complexity graph
  const maxComplexityY = 5000; // (100 * 99) / 2 = 4950

  return (
    <div className="flex flex-col gap-8">
      {/* 1. TIME COMPLEXITY GRAPH */}
      <div className="flex flex-col rounded-2xl bg-slate-900/90 border border-slate-800 p-5 sm:p-6 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-4 border-b border-slate-800 gap-3">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <LineChart className="w-4 h-4 text-cyan-400" />
              <span>1. Time Complexity Growth Curves</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Theoretical operations vs Input Size $N$ (from $N=10$ to $N=100$)
            </p>
          </div>

          {/* Case Selector: Best / Average / Worst */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Case:</span>
            <div className="inline-flex p-1 bg-slate-950 rounded-xl border border-slate-800 text-xs">
              <button
                onClick={() => setComplexityCase('best')}
                className={`px-3 py-1 font-medium rounded-lg transition-colors ${
                  complexityCase === 'best'
                    ? 'bg-emerald-500/20 text-emerald-300 font-semibold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Best Case
              </button>
              <button
                onClick={() => setComplexityCase('avg')}
                className={`px-3 py-1 font-medium rounded-lg transition-colors ${
                  complexityCase === 'avg'
                    ? 'bg-cyan-500/20 text-cyan-300 font-semibold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Average Case
              </button>
              <button
                onClick={() => setComplexityCase('worst')}
                className={`px-3 py-1 font-medium rounded-lg transition-colors ${
                  complexityCase === 'worst'
                    ? 'bg-rose-500/20 text-rose-300 font-semibold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Worst Case
              </button>
            </div>
          </div>
        </div>

        {/* Algorithm Toggles for Complexity Graph */}
        <div className="flex flex-wrap items-center gap-2 pt-3">
          {ALGORITHMS.map((algo) => {
            const active = activeComplexityAlgos.includes(algo.id);
            const color = algoColors[algo.id];
            return (
              <button
                key={algo.id}
                onClick={() => handleToggleComplexityAlgo(algo.id)}
                className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-lg border transition-all ${
                  active
                    ? 'bg-slate-800 text-white border-slate-600'
                    : 'bg-slate-950/60 text-slate-500 border-slate-850 hover:text-slate-300'
                }`}
              >
                <span
                  className="w-2.5 h-2.5 rounded-full inline-block"
                  style={{ backgroundColor: active ? color : '#475569' }}
                />
                <span>{algo.name}</span>
                <span className="font-mono text-[10px] opacity-70">
                  (
                  {complexityCase === 'best'
                    ? algo.bestTime
                    : complexityCase === 'avg'
                    ? algo.avgTime
                    : algo.worstTime}
                  )
                </span>
              </button>
            );
          })}
        </div>

        {/* SVG Line Graph */}
        <div className="w-full overflow-x-auto flex justify-center py-2">
          <svg
            viewBox={`0 0 ${chartWidth} ${chartHeight}`}
            className="w-full max-w-[700px] select-none"
            style={{ height: `${chartHeight}px` }}
          >
            {/* Grid lines and axes */}
            <g stroke="#334155" strokeWidth="1" strokeDasharray="3 3">
              {[0, 1000, 2000, 3000, 4000, 5000].map((val) => {
                const y = padding.top + innerHeight - (val / maxComplexityY) * innerHeight;
                return (
                  <g key={val}>
                    <line x1={padding.left} y1={y} x2={chartWidth - padding.right} y2={y} />
                    <text
                      x={padding.left - 10}
                      y={y + 3}
                      fill="#94a3b8"
                      fontSize="9px"
                      textAnchor="end"
                      fontFamily="monospace"
                    >
                      {val}
                    </text>
                  </g>
                );
              })}

              {nPoints.map((n) => {
                const x = padding.left + ((n - 10) / 90) * innerWidth;
                return (
                  <g key={n}>
                    <line x1={x} y1={padding.top} x2={x} y2={padding.top + innerHeight} />
                    <text
                      x={x}
                      y={padding.top + innerHeight + 16}
                      fill="#94a3b8"
                      fontSize="9px"
                      textAnchor="middle"
                      fontFamily="monospace"
                    >
                      N={n}
                    </text>
                  </g>
                );
              })}
            </g>

            {/* Axis labels */}
            <text
              x={chartWidth / 2}
              y={chartHeight - 6}
              textAnchor="middle"
              fill="#cbd5e1"
              fontSize="11px"
              fontWeight="600"
            >
              Input Array Size (N)
            </text>
            <text
              x={15}
              y={chartHeight / 2}
              textAnchor="middle"
              fill="#cbd5e1"
              fontSize="11px"
              fontWeight="600"
              transform={`rotate(-90 15 ${chartHeight / 2})`}
            >
              Operations Count (f(N))
            </text>

            {/* Plot Lines */}
            {activeComplexityAlgos.map((algoId) => {
              const points = nPoints.map((n) => {
                const val = getTheoreticalValue(algoId, complexityCase, n);
                const x = padding.left + ((n - 10) / 90) * innerWidth;
                const y = padding.top + innerHeight - (Math.min(val, maxComplexityY) / maxComplexityY) * innerHeight;
                return `${x},${y}`;
              });

              return (
                <g key={algoId}>
                  <polyline
                    fill="none"
                    stroke={algoColors[algoId]}
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points={points.join(' ')}
                  />
                  {nPoints.map((n) => {
                    const val = getTheoreticalValue(algoId, complexityCase, n);
                    const x = padding.left + ((n - 10) / 90) * innerWidth;
                    const y = padding.top + innerHeight - (Math.min(val, maxComplexityY) / maxComplexityY) * innerHeight;
                    return (
                      <circle
                        key={n}
                        cx={x}
                        cy={y}
                        r={3}
                        fill={algoColors[algoId]}
                        stroke="#0f172a"
                        strokeWidth="1.5"
                      />
                    );
                  })}
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* 2. PERFORMANCE BENCHMARK & COMPARISON CHART */}
      <div className="flex flex-col rounded-2xl bg-slate-900/90 border border-slate-800 p-5 sm:p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-3">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-cyan-400" />
              <span>2. Live Performance Benchmark & Comparison Chart</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Empirical execution measurements on randomized datasets across sizes N=10, 25, 50, 75
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Metric Selector */}
            <div className="inline-flex p-1 bg-slate-950 rounded-xl border border-slate-800 text-xs">
              <button
                onClick={() => setSelectedBenchmarkMetric('comparisons')}
                className={`px-3 py-1 font-medium rounded-lg transition-colors ${
                  selectedBenchmarkMetric === 'comparisons'
                    ? 'bg-amber-500/20 text-amber-300 font-semibold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Comparisons
              </button>
              <button
                onClick={() => setSelectedBenchmarkMetric('swaps')}
                className={`px-3 py-1 font-medium rounded-lg transition-colors ${
                  selectedBenchmarkMetric === 'swaps'
                    ? 'bg-rose-500/20 text-rose-300 font-semibold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Swaps / Writes
              </button>
              <button
                onClick={() => setSelectedBenchmarkMetric('timeMs')}
                className={`px-3 py-1 font-medium rounded-lg transition-colors ${
                  selectedBenchmarkMetric === 'timeMs'
                    ? 'bg-emerald-500/20 text-emerald-300 font-semibold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Time (ms)
              </button>
            </div>

            <button
              onClick={handleRunBenchmark}
              disabled={isBenchmarking}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 transition-colors shadow-sm disabled:opacity-50"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{isBenchmarking ? 'Running...' : 'Re-run Benchmark'}</span>
            </button>
          </div>
        </div>

        {/* Grouped Bar Chart by Input Size */}
        <div className="mt-4 space-y-5">
          {[10, 25, 50].map((size) => {
            const sizeData = benchmarkResults.filter((r) => r.size === size);
            const maxVal = Math.max(
              ...sizeData.map((d) => (selectedBenchmarkMetric === 'timeMs' ? Math.max(d.timeMs, 0.1) : d[selectedBenchmarkMetric])),
              1
            );

            return (
              <div key={size} className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-850">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-mono font-bold text-cyan-400">Array Size: N = {size}</span>
                  <span className="text-slate-500 text-[11px] font-mono">
                    Metric: {selectedBenchmarkMetric.toUpperCase()}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 pt-1">
                  {sizeData.map((item) => {
                    const rawVal = item[selectedBenchmarkMetric];
                    const barHeightPct = Math.max(8, Math.round((Number(rawVal) / maxVal) * 100));

                    return (
                      <div key={item.algorithmId} className="flex flex-col items-center">
                        <span className="text-[10px] font-mono text-slate-300 mb-1 tabular-nums font-semibold">
                          {selectedBenchmarkMetric === 'timeMs' ? `${rawVal}ms` : Number(rawVal).toLocaleString()}
                        </span>
                        <div className="w-full h-20 bg-slate-900 rounded-lg p-1 flex items-end justify-center border border-slate-800">
                          <div
                            style={{
                              height: `${barHeightPct}%`,
                              backgroundColor: algoColors[item.algorithmId]
                            }}
                            className="w-full rounded transition-all duration-300 opacity-90 hover:opacity-100"
                          />
                        </div>
                        <span className="text-[11px] text-slate-400 mt-1.5 font-medium truncate w-full text-center">
                          {item.name.replace(' Sort', '')}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. HISTOGRAM & DISTRIBUTION SECTION */}
      <div className="flex flex-col rounded-2xl bg-slate-900/90 border border-slate-800 p-5 sm:p-6 shadow-xl">
        <div className="pb-4 border-b border-slate-800">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-cyan-400" />
            <span>3. Array Value Distribution & Histogram</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Frequency distribution of values in current array before sorting vs ordered ramp after sorting
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
          {/* Unsorted Histogram (Frequency Bins) */}
          <div className="flex flex-col p-4 rounded-xl bg-slate-950/70 border border-slate-850">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-300 mb-3">
              <span className="flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-cyan-400" />
                <span>Value Frequency Histogram (Before)</span>
              </span>
              <span className="text-slate-500 font-mono text-[11px]">10 Value Bins</span>
            </div>

            <div className="flex items-end justify-between gap-1 h-36 pt-4">
              {unsortedDist.buckets.map((count, bIdx) => {
                const heightPct = Math.max(6, Math.round((count / maxBucketCount) * 100));
                return (
                  <div key={bIdx} className="flex-1 flex flex-col items-center justify-end h-full">
                    <span className="text-[10px] font-mono text-cyan-400 font-semibold mb-1">
                      {count}
                    </span>
                    <div
                      style={{ height: `${heightPct}%` }}
                      className="w-full bg-cyan-500/80 hover:bg-cyan-400 rounded-t-sm transition-all duration-150"
                    />
                    <span className="text-[9px] font-mono text-slate-400 mt-1 truncate">
                      {unsortedDist.bucketLabels[bIdx]}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Sorted Array Bar Chart Ramp */}
          <div className="flex flex-col p-4 rounded-xl bg-slate-950/70 border border-slate-850">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-300 mb-3">
              <span className="flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                <span>Sorted Monotonic Ramp (After)</span>
              </span>
              <span className="text-slate-500 font-mono text-[11px]">Ascending Order</span>
            </div>

            <div className="flex items-end justify-center gap-1 h-36 pt-4">
              {currentSortedArray.map((val, idx) => {
                const maxVal = Math.max(...currentSortedArray, 1);
                const heightPct = Math.max(8, Math.round((val / maxVal) * 100));
                return (
                  <div
                    key={idx}
                    style={{ height: `${heightPct}%` }}
                    className="flex-1 max-w-[20px] bg-emerald-500/80 hover:bg-emerald-400 rounded-t-sm transition-all duration-150"
                    title={`Value: ${val}`}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
