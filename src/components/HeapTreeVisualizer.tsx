import React from 'react';
import { SortStep, ElementState } from '../types/sorting';

interface HeapTreeVisualizerProps {
  step: SortStep;
  height?: number;
}

interface TreeNode {
  index: number;
  value: number;
  x: number;
  y: number;
  level: number;
  state: ElementState;
  isExtracted: boolean;
  parentId?: number;
}

export const HeapTreeVisualizer: React.FC<HeapTreeVisualizerProps> = ({
  step,
  height = 420
}) => {
  const { array, indices, meta } = step;
  const n = array.length;
  const heapSize = meta?.heapSize !== undefined ? meta.heapSize : n;

  // Calculate coordinates for complete binary tree up to n elements
  // Tree depth
  const maxDepth = Math.floor(Math.log2(Math.max(1, n)));
  const svgWidth = 840;
  const svgHeight = height;
  const levelHeight = svgHeight / (maxDepth + 2);

  const nodes: TreeNode[] = [];
  const lines: { x1: number; y1: number; x2: number; y2: number; isHeapEdge: boolean }[] = [];

  for (let i = 0; i < n; i++) {
    const level = Math.floor(Math.log2(i + 1));
    const indexInLevel = i - (Math.pow(2, level) - 1);
    const totalInLevel = Math.pow(2, level);

    // Spacing across width
    const slotWidth = svgWidth / (totalInLevel + 1);
    const x = slotWidth * (indexInLevel + 1);
    const y = 45 + level * levelHeight;

    const isExtracted = i >= heapSize;
    const state = indices[i] || 'default';
    const parentId = i > 0 ? Math.floor((i - 1) / 2) : undefined;

    nodes.push({
      index: i,
      value: array[i],
      x,
      y,
      level,
      state,
      isExtracted,
      parentId
    });

    if (parentId !== undefined && nodes[parentId]) {
      const parentNode = nodes[parentId];
      lines.push({
        x1: parentNode.x,
        y1: parentNode.y,
        x2: x,
        y2: y,
        isHeapEdge: !isExtracted
      });
    }
  }

  const getNodeColor = (node: TreeNode) => {
    if (node.isExtracted || node.state === 'sorted') {
      return {
        fill: '#10B981', // emerald-500
        stroke: '#34D399',
        textColor: '#022c22'
      };
    }
    switch (node.state) {
      case 'heap-parent':
        return {
          fill: '#6366F1', // indigo-500
          stroke: '#818CF8',
          textColor: '#ffffff'
        };
      case 'heap-child':
        return {
          fill: '#38BDF8', // sky-400
          stroke: '#7DD3FC',
          textColor: '#082f49'
        };
      case 'swapping':
        return {
          fill: '#F43F5E', // rose-500
          stroke: '#FDA4AF',
          textColor: '#ffffff'
        };
      case 'comparing':
        return {
          fill: '#FBBF24', // amber-400
          stroke: '#FDE68A',
          textColor: '#451a03'
        };
      case 'pivot':
        return {
          fill: '#22D3EE', // cyan-400
          stroke: '#67E8F9',
          textColor: '#083344'
        };
      case 'default':
      default:
        return {
          fill: '#334155', // slate-700
          stroke: '#64748B',
          textColor: '#F8FAFC'
        };
    }
  };

  return (
    <div className="relative w-full rounded-2xl bg-slate-950/80 border border-slate-800 p-4 overflow-hidden flex flex-col items-center">
      {/* Header Info */}
      <div className="w-full flex items-center justify-between text-xs px-3 py-1.5 bg-slate-900/80 rounded-xl border border-slate-800 mb-2">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-cyan-400">Complete Binary Heap Tree</span>
          <span className="text-slate-400">·</span>
          <span className="text-slate-300">
            Active Heap Nodes: <strong className="text-cyan-300 tabular-nums">{heapSize}</strong> / {n}
          </span>
        </div>
        <div className="flex items-center gap-3 text-slate-400">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" /> Parent
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-400" /> Children
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Extracted/Sorted
          </span>
        </div>
      </div>

      {/* SVG Tree View */}
      <div className="w-full overflow-x-auto flex justify-center">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full max-w-[840px] select-none"
          style={{ height: `${svgHeight}px` }}
        >
          <defs>
            <filter id="node-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.3" />
            </filter>
          </defs>

          {/* Edges / Lines between parents and children */}
          {lines.map((line, idx) => (
            <line
              key={idx}
              x1={line.x1}
              y1={line.y1}
              x2={line.x2}
              y2={line.y2}
              stroke={line.isHeapEdge ? '#475569' : '#1e293b'}
              strokeWidth={line.isHeapEdge ? 2.5 : 1.5}
              strokeDasharray={line.isHeapEdge ? 'none' : '4 4'}
              className="transition-all duration-150"
            />
          ))}

          {/* Tree Nodes */}
          {nodes.map((node) => {
            const colors = getNodeColor(node);
            const radius = n <= 15 ? 20 : n <= 31 ? 16 : 13;
            const isHighlight =
              node.state === 'heap-parent' ||
              node.state === 'heap-child' ||
              node.state === 'swapping' ||
              node.state === 'comparing';

            return (
              <g
                key={node.index}
                className="transition-all duration-150 cursor-default"
                filter={isHighlight ? 'url(#node-glow)' : undefined}
              >
                {/* Node Circle */}
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={radius}
                  fill={colors.fill}
                  stroke={colors.stroke}
                  strokeWidth={isHighlight ? 3 : 2}
                  opacity={node.isExtracted ? 0.8 : 1}
                  className="transition-colors duration-150"
                />

                {/* Node Value */}
                <text
                  x={node.x}
                  y={node.y + (radius > 15 ? 4 : 3)}
                  textAnchor="middle"
                  fill={colors.textColor}
                  fontSize={radius > 15 ? '13px' : '10px'}
                  fontWeight="bold"
                  className="font-mono"
                >
                  {node.value}
                </text>

                {/* Array Index Tag under node */}
                <text
                  x={node.x}
                  y={node.y + radius + 13}
                  textAnchor="middle"
                  fill="#94a3b8"
                  fontSize="9px"
                  className="font-mono"
                >
                  i={node.index}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
};
