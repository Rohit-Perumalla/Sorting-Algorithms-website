import React, { useState } from 'react';
import { ALGORITHMS } from '../algorithms';
import { AlgorithmId } from '../types/sorting';
import { BookOpen, Code2, HelpCircle, CheckCircle, AlertTriangle, Lightbulb } from 'lucide-react';

interface EducationalSectionProps {
  selectedAlgorithm: AlgorithmId;
  onSelectAlgorithm: (id: AlgorithmId) => void;
}

export const EducationalSection: React.FC<EducationalSectionProps> = ({
  selectedAlgorithm,
  onSelectAlgorithm
}) => {
  const [activeTab, setActiveTab] = useState<'how-it-works' | 'which-to-use'>('how-it-works');
  const currentAlgo = ALGORITHMS.find((a) => a.id === selectedAlgorithm) || ALGORITHMS[0];

  return (
    <div className="flex flex-col gap-6">
      {/* Tab Switcher */}
      <div className="flex items-center gap-2 p-1.5 bg-slate-900 rounded-2xl border border-slate-800 w-fit">
        <button
          onClick={() => setActiveTab('how-it-works')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl transition-colors ${
            activeTab === 'how-it-works'
              ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>How It Works & Pseudocode</span>
        </button>
        <button
          onClick={() => setActiveTab('which-to-use')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl transition-colors ${
            activeTab === 'which-to-use'
              ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <HelpCircle className="w-4 h-4" />
          <span>Which Algorithm Should I Use?</span>
        </button>
      </div>

      {activeTab === 'how-it-works' ? (
        <div className="flex flex-col gap-6">
          {/* Sub-selector for algorithms */}
          <div className="flex flex-wrap items-center gap-2">
            {ALGORITHMS.map((algo) => (
              <button
                key={algo.id}
                onClick={() => onSelectAlgorithm(algo.id)}
                className={`px-3 py-1.5 text-xs font-medium rounded-xl transition-colors ${
                  algo.id === selectedAlgorithm
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-sm font-semibold'
                    : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
                }`}
              >
                {algo.name}
              </button>
            ))}
          </div>

          {/* Algorithm Details Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left: Conceptual Explanation, Example Walkthrough, and Pros/Cons */}
            <div className="flex flex-col gap-5 p-5 sm:p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl">
              <div>
                <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-3">
                  <h3 className="text-lg font-bold text-white tracking-tight">
                    {currentAlgo.name} Explanation
                  </h3>
                  <span className="text-xs font-medium text-cyan-400 font-mono">
                    {currentAlgo.category}
                  </span>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {currentAlgo.explanation}
                </p>
              </div>

              {/* Concrete Worked Example */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-850">
                <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Lightbulb className="w-3.5 h-3.5" />
                  <span>Worked Example with [5, 2, 8, 1, 9]</span>
                </h4>
                <div className="text-xs text-slate-300 space-y-1.5 font-mono">
                  {selectedAlgorithm === 'bubble' && (
                    <>
                      <p>• Pass 1: Compare (5,2) -&gt; Swap -&gt; [2, 5, 8, 1, 9]</p>
                      <p>• Pass 1: Compare (5,8) -&gt; Ok; (8,1) -&gt; Swap -&gt; [2, 5, 1, 8, 9]</p>
                      <p>• Pass 1: Compare (8,9) -&gt; Ok. Largest element (9) locked at end.</p>
                      <p>• Pass 2: Compare (2,5) -&gt; Ok; (5,1) -&gt; Swap -&gt; [2, 1, 5, 8, 9]</p>
                      <p>• Pass 3: Compare (2,1) -&gt; Swap -&gt; [1, 2, 5, 8, 9]. Done!</p>
                    </>
                  )}
                  {selectedAlgorithm === 'selection' && (
                    <>
                      <p>• Step 1: Scan [5, 2, 8, 1, 9] -&gt; Min is 1 at index 3. Swap with index 0 -&gt; [1, 2, 8, 5, 9]</p>
                      <p>• Step 2: Scan [2, 8, 5, 9] -&gt; Min is 2 at index 1. Already in place -&gt; [1, 2, 8, 5, 9]</p>
                      <p>• Step 3: Scan [8, 5, 9] -&gt; Min is 5 at index 3. Swap with index 2 -&gt; [1, 2, 5, 8, 9]</p>
                      <p>• Step 4: Scan [8, 9] -&gt; Min is 8 at index 3. In place -&gt; [1, 2, 5, 8, 9]</p>
                    </>
                  )}
                  {selectedAlgorithm === 'insertion' && (
                    <>
                      <p>• Step 1: Key = 2. Compare with 5, shift 5 right -&gt; [2, 5, 8, 1, 9]</p>
                      <p>• Step 2: Key = 8. Greater than 5, keep in place -&gt; [2, 5, 8, 1, 9]</p>
                      <p>• Step 3: Key = 1. Shift 8, 5, 2 right, place 1 at index 0 -&gt; [1, 2, 5, 8, 9]</p>
                      <p>• Step 4: Key = 9. Greater than 8, keep in place -&gt; [1, 2, 5, 8, 9]</p>
                    </>
                  )}
                  {selectedAlgorithm === 'merge' && (
                    <>
                      <p>• Divide: Split into [5, 2] and [8, 1, 9]</p>
                      <p>• Divide further: [5], [2] -&gt; Merge into [2, 5]</p>
                      <p>• Divide [8, 1, 9] into [8] and [1, 9] -&gt; Merge [1] &amp; [9] into [1, 9], then merge with [8] into [1, 8, 9]</p>
                      <p>• Final Merge: Merge [2, 5] and [1, 8, 9] -&gt; [1, 2, 5, 8, 9]</p>
                    </>
                  )}
                  {selectedAlgorithm === 'quick' && (
                    <>
                      <p>• Choose Pivot: arr[4] = 9. Elements &lt; 9 placed left: [5, 2, 8, 1 | 9]</p>
                      <p>• Recurse Left on [5, 2, 8, 1]. Choose Pivot = 1.</p>
                      <p>• Partition around 1: All elements &gt; 1, so 1 placed at index 0 -&gt; [1 | 2, 8, 5]</p>
                      <p>• Recurse on [2, 8, 5]. Pivot = 5. Left: 2, Right: 8 -&gt; [2, 5, 8]</p>
                      <p>• Result combined: [1, 2, 5, 8, 9]</p>
                    </>
                  )}
                  {selectedAlgorithm === 'heap' && (
                    <>
                      <p>• Build Max-Heap: Rearrange array into max-heap [9, 5, 8, 1, 2]</p>
                      <p>• Extract 9 (root): Swap with 2 -&gt; [2, 5, 8, 1 | 9]. Sift down 2 -&gt; [8, 5, 2, 1 | 9]</p>
                      <p>• Extract 8: Swap with 1 -&gt; [1, 5, 2 | 8, 9]. Sift down 1 -&gt; [5, 1, 2 | 8, 9]</p>
                      <p>• Extract 5: Swap with 2 -&gt; [2, 1 | 5, 8, 9]. Sift down 2 -&gt; [2, 1 | 5, 8, 9]</p>
                      <p>• Extract 2: Swap with 1 -&gt; [1, 2, 5, 8, 9]. Complete!</p>
                    </>
                  )}
                </div>
              </div>

              {/* Strengths & Weaknesses */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-900/40">
                  <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 mb-2">
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Advantages</span>
                  </span>
                  <ul className="text-xs text-slate-300 space-y-1">
                    {currentAlgo.pros.map((p, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-emerald-500 mt-0.5">•</span>
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-3.5 rounded-xl bg-rose-950/20 border border-rose-900/40">
                  <span className="text-xs font-bold text-rose-400 flex items-center gap-1.5 mb-2">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Trade-offs & Limitations</span>
                  </span>
                  <ul className="text-xs text-slate-300 space-y-1">
                    {currentAlgo.cons.map((c, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-rose-500 mt-0.5">•</span>
                        <span>{c}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Right: Pseudocode & Complexity Card */}
            <div className="flex flex-col gap-5 p-5 sm:p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Code2 className="w-4 h-4 text-cyan-400" />
                  <span>Standard Pseudocode</span>
                </h4>
                <span className="text-[11px] font-mono text-slate-400">
                  Time: {currentAlgo.avgTime} · Space: {currentAlgo.spaceComplexity}
                </span>
              </div>

              {/* Code container */}
              <div className="rounded-xl bg-slate-950 p-4 border border-slate-850 overflow-x-auto">
                <pre className="font-mono text-xs text-cyan-300 leading-relaxed">
                  {currentAlgo.pseudocode.map((line, idx) => (
                    <div key={idx} className="flex">
                      <span className="w-6 shrink-0 text-slate-600 select-none text-right pr-2">
                        {idx + 1}
                      </span>
                      <span className="whitespace-pre">{line}</span>
                    </div>
                  ))}
                </pre>
              </div>

              {/* Summary Complexity Matrix Table */}
              <div>
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Complexity Summary Matrix
                </h4>
                <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950">
                  <table className="w-full text-left text-xs font-mono">
                    <thead className="bg-slate-900 border-b border-slate-800 text-slate-400 font-sans">
                      <tr>
                        <th className="p-2.5">Metric</th>
                        <th className="p-2.5">Value</th>
                        <th className="p-2.5">Notes</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-850">
                      <tr>
                        <td className="p-2.5 text-slate-400">Best Case</td>
                        <td className="p-2.5 text-emerald-400 font-bold">{currentAlgo.bestTime}</td>
                        <td className="p-2.5 text-slate-400 font-sans">Already sorted input</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 text-slate-400">Average Case</td>
                        <td className="p-2.5 text-amber-400 font-bold">{currentAlgo.avgTime}</td>
                        <td className="p-2.5 text-slate-400 font-sans">Randomized distribution</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 text-slate-400">Worst Case</td>
                        <td className="p-2.5 text-rose-400 font-bold">{currentAlgo.worstTime}</td>
                        <td className="p-2.5 text-slate-400 font-sans">Reversed or adversarial input</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 text-slate-400">Auxiliary Space</td>
                        <td className="p-2.5 text-sky-400 font-bold">{currentAlgo.spaceComplexity}</td>
                        <td className="p-2.5 text-slate-400 font-sans">
                          {currentAlgo.isInPlace ? 'In-place memory' : 'Extra array allocation'}
                        </td>
                      </tr>
                      <tr>
                        <td className="p-2.5 text-slate-400">Stability</td>
                        <td className="p-2.5 font-bold font-sans">
                          {currentAlgo.isStable ? (
                            <span className="text-emerald-400">Stable</span>
                          ) : (
                            <span className="text-rose-400">Unstable</span>
                          )}
                        </td>
                        <td className="p-2.5 text-slate-400 font-sans">
                          {currentAlgo.isStable ? 'Preserves duplicate order' : 'May swap identical keys'}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* "Which Algorithm Should I Use?" Guide Section */
        <div className="flex flex-col gap-6 p-5 sm:p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl">
          <div className="pb-3 border-b border-slate-800">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-cyan-400" />
              <span>Which Algorithm Should I Use? Practical Decision Matrix</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              There is no single "best" sorting algorithm. The optimal choice depends strictly on dataset size, memory constraints, data distribution, and stability requirements.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Scenario 1 */}
            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-850 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-cyan-400 uppercase tracking-wide">
                  Small Datasets (N &lt; 20)
                </span>
                <h4 className="text-sm font-bold text-white mt-1">Use Insertion Sort</h4>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  Due to negligible constant factors, simplicity, and low branch-prediction penalties, Insertion Sort outperforms O(n log n) algorithms on small lists. This is why standard library implementations (like Timsort and Introsort) switch to Insertion Sort for partitions smaller than 16–32 elements.
                </p>
              </div>
              <div className="mt-3 pt-2 border-t border-slate-800 text-[11px] text-slate-400">
                Key advantage: Fast setup, O(1) space, adaptive O(n) on nearly sorted data.
              </div>
            </div>

            {/* Scenario 2 */}
            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-850 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-cyan-400 uppercase tracking-wide">
                  Nearly Sorted / Streaming Data
                </span>
                <h4 className="text-sm font-bold text-white mt-1">Use Insertion Sort</h4>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  When elements are already close to their final positions (e.g., periodic updates in a live leaderboard or real-time sensor streams), Insertion Sort runs in linear O(n) time and can sort incoming data on the fly.
                </p>
              </div>
              <div className="mt-3 pt-2 border-t border-slate-800 text-[11px] text-slate-400">
                Key advantage: Few inversions = minimal element shifts.
              </div>
            </div>

            {/* Scenario 3 */}
            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-850 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-cyan-400 uppercase tracking-wide">
                  General Fast In-Memory Sorting
                </span>
                <h4 className="text-sm font-bold text-white mt-1">Use Quick Sort</h4>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  Quick Sort exhibits outstanding CPU cache locality and minimal overhead because it partitions contiguous memory in-place. With dual-pivot or randomized pivots, it consistently outperforms other O(n log n) alternatives on modern hardware.
                </p>
              </div>
              <div className="mt-3 pt-2 border-t border-slate-800 text-[11px] text-slate-400">
                Key advantage: 2x–3x faster in wall-clock time than Merge or Heap sort.
              </div>
            </div>

            {/* Scenario 4 */}
            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-850 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-cyan-400 uppercase tracking-wide">
                  Strict O(N log N) &amp; Stability
                </span>
                <h4 className="text-sm font-bold text-white mt-1">Use Merge Sort</h4>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  When duplicate keys must retain their original order (e.g., sorting contacts by last name then by first name), or when worst-case latency must never degrade into O(n²), Merge Sort guarantees O(n log n) and stability at the cost of O(n) extra RAM.
                </p>
              </div>
              <div className="mt-3 pt-2 border-t border-slate-800 text-[11px] text-slate-400">
                Key advantage: Deterministic performance and stable ordering.
              </div>
            </div>

            {/* Scenario 5 */}
            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-850 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-cyan-400 uppercase tracking-wide">
                  Embedded &amp; Memory-Constrained
                </span>
                <h4 className="text-sm font-bold text-white mt-1">Use Heap Sort</h4>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  In safety-critical or resource-constrained embedded systems where recursive call stack overflows cannot be tolerated and memory allocation is banned, Heap Sort delivers guaranteed O(n log n) with true O(1) auxiliary space.
                </p>
              </div>
              <div className="mt-3 pt-2 border-t border-slate-800 text-[11px] text-slate-400">
                Key advantage: Zero extra memory allocation and zero recursion risk.
              </div>
            </div>

            {/* Scenario 6 */}
            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-850 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-cyan-400 uppercase tracking-wide">
                  Expensive Memory Writes
                </span>
                <h4 className="text-sm font-bold text-white mt-1">Use Selection Sort</h4>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  When writing to memory involves high cost or hardware wear (such as writing to EEPROM or flash memory), Selection Sort makes at most N swaps total, minimizing physical writes despite high comparison counts.
                </p>
              </div>
              <div className="mt-3 pt-2 border-t border-slate-800 text-[11px] text-slate-400">
                Key advantage: Strictly O(n) writes across all input cases.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
