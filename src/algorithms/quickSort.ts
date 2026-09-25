import { SortStep, ElementState } from '../types/sorting';

export function generateQuickSortSteps(initialArray: number[], order: 'asc' | 'desc' = 'asc'): SortStep[] {
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
    meta?: SortStep['meta'],
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
      phase: phase || 'Quick Sort',
      codeLine,
      meta
    });
  };

  pushStep({}, 'Initial array before Quick Sort begins', undefined, 1, 'Starting');

  function partition(low: number, high: number): number {
    const pivot = arr[high];
    accesses++;
    let i = low - 1;

    pushStep(
      { [high]: 'pivot' },
      `Selected pivot arr[${high}] = ${pivot}. Partitioning range [${low}..${high}].`,
      {
        pivotIndex: high,
        partitionRange: { low, high, i, j: low }
      },
      2,
      `Pivot: ${pivot}`
    );

    for (let j = low; j < high; j++) {
      comparisons++;
      accesses += 2;
      const shouldPlaceLeft = order === 'asc' ? arr[j] < pivot : arr[j] > pivot;

      const compHighlight: { [index: number]: ElementState } = {
        [high]: 'pivot',
        [j]: 'comparing'
      };
      if (i >= low) compHighlight[i] = 'selected';

      pushStep(
        compHighlight,
        `Comparing arr[${j}] (${arr[j]}) with pivot ${pivot}. ${
          shouldPlaceLeft
            ? `${arr[j]} belongs to ${order === 'asc' ? 'less' : 'greater'} partition. Advancing pointer i to ${i + 1}.`
            : `${arr[j]} stays on the ${order === 'asc' ? 'greater' : 'less'} side.`
        }`,
        {
          pivotIndex: high,
          partitionRange: { low, high, i, j }
        },
        4,
        `Scanning j=${j}`
      );

      if (shouldPlaceLeft) {
        i++;
        if (i !== j) {
          swaps++;
          accesses += 4;
          const temp = arr[i];
          arr[i] = arr[j];
          arr[j] = temp;

          pushStep(
            {
              [high]: 'pivot',
              [i]: 'swapping',
              [j]: 'swapping'
            },
            `Swapped arr[${i}] (${arr[i]}) with arr[${j}] (${arr[j]}) to maintain partition boundary.`,
            {
              pivotIndex: high,
              partitionRange: { low, high, i, j }
            },
            5,
            `Partition swap`
          );
        }
      }
    }

    // Place pivot into final position i + 1
    swaps++;
    accesses += 4;
    const temp = arr[i + 1];
    arr[i + 1] = arr[high];
    arr[high] = temp;
    const pivotFinalPos = i + 1;

    sortedIndices.add(pivotFinalPos);

    pushStep(
      { [pivotFinalPos]: 'sorted' },
      `Placed pivot ${pivot} into its sorted position at index ${pivotFinalPos}. Elements left are ${
        order === 'asc' ? '<=' : '>='
      } pivot, elements right are ${order === 'asc' ? '>=' : '<='} pivot.`,
      {
        pivotIndex: pivotFinalPos,
        partitionRange: { low, high, i: pivotFinalPos, j: high }
      },
      7,
      `Pivot sorted at ${pivotFinalPos}`
    );

    return pivotFinalPos;
  }

  function quickSortHelper(low: number, high: number) {
    if (low < high) {
      const pi = partition(low, high);
      quickSortHelper(low, pi - 1);
      quickSortHelper(pi + 1, high);
    } else if (low === high) {
      sortedIndices.add(low);
      pushStep(
        { [low]: 'sorted' },
        `Subarray of size 1 at index ${low} (${arr[low]}) is already sorted.`,
        undefined,
        8,
        `Single element`
      );
    }
  }

  quickSortHelper(0, n - 1);

  for (let k = 0; k < n; k++) sortedIndices.add(k);
  pushStep({}, 'Quick Sort complete! Entire array is sorted.', undefined, 9, 'Completed');

  return steps;
}
