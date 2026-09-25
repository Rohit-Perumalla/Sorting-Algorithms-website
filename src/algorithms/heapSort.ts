import { SortStep, ElementState } from '../types/sorting';

export function generateHeapSortSteps(initialArray: number[], order: 'asc' | 'desc' = 'asc'): SortStep[] {
  const steps: SortStep[] = [];
  const arr = [...initialArray];
  const n = arr.length;
  let comparisons = 0;
  let swaps = 0;
  let accesses = 0;

  const sortedIndices = new Set<number>();

  const pushStep = (
    indices: { [index: number]: ElementState },
    description: string,
    heapSize: number,
    parentIndex?: number,
    childIndex?: number,
    codeLine?: number,
    phase?: string
  ) => {
    const fullIndices: { [index: number]: ElementState } = {};
    for (let idx = 0; idx < n; idx++) {
      if (sortedIndices.has(idx)) {
        fullIndices[idx] = 'sorted';
      } else if (indices[idx]) {
        fullIndices[idx] = indices[idx];
      } else {
        fullIndices[idx] = 'default';
      }
    }
    steps.push({
      array: [...arr],
      indices: fullIndices,
      comparisons,
      swaps,
      accesses,
      description,
      phase: phase || 'Heap Sort',
      codeLine,
      meta: {
        heapSize,
        parentIndex,
        childIndex
      }
    });
  };

  pushStep({}, 'Initial array before Heap Sort starts', n, undefined, undefined, 1, 'Starting');

  function heapify(size: number, rootIdx: number) {
    let extremeIdx = rootIdx;
    const leftChild = 2 * rootIdx + 1;
    const rightChild = 2 * rootIdx + 2;

    const baseHighlight: { [index: number]: ElementState } = {
      [rootIdx]: 'heap-parent'
    };
    if (leftChild < size) baseHighlight[leftChild] = 'heap-child';
    if (rightChild < size) baseHighlight[rightChild] = 'heap-child';

    pushStep(
      baseHighlight,
      `Checking heap node arr[${rootIdx}] = ${arr[rootIdx]} with children ${
        leftChild < size ? `Left[${leftChild}]=${arr[leftChild]}` : 'none'
      } and ${rightChild < size ? `Right[${rightChild}]=${arr[rightChild]}` : 'none'}.`,
      size,
      rootIdx,
      undefined,
      3,
      `Heapify index ${rootIdx}`
    );

    if (leftChild < size) {
      comparisons++;
      accesses += 2;
      const leftBetter = order === 'asc' ? arr[leftChild] > arr[extremeIdx] : arr[leftChild] < arr[extremeIdx];
      if (leftBetter) {
        extremeIdx = leftChild;
      }
    }

    if (rightChild < size) {
      comparisons++;
      accesses += 2;
      const rightBetter = order === 'asc' ? arr[rightChild] > arr[extremeIdx] : arr[rightChild] < arr[extremeIdx];
      if (rightBetter) {
        extremeIdx = rightChild;
      }
    }

    if (extremeIdx !== rootIdx) {
      swaps++;
      accesses += 4;
      const temp = arr[rootIdx];
      arr[rootIdx] = arr[extremeIdx];
      arr[extremeIdx] = temp;

      pushStep(
        { [rootIdx]: 'swapping', [extremeIdx]: 'swapping' },
        `Heap violation: arr[${extremeIdx}] (${arr[rootIdx]}) is ${
          order === 'asc' ? 'larger' : 'smaller'
        } than parent (${temp}). Swapped!`,
        size,
        rootIdx,
        extremeIdx,
        5,
        `Sift down swap`
      );

      // Recursively heapify the affected sub-tree
      heapify(size, extremeIdx);
    }
  }

  // Phase 1: Build Heap (bottom-up from last non-leaf node)
  pushStep({}, 'Phase 1: Building max-heap representation from the bottom up.', n, undefined, undefined, 2, 'Build Heap');
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    heapify(n, i);
  }

  pushStep(
    { 0: 'pivot' },
    `Max-Heap property established! Root element arr[0] (${arr[0]}) is the current maximum.`,
    n,
    0,
    undefined,
    6,
    'Heap Built'
  );

  // Phase 2: Extract elements from heap one by one
  for (let i = n - 1; i > 0; i--) {
    // Swap root (max element) with the last element of current heap
    swaps++;
    accesses += 4;
    const temp = arr[0];
    arr[0] = arr[i];
    arr[i] = temp;

    pushStep(
      { [0]: 'swapping', [i]: 'swapping' },
      `Extracted heap root ${temp} and moved to sorted position at index ${i}.`,
      i,
      0,
      i,
      7,
      `Extract max`
    );

    sortedIndices.add(i);

    pushStep(
      {},
      `Element ${arr[i]} locked into sorted position. Heap size reduced to ${i}. Sifting down root ${arr[0]}.`,
      i,
      0,
      undefined,
      8,
      `Heap size ${i}`
    );

    // Call heapify on the reduced heap
    heapify(i, 0);
  }

  sortedIndices.add(0);
  const finalIndices: { [index: number]: ElementState } = {};
  for (let i = 0; i < n; i++) finalIndices[i] = 'sorted';
  steps.push({
    array: [...arr],
    indices: finalIndices,
    comparisons,
    swaps,
    accesses,
    description: 'Heap Sort completed! All elements sorted in O(n log n) in-place.',
    phase: 'Completed',
    codeLine: 9,
    meta: { heapSize: 0 }
  });

  return steps;
}
