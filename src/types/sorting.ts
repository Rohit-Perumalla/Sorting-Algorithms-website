export type AlgorithmId =
  | 'bubble'
  | 'selection'
  | 'insertion'
  | 'merge'
  | 'quick'
  | 'heap';

export type ElementState =
  | 'default'      // Unsorted / resting state
  | 'comparing'    // Actively compared elements (amber)
  | 'swapping'     // Actively swapping or overwriting (rose)
  | 'selected'     // Minimum, key element, or focus (purple)
  | 'pivot'        // Quick sort pivot (cyan)
  | 'sorted'       // Confirmed in final sorted place (emerald)
  | 'heap-parent'  // Heap sort parent node (indigo)
  | 'heap-child'   // Heap sort child node (sky)
  | 'merging'      // Merge sort active merge element (fuchsia);

export interface MergeTreeNodeSnapshot {
  id: string;
  left: number;
  right: number;
  depth: number;
  parentId?: string;
  values: number[];
  state: 'pending' | 'dividing' | 'active-left' | 'active-right' | 'merging' | 'sorted';
}

export interface MergeBufferState {
  leftArray: number[];
  rightArray: number[];
  mergedArray: number[];
  leftPointer?: number;
  rightPointer?: number;
  activeTargetIndex?: number;
}

export interface SortStep {
  array: number[];
  indices: { [index: number]: ElementState };
  comparisons: number;
  swaps: number;
  accesses: number;
  description: string;
  phase?: string;
  codeLine?: number;
  meta?: {
    pivotIndex?: number;
    minIndex?: number;
    keyIndex?: number;
    pass?: number;
    heapSize?: number;
    parentIndex?: number;
    childIndex?: number;
    mergeSubarrays?: {
      leftStart: number;
      leftEnd: number;
      rightStart: number;
      rightEnd: number;
    };
    mergeTreeNodes?: MergeTreeNodeSnapshot[];
    activeMergeNodeId?: string;
    mergeBuffer?: MergeBufferState;
    partitionRange?: {
      low: number;
      high: number;
      i?: number;
      j?: number;
    };
  };
}

export interface AlgorithmInfo {
  id: AlgorithmId;
  name: string;
  category: string;
  shortDesc: string;
  bestTime: string;
  avgTime: string;
  worstTime: string;
  spaceComplexity: string;
  isStable: boolean;
  isInPlace: boolean;
  pseudocode: string[];
  explanation: string;
  pros: string[];
  cons: string[];
  idealFor: string;
}

export interface BenchmarkResult {
  algorithmId: AlgorithmId;
  name: string;
  size: number;
  timeMs: number;
  comparisons: number;
  swaps: number;
  accesses: number;
}
