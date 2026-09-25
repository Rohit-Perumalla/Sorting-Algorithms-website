import React, { useMemo } from 'react';
import { SortStep, MergeTreeNodeSnapshot } from '../types/sorting';
import { ArrowDown, Layers, Split, GitMerge, CheckCircle2 } from 'lucide-react';

interface MergeTreeVisualizerProps {
  step: SortStep;
  height?: number;
}

interface TreeLevelLayout {
  depth: number;
  nodes: (MergeTreeNodeSnapshot & {
    xPct: number;
    parentXPct?: number;
  })[];
}

export const MergeTreeVisualizer: React.FC<MergeTreeVisualizerProps> = ({
  step,
  height = 460
}) => {
  const { meta } = step;
  const nodes = meta?.mergeTreeNodes || [];
  const activeNodeId = meta?.activeMergeNodeId;
  const mergeBuffer = meta?.mergeBuffer;

  // Group nodes by depth
  const levels = useMemo(() => {
    if (!nodes.length) return [];

    const maxDepth = Math.max(...nodes.map((n) => n.depth), 0);
    const result: TreeLevelLayout[] = [];

    // Helper map to quickly find parent positions
    const nodePositionMap = new Map<string, number>();

    for (let d = 0; d <= maxDepth; d++) {
      const depthNodes = nodes.filter((n) => n.depth === d);
      // Sort nodes at depth by left index
      depthNodes.sort((a, b) => a.left - b.left);

      const totalAtDepth = depthNodes.length;
      const layoutNodes = depthNodes.map((node, index) => {
        // Compute x percentage across width
        const xPct = ((index + 0.5) / totalAtDepth) * 100;
        nodePositionMap.set(node.id, xPct);

        const parentXPct = node.parentId ? nodePositionMap.get(node.parentId) : undefined;

        return {
          ...node,
          xPct,
          parentXPct
        };
      });

      result.push({
        depth: d,
        nodes: layoutNodes
      });
    }

    return result;
  }, [nodes]);

  const getNodeStyles = (state: MergeTreeNodeSnapshot['state'], isActive: boolean) => {
    if (isActive) {
      return {
        card: 'border-fuchsia-400 bg-fuchsia-950/60 shadow-lg shadow-fuchsia-950/50 ring-2 ring-fuchsia-400/50',
        badge: 'bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-500/40',
        cells: 'border-fuchsia-400/40 bg-fuchsia-900/40 text-fuchsia-200'
      };
    }
    switch (state) {
      case 'dividing':
        return {
          card: 'border-cyan-400 bg-cyan-950/50 shadow-md shadow-cyan-950/40 ring-1 ring-cyan-400/40',
          badge: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
          cells: 'border-cyan-500/30 bg-cyan-900/30 text-cyan-200'
        };
      case 'active-left':
        return {
          card: 'border-indigo-400 bg-indigo-950/50 shadow-md shadow-indigo-950/40',
          badge: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40',
          cells: 'border-indigo-500/30 bg-indigo-900/30 text-indigo-200'
        };
      case 'active-right':
        return {
          card: 'border-sky-400 bg-sky-950/50 shadow-md shadow-sky-950/40',
          badge: 'bg-sky-500/20 text-sky-300 border-sky-500/40',
          cells: 'border-sky-500/30 bg-sky-900/30 text-sky-200'
        };
      case 'merging':
        return {
          card: 'border-amber-400 bg-amber-950/50 shadow-md shadow-amber-950/40',
          badge: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
          cells: 'border-amber-500/30 bg-amber-900/30 text-amber-200'
        };
      case 'sorted':
        return {
          card: 'border-emerald-500/80 bg-emerald-950/40 shadow-sm shadow-emerald-950/30',
          badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
          cells: 'border-emerald-500/30 bg-emerald-900/30 text-emerald-200'
        };
      case 'pending':
      default:
        return {
          card: 'border-slate-800 bg-slate-900/50 opacity-60',
          badge: 'bg-slate-800 text-slate-400 border-slate-700/50',
          cells: 'border-slate-800 bg-slate-950/60 text-slate-400'
        };
    }
  };

  return (
    <div className="relative w-full rounded-2xl bg-slate-950/80 border border-slate-800 p-4 sm:p-5 overflow-hidden flex flex-col gap-4">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between text-xs px-3.5 py-2 bg-slate-900/80 rounded-xl border border-slate-800 gap-2">
        <div className="flex items-center gap-2">
          <Split className="w-4 h-4 text-cyan-400" />
          <span className="font-bold text-white">Divide &amp; Conquer Recursion Tree</span>
          <span className="text-slate-500">·</span>
          <span className="text-slate-400">
            Total Tree Depth: <strong className="text-cyan-300">{levels.length} levels</strong>
          </span>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-3 text-slate-400 text-[11px]">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-sm bg-cyan-400" /> Dividing
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-sm bg-indigo-400" /> Left Subarray
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-sm bg-sky-400" /> Right Subarray
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-sm bg-fuchsia-400" /> Active Merge
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500" /> Sorted Subarray
          </span>
        </div>
      </div>

      {/* Active Merge Inspector Panel (when merging is active) */}
      {mergeBuffer && (
        <div className="p-3.5 rounded-xl bg-slate-900/90 border border-fuchsia-500/40 shadow-lg shadow-fuchsia-950/20">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-2.5">
            <div className="flex items-center gap-2 text-xs font-bold text-fuchsia-300">
              <GitMerge className="w-4 h-4 text-fuchsia-400" />
              <span>Active Two-Way Merge Step</span>
            </div>
            <span className="text-[11px] font-mono text-slate-400">
              {mergeBuffer.mergedArray.length} of {mergeBuffer.leftArray.length + mergeBuffer.rightArray.length} merged
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center text-xs">
            {/* Left Subarray */}
            <div className="p-2.5 rounded-lg bg-slate-950/70 border border-indigo-500/40">
              <span className="text-[10px] uppercase font-bold text-indigo-400 block mb-1.5">
                Left Half Subarray
              </span>
              <div className="flex flex-wrap gap-1">
                {mergeBuffer.leftArray.map((val, idx) => {
                  const isCurrent = mergeBuffer.leftPointer === idx;
                  const isConsumed = mergeBuffer.leftPointer !== undefined && idx < mergeBuffer.leftPointer;
                  return (
                    <span
                      key={idx}
                      className={`px-2 py-0.5 rounded font-mono font-semibold transition-all ${
                        isCurrent
                          ? 'bg-amber-400 text-slate-950 ring-2 ring-amber-300 scale-105'
                          : isConsumed
                          ? 'bg-slate-800/50 text-slate-600 line-through'
                          : 'bg-indigo-950/80 text-indigo-200 border border-indigo-800/60'
                      }`}
                    >
                      {val}
                    </span>
                  );
                })}
              </div>
            </div>

            {/* Right Subarray */}
            <div className="p-2.5 rounded-lg bg-slate-950/70 border border-sky-500/40">
              <span className="text-[10px] uppercase font-bold text-sky-400 block mb-1.5">
                Right Half Subarray
              </span>
              <div className="flex flex-wrap gap-1">
                {mergeBuffer.rightArray.map((val, idx) => {
                  const isCurrent = mergeBuffer.rightPointer === idx;
                  const isConsumed = mergeBuffer.rightPointer !== undefined && idx < mergeBuffer.rightPointer;
                  return (
                    <span
                      key={idx}
                      className={`px-2 py-0.5 rounded font-mono font-semibold transition-all ${
                        isCurrent
                          ? 'bg-amber-400 text-slate-950 ring-2 ring-amber-300 scale-105'
                          : isConsumed
                          ? 'bg-slate-800/50 text-slate-600 line-through'
                          : 'bg-sky-950/80 text-sky-200 border border-sky-800/60'
                      }`}
                    >
                      {val}
                    </span>
                  );
                })}
              </div>
            </div>

            {/* Resulting Merged Subarray */}
            <div className="p-2.5 rounded-lg bg-slate-950/70 border border-emerald-500/40">
              <span className="text-[10px] uppercase font-bold text-emerald-400 block mb-1.5">
                Output Merged Buffer
              </span>
              <div className="flex flex-wrap gap-1 min-h-[26px] items-center">
                {mergeBuffer.mergedArray.length === 0 ? (
                  <span className="text-slate-500 text-[11px] italic">Awaiting elements...</span>
                ) : (
                  mergeBuffer.mergedArray.map((val, idx) => {
                    const isNewest = idx === mergeBuffer.mergedArray.length - 1;
                    return (
                      <span
                        key={idx}
                        className={`px-2 py-0.5 rounded font-mono font-semibold transition-all ${
                          isNewest
                            ? 'bg-fuchsia-500 text-white ring-2 ring-fuchsia-300 scale-105'
                            : 'bg-emerald-950 text-emerald-300 border border-emerald-800/60'
                        }`}
                      >
                        {val}
                      </span>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Recursion Tree Area */}
      <div
        className="w-full overflow-x-auto overflow-y-auto pb-4 pt-2 relative"
        style={{ minHeight: `${height}px` }}
      >
        <div className="min-w-[760px] flex flex-col gap-6 py-2">
          {levels.map((level) => (
            <div key={level.depth} className="relative flex flex-col items-center">
              {/* Level indicator watermark */}
              <div className="w-full flex items-center justify-between text-[10px] font-mono text-slate-600 mb-1 px-2 select-none border-b border-slate-900 pb-0.5">
                <span>Level {level.depth} {level.depth === 0 ? '(Root Array)' : level.depth === levels.length - 1 ? '(Base Leaves)' : ''}</span>
                <span>{level.nodes.length} subarrays</span>
              </div>

              {/* Row of Subarray Nodes at this depth */}
              <div className="w-full flex justify-around items-start gap-2 pt-1">
                {level.nodes.map((node) => {
                  const isActive = node.id === activeNodeId;
                  const styles = getNodeStyles(node.state, isActive);
                  const isLeaf = node.left === node.right;

                  return (
                    <div
                      key={node.id}
                      className={`flex flex-col items-center p-2 rounded-xl border transition-all duration-200 select-none ${styles.card}`}
                      style={{
                        minWidth: isLeaf ? '52px' : '72px',
                        maxWidth: '220px'
                      }}
                    >
                      {/* Subarray Range Header */}
                      <div className="flex items-center justify-between gap-1 w-full text-[10px] font-mono mb-1">
                        <span className={`px-1 rounded border text-[9px] ${styles.badge}`}>
                          [{node.left}..{node.right}]
                        </span>
                        {node.state === 'sorted' && (
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        )}
                      </div>

                      {/* Elements in this Subarray */}
                      <div className="flex flex-wrap justify-center gap-1 w-full">
                        {node.values.map((v, i) => (
                          <span
                            key={i}
                            className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold border transition-colors ${styles.cells}`}
                          >
                            {v}
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Visual downward branch indicators between levels */}
              {level.depth < levels.length - 1 && (
                <div className="flex justify-center items-center my-1 text-slate-700">
                  <ArrowDown className="w-3 h-3 opacity-40 animate-pulse" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
